import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import WatchModal from './WatchModal';
import './UpcomingMovies.css';

const UpcomingMovies = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchUpcomingMovies = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=f1aca93e54807386df3f6972a5c33b50&page=${pageNum}`
      );
      setUpcomingMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMovies(page);
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

  const handleWatch = (movie) => {
    setSelectedMovie(movie);
    setWatchModalOpen(true);
  };

  const closeWatchModal = () => {
    setWatchModalOpen(false);
    setSelectedMovie(null);
  };

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilRelease = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const diffTime = releaseDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    <div className="upcoming-container">
      <motion.div 
        className="upcoming-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="section-title">Upcoming Movies</h1>
        <p className="section-subtitle">Discover the latest movies coming to theaters</p>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading upcoming movies...</p>
        </div>
      ) : (
        <motion.div 
          className="movies-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {upcomingMovies.map((movie) => {
            const daysUntilRelease = getDaysUntilRelease(movie.release_date);
            const isReleased = daysUntilRelease <= 0;
            
            return (
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
                      <div className="release-badge">
                        {isReleased ? (
                          <span className="badge released">Now Playing</span>
                        ) : (
                          <span className="badge upcoming">
                            {daysUntilRelease === 1 ? 'Tomorrow' : `${daysUntilRelease} days`}
                          </span>
                        )}
                      </div>
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-rating">
                          <i className="fas fa-star"></i>
                          {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="movie-release">
                          <i className="fas fa-calendar"></i>
                          {formatReleaseDate(movie.release_date)}
                        </span>
                      </div>
                      <p className="movie-overview">
                        {movie.overview.length > 100 
                          ? `${movie.overview.substring(0, 100)}...` 
                          : movie.overview
                        }
                      </p>
                      <div className="movie-actions">
                        <button 
                          className="btn-watch"
                          onClick={() => handleWatch(movie)}
                        >
                          <i className="fas fa-play"></i>
                          Watch
                        </button>
                        <Link to={`/details/${movie.id}`} className="btn-details">
                          <i className="fas fa-info-circle"></i>
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
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

      <WatchModal
        isOpen={watchModalOpen}
        onClose={closeWatchModal}
        movie={selectedMovie}
      />
    </div>
  );
};

export default UpcomingMovies; 