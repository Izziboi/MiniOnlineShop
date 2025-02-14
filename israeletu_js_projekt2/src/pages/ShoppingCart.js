import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartContext } from '../context/ShoppingCartContext.js';
import { CheckoutContext } from '../context/CheckoutContext.js';

function ShoppingCart() {
  const { cart, setCart } = useContext(ShoppingCartContext);
  const { addToCheckout } = useContext(CheckoutContext);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // State to track quantities for each product
  const navigate = useNavigate();

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(newQuantity, 1), // Ensure at least 1
    }));
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId) // Deselect
        : [...prevSelected, productId] // Select
    );
  };

  // Handle product deletion
  const handleDelete = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
  };

  // Handle checkout for selected products
  const handleCheckout = () => {
    const productsToCheckout = cart
      .filter((item) => selectedProducts.includes(item.id))
      .map((product) => ({
        ...product,
        quantity: quantities[product.id] || 1, // Add quantity to the product
      }));
    productsToCheckout.forEach((product) => addToCheckout(product));
    navigate('/checkout');
  };

  // Calculate totals
  const totalItems = selectedProducts.length;
  const totalCost = cart
    .filter((item) => selectedProducts.includes(item.id))
    .reduce(
      (acc, item) => acc + parseFloat(item.price) * (quantities[item.id] || 1),
      0
    );

  return (
    <div className="shopcart-div">
      <h2>View your chosen products and use the checkboxes to select the ones you want to order</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <img src={item.src} alt={item.name} style={{ width: '100px' }} />
              <div>
                <p>{item.name}</p>
                <p>{item.price}€</p>
                <input
                  type="number"
                  min="1"
                  value={quantities[item.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                  }
                />
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <label>Select for checkout</label>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="totals">
        <p>Number of products: {totalItems}</p>
        <p>Sub total: {totalCost.toFixed(2)}€</p>
        <button className="checkout-btn" onClick={handleCheckout} disabled={totalItems === 0}>
          To Checkout
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
