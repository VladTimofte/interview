import React from 'react';
import './Style.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Persons from './pages/Persons';
import Cars from './pages/Cars';

function App() {
  return (
    <>
      <Router>
        <Navbar />
          <Routes>
            <Route path='/' exact element={<Persons />} />
            <Route path='/persons' element={<Persons />} />
            <Route path='/cars' element={<Cars />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
