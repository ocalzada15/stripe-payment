const stripe = require("stripe")(process.env.SECRET_KEY);
const uuid = require("uuid/v4");

const db = require("../DB");

module.exports = {
  checkout,
  getAll,
  getPayments,
  test2,
  customer,
  exCustomer
};

async function exCustomer(req, res, next) {
  try {
    const { name, email } = req.body;
    const customer = await db.connection.query(
      "SELECT id FROM tmp.users WHERE email LIKE ?",
      `${email}`,
      err => {
        if (err) throw err;
      }
    );
    console.log(customer);
  } catch (err) {
    console.log(err);
  }
}

// Create customer before checkout
async function customer(req, res, next) {
  try {
    const { name, email } = req.body;
    const customer = await stripe.customers.create({
      name,
      email
    });
    // add user to db
    let user = {
      id: customer.id,
      name: customer.name,
      address: customer.address,
      email: customer.email
    };
    db.connection.query("INSERT IGNORE INTO users SET ?", user, err => {
      if (err) throw err;
    });

    res.status(201).json(customer);
  } catch (err) {
    console.log(err);
  }
}

function getPayments(req, res, next) {
  db.connection.query("SELECT * FROM tmp.payments", (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
}

function getAll(req, res, next) {
  db.connection.query("SELECT * FROM tmp.orders", (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
}

async function test2(req, res, next) {
  console.log(req.body);
  try {
    const { token, cart, total, customer } = req.body;

    // Create stripe customer
    // const customer = await stripe.customers.create({
    //   name: token.card.name,
    //   email: token.email,
    //   source: token.id
    // });
    const source = await stripe.sources.create({
      token: token.id,
      type: "card"
    });

    //create stripe charge
    const charge = await stripe.charges.create({
      amount: total * 100,
      currency: "usd",
      description: "Test Charge",
      customer: customer.id,
      source: source.id
    });

    //Inserting data to database
    let user = {
      id: customer.id,
      name: token.card.name,
      address: `${token.card.address_line1}, ${token.card.address_city}, ${token.card.address_state}, ${token.card.address_zip}, ${token.card.country}`
      // email: token.email
    };
    let order = {
      id: charge.id,
      products: JSON.stringify(cart),
      total: total,
      userId: customer.id
    };
    let payment = {
      id: charge.source.card.fingerprint,
      brand: token.card.brand,
      country: token.card.country,
      exp_month: token.card.exp_month,
      exp_year: token.card.exp_year,
      funding: token.card.funding,
      last4: token.card.last4,
      name: token.card.name,
      userId: customer.id
    };
    console.log(charge);
    // db.connection.query("INSERT IGNORE INTO users SET ?", user, err => {
    //   if (err) throw err;
    // });
    db.connection.query("INSERT IGNORE INTO orders SET ?", order, err => {
      if (err) throw err;
    });
    db.connection.query("INSERT IGNORE INTO payments SET ?", payment, err => {
      if (err) throw err;
    });

    //send respose
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

// first try with stripe UI
async function checkout(req, res, next) {
  console.log(req.body);

  let error;
  let status;

  try {
    const { token, cart, total } = req.body;

    // Create stripe customer
    const customer = await stripe.customers.create({
      name: token.card.name,
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuid();
    // Create stripe charge
    const charge = await stripe.charges.create(
      {
        amount: total * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased Courses`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );

    //Inserting data to database
    let user = {
      id: customer.id,
      name: token.card.name,
      address: `${token.card.address_line1}, ${token.card.address_city}, ${token.card.address_state}, ${token.card.address_zip}, ${token.card.address_country}`,
      email: token.email
    };
    let order = {
      id: charge.id,
      products: JSON.stringify(cart),
      total: total,
      userId: customer.id
    };
    let payment = {
      id: charge.source.fingerprint,
      brand: token.card.brand,
      country: token.card.country,
      exp_month: token.card.exp_month,
      exp_year: token.card.exp_year,
      funding: token.card.funding,
      last4: token.card.last4,
      name: token.card.name,
      userId: customer.id
    };
    db.connection.query("INSERT IGNORE INTO users SET ?", user, err => {
      if (err) throw err;
    });
    db.connection.query("INSERT IGNORE INTO orders SET ?", order, err => {
      if (err) throw err;
    });
    db.connection.query("INSERT IGNORE INTO payments SET ?", payment, err => {
      if (err) throw err;
    });

    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }
  res.json({ error, status });
}
