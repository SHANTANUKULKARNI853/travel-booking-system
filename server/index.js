require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const Booking = require("./models/Booking");


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MongoDB connection string is missing. Check your .env file.");
  process.exit(1);
}

console.log("🔍 Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const typeDefs = gql`
  type Booking {
    id: ID!
    name: String!
    email: String!
    destination: String!
    date: String!
    travelers: Int!
  }

  type Query {
    getBookings: [Booking]
  }

  type Mutation {
    addBooking(name: String!, email: String!, destination: String!, date: String!, travelers: Int!): Booking
    deleteBooking(id: ID!): Booking
  }
`;

const resolvers = {
  Query: {
    getBookings: async () => {
      return await Booking.find();
    },
  },
  Mutation: {
    addBooking: async (_, { name, email, destination, date, travelers }) => {
      console.log("📩 Adding new booking:", { name, email, destination, date, travelers });
      const newBooking = new Booking({ name, email, destination, date, travelers });
      return await newBooking.save();
    },
    deleteBooking: async (_, { id }) => {
      return await Booking.findByIdAndDelete(id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use. Use a different port.`);
      process.exit(1);
    }
  });
}

startServer().catch((err) => console.error("❌ Error starting server:", err));
