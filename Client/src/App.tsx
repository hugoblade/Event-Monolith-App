import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import { getToken } from './utils/auth';

const Protected = ({ children }: { children: JSX.Element }) => {
  return getToken() ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <div>
      <NavBar />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/events/:id"
            element={
              <Protected>
                <EventDetails />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
