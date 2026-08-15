const { betterAuth } = require("better-auth");
const { MongoClient } = require("mongodb");
const { mongodbAdapter } = require("@better-auth/mongo-adapter");
require('dotenv').config();

// Ensure the db name is specified in the URI, e.g., .../pet_adoption?retryWrites=...
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  }
});

module.exports = { auth };
