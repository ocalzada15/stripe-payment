import React, { Component } from "react";
import "./App.css";

import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";

toast.configure();

// function App() {
//   const [product] = useState({
//     name: 'Course A',
//     price: 30.00,
//     description: 'First course'
//   })
const newCart = [];
const amount = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  hanldeToken = async token => {
    let cart = this.state.cart;
    let total = this.state.total;
    //console.log(token);
    const response = await axios.post("http://localhost:3001/api/checkout", {
      token,
      cart,
      total
    });
    const { status } = response.data;
    if (status === "success") {
      toast("Success!", { type: "success" });
    } else {
      toast("Error", { type: "error" });
    }
  };

  handleCart = () => {
    this.setState({
      cart: newCart,
      total: amount.reduce((a, b) => a + b, 0)
    });
  };

  handleClick = idx => {
    let item = this.state.product[idx];
    newCart.push(item);
    amount.push(parseFloat(item.price));
    this.handleCart();

    console.log(amount);
  };

  render() {
    let items = this.state.cart.length ? (
      <div>
        {this.state.cart.map((c, idx) => (
          <div key={idx}>
            <p>
              {c.name} | ${c.price}
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
                <StripeCheckout
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                  // token={() => this.hanldeToken(this.state)}
                  token={this.hanldeToken}
                  billingAddress
                  shippingAddress
                  amount={this.state.total * 100}
                  name="cart"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
