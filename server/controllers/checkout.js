const stripe = require("stripe")(process.env.SECRET_KEY);
const uuid = require("uuid/v4");

const db = require("../DB");

module.exports = {
  checkout
};

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
        description: `Purchased the ${cart.name}`,
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
    // let user = {
    //   id: customer.id,
    //   name: token.card.name,
    //   address: token.card.address_city,
    //   email: token.email
    // };
    // let order = {
    //   productName: product.name,
    //   total: product.price,
    //   userId: customer.id
    // };
    // db.connection.query("INSERT INTO users SET ?", user, err => {
    //   if (err) throw err;
    // });
    // db.connection.query("INSERT INTO orders SET ?", order, err => {
    //   if (err) throw err;
    // });

    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }
  res.json({ error, status });
}
