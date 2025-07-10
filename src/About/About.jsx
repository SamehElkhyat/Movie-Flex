import React from "react";
import axios from "axios";
import "./About.css";
import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { motion} from "framer-motion";
import Sidebarr from '../Sidebarr/sidebar'
import WatchModal from '../components/WatchModal'

export default function Home() {
  const [trendingmovies, setTrendingmovie] = useState([]);
  const [page, setPagination] = useState(1);
  const [showSide, setShowside] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

const Details =  (id) => {
  navigate(`/details/${id}`)
}

const watch = async (movie) => {
  setSelectedMovie(movie);
  setWatchModalOpen(true);
}

const closeWatchModal = () => {
  setWatchModalOpen(false);
  setSelectedMovie(null);
}

const openStreamingService = (url) => {
  window.open(url, '_blank');
}

  const plusPage = () => {
    if (page >= 1) {
      setPagination(page + 1);
      getTrendingMovie(page + 1);
    }
  };

  const minusPage = () => {
    if (page > 1) {
      setPagination(page - 1);
      getTrendingMovie(page - 1);
    }
  };

  async function getTrendingMovie(page = 1) {
    setLoading(true);
    try {
      let { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=f1aca93e54807386df3f6972a5c33b50&page=${page}`
      );
      setTrendingmovie(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTrendingMovie(page);
  }, [page]);

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
    <div className="movies-container">
      <motion.div 
        className="movies-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="section-title">Trending Movies</h1>
        <p className="section-subtitle">Discover the most popular movies this week</p>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      ) : (
        <motion.div 
          className="movies-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {trendingmovies.map((movie, index) => (
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
                      <Link 
                        onClick={() => watch(movie)}
                        className="btn-watch"
                      >
                        <i className="fas fa-play"></i>
                        Watch
                      </Link>
                      <Link to={`/details/${movie.id}`} className="btn-details">
                        <i className="fas fa-info-circle"></i>
                        Details
                      </Link>
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
          onClick={minusPage} 
          className="btn-pagination"
          disabled={page <= 1}
        >
          <i className="fas fa-chevron-left"></i>
          Previous
        </button>
        <span className="page-info">Page {page}</span>
        <button 
          onClick={plusPage} 
          className="btn-pagination"
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
}
