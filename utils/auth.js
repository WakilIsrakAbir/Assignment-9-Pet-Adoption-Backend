const { betterAuth } = require("better-auth");
const { MongoClient } = require("mongodb");
const { mongodbAdapter } = require("@better-auth/mongo-adapter");
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  }
});

module.exports = { auth };
