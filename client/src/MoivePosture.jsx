import React, { useState } from 'react';
import axios from 'axios';

const MovieImageSearch = () => {
  const [movieName, setMovieName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Accessing environment variables
  const API_KEY = "AIzaSyBnQN0OFMD2D8ks_hOuRsYZ_HDJ_V7O4sQ";  // Your API key
  const CSE_ID = "645c252b1150d4f9c";  // Your Custom Search Engine ID

  const handleSearch = async () => {
    if (!movieName) {
      alert('Please enter a movie name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`, {
          params: {
            key: API_KEY,
            cx: CSE_ID,
            q: movieName,
            searchType: 'image',
            num: 1
          }
        });

      const imageUrl = response.data.items && response.data.items[0].link;
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('Error fetching movie image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-search">
      <input
        type="text"
        placeholder="Enter movie name"
        value={movieName}
        onChange={(e) => setMovieName(e.target.value)}
        className="input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>

      {loading && <p>Loading...</p>}

      {imageUrl && !loading && (
        <div>
          <h3>Movie Image:</h3>
          <img
            src={imageUrl}
            alt="Movie"
            className="movie-image"
            style={{
              width: '300px',  // Set the fixed width
              height: '450px', // Set the fixed height
              objectFit: 'cover' // Ensure the image is not stretched or distorted
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MovieImageSearch;
