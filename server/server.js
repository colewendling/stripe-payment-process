require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { resolve } = require("path");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//middleware
app.use(express.static(process.env.STATIC_DIR));
// app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

//create payment intent

// curl -X POST http://localhost:4242/create-payment-intent -H "Content-Type: application/json" -d '{"paymentMethodType":"ideal", "currency":"eur"}'

app.post('/create-payment-intent', async (req, res) => {
  const {paymentMethodType, currency} = req.body;

  try{
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1999,
    currency: currency,
    payment_method_types: [paymentMethodType]
  })
  res.send({clientSecret: paymentIntent.client_secret});
} catch(e) {
  res.status(400).json({error: { message: e.message }})
}
});

app.post("/create-customer", async (req, res) => {
  const { name, email } = req.body;
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
    })
    res.send(customer);
  } catch (e) {
    res.status(400).json({ error: { message: e.message } });
  }
});



app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/config", async (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});


// curl -X POST localhost:4242/my-route -d '{"test": 123}' -H"Content-Type: application/json"
app.post('/echo', (req, res) => {
  //put data in db
  //make an api call to stripe to create customer/ inovice etc.
  console.log('body', req.body)
  res.send(req.body);
});

// stripe listen --forward-to localhost:4242/webhook
// stripe trigger payment_intent.created

//original

// app.post('/webhook', (req, res) => {
//   const event = req.body;
//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object;
//       console.log("Checkout Session ID: ", session.id);
//       break;
//     case "payment_intent.created":
//       const paymentIntent = event.data.object;
//       console.log("PaymentIntent Create: ", paymentIntent.id);
//     default:
//       console.log("unknown event type: " + event.type);
//   }
//   res.send({message: 'success'})
// })

//updates
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if(event.type === 'payment_intent.created') {
      const paymentIntent = event.data.object;
      console.log(`✅ [${event.id}] PaymentIntent:(${paymentIntent.id}) Status:${paymentIntent.status}`)
    }
    if (event.type === "payment_intent.requires_action") {
      const paymentIntent = event.data.object;
      console.log(
        `✅ [${event.id}] PaymentIntent:(${paymentIntent.id}) Status:${paymentIntent.status}`)
    }
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log(
        `✅ [${event.id}] PaymentIntent:(${paymentIntent.id}) Status:${paymentIntent.status}`)
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);



app.listen(4242, () => console.log("Running on http://localhost:4242"));
