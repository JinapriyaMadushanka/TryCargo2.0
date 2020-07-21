const User = require("../../models/users");
const ShopOwner = require("../../models/shopowner");
const Order = require("../../models/orders");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;
const cloudinary = require("cloudinary").v2;
const cloudnmae =
  process.env.cloud_name || require("../../config/env").cloud_name;
const cloudinary_api_key =
  process.env.cloudinary_api_key ||
  require("../../config/env").cloudinary_api_key;

const cloudinary_api_secret =
  process.env.cloudinary_api_secret ||
  require("../../config/env").cloudinary_api_secret;

cloudinary.config({
  cloud_name: cloudnmae,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

exports.customerdashboard = (req, res) => {
  console.log("ownerdahsboard");
  var datain = req.body;
  console.log(datain);

  User.findOne({ _id: req.id })
    .then((doc) => {
      console.log(doc);

      Order.find({ customerId: req.id })
        .then((orders) => {
          orderData = orders.map((order) => ({
            items: order.items.map((item) => {
              itemdisp = item.itemName + "(" + item.quantity + "), ";
              return itemdisp;
            }),
            store: order.buisnessname,
            date: order.date,
            cost: order.totalprice,
            status: order.orderStatus,
          }));
          ShopOwner.find({ "address.district": doc.address.district })
            .then((shops) => {
              shopData = shops.map((shop) => ({
                id: shop.id,
                address: shop.address,
                email: shop.email,
                buisnessname: shop.buisnessname,
                buisnessphone: shop.buisnessphone,
                aboutus: shop.aboutus,
                workinghours: shop.workinghours,
                items: shop.items,
              }));
              temppayload = {
                orders: orderData,
                shops: shopData,
              };

              console.log(temppayload);
              res.status(200).json({ msg: "success", data: temppayload });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send("err");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("err");
    });
};

exports.neworder = (req, res) => {
  console.log("new order");
  var datain = req.body;
  console.log(datain);
  const orderId = uuid();

  User.findOne({ _id: req.id })
    .then((doc) => {
      // console.log(doc);

      var neworder = new Order({
        ownerId: datain.ownerId,
        customerId: req.id,
        orderId: orderId,
        delivery_address: datain.address,
        date: new Date().toISOString(),
        buisnessname: datain.buisnessname,
        customeraddress: datain.customeraddress,
        totalprice: datain.totalprice,
        orderStatus: "pending",
        items: datain.items,
      });

      neworder
        .save()
        .then((order) => {
          console.log(order);

          neworder = {
            items: order.items.map((item) => {
              itemdisp = item.itemName + "(" + item.quantity + "), ";
              return itemdisp;
            }),
            store: order.buisnessname,
            date: order.date,
            cost: order.totalprice,
            status: order.orderStatus,
          };
          res.status(200).json({ msg: "success", data: neworder });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("err");
    });
};
