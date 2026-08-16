import {  betterAuth  } from 'better-auth';
import {  MongoClient  } from 'mongodb';
import {  mongodbAdapter  } from '@better-auth/mongo-adapter';
import 'dotenv/config';

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
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  baseURL: process.env.NODE_ENV === "production" ? "https://assignment-9-pet-adoption.vercel.app" : undefined,
  trustedOrigins: process.env.NODE_ENV === "production" 
    ? ["https://assignment-9-pet-adoption.vercel.app"]
    : ["http://localhost:3000", "http://localhost:5173"],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  }
});

export {  auth  };
