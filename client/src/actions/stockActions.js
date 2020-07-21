import axios from "axios";
import Swal from "sweetalert2";
import { SET_NEW_ITEM, GET_SUPPLIES, NEW_ORDER, GET_ORDERS } from "./types";

//Add an item to store
export const addItem = (itemData) => (dispatch) => {
  axios
    .post("/apiowner/addnewitem", itemData)
    .then((res) => {
      Swal.fire("Success", "Item has been added to your store", "success");
      console.log(res);
      dispatch({ type: SET_NEW_ITEM, payload: res.data.data });
    })
    .catch((err) => console.log(err));
};
//Edit an item on the store
export const editItem = (itemData) => (dispatch) => {
  axios
    .post("/apiowner/edititem", itemData)
    .then((res) => {
      Swal.fire("Success", "Item has been updated", "success");
      console.log(res);
      dispatch({ type: SET_NEW_ITEM, payload: res.data.data });
    })
    .catch((err) => console.log(err));
};

//return all stores by district
export const getStores = (token) => (dispatch) => {
  axios
    .get("/apicustomer/customerdashboard", token)
    .then((res) => {
      // console.log(res.data.data);
      dispatch({ type: GET_SUPPLIES, payload: res.data.data });
    })
    .catch((err) => console.log(err));
};

//Place a new order
export const newOrder = (orderData) => (dispatch) => {
  axios
    .post("/apicustomer/neworder", orderData)
    .then((res) => {
      console.log(res.data);
      Swal.fire("Success", "Order has been placed", "success");
      dispatch({ type: NEW_ORDER, payload: res.data.data });
    })
    .catch((err) => console.log(err));
};
//get all orders for specific store
export const getOrders = (token) => (dispatch) => {
  axios
    .get("/apiowner/ownerdashboard", token)
    .then((res) => {
      // console.log(res.data.data);
      dispatch({ type: GET_ORDERS, payload: res.data.data });
    })
    .catch((err) => console.log(err));
};
