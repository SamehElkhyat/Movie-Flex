import React, { useState } from 'react'
import { useFormik } from 'formik'
import './SignUp.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSignUp(values) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate password match
    if (values.password !== values.repassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3007/signup`, values);
      if (response.data === 'success') {
        setSuccess('Account created successfully! Welcome to MovieFlix.');
        setTimeout(() => {
          window.location.href = '/movies/Home';
        }, 2000);
      } else {
        setError('Email already exists. Please try a different email.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  let formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      repassword: '',
      gender: '',
    },
    onSubmit: handleSignUp
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
            <h1>Join MovieFlix</h1>
            <p>Create your account to start watching</p>
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

            {success && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {success}
              </motion.div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="form-input"
                  type="text"
                  name="name"
                  placeholder="Full name"
                  required
                />
              </div>
            </div>

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

            <div className="form-group">
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.repassword}
                  className="form-input"
                  type="password"
                  name="repassword"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="gender-label">Gender</label>
              <div className="gender-options">
                <label className="radio-wrapper">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={formik.handleChange}
                    className="radio-input"
                    required
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Male</span>
                </label>
                <label className="radio-wrapper">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={formik.handleChange}
                    className="radio-input"
                    required
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Female</span>
                </label>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox-input" required />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">I agree to the terms and conditions</span>
              </label>
            </div>

            <motion.button 
              type="submit" 
              className="btn-signup"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Create Account
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
            <p>Already have an account? <Link to="/Regestier" className="link-signin">Sign in</Link></p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}