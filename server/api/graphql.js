// server/api/graphql.js
import { ApolloServer, gql } from 'apollo-server-micro';
import mongoose from 'mongoose';
import Booking from '../../models/Booking'; // Adjust path if necessary

// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return; // Reuse the existing connection if available
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

// Define the GraphQL schema
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

// Define resolvers for queries and mutations
const resolvers = {
  Query: {
    getBookings: async () => {
      await connectToDatabase();
      return await Booking.find();
    },
  },
  Mutation: {
    addBooking: async (_, { name, email, destination, date, travelers }) => {
      await connectToDatabase();
      const booking = new Booking({ name, email, destination, date, travelers });
      await booking.save();
      return booking;
    },
    deleteBooking: async (_, { id }) => {
      await connectToDatabase();
      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) throw new Error("Booking not found");
      return deletedBooking;
    },
  },
};

// Set up Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Export the server handler for Vercel
export default server.createHandler({ path: '/api/graphql' });
