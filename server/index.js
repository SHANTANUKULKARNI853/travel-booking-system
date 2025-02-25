const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Booking = require('./models/Booking');

const app = express();
app.use(cors());

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
    updateBooking(id: ID!, name: String, email: String, destination: String, date: String, travelers: Int): Booking
  }
`;

const resolvers = {
  Query: {
    getBookings: async () => await Booking.find(),
  },
  Mutation: {
    addBooking: async (_, { name, email, destination, date, travelers }) => {
      const booking = new Booking({ name, email, destination, date, travelers });
      await booking.save();
      return booking;
    },
    deleteBooking: async (_, { id }) => {
      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) {
        throw new Error("Booking not found");
      }
      return deletedBooking;
    },
    updateBooking: async (_, { id, name, email, destination, date, travelers }) => {
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { name, email, destination, date, travelers },
        { new: true }
      );
      if (!updatedBooking) {
        throw new Error("Booking not found");
      }
      return updatedBooking;
    },
  },
};

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 4000;

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};

startServer();
