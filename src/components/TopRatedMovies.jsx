import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './TopRatedMovies.css';

const TopRatedMovies = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTopRatedMovies = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=f1aca93e54807386df3f6972a5c33b50&page=${pageNum}`
      );
      setTopRatedMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRatedMovies(page);
  }, [page]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="top-rated-container">
      <motion.div 
        className="top-rated-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="section-title">Top Rated Movies</h1>
        <p className="section-subtitle">The highest rated movies of all time</p>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading top rated movies...</p>
        </div>
      ) : (
        <motion.div 
          className="movies-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topRatedMovies.map((movie, index) => (
            <motion.div 
              key={movie.id} 
              className="movie-card"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="movie-poster">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="movie-overlay">
                  <div className="movie-info">
                    <div className="movie-rank">
                      <span className="rank-number">#{index + 1 + (page - 1) * 20}</span>
                    </div>
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="movie-rating">
                        <i className="fas fa-star"></i>
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="movie-year">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    </div>
                    <p className="movie-overview">
                      {movie.overview.length > 100 
                        ? `${movie.overview.substring(0, 100)}...` 
                        : movie.overview
                      }
                    </p>
                    <div className="movie-actions">
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
        </motion.div>
      )}

      <motion.div 
        className="pagination"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button 
          onClick={prevPage} 
          className="btn-pagination"
          disabled={page <= 1}
        >
          <i className="fas fa-chevron-left"></i>
          Previous
        </button>
        <span className="page-info">Page {page} of {totalPages}</span>
        <button 
          onClick={nextPage} 
          className="btn-pagination"
          disabled={page >= totalPages}
        >
          Next
          <i className="fas fa-chevron-right"></i>
        </button>
      </motion.div>
    </div>
  );
};

export default TopRatedMovies; 