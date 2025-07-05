import React from 'react';
import './Start.css'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="hero-container">
      {/* Background Video/Image */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      {/* Hero Content */}
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="title-main">Unlimited</span>
          <span className="title-accent">Movies</span>
          <span className="title-sub">TV Shows & More</span>
        </motion.h1>
        
        <motion.p 
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Watch anywhere. Cancel anytime. Ready to watch? Enter your email to create or restart your membership.
        </motion.p>
        
        <motion.div 
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          <Link to="SignUp" className="btn-primary">
            <span>Get Started</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
          <Link to="Regestier" className="btn-secondary">
            <span>Sign In</span>
            <i className="fas fa-user"></i>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Floating Elements */}
      <motion.div 
        className="floating-elements"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="floating-card card-1"></div>
        <div className="floating-card card-2"></div>
        <div className="floating-card card-3"></div>
      </motion.div>
    </div>
  );
}
