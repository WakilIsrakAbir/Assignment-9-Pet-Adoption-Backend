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
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173", process.env.FRONTEND_URL],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  }
});

export {  auth  };
