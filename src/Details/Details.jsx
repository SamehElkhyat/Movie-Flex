import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Details.css';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=f1aca93e54807386df3f6972a5c33b50&append_to_response=credits,videos,images,similar`
      );
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTrailer = () => {
    if (!movieDetails?.videos?.results) return null;
    return movieDetails.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleWatchTrailer = () => {
    const trailer = getTrailer();
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-error">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={handleBackClick} className="btn-back">
          <i className="fas fa-arrow-left"></i>
          Go Back
        </button>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="details-error">
        <i className="fas fa-film"></i>
        <h3>Movie not found</h3>
        <p>The movie you're looking for doesn't exist.</p>
        <button onClick={handleBackClick} className="btn-back">
          <i className="fas fa-arrow-left"></i>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="details-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section with Backdrop */}
      <div 
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path})`
        }}
      >
        <div className="hero-content">
          <button onClick={handleBackClick} className="btn-back-hero">
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          
          <div className="hero-info">
            <motion.div 
              className="movie-poster"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
                alt={movieDetails.title}
              />
            </motion.div>
            
            <motion.div 
              className="movie-hero-details"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
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
                <span className="movie-status">
                  {movieDetails.status}
                </span>
              </div>
              
              <div className="movie-genres">
                {movieDetails.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="movie-tagline">{movieDetails.tagline}</p>
              
              <div className="hero-actions">
                <button className="btn-watch-hero" onClick={handleWatchTrailer}>
                  <i className="fas fa-play"></i>
                  Watch Trailer
                </button>
                <button className="btn-favorite-hero">
                  <i className="fas fa-heart"></i>
                  Add to Favorites
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            <motion.div 
              className="overview-section"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2>Overview</h2>
              <p className="movie-overview">{movieDetails.overview}</p>
            </motion.div>

            <motion.div 
              className="stats-section"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2>Movie Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-content">
                    <h4>Budget</h4>
                    <p>{formatCurrency(movieDetails.budget)}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="stat-content">
                    <h4>Revenue</h4>
                    <p>{formatCurrency(movieDetails.revenue)}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-content">
                    <h4>Vote Count</h4>
                    <p>{movieDetails.vote_count.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-calendar"></i>
                  </div>
                  <div className="stat-content">
                    <h4>Release Date</h4>
                    <p>{formatDate(movieDetails.release_date)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {movieDetails.credits?.cast && (
              <motion.div 
                className="cast-section"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h2>Cast</h2>
                <div className="cast-grid">
                  {movieDetails.credits.cast.slice(0, 8).map(actor => (
                    <div key={actor.id} className="cast-card">
                      <div className="cast-image">
                        <img
                          src={actor.profile_path 
                            ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                            : 'https://via.placeholder.com/200x300/666/fff?text=No+Image'
                          }
                          alt={actor.name}
                        />
                      </div>
                      <div className="cast-info">
                        <h4 className="actor-name">{actor.name}</h4>
                        <p className="character-name">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            <motion.div 
              className="production-section"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h2>Production Details</h2>
              
              {movieDetails.production_companies && (
                <div className="production-companies">
                  <h3>Production Companies</h3>
                  <div className="companies-grid">
                    {movieDetails.production_companies.map(company => (
                      <div key={company.id} className="company-card">
                        {company.logo_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                            alt={company.name}
                          />
                        ) : (
                          <div className="company-placeholder">
                            <i className="fas fa-building"></i>
                            <span>{company.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movieDetails.production_countries && (
                <div className="production-countries">
                  <h3>Production Countries</h3>
                  <div className="countries-list">
                    {movieDetails.production_countries.map(country => (
                      <span key={country.iso_3166_1} className="country-tag">
                        {country.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movieDetails.spoken_languages && (
                <div className="spoken-languages">
                  <h3>Spoken Languages</h3>
                  <div className="languages-list">
                    {movieDetails.spoken_languages.map(language => (
                      <span key={language.iso_639_1} className="language-tag">
                        {language.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {movieDetails.similar?.results && (
              <motion.div 
                className="similar-movies"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <h2>Similar Movies</h2>
                <div className="similar-grid">
                  {movieDetails.similar.results.slice(0, 4).map(movie => (
                    <div key={movie.id} className="similar-card" onClick={() => navigate(`/details/${movie.id}`)}>
                      <img
                        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                        alt={movie.title}
                      />
                      <div className="similar-info">
                        <h4>{movie.title}</h4>
                        <span className="similar-rating">
                          <i className="fas fa-star"></i>
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Details;
