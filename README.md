# Travel Booking System

## 📌 Project Overview
The **Travel Booking System** is a web application that allows users to book trips to various destinations. The system consists of a **React frontend**, a **Node.js/Express backend** with **GraphQL**, and **MongoDB Atlas** as the database. The backend is deployed on **Render**, and the frontend communicates with it via **Apollo Client**.

## 🚀 Features
- **Book a Trip** – Users can enter details and book a trip.
- **View Bookings** – Retrieve all saved bookings.
- **Delete Booking** – Remove a booking from the database.
- **GraphQL API** – Efficient data fetching and management.
- **MongoDB Atlas** – Stores all booking data.
- **Fully Responsive UI** – Works across devices.

## 🛠️ Tech Stack
- **Frontend:** React, Apollo Client, React Router
- **Backend:** Node.js, Express, Apollo Server, GraphQL
- **Database:** MongoDB Atlas
- **Deployment:** Render (Backend), Netlify/Vercel (Frontend)

## 🏗️ Project Structure
```
travel-booking-system/
│── frontend/  # React App (Client Side)
│── server/    # Node.js & GraphQL Backend
│── models/    # MongoDB Schema for Booking
│── .env       # Environment Variables
│── package.json  # Dependencies
│── README.md  # Project Documentation
```

## ⚙️ Setup Instructions
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/travel-booking-system.git
cd travel-booking-system
```

### 2️⃣ Backend Setup
```sh
cd server
npm install  # Install dependencies
```

Create a **.env** file in the `server/` directory:
```env
PORT=4000
MONGO_URI=your-mongodb-connection-string
```

Start the backend server:
```sh
node index.js
```

### 3️⃣ Frontend Setup
```sh
cd ../frontend
npm install  # Install dependencies
```

Update `App.js` to use the correct backend URL:
```js
const client = new ApolloClient({
  uri: "https://your-backend-url.onrender.com/graphql",
  cache: new InMemoryCache(),
});
```

Start the React frontend:
```sh
npm start
```

## 🌍 Deployment
- **Backend:** Deployed on Render.
- **Frontend:** Deploy on Netlify/Vercel.

## 📌 API Endpoints (GraphQL)
### 🔍 Query: Get All Bookings
```graphql
query {
  getBookings {
    id
    name
    email
    destination
    date
    travelers
  }
}
```
### ➕ Mutation: Add Booking
```graphql
mutation {
  addBooking(name: "John Doe", email: "john@example.com", destination: "Paris", date: "2025-05-01", travelers: 2) {
    id
    name
  }
}
```
### ❌ Mutation: Delete Booking
```graphql
mutation {
  deleteBooking(id: "booking_id_here") {
    id
  }
}
```

## 🎯 Next Steps
- Implement **Update Booking** feature.
- Add authentication (optional).
- Improve UI/UX.

## 🏆 Contributors
- **Shantanu Kulkarni** – Developer

🚀 **Enjoy using the Travel Booking System!**

