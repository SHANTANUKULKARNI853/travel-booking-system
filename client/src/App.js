import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useQuery, useMutation, gql, ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql", // Ensure correct backend URL
  cache: new InMemoryCache(),
});

const GET_BOOKINGS = gql`
  query GetBookings {
    getBookings {
      id
      name
      email
      destination
      date
      travelers
    }
  }
`;

const ADD_BOOKING = gql`
  mutation AddBooking($name: String!, $email: String!, $destination: String!, $date: String!, $travelers: Int!) {
    addBooking(name: $name, email: $email, destination: $destination, date: $date, travelers: $travelers) {
      id
      name
      email
      destination
      date
      travelers
    }
  }
`;

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id) {
      id
    }
  }
`;

function Home() {
  const { loading, error, data } = useQuery(GET_BOOKINGS);
  const [addBooking] = useMutation(ADD_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
    onError: (err) => console.error("Error adding booking:", err.message),
  });
  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
    onError: (err) => console.error("Error deleting booking:", err.message),
  });

  const [formData, setFormData] = useState({ name: "", email: "", destination: "", date: "", travelers: 1 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBooking({ variables: { ...formData, travelers: parseInt(formData.travelers) } });
      setFormData({ name: "", email: "", destination: "", date: "", travelers: 1 });
    } catch (error) {
      console.error("Error submitting booking:", error.message);
    }
  };

  return (
    <div className="container py-5 app-bg">
      <h1 className="mb-4 text-primary text-center">Travel Booking System</h1>
      <Link to="/bookings" className="btn btn-secondary mb-3">View Bookings</Link>
      <div className="card p-4 shadow-lg rounded border-0">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input className="form-control form-control-lg" placeholder="Name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control form-control-lg" placeholder="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control form-control-lg" placeholder="Destination" name="destination" value={formData.destination} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control form-control-lg" placeholder="Date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control form-control-lg" placeholder="Travelers" name="travelers" type="number" value={formData.travelers} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary w-100" type="submit">Book Now</button>
        </form>
      </div>
    </div>
  );
}

function Bookings() {
  const { loading, error, data } = useQuery(GET_BOOKINGS);

  return (
    <div className="container py-5 app-bg">
      <h1 className="mb-4 text-primary text-center">All Bookings</h1>
      <Link to="/" className="btn btn-secondary mb-3">Back</Link>
      {loading && <p className="text-info text-center mt-3">Loading...</p>}
      {error && <p className="text-danger text-center mt-3">Error fetching bookings.</p>}
      <ul className="list-group mt-3">
        {data?.getBookings.map((booking) => (
          <li key={booking.id} className="list-group-item d-flex justify-content-between align-items-center">
            {booking.name} - {booking.email} - {booking.destination} ({booking.date}) - {booking.travelers} Travelers
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
