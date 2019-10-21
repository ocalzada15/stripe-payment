import React, { useState } from 'react';
import './App.css';

import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { toast } from 'react-toastify'

toast.configure()

function App() {
  const [product] = useState({
    name: 'Course A',
    price: 30.00,
    description: 'First course'
  })

  const hanldeToken = async token => {
    console.log(token);
    const response = await axios.post('http://localhost:3001/api/checkout', {
      token,
      product
    });
    const { status } = response.data;
    if (status === 'success') {

      toast('Success!', { type: 'success' })
    } else {
      toast('Error', { type: 'error' })
    }
  }

  return (
    <div className="container">
      <div className='card card-body mt-3'>
        <h1>{product.name}</h1>
        <h4>Price: $ {product.price}</h4>
        <p> Description - {product.description}</p>
      </div>
      <div className='row'>
        <div align='center' className='col mt-2'>

          <StripeCheckout
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
            token={hanldeToken}
            billingAddress
            shippingAddress
            amount={product.price * 100}
            name={product.name}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
