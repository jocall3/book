// src/culture/ParadoxExchange.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParadoxExchange = () => {
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userBalance, setUserBalance] = useState(1000); // Initial balance
  const [selectedArt, setSelectedArt] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const response = await axios.get('/api/art'); // Replace with your API endpoint
        setArtPieces(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch art pieces.');
        setLoading(false);
      }
    };

    fetchArt();
  }, []);

  const handleArtSelect = (art) => {
    setSelectedArt(art);
    setMessage(''); // Clear any previous messages
  };

  const handleBidChange = (e) => {
    setBidAmount(e.target.value);
  };

  const handlePlaceBid = async () => {
    if (!selectedArt) {
      setMessage('Please select an art piece.');
      return;
    }

    const bid = parseFloat(bidAmount);

    if (isNaN(bid) || bid <= 0) {
      setMessage('Please enter a valid bid amount.');
      return;
    }

    if (bid > userBalance) {
      setMessage('Insufficient balance.');
      return;
    }

    try {
      // Simulate bid placement and update balance
      // In a real application, this would be handled by a backend API
      setUserBalance(userBalance - bid);
      setMessage(`Bid of $${bid} placed on "${selectedArt.title}".`);
      setBidAmount(''); // Clear the bid input
      setSelectedArt({...selectedArt, currentBid: bid}); // Update the current bid on the selected art piece
      // Optimistically update the artPieces array
      setArtPieces(artPieces.map(art => art.id === selectedArt.id ? {...art, currentBid: bid} : art));

      // Simulate API call to update the bid on the server
      await axios.post('/api/bid', { artId: selectedArt.id, bidAmount: bid });

    } catch (err) {
      setMessage('Failed to place bid. Please try again.');
      // Revert balance if bid fails (in a real app, handle this server-side)
      setUserBalance(userBalance + bid);
    }
  };

  if (loading) {
    return <div>Loading art pieces...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="paradox-exchange">
      <h1>Paradox Exchange</h1>
      <p>A platform for fostering global understanding through contradictory economic art.</p>

      <div className="art-gallery">
        <h2>Available Art</h2>
        <ul className="art-list">
          {artPieces.map((art) => (
            <li key={art.id} onClick={() => handleArtSelect(art)}>
              <img src={art.imageUrl} alt={art.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />
              <h3>{art.title}</h3>
              <p>{art.artist}</p>
              <p>Current Bid: ${art.currentBid || 0}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="user-account">
        <h2>Your Account</h2>
        <p>Balance: ${userBalance}</p>
      </div>

      {selectedArt && (
        <div className="bid-section">
          <h2>Bid on "{selectedArt.title}"</h2>
          <img src={selectedArt.imageUrl} alt={selectedArt.title} style={{ maxWidth: '200px', maxHeight: '200px' }} />
          <p>Artist: {selectedArt.artist}</p>
          <p>Description: {selectedArt.description}</p>
          <p>Current Bid: ${selectedArt.currentBid || 0}</p>
          <input
            type="number"
            placeholder="Enter bid amount"
            value={bidAmount}
            onChange={handleBidChange}
          />
          <button onClick={handlePlaceBid}>Place Bid</button>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ParadoxExchange;