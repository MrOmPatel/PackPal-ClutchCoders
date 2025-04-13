import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";
import ContactUs from "./pages/ContactUs";
import ThemeToggle from "./components/ThemeToggle";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/:type/:id" element={<TripDetails />} />
          <Route path="/:type/:id/edit" element={<EditTrip />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
        <ThemeToggle />
      </div>
    </Router>
  );
};

export default App;