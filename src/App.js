import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const quotes = [
    {
      text: "The only limit to our realization of tomorrow is our doubts of today.",
      author: "Franklin D. Roosevelt",
    },
    {
      text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb",
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      text: "Do what you can, with what you have, where you are.",
      author: "Theodore Roosevelt",
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "In the middle of every difficulty lies opportunity.",
      author: "Albert Einstein",
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius",
    },
  ];

  const [quote, setQuote] = useState({ text: '', author: '' });
  const [fade, setFade] = useState(false);
  const [favoriteQuotes, setFavoriteQuotes] = useState([]); // State for favorite quotes
  const [darkMode, setDarkMode] = useState(false); // State for light/dark theme
  const [copySuccess, setCopySuccess] = useState(false); // State for copy success message
  const [canPlaySounds, setCanPlaySounds] = useState(false); // State to enable sounds

  // Sounds
  const newQuoteSound = new Audio('/sounds/new-quote.mp3'); // Sound for new quote
  const sound = new Audio('/sounds/copy.mp3'); // Sound for copying quote
  const favoriteSound = new Audio('/sounds/favorite.mp3'); // Sound for adding to favorites
  const clearSound = new Audio('/sounds/clear.mp3'); // Sound for clearing favorites

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const fetchQuote = () => {
    setFade(true); // Start fading
    setTimeout(() => {
      const randomQuote = getRandomQuote();
      setQuote(randomQuote);
      setFade(false); // End fading
      if (canPlaySounds) {
        newQuoteSound.play(); // Play new quote sound
      }
    }, 500); // Wait time for fading
  };

  // Function to add the current quote to favorites
  const addToFavorites = () => {
    const newFavorite = { text: quote.text, author: quote.author };

    // Check if the quote is already in favorites
    if (!favoriteQuotes.some((fav) => fav.text === newFavorite.text)) {
      setFavoriteQuotes([...favoriteQuotes, newFavorite]);
      localStorage.setItem('favoriteQuotes', JSON.stringify([...favoriteQuotes, newFavorite]));
      if (canPlaySounds) {
        favoriteSound.play(); // Play favorite sound
      }
      alert('Quote added to favorites!');
    } else {
      alert('This quote is already in your favorites!');
    }
  };

  // Function to clear the favorites list
  const clearFavorites = () => {
    setFavoriteQuotes([]);
    localStorage.removeItem('favoriteQuotes');
    if (canPlaySounds) {
      clearSound.play(); // Play clear favorites sound
    }
    alert('Favorite quotes cleared!');
  };

  // Function to toggle between light and dark themes
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    if (canPlaySounds) {
      sound.play(); // Play copy sound
    }
  };

  // Function to copy the quote to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    setCopySuccess(true);
    if (canPlaySounds) {
      sound.play(); // Play copy sound
    }
    setTimeout(() => setCopySuccess(false), 2000); // Hide message after 2 seconds
  };

  // Function to share on Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `"${quote.text}" - ${quote.author}`
    )}`;
    if (canPlaySounds) {
      sound.play(); // Play copy sound
    }
    window.open(url, '_blank');
  };

  // Function to share on WhatsApp
  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      `"${quote.text}" - ${quote.author}`
    )}`;
    if (canPlaySounds) {
      sound.play(); // Play copy sound
    }
    window.open(url, '_blank');
  };

  // Load favorite quotes and theme from localStorage on app load
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
    setFavoriteQuotes(storedFavorites);

    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    setDarkMode(storedDarkMode);

    fetchQuote();
  }, []);

  // Enable sounds after the first interaction
  const handleFirstInteraction = () => {
    setCanPlaySounds(true);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div id="quote-box" className="quote-container">
        <div id="text" className={`quote-text ${fade ? 'fade-out' : ''}`}>
          <i className="fas fa-quote-left"></i> {quote.text}
        </div>
        <div id="author" className="quote-author">
          - {quote.author}
        </div>
        <div className="buttons">
          <a
            id="tweet-quote"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `"${quote.text}" - ${quote.author}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn tweet-btn"
          >
            <i className="fab fa-twitter"></i> Tweet
          </a>
          <button id="new-quote" className="btn new-quote-btn" onClick={() => {
            fetchQuote();
            handleFirstInteraction(); // Enable sounds
          }}>
            New Quote
          </button>
          <button id="add-favorite" className="btn favorite-btn" onClick={() => {
            addToFavorites();
            handleFirstInteraction(); // Enable sounds
          }}>
            <i className="fas fa-heart"></i> Add to Favorites
          </button>
          <button id="copy-quote" className="btn copy-btn" onClick={() => {
            copyToClipboard();
            handleFirstInteraction(); // Enable sounds
          }}>
            <i className="fas fa-copy"></i> Copy
          </button>
          <button id="share-facebook" className="btn facebook-btn" onClick={shareOnFacebook}>
            <i className="fab fa-facebook"></i> Facebook
          </button>
          <button id="share-whatsapp" className="btn whatsapp-btn" onClick={shareOnWhatsApp}>
            <i className="fab fa-whatsapp"></i> WhatsApp
          </button>
          <button id="toggle-theme" className="btn theme-btn" onClick={toggleDarkMode}>
            {darkMode ? 'Light Theme' : 'Dark Theme'}
          </button>
        </div>
        {copySuccess && <div className="copy-success">Quote copied to clipboard!</div>}
      </div>

      {/* Favorite Quotes List */}
      {favoriteQuotes.length > 0 && (
        <div className="favorite-quotes-container">
          <h2>Favorite Quotes</h2>
          <ul className="favorite-quotes-list">
            {favoriteQuotes.map((favQuote, index) => (
              <li key={index} className="favorite-quote">
                <i className="fas fa-quote-left"></i> {favQuote.text} - {favQuote.author}
              </li>
            ))}
          </ul>
          <button id="clear-favorites" className="btn clear-btn" onClick={() => {
            clearFavorites();
            handleFirstInteraction(); // Enable sounds
          }}>
            Clear Favorites
          </button>
        </div>
      )}

      <div className="developed-by">
        developed by <span className="developer-name">Eddie Jonathan Garcia Borbon</span>
      </div>
    </div>
  );
};

export default App;