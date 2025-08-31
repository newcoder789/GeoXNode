import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import GlacierMap from './components/GlacierMap';
import DataStory from './components/DataStory';
import NotificationForm from './components/NotificationForm';
import RecentEvents from './components/RecentEvents';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navbar />
        
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <DataStory />
              <NotificationForm />
              <RecentEvents />
              <Sponsors />
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<GlacierMap />} />
          <Route path="/events" element={<RecentEvents />} />
          <Route path="/subscribe" element={<NotificationForm />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
