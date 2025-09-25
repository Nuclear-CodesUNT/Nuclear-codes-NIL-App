import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="nav">
      <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/about">About</Link> | <Link to="/profile">Profile</Link>
    </nav>
  );
}