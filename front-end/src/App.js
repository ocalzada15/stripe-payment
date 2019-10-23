import React, { Component } from "react";
import "./App.css";

//import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";

import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutElm from "./components/Cart";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Checkout from "./components/Checkout";
import Landing from "./components/Landing";

toast.configure();

const newCart = [];
const amount = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      orders: [],
      payments: [],
      cart: [],
      total: 0,

      product: [
        {
          name: "Course A",
          price: 30.0,
          description: "First course"
        },
        {
          name: "Course B",
          price: 25.0,
          description: "Second course"
        },
        {
          name: "Course C",
          price: 40.0,
          description: "Third course"
        }
      ]
    };
  }

  setUser = user => {
    this.setState({
      user
    });
  };

  componentDidMount() {
    this.getAllOrders();
    this.getAllPayments();
  }

  getAllOrders = async () => {
    const results = await axios.get("http://localhost:3001/api/checkout/all");
    this.setState({
      orders: results.data
    });
  };

  getAllPayments = async () => {
    const results = await axios.get(
      "http://localhost:3001/api/checkout/payments"
    );
    this.setState({
      payments: results.data
    });
  };

  // hanldeToken = async token => {
  //   let cart = this.state.cart;
  //   let total = this.state.total;

  //   const response = await axios.post("http://localhost:3001/api/checkout", {
  //     token,
  //     cart,
  //     total
  //   });
  //   const { status } = response.data;
  //   if (status === "success") {
  //     toast("Success!", { type: "success" });
  //   } else {
  //     toast("Error", { type: "error" });
  //   }
  // };

  handleCart = () => {
    this.setState({
      cart: newCart,
      total: amount.reduce((a, b) => a + b, 0)
    });
  };

  handleDelete = idx => {
    let item = this.state.cart[idx];
    let i = newCart.indexOf(item);
    let p = item.price;
    let a = amount.indexOf(p);
    newCart.splice(i, 1);
    amount.splice(a, 1);
    this.handleCart();
  };

  handleClick = idx => {
    let item = this.state.product[idx];
    newCart.push(item);
    amount.push(parseFloat(item.price));
    this.handleCart();
  };

  render() {
    return (
      <div className="container my-5">
        <Router>
          <Route
            path={"/checkout"}
            render={props => (
              <Checkout
                {...props}
                state={this.state}
                user={this.state.user}
                handleDelete={this.handleDelete}
                handleClick={this.handleClick}
              />
            )}
          />
          <Route
            exact
            path={"/"}
            render={props => <Landing {...props} setUser={this.setUser} />}
          />
        </Router>
      </div>
    );
  }
}

export default App;
