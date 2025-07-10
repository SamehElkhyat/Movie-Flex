import React, { useState } from 'react'
import './SignIn.css'
import { useFormik } from 'formik'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn(values) {
    setIsLoading(true);
    setError('');
    
    try {
      const users = await axios.post(`http://localhost:3007/signin`, values);
      if (users.data === 'success') {
        alert('Welcome! You have successfully signed in.');
        window.location.href = '/movies';
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  let formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: handleSignIn
  });

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="auth-overlay"></div>
      </motion.div>

      <motion.div 
        className="auth-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="auth-card">
          <motion.div 
            className="auth-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1>Welcome Back</h1>
            <p>Sign in to continue to MovieFlix</p>
          </motion.div>

          <motion.form 
            onSubmit={formik.handleSubmit}
            className="auth-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
              <Link to="#" className="forgot-password">Forgot password?</Link>
            </div>

            <motion.button 
              type="submit" 
              className="btn-signin"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Don't have an account? <Link to="/SignUp" className="link-signup">Sign up</Link></p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}