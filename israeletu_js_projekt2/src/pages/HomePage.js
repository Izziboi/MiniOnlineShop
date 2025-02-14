import React from 'react';
import { Link } from 'react-router-dom';
import images from '../imageArray.js'; // Adjust the path as needed

function HomePage() {
  return (
    <div className='home-div'>
      <h2>Welcome to My Online Shop</h2>
      <div className="image-grid">
        {images.map((image, index) => (
          <div className="image-item" key={index}>
            <Link to={`/product/${index}`}>
              <img src={image.src} alt={image.name} />
              <p>{image.name}</p>
              <p>{image.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
