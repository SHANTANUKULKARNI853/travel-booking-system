import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Link } from "react-router-dom";

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

function Bookings() {
  const { loading, error, data } = useQuery(GET_BOOKINGS);
  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
  });
  const [updateBooking] = useMutation(UPDATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", destination: "", date: "", travelers: 1 });

  const handleEdit = (booking) => {
    setEditMode(true);
    setEditId(booking.id);
    setFormData({ 
      name: booking.name, 
      email: booking.email, 
      destination: booking.destination, 
      date: booking.date, 
      travelers: booking.travelers 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateBooking({ variables: { id: editId, ...formData, travelers: parseInt(formData.travelers) } });
    setEditMode(false);
    setEditId(null);
    setFormData({ name: "", email: "", destination: "", date: "", travelers: 1 });
  };

  if (loading) return <p className="text-info text-center mt-3">Loading...</p>;
  if (error) return <p className="text-danger text-center mt-3">Error fetching bookings.</p>;

  return (
    <div className="container py-5 app-bg">
      <h1 className="mb-4 text-primary text-center">All Bookings</h1>
      <Link to="/" className="btn btn-secondary mb-3">Back</Link>

      {editMode ? (
        <div className="card p-4 shadow-lg rounded border-0">
          <h3 className="text-center mb-3">Edit Booking</h3>
          <form onSubmit={handleUpdate}>
            <input className="form-control mb-3" placeholder="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <input className="form-control mb-3" placeholder="Email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <input className="form-control mb-3" placeholder="Destination" name="destination" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required />
            <input className="form-control mb-3" placeholder="Date" name="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            <input className="form-control mb-3" placeholder="Travelers" name="travelers" type="number" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: e.target.value })} required />
            <button className="btn btn-primary w-100" type="submit">Update Booking</button>
          </form>
        </div>
      ) : (
        <ul className="list-group mt-3">
          {data.getBookings.map((booking) => (
            <li key={booking.id} className="list-group-item d-flex justify-content-between align-items-center">
              {booking.name} - {booking.email} - {booking.destination} ({booking.date}) - {booking.travelers} Travelers
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(booking)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteBooking({ variables: { id: booking.id } })}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Bookings;
