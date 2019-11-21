import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import { Link } from "react-router-dom";
import CheckoutElm from "../Cart";

class Checkout extends Component {


  componentDidMount() {
    this.props.getAllOrders();
    this.props.getAllPayments();
  }

  render() {
    let items = this.props.state.cart.length ? (
      <div>
        {this.props.state.cart.map((c, idx) => (
          <div
            className="card mb-3 card-body"
            style={{ height: "70px" }}
            key={idx}
          >
            <p>
              {c.name} | ${c.price}
              <button
                className="btn btn-sm btn-danger ml-5"
                onClick={() => this.props.handleDelete(idx)}
              >
                X
              </button>
            </p>
          </div>
        ))}
      </div>
    ) : (
      <div>
        <h4>Your card is empty</h4>
        <p>Click on "Add to cart" to add an item</p>
      </div>
    );

    let user = this.props.user ? (
      <div>
        <p>Welcome: {this.props.user.name}</p>
      </div>
    ) : (
      <div>hi</div>
    );

    return (
      <div className="container my-5">
        <Link to={"/"}>
          <button>Back</button>
        </Link>
        {user}
        <div className="row">
          <div className="col">
            {this.props.state.product.map((p, idx) => (
              <div key={idx} className="card card-body mt-3">
                <div>
                  <h1>{p.name}</h1>
                  <h4>Price: $ {p.price}</h4>
                  <p> Description - {p.description}</p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => this.props.handleClick(idx)}
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
                <h4>Total: ${this.props.state.total}</h4>
              </div>
            </div>
            <div className="row">
              <div align="center" className="col mt-2">
                <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
                  <div className="example">
                    <Elements>
                      <CheckoutElm
                        setUser={this.props.setUser}
                        user={this.props.user}
                        total={this.props.state.total}
                        cart={this.props.state.cart}
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
              {this.props.state.orders.map((o, idx) => (
                <li key={idx}>
                  Order Id: {o.id} | Total: ${o.total}
                </li>
              ))}
            </ol>
          </div>
          <div className="col">
            <h4>Payments</h4>
            {this.props.state.payments.map((p, idx) => (
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

export default Checkout;
