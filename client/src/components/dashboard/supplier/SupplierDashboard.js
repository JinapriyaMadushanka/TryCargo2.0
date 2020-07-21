import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import M from "materialize-css/dist/js/materialize.min.js";
import Swal from "sweetalert2";
import { addItem, editItem } from "../../../actions/stockActions";
import { updateProfile } from "../../../actions/profileActions";
import { getOrders } from "../../../actions/stockActions";

import buisnesslogo from "../../../images/gedara.jpg";
import cover from "../../../images/cover.jpg";
import profileImage from "../../../images/background.jpg";

class SupplierDashboard extends Component {
  constructor(props) {
    super(props);
    const {
      username,
      email,
      buisnessname,
      buisnessphone,
      address,
      workinghours,
      aboutus,
      items = [],
    } = this.props.auth.user;
    this.state = {
      username: username,
      email: email,
      buisnessname: buisnessname,
      buisnessphone: buisnessphone,
      address: {
        addressline1: address.addressline1,
        addressline2: address.addressline2,
        city: address.city,
        district: address.district,
        postalcode: address.postalcode,
        country: address.country,
      },
      workinghours: workinghours,
      aboutus: aboutus,
      items: items,
      itemName: "",
      unitPrice: "",
      description: "",
      quantity: "",
      file: null,
    };
    this.onChange = this.onChange.bind(this);
    this.handleAddNewItem = this.handleAddNewItem.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
    this.displayNewOrders = this.displayNewOrders.bind(this);
  }
  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function () {
      var modal = document.querySelectorAll(".modal");
      M.Modal.init(modal);
    });
    const slider = document.querySelector(".slider");
    M.Slider.init(slider, {
      height: "auto",
      indicators: false,
    });
    this.props.getOrders(localStorage.jwtToken);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.user.items) {
      this.setState({ items: nextProps.auth.user.items });
    }
  }
  onChange(e) {
    if (e.target.name === "file") {
      this.setState({
        [e.target.name]: e.target.files[0],
      });
    } else if (
      e.target.name === "addressline1" ||
      e.target.name === "addressline2" ||
      e.target.name === "city" ||
      e.target.name === "district" ||
      e.target.name === "postalcode" ||
      e.target.name === "country"
    ) {
      const { address } = { ...this.state };
      const currentState = address;
      const { name, value } = e.target;
      currentState[name] = value;

      this.setState({ address: currentState });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  }
  handleAddNewItem(e) {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("itemName", this.state.itemName);
    formdata.append("unitPrice", this.state.unitPrice);
    formdata.append("description", this.state.description);
    formdata.append("quantity", this.state.quantity);
    formdata.append("resobj", this.state.file);
    this.props.addItem(formdata);
  }
  handleEditItem(itemid, itemIndex) {
    const itemData = this.props.auth.user.items[itemIndex];
    const formdata = new FormData();
    if (this.state.itemName === "") {
      formdata.append("itemName", itemData.itemName);
    } else {
      formdata.append("itemName", this.state.itemName);
    }
    if (this.state.quantity === "") {
      formdata.append("quantity", itemData.quantity);
    } else {
      formdata.append("quantity", this.state.quantity);
    }
    if (this.state.unitPrice === "") {
      formdata.append("unitPrice", itemData.unitPrice);
    } else {
      formdata.append("unitPrice", this.state.unitPrice);
    }
    formdata.append("itemid", itemid);
    formdata.append("description", this.state.description);
    formdata.append("resobj", this.state.file);
    this.props.editItem(formdata);
    // console.log(itemid);
  }
  handleEditProfile(e) {
    e.preventDefault();
    const profileData = {
      id: this.props.auth.user.id,
      username: this.state.username,
      email: this.state.email,
      buisnessname: this.state.buisnessname,
      buisnessphone: this.state.buisnessphone,
      addressline1: this.state.address.addressline1,
      addressline2: this.state.address.addressline2,
      city: this.state.address.city,
      district: this.state.address.district,
      postalcode: this.state.address.postalcode,
      country: this.state.address.country,
      aboutus: this.state.aboutus,
      workinghours: this.state.workinghours,
    };
    // console.log(profileData);
    this.props.updateProfile(profileData);
  }
  displayNewOrders() {
    const { orders } = this.props.supplies;
    const pending_orders = orders.filter((order) => order.status === "pending");
    // console.log(pending_orders);
    const new_orders = pending_orders.map((order) => (
      <tr key={pending_orders.indexOf(order)}>
        <td>{order.items}</td>
        <td>{order.cost}</td>
        <td>{order.delivery_address}</td>
        <td>
          <Moment format="YYYY/MM/DD">{order.date}</Moment>
        </td>
        <td>
          <button className="btn waves-effect waves-light green">
            <i className="material-icons">check</i>
          </button>
          &nbsp;
          <button className="btn waves-effect waves-light red darken-3">
            <i className="material-icons">close</i>
          </button>
        </td>
      </tr>
    ));
    // console.log(new_orders);
    return new_orders;
  }
  render() {
    const { items } = this.state;
    const supplies = items.map((item) => (
      <tr key={items.indexOf(item)}>
        <td>
          <img
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            src={item.imgurl}
          ></img>
        </td>
        <td>{item.itemName}</td>
        <td>{item.unitPrice}</td>
        <td>
          <Moment format="YYYY/MM/DD">{item.addeddate}</Moment>
        </td>
        <td>{item.quantity}</td>
        <td>
          <a
            href="#"
            data-target="editItem"
            className="btn-flat waves-effect waves-yellow modal-trigger"
          >
            <i className="material-icons amber-text">edit</i>
          </a>
          <div id="editItem" className="modal">
            <div className="modal-content" style={{ padding: "20 15 20 15" }}>
              <h4>Edit Item Details</h4>
              <form noValidate>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder={item.itemName}
                      value={this.state.itemName}
                      onChange={this.onChange}
                      name="itemName"
                      id="itemName"
                      type="text"
                    />
                    <label htmlFor="itemName">Item Name</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder={item.unitPrice}
                      value={this.state.unitPrice}
                      onChange={this.onChange}
                      name="unitPrice"
                      id="unitPrice"
                      type="text"
                    />
                    <label htmlFor="unitPrice">Unit Price</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder="Description"
                      onChange={this.onChange}
                      name="description"
                      id="description"
                      type="text"
                    />
                    <label htmlFor="description">Description</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder={item.quantity}
                      value={this.state.quantity}
                      onChange={this.onChange}
                      name="quantity"
                      id="quantity"
                      type="text"
                    />
                    <label htmlFor="quantity">Quantity</label>
                  </div>
                </div>
                <div className="row">
                  <div className="file-field input-field col s12">
                    <div className="btn waves-effect waves-light grey darken-3">
                      <span>File</span>
                      <input
                        type="file"
                        name="file"
                        onChange={this.onChange}
                      ></input>
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text"></input>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="row center-align">
              <a
                onClick={() => {
                  this.handleEditItem(item.itemId, items.indexOf(item));
                }}
                className="modal-close btn waves-effect waves-light blue darken-3"
              >
                Update
              </a>
            </div>
          </div>
        </td>
        <td>
          <button className="btn-flat waves-effect waves-red ">
            <i className="material-icons red-text">delete</i>
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <br></br>
        <div className="row left-align">
          <br></br>
          <div style={{ width: "100%" }}>
            <div className="row">
              <div className="col s12">
                <div className="row">
                  <div className="col s12 m3">
                    <div
                      className="card grey darken-3"
                      style={{ width: "100%" }}
                    >
                      <div className="card-image">
                        <img src={buisnesslogo}></img>
                      </div>
                      <div className="card-content left-align">
                        <div className="card-title blue-text">
                          <h5>{this.state.buisnessname}</h5>
                        </div>
                        <ul className="grey-text">
                          <li>Username : {this.state.username}</li>
                          <br></br>
                          <li>Email : {this.state.email}</li>
                          <br></br>
                          <li>Telephone : {this.state.buisnessphone}</li>
                          <br></br>
                          <li>
                            Address :{" "}
                            {this.state.address.addressline1 +
                              ", " +
                              this.state.address.addressline2 +
                              ", " +
                              this.state.address.city +
                              ", " +
                              this.state.address.district +
                              ", " +
                              this.state.address.country}
                          </li>
                          <br></br>
                          <li>Working Hours : {this.state.workinghours}</li>
                          <br></br>
                          <li>About Us : {this.state.aboutus}</li>
                        </ul>
                      </div>
                      <div className="card-action center-align">
                        <a
                          href="#"
                          data-target="editProfile"
                          className="btn btn-medium waves-effect waves-light blue darken-3 modal-trigger"
                        >
                          Edit Profile
                        </a>
                        <div id="editProfile" className="modal">
                          <div
                            className="modal-content"
                            style={{ padding: "20 15 20 15" }}
                          >
                            <h4>Edit Profile</h4>
                            <form noValidate onSubmit={this.handleEditProfile}>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.buisnessname}
                                    onChange={this.onChange}
                                    name="buisnessname"
                                    id="buisnessname"
                                    type="text"
                                  />
                                  <label htmlFor="buisnessname">
                                    Buisness Name
                                  </label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.username}
                                    onChange={this.onChange}
                                    name="username"
                                    id="username"
                                    type="text"
                                  />
                                  <label htmlFor="username">Username</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    name="email"
                                    id="email"
                                    type="email"
                                  />
                                  <label htmlFor="email">Email</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.buisnessphone}
                                    onChange={this.onChange}
                                    name="buisnessphone"
                                    id="buisnessphone"
                                    type="text"
                                  />
                                  <label htmlFor="buisnessphone">
                                    Contact Number
                                  </label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <textarea
                                    value={this.state.aboutus}
                                    onChange={this.onChange}
                                    name="aboutus"
                                    id="aboutus"
                                    type="text"
                                    className="materialize-textarea"
                                  ></textarea>
                                  <label htmlFor="aboutus">About</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.address.addressline1}
                                    onChange={this.onChange}
                                    name="addressline1"
                                    type="text"
                                  />
                                  <label htmlFor="addressline1">
                                    Address Line 1
                                  </label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.address.addressline2}
                                    onChange={this.onChange}
                                    name="addressline2"
                                    type="text"
                                  />
                                  <label htmlFor="addressline2">
                                    Address Line 2
                                  </label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.address.city}
                                    onChange={this.onChange}
                                    name="city"
                                    type="text"
                                  />
                                  <label htmlFor="city">city</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.address.district}
                                    onChange={this.onChange}
                                    name="district"
                                    type="text"
                                  />
                                  <label htmlFor="district">District</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.address.postalcode}
                                    onChange={this.onChange}
                                    name="postalcode"
                                    type="text"
                                  />
                                  <label htmlFor="postalcode">
                                    Zip/Postal Code
                                  </label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.address.country}
                                    onChange={this.onChange}
                                    name="country"
                                    type="text"
                                  />
                                  <label htmlFor="country">Country</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className="input-field col s12">
                                  <input
                                    value={this.state.workinghours}
                                    onChange={this.onChange}
                                    name="workinghours"
                                    id="workinghours"
                                    type="text"
                                  />
                                  <label htmlFor="workinghours">
                                    Working Hours
                                  </label>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div className="row center-align">
                            <div>
                              <a
                                onClick={this.handleEditProfile}
                                className="modal-close btn waves-effect waves-light blue darken-3"
                              >
                                Update
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col s12 m9" style={{ marginTop: "10px" }}>
                    <section className="slider">
                      <ul className="slides">
                        <li>
                          <img
                            className="img-responsive"
                            src={profileImage}
                          ></img>
                          <div className="caption left-align text-black">
                            <h2>FOOD</h2>
                            <h5 className="light white-text text-darken-3 hide-on-small-only">
                              Get food delivered to your home
                            </h5>
                          </div>
                        </li>
                        <li>
                          <img
                            className="img-responsive"
                            src={profileImage}
                          ></img>
                          <div className="caption left-align">
                            <h2>MEDICINE</h2>
                            <h5 className="light white-text text-darken-3 hide-on-small-only">
                              Get your medicine delivered to your home
                            </h5>
                          </div>
                        </li>
                        <li>
                          <img
                            className="img-responsive"
                            src={profileImage}
                          ></img>
                          <div className="caption left-align">
                            <h2>DELIVARY</h2>
                            <h5 className="light white-text text-darken-3 hide-on-small-only">
                              Start delivering essential supplies to your local
                              area
                            </h5>
                          </div>
                        </li>
                        <li>
                          <img
                            className="img-responsive"
                            src={profileImage}
                          ></img>
                          <div className="caption left-align">
                            <h2>SUPPLY</h2>
                            <h5 className="light white-text text-darken-3 hide-on-small-only">
                              Create your supply port and start distributing
                              essential supplies to your local area
                            </h5>
                          </div>
                        </li>
                        <li>
                          <img
                            className="img-responsive"
                            src={profileImage}
                          ></img>
                          <div className="caption left-align">
                            <h2>Stay Home,Stay Safe</h2>
                            <h5 className="light white-text text-darken-3 hide-on-small-only">
                              Get food delivered to your home
                            </h5>
                          </div>
                        </li>
                        <li>
                          <img
                            className="img-responsive"
                            src={profileImage}
                          ></img>
                          <div className="caption left-align">
                            <h2>SURVIVE</h2>
                            <h5 className="light white-text darken-3 hide-on-small-only">
                              Prepare and prevent,don't repair and repent
                            </h5>
                          </div>
                        </li>
                      </ul>
                    </section>
                    <div className="container" style={{ width: "100%" }}>
                      <div className="row">
                        <div
                          className="container card grey lighten-3 center-align"
                          style={{ width: "100%", marginTop: "20px" }}
                        >
                          <h5
                            style={{
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            New Orders
                          </h5>
                        </div>
                        <table className="highlight responsive-table">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Cost</th>
                              <th>Customer</th>
                              <th>Date Added</th>
                              <th>Accept</th>
                            </tr>
                          </thead>
                          <tbody>{this.displayNewOrders()}</tbody>
                        </table>
                      </div>
                    </div>
                    <div className="container" style={{ width: "100%" }}>
                      <div className="row">
                        <div
                          className="container card grey lighten-3 center-align"
                          style={{ width: "100%", marginTop: "20px" }}
                        >
                          <h5
                            style={{
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            Ongoing Orders
                          </h5>
                        </div>
                        <table className="highlight responsive-table">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Cost</th>
                              <th>Customer</th>
                              <th>Date Accepted</th>
                              <th>Delivery Status</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <div className="container" style={{ width: "100%" }}>
                      <div className="row">
                        <div
                          className="container card grey lighten-3 center-align"
                          style={{ width: "100%" }}
                        >
                          <h5
                            style={{
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            Delivered Orders
                          </h5>
                        </div>
                        <table className="highlight responsive-table">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Customer</th>
                              <th>Cost</th>
                              <th>Date Accepted</th>
                              <th>Date Delivered</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <div className="container" style={{ width: "100%" }}>
                      <div className="row">
                        <div
                          className="container card grey darken-3 white-text center-align"
                          style={{ width: "100%" }}
                        >
                          <h5
                            style={{
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            Your Current Stock
                          </h5>
                        </div>
                        <table className="highlight responsive-table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Date added</th>
                              <th>Remaining Stock</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>{supplies}</tbody>
                        </table>
                      </div>
                      <div className="row center-align">
                        <div className="col s12">
                          <a
                            href="#"
                            data-target="addItem"
                            className="btn btn-small waves-effect waves-light blue darken-3 modal-trigger"
                          >
                            <i className="material-icons">add</i>
                          </a>
                          <div id="addItem" className="modal">
                            <div
                              className="modal-content"
                              style={{ padding: "20 15 20 15" }}
                            >
                              <h4>Add Item Details</h4>
                              <form noValidate>
                                <div className="row">
                                  <div className="input-field col s12">
                                    <input
                                      value={this.state.itemName}
                                      onChange={this.onChange}
                                      name="itemName"
                                      id="itemName"
                                      type="text"
                                    />
                                    <label htmlFor="itemName">Item Name</label>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="input-field col s12">
                                    <input
                                      value={this.state.unitPrice}
                                      onChange={this.onChange}
                                      name="unitPrice"
                                      id="unitPrice"
                                      type="text"
                                    />
                                    <label htmlFor="unitPrice">
                                      Unit Price
                                    </label>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="input-field col s12">
                                    <input
                                      value={this.state.description}
                                      onChange={this.onChange}
                                      name="description"
                                      id="description"
                                      type="text"
                                    />
                                    <label htmlFor="description">
                                      Description
                                    </label>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="input-field col s12">
                                    <input
                                      value={this.state.quantity}
                                      onChange={this.onChange}
                                      name="quantity"
                                      id="quantity"
                                      type="text"
                                    />
                                    <label htmlFor="quantity">Quantity</label>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="file-field input-field col s12">
                                    <div className="btn waves-effect waves-light grey darken-3">
                                      <span>File</span>
                                      <input
                                        type="file"
                                        name="file"
                                        onChange={this.onChange}
                                      ></input>
                                    </div>
                                    <div className="file-path-wrapper">
                                      <input
                                        className="file-path validate"
                                        type="text"
                                      ></input>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                            <div className="row center-align">
                              <a
                                onClick={this.handleAddNewItem}
                                className="modal-close btn waves-effect waves-light blue darken-3"
                              >
                                Submit
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SupplierDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  supplies: PropTypes.object.isRequired,
  addItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  getOrders: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  supplies: state.supplies,
});

export default connect(mapStateToProps, {
  addItem,
  editItem,
  updateProfile,
  getOrders,
})(SupplierDashboard);
