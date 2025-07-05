import React, { useState, useEffect } from 'react';
import './navbar.scss'
import './nnav.css'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function App() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header 
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <nav className="nav-container">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <motion.span 
                            className="logo-text"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            MovieFlix
                        </motion.span>
                    </Link>
                </div>

                <div className="nav-center">
                    <motion.div 
                        className="scrolling-text"
                        animate={{ x: [0, -100, 0] }}
                        transition={{ 
                            duration: 20, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                    >
                        <span className="scroll-content">
                            Trending • Popular • New Releases • Award Winners • Coming Soon
                        </span>
                    </motion.div>
                </div>

                <div className="nav-right">
                    <motion.div 
                        className="nav-links"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="Movies" className="nav-link">
                            <motion.span 
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                Movies
                            </motion.span>
                        </Link>
                        <Link to="Regestier" className="nav-link">
                            <motion.span 
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                Sign In
                            </motion.span>
                        </Link>
                        <Link to="SignUp" className="nav-link signup-btn">
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                Sign Up
                            </motion.span>
                        </Link>
                    </motion.div>

                    <button 
                        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            <motion.div 
                className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                    opacity: isMobileMenuOpen ? 1 : 0,
                    height: isMobileMenuOpen ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
            >
                <Link to="Movies" className="mobile-link">Movies</Link>
                <Link to="Regestier" className="mobile-link">Sign In</Link>
                <Link to="SignUp" className="mobile-link">Sign Up</Link>
            </motion.div>
        </motion.header>
    );
}