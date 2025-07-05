import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './TVShows.css';

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const categories = [
    { id: 'popular', name: 'Popular', endpoint: 'popular' },
    { id: 'top_rated', name: 'Top Rated', endpoint: 'top_rated' },
    { id: 'on_the_air', name: 'On The Air', endpoint: 'on_the_air' },
    { id: 'airing_today', name: 'Airing Today', endpoint: 'airing_today' }
  ];

  const fetchTVShows = async (category = 'popular', pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${category}?api_key=f1aca93e54807386df3f6972a5c33b50&page=${pageNum}`
      );
      setTvShows(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows(selectedCategory, page);
  }, [selectedCategory, page]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <div className="tv-shows-container">
      <motion.div 
        className="tv-shows-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="section-title">TV Shows</h1>
        <p className="section-subtitle">Discover amazing television series</p>
      </motion.div>

      <motion.div 
        className="category-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading TV shows...</p>
        </div>
      ) : (
        <motion.div 
          className="shows-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tvShows.map((show) => (
            <motion.div 
              key={show.id} 
              className="show-card"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="show-poster">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                  alt={show.name}
                  loading="lazy"
                />
                <div className="show-overlay">
                  <div className="show-info">
                    <h3 className="show-title">{show.name}</h3>
                    <div className="show-meta">
                      <span className="show-rating">
                        <i className="fas fa-star"></i>
                        {show.vote_average.toFixed(1)}
                      </span>
                      <span className="show-year">
                        {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                      </span>
                    </div>
                    <div className="show-details">
                      <span className="show-status">
                        <i className="fas fa-circle"></i>
                        {show.status}
                      </span>
                      <span className="show-episodes">
                        <i className="fas fa-tv"></i>
                        {show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="show-overview">
                      {show.overview.length > 120 
                        ? `${show.overview.substring(0, 120)}...` 
                        : show.overview
                      }
                    </p>
                    <div className="show-actions">
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

export default TVShows; 