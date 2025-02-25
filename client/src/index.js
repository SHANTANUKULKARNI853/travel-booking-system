import React from "react";
import ReactDOM from "react-dom/client"; // <-- Use createRoot instead of render
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";

const client = new ApolloClient({
  uri: "https://travel-booking-system-1-9z9q.onrender.com/graphql",
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
