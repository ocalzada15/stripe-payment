import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Landing extends Component {
  state = {
    name: "",
    email: "",
    password: ""
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleCustomer = async () => {
    let name = this.state.name;
    let email = this.state.email;

    const results = await axios.post(
      "http://localhost:3001/api/checkout/customer",
      { name, email }
    );
    console.log(results);
    let user = results.data;
    this.props.setUser(user);
    if (results.statusText == "Created") {
      this.props.history.push("/checkout");
    }
  };

  exCustomer = async () => {
    let name = this.state.name;
    let email = this.state.email;
    const results = await axios.post(
      "http://localhost:3001/api/checkout/exCustomer",
      { name, email }
    );
    console.log(results);
    const user = results.data;
    this.props.setUser(user);
    if (results.statusText == "OK") {
      this.props.history.push("/checkout");
    }
  };

  render() {
    return (
      <div className="container my-5">
        <h1>Landing</h1>
        <div className="row">
          <div className="col">
            <h3>Please sign up to checkout</h3>
            <input
              className="form-group"
              type="text"
              name="name"
              placeholder="name"
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

            <br />
            <button className="mb-3" onClick={this.handleCustomer}>
              Sign Up
            </button>
          </div>
        </div>
        <div>
          <div>
            <h4>Returning Customer?</h4>
            <input
              className="form-group"
              type="text"
              name="name"
              placeholder="name"
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
            <br />
            <button onClick={this.exCustomer}>Go</button>
          </div>
        </div>
        {/* <Link to={"/checkout"}>
          <button>Checkout</button>
        </Link> */}
      </div>
    );
  }
}

export default Landing;
