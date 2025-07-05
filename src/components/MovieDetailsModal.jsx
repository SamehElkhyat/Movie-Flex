import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './MovieDetailsModal.css';

const MovieDetailsModal = ({ movie, isOpen, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=f1aca93e54807386df3f6972a5c33b50&append_to_response=credits,videos,images`
      );
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrailer = () => {
    if (!movieDetails?.videos?.results) return null;
    return movieDetails.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading movie details...</p>
            </div>
          ) : movieDetails ? (
            <div className="movie-details">
              <button className="close-button" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
              
              <div className="movie-header">
                <div className="movie-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
                    alt={movieDetails.title}
                  />
                </div>
                
                <div className="movie-info">
                  <h1 className="movie-title">{movieDetails.title}</h1>
                  <div className="movie-meta">
                    <span className="movie-rating">
                      <i className="fas fa-star"></i>
                      {movieDetails.vote_average.toFixed(1)}
                    </span>
                    <span className="movie-year">
                      {new Date(movieDetails.release_date).getFullYear()}
                    </span>
                    <span className="movie-runtime">
                      {formatRuntime(movieDetails.runtime)}
                    </span>
                  </div>
                  
                  <div className="movie-genres">
                    {movieDetails.genres?.map(genre => (
                      <span key={genre.id} className="genre-tag">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  
                  <p className="movie-overview">{movieDetails.overview}</p>
                  
                  <div className="movie-stats">
                    <div className="stat">
                      <span className="stat-label">Budget</span>
                      <span className="stat-value">{formatCurrency(movieDetails.budget)}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Revenue</span>
                      <span className="stat-value">{formatCurrency(movieDetails.revenue)}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Status</span>
                      <span className="stat-value">{movieDetails.status}</span>
                    </div>
                  </div>
                  
                  <div className="movie-actions">
                    <button className="btn-watch">
                      <i className="fas fa-play"></i>
                      Watch Now
                    </button>
                    <button className="btn-trailer">
                      <i className="fas fa-film"></i>
                      Watch Trailer
                    </button>
                    <button className="btn-favorite">
                      <i className="fas fa-heart"></i>
                      Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
              
              {movieDetails.credits?.cast && (
                <div className="cast-section">
                  <h3>Cast</h3>
                  <div className="cast-grid">
                    {movieDetails.credits.cast.slice(0, 6).map(actor => (
                      <div key={actor.id} className="cast-member">
                        <img
                          src={actor.profile_path 
                            ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                            : '/placeholder-avatar.jpg'
                          }
                          alt={actor.name}
                        />
                        <span className="actor-name">{actor.name}</span>
                        <span className="character-name">{actor.character}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="error-container">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Failed to load movie details</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieDetailsModal; 