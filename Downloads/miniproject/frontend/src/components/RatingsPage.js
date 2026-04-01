import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ratingAPI } from '../services/api';

const RatingsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ratings, setRatings ] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const loadRatings = async () => {
      if (user) {
        try {
          const ratingsResponse = await ratingAPI.getRatingsForUser(user.id);
          setRatings(ratingsResponse.data || []);
          const avgResponse = await ratingAPI.getAverageRating(user.id);
          const avg = typeof avgResponse.data === 'number' ? avgResponse.data : (avgResponse.data?.average || 0);
          setAverageRating(avg);
        } catch (err) {
          console.error('Error loading ratings:', err);
        }
      }
    };
    loadRatings();
  }, [user]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="ratings-page">
      <div className="page-header">
        <h1>⭐ My Ratings</h1>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>
      <div className="sidebar-section">
        <h4>Average Rating</h4>
        <div className="average-rating">
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
        </div>
      </div>
      {ratings.length > 0 ? (
        <div className="sidebar-section">
          <h4>Ratings History</h4>
          <div className="ratings-list">
            {ratings.slice(0, 10).map(rating => (
              <div key={rating.id} className="rating-item">
                {renderStars(rating.ratingValue)}
                <span className="rating-from">from {rating.fromUser?.name || 'Employer'}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No ratings yet</p>
      )}
    </div>
  );
};

export default RatingsPage;

