import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useQuery, useMutation, gql, ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Bookings from "./Bookings";


const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Ensure correct backend URL
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

const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $name: String, $email: String, $destination: String, $date: String, $travelers: Int) {
    updateBooking(id: $id, name: $name, email: $email, destination: $destination, date: $date, travelers: $travelers) {
      id
      name
      email
      destination
      date
      travelers
    }
  }
`;

function Home() {
  const { loading, error, data } = useQuery(GET_BOOKINGS);
  const [addBooking] = useMutation(ADD_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
    onCompleted: () => toast.success("Booking successful! 🎉"),
    onError: (err) => toast.error("Error adding booking: " + err.message),
  });
  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
    onCompleted: () => toast.success("Booking deleted! 🗑️"),
    onError: (err) => toast.error("Error deleting booking: " + err.message),
  });
  const [updateBooking] = useMutation(UPDATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
    onCompleted: () => toast.success("Booking updated! ✏️"),
    onError: (err) => toast.error("Error updating booking: " + err.message),
  });

  const [formData, setFormData] = useState({ name: "", email: "", destination: "", date: "", travelers: 1 });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateBooking({ variables: { id: editId, ...formData, travelers: parseInt(formData.travelers) } });
        setEditMode(false);
        setEditId(null);
      } else {
        await addBooking({ variables: { ...formData, travelers: parseInt(formData.travelers) } });
      }
      setFormData({ name: "", email: "", destination: "", date: "", travelers: 1 });
    } catch (error) {
      console.error("Error submitting booking:", error.message);
    }
  };

  const handleEdit = (booking) => {
    setEditMode(true);
    setEditId(booking.id);
    setFormData({ name: booking.name, email: booking.email, destination: booking.destination, date: booking.date, travelers: booking.travelers });
  };

  return (
    <div className="container py-5 bg-dark text-white rounded">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="mb-4 text-warning text-center">✈️ Travel Booking System</h1>
      <Link to="/bookings" className="btn btn-light mb-3">View Bookings</Link>
      <div className="card p-4 shadow-lg rounded border-0 bg-secondary text-white">
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
          <button className="btn btn-warning w-100" type="submit">{editMode ? "Update Booking ✏️" : "Book Now ✅"}</button>
        </form>
      </div>
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
