require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
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

app.post("/create-payment-intent", async (req, res) => {
  const { paymentMethodType, currency, amount, customerEmail, customerName, paymentMethodId } = req.body;

  var customer = null;
  try {
    customer = await stripe.customers.create({
      name: customerName,
      email: customerEmail,
    });
  } catch (e) {
    res.status(400).json({ error: { message: e.message } });
  }
  console.log(`CUSTOMER: `, customer);
  console.log('Creating PI for PM: ', paymentMethodId);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method: paymentMethodId,
      customer: customer.id,
      setup_future_usage: "off_session"
    });
    console.log(`PAYMENT INTENT: `, paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({ error: { message: e.message } });
  }
});

app.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.

  const { name, email, description, number, exp_month, exp_year, cvc } =
    req.body;

  // const paymentMethod = await stripe.paymentMethods.create({
  //   type: "card",
  //   card: {
  //     number: number,
  //     exp_month: exp_month,
  //     exp_year: exp_year,
  //     cvc: cvc,
  //   },
  // });

  const token = await stripe.tokens.create({
    card: {
      name: name,
      number: number,
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: cvc,
    },
  });

  const customer = await stripe.customers.create({
    name: name,
    email: email,
    description: description,
    source: token.id,
  });
  // console.log(`paymentMethod: `, paymentMethod);
  //console.log(`CUSTOMER: `, customer);
  // console.log(`customer_id: `, customer.id)

  // const attachedPaymentMethod = await stripe.paymentMethods.attach(
  //   paymentMethod.id,
  //   { customer: customer.id }
  // );

  // console.log(`ATTACHED PAYMENT METHOD: `, attachedPaymentMethod)

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  // console.log(`ephemeralkey: `, ephemeralKey);
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
  });
  // console.log(`setupIntent: `, setupIntent);
  res.json({
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customerObject: customer,
    publishableKey:
      "pk_test_51KiQMsI3oyKP8eORrA6f2aREXVZJo16HxStTPqzcZ4TjVgZCRE6VbmMJyQNHv14XKaTRa6orZkRUB4Oxbju76ofP00qt8z5S9T",
  });
});

app.post("/create-customer", async (req, res) => {
  const { name, email } = req.body;
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
    });
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
app.post("/echo", (req, res) => {
  //put data in db
  //make an api call to stripe to create customer/ inovice etc.
  console.log("body", req.body);
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

    if (event.type === "payment_intent.created") {
      const paymentIntent = event.data.object;
      console.log(
        `✅ [${event.id}] PaymentIntent:(${paymentIntent.id}) Status:${paymentIntent.status}`
      );
    }
        if (event.type === "customer.created") {
          const customer = event.data.object;
          console.log(
            `✅ [${event.id}] Customer:(${customer.id}) Created with default_source: (${customer.default_source})`
          );
        }

         if (event.type === "paymentMethod.complete") {
           const paymentMethod = event.data.object;
           console.log(
             `✅ [${paymentMethod.id}] paymentMethod_id:(${paymentMethod.id}) Created.`
           );
         }
    if (event.type === "payment_intent.requires_action") {
      const paymentIntent = event.data.object;
      console.log(
        `✅ [${event.id}] PaymentIntent:(${paymentIntent.id}) Status:${paymentIntent.status}`
      );
    }
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log(
        `✅ [${event.id}] PaymentIntent:(${paymentIntent.id}) Status:${paymentIntent.status} ${paymentIntent}`
      );
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

app.listen(4242, () => console.log("Running on http://localhost:4242"));
