import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './WatchModal.css';

const WatchModal = ({ movie, show, isOpen, onClose }) => {
  const [watchProviders, setWatchProviders] = useState(null);
  const [videos, setVideos] = useState(null);
  const [externalIds, setExternalIds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('streaming');

  // Determine if we're dealing with a movie or TV show
  const content = movie || show;
  const isTVShow = !!show;

  useEffect(() => {
    if (isOpen && content) {
      fetchWatchData();
    }
  }, [isOpen, content]);

  const fetchWatchData = async () => {
    setLoading(true);
    try {
      const baseUrl = isTVShow ? 'tv' : 'movie';
      
      // Fetch watch providers
      const providersResponse = await axios.get(
        `https://api.themoviedb.org/3/${baseUrl}/${content.id}/watch/providers?api_key=f1aca93e54807386df3f6972a5c33b50`
      );
      setWatchProviders(providersResponse.data.results);
      // Fetch videos (trailers, etc.)
      const videosResponse = await axios.get(
        `https://api.themoviedb.org/3/${baseUrl}/${content.id}/videos?api_key=f1aca93e54807386df3f6972a5c33b50`
      );
      setVideos(videosResponse.data.results);

      // Fetch external IDs for links to other platforms
      const externalResponse = await axios.get(
        `https://api.themoviedb.org/3/${baseUrl}/${content.id}/external_ids?api_key=f1aca93e54807386df3f6972a5c33b50`
      );
      setExternalIds(externalResponse.data);
    } catch (error) {
      console.error('Error fetching watch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreamingProviders = () => {
    if (!watchProviders) return null;
    
    // Get US providers (you can change this to other countries)
    const usProviders = watchProviders.US || {};
    return usProviders;
  };

  const getTrailers = () => {
    if (!videos) return [];
    return videos.filter(video => 
      video.type === 'Trailer' && 
      (video.site === 'YouTube' || video.site === 'Vimeo')
    );
  };

  const openExternalLink = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getExternalLinks = () => {
    if (!externalIds) return [];
    
    const links = [];
    if (externalIds.imdb_id) {
      links.push({
        name: 'IMDb',
        url: `https://www.imdb.com/title/${externalIds.imdb_id}`,
        icon: 'fas fa-film'
      });
    }
    if (externalIds.facebook_id) {
      links.push({
        name: 'Facebook',
        url: `https://www.facebook.com/${externalIds.facebook_id}`,
        icon: 'fab fa-facebook'
      });
    }
    if (externalIds.instagram_id) {
      links.push({
        name: 'Instagram',
        url: `https://www.instagram.com/${externalIds.instagram_id}`,
        icon: 'fab fa-instagram'
      });
    }
    if (externalIds.twitter_id) {
      links.push({
        name: 'Twitter',
        url: `https://twitter.com/${externalIds.twitter_id}`,
        icon: 'fab fa-twitter'
      });
    }
    return links;
  };

  const renderStreamingOptions = () => {
    const providers = getStreamingProviders();
    if (!providers) {
      return <p className="no-options">No streaming information available for this {isTVShow ? 'TV show' : 'movie'}.</p>;
    }

    const options = [];
    
    if (providers.flatrate && providers.flatrate.length > 0) {
      options.push({
        type: 'Stream',
        services: providers.flatrate,
        color: '#00b894'
      });
    }
    
    if (providers.rent && providers.rent.length > 0) {
      options.push({
        type: 'Rent',
        services: providers.rent,
        color: '#fdcb6e'
      });
    }
    
    if (providers.buy && providers.buy.length > 0) {
      options.push({
        type: 'Buy',
        services: providers.buy,
        color: '#e17055'
      });
    }

    if (options.length === 0) {
      return <p className="no-options">No streaming options available for this {isTVShow ? 'TV show' : 'movie'}.</p>;
    }

    return (
      <div className="streaming-options">
        {options.map((option, index) => (
          <div key={index} className="streaming-option">
            <h4 style={{ color: option.color }}>{option.type}</h4>
            <div className="services-grid">
              {option.services.map((service, serviceIndex) => (
                <div key={serviceIndex} className="service-card">
                  <img
                    src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                    alt={service.provider_name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="service-name">{service.provider_name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTrailers = () => {
    const trailers = getTrailers();
    if (trailers.length === 0) {
      return <p className="no-options">No trailers available for this {isTVShow ? 'TV show' : 'movie'}.</p>;
    }

    return (
      <div className="trailers-section">
        {trailers.slice(0, 3).map((trailer, index) => (
          <div key={index} className="trailer-card">
            <div className="trailer-thumbnail">
              <img
                src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                alt={trailer.name}
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;
                }}
              />
              <div className="play-overlay" onClick={() => openExternalLink(`https://www.youtube.com/watch?v=${trailer.key}`)}>
                <i className="fas fa-play"></i>
              </div>
            </div>
            <h4>{trailer.name}</h4>
            <p>{trailer.type}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderExternalLinks = () => {
    const links = getExternalLinks();
    if (links.length === 0) {
      return <p className="no-options">No external links available for this {isTVShow ? 'TV show' : 'movie'}.</p>;
    }

    return (
      <div className="external-links">
        {links.map((link, index) => (
          <button
            key={index}
            className="external-link-btn"
            onClick={() => openExternalLink(link.url)}
          >
            <i className={link.icon}></i>
            {link.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="watch-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="watch-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{content?.title || content?.name}</h2>
              <button className="close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-tabs">
              <button
                className={`tab-btn ${activeTab === 'streaming' ? 'active' : ''}`}
                onClick={() => setActiveTab('streaming')}
              >
                <i className="fas fa-play"></i>
                Streaming
              </button>
              <button
                className={`tab-btn ${activeTab === 'trailers' ? 'active' : ''}`}
                onClick={() => setActiveTab('trailers')}
              >
                <i className="fas fa-film"></i>
                Trailers
              </button>
              <button
                className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
                onClick={() => setActiveTab('links')}
              >
                <i className="fas fa-external-link-alt"></i>
                Links
              </button>
            </div>

            <div className="modal-content">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading watch options...</p>
                </div>
              ) : (
                <div className="tab-content">
                  {activeTab === 'streaming' && renderStreamingOptions()}
                  {activeTab === 'trailers' && renderTrailers()}
                  {activeTab === 'links' && renderExternalLinks()}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WatchModal; 