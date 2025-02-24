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
  },
};

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
