import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './MovieSearch.css';

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchMovies = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=f1aca93e54807386df3f6972a5c33b50&query=${encodeURIComponent(query)}&page=1`
      );
      setSearchResults(data.results);
      setSearched(true);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(searchQuery);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
      setSearched(false);
    }
  };

  return (
    <div className="search-container">
      <motion.div 
        className="search-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="search-title">Search Movies</h2>
        <p className="search-subtitle">Find your favorite movies and discover new ones</p>
      </motion.div>

      <motion.form 
        className="search-form"
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for movies..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </div>
      </motion.form>

      {loading && (
        <motion.div 
          className="loading-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </motion.div>
      )}

      {searched && !loading && (
        <motion.div 
          className="search-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="results-title">
            {searchResults.length > 0 
              ? `Found ${searchResults.length} movies` 
              : 'No movies found'
            }
          </h3>
          
          {searchResults.length > 0 && (
            <div className="results-grid">
              {searchResults.map((movie) => (
                <motion.div 
                  key={movie.id} 
                  className="result-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="result-poster">
                    <img
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                        : '/placeholder-poster.jpg'
                      }
                      alt={movie.title}
                      loading="lazy"
                    />
                    <div className="result-overlay">
                      <div className="result-info">
                        <h4 className="result-title">{movie.title}</h4>
                        <div className="result-meta">
                          <span className="result-rating">
                            <i className="fas fa-star"></i>
                            {movie.vote_average.toFixed(1)}
                          </span>
                          <span className="result-year">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                          </span>
                        </div>
                        <p className="result-overview">
                          {movie.overview 
                            ? (movie.overview.length > 80 
                                ? `${movie.overview.substring(0, 80)}...` 
                                : movie.overview)
                            : 'No overview available'
                          }
                        </p>
                        <div className="result-actions">
                          <button className="btn-watch">
                            <i className="fas fa-play"></i>
                            Watch
                          </button>
                          <button className="btn-details">
                            <i className="fas fa-info-circle"></i>
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MovieSearch; 