import React, { Component } from "react";
import "./App.css";

import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";

import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutElm from "./components/Cart";

toast.configure();
const newCart = [];
const amount = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    let item = this.state.product[idx];
    let p = item.price;
    let m = amount.indexOf(p);
    newCart.splice(newCart.indexOf(item), 1);
    amount.splice(m, 1);
    this.handleCart();
  };

  handleClick = idx => {
    let item = this.state.product[idx];
    newCart.push(item);
    amount.push(parseFloat(item.price));
    this.handleCart();
  };

  render() {
    let items = this.state.cart.length ? (
      <div>
        {this.state.cart.map((c, idx) => (
          <div key={idx}>
            <p>
              {c.name} | ${c.price}
              <button
                className="btn btn-sm btn-danger ml-5"
                onClick={() => this.handleDelete(idx)}
              >
                X
              </button>
            </p>

            <hr />
          </div>
        ))}
      </div>
    ) : (
      <div>
        <h4>Your card is empty</h4>
        <p>Click on "Add to cart" to add an item</p>
      </div>
    );

    return (
      <div className="container my-5">
        <div className="row">
          <div className="col">
            {this.state.product.map((p, idx) => (
              <div key={idx} className="card card-body mt-3">
                <div>
                  <h1>{p.name}</h1>
                  <h4>Price: $ {p.price}</h4>
                  <p> Description - {p.description}</p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => this.handleClick(idx)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col text-center">
            <div className="row">
              <div className="col">
                <h2>Cart</h2>
                <hr />

                {items}
                <h4>Total: ${this.state.total}</h4>
              </div>
            </div>
            <div className="row">
              <div align="center" className="col mt-2">
                {/* <StripeCheckout
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                  // token={() => this.hanldeToken(this.state)}
                  token={this.hanldeToken}
                  billingAddress
                  shippingAddress
                  amount={this.state.total * 100}
                  name="cart"
                /> */}
                <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
                  <div className="example">
                    <Elements>
                      <CheckoutElm
                        total={this.state.total}
                        cart={this.state.cart}
                      />
                    </Elements>
                  </div>
                </StripeProvider>
              </div>
            </div>
          </div>
        </div>
        <br />
        <hr />
        <div className="row">
          <div className="col">
            <h4>Orders results</h4>
            <ol>
              {this.state.orders.map((o, idx) => (
                <li key={idx}>
                  Order Id: {o.id} | Total: ${o.total}
                </li>
              ))}
            </ol>
          </div>
          <div className="col">
            <h4>Payments</h4>
            {this.state.payments.map((p, idx) => (
              <div key={idx}>
                <p>
                  Brand: {p.brand} | Exp Month: {p.exp_month} | Last 4:{" "}
                  {p.last4}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
