// /functions/processPayment.js
const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { amount, wallet, crypto } = JSON.parse(event.body);

  const response = await fetch("https://api.nowpayments.io/v1/payment", {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: amount,
      price_currency: "usd",
      pay_currency: crypto,
      payout_address: wallet,
      order_id: `order_${Date.now()}`,
      order_description: "Crypto Purchase",
      ipn_callback_url: "https://yourdomain.com/callback"
    }),
  });

  const result = await response.json();
  if (result.payment_url) {
    return {
      statusCode: 200,
      body: JSON.stringify({ payment_url: result.payment_url }),
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: result.message || "API Error" }),
    };
  }
};
