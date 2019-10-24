import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      name: "",
      street: "",
      city: "",
      email: "",
      state: ""
    };
    this.submit = this.submit.bind(this);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submit = async () => {
    let customer = this.props.user;
    let cart = this.props.cart;
    let total = this.props.total;

    if (total == 0) return;

    let { token } = await this.props.stripe.createToken({
      name: this.state.name,
      address_line1: this.state.street,
      address_city: this.state.city,
      address_state: this.state.state,
      email: this.state.email
    });
    console.log(token);
    let response = await axios.post(
      "http://localhost:3001/api/checkout/test2",
      {
        token,
        cart,
        total,
        customer
      }
    );
    console.log(response);
    //if (response.data === "OK") this.setState({ complete: true });
    if (response.statusText == "OK") {
      this.setState({ complete: true });
      this.props.setUser(response.data);
    }
  };

  // test clicker
  testClick = e => {
    console.log(this.props.user);
  };

  render() {
    if (this.state.complete)
      return (
        <div>
          <h1>Purchase Completed!</h1>
          <button
            className="btn btn-warning"
            onClick={() => {
              this.setState({ complete: false });
            }}
          >
            Keep shopping
          </button>
        </div>
      );
    return (
      <div className="checkout">
        <hr />
        <button onClick={this.testClick}>Test</button>
        <p>Would you like to complete the purchase?</p>
        <div className="card card-body">
          <input
            className="form-group"
            type="text"
            name="name"
            placeholder="name on card"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <input
            className="form-group"
            type="text"
            name="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <label>Billing Info</label>
          <input
            className="form-group"
            type="text"
            name="street"
            placeholder="street"
            value={this.state.street}
            onChange={this.handleChange}
          />
          <input
            className="form-group"
            type="text"
            name="city"
            placeholder="city"
            value={this.state.city}
            onChange={this.handleChange}
          />
          <input
            className="form-group"
            type="text"
            name="state"
            placeholder="state"
            value={this.state.state}
            onChange={this.handleChange}
          />

          <CardElement style={{ base: { fontSize: "18px" } }} />
          <br />

          <button className="btn btn-success" onClick={this.submit}>
            Purchase
          </button>
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
