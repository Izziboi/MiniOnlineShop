import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import { ShoppingCartContext } from '../context/ShoppingCartContext.js';
import { CheckoutContext } from '../context/CheckoutContext.js';
import imageDetails from '../imageDetails.js';

function ProductDetails() {
  const { id } = useParams();
  const product = imageDetails[id];
  const { addToCart } = useContext(ShoppingCartContext);
  const { addToCheckout } = useContext(CheckoutContext);
  const navigate = useNavigate(); // Initialize useNavigate

  if (!product) {
    return <p>Product not found!</p>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/shoppingcart'); // Redirect to ShoppingCart page
  };

  const handleAddToCheckout = () => {
    addToCheckout(product);
    navigate('/checkout'); // Redirect to Checkout page
  };

  return (
    <div className="product-details">
      <img src={product.src} alt={product.name} className="product-image" />
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <p>{product.description}</p>
      <button className='btn' onClick={handleAddToCart}>To Shopping Cart</button>
      <button className='btn' onClick={handleAddToCheckout}>To Checkout</button>
    </div>
  );
}

export default ProductDetails;
