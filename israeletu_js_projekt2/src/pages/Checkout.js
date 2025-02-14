import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { CheckoutContext } from '../context/CheckoutContext.js';

function Checkout() {
  const { checkoutItems, setCheckoutItems } = useContext(CheckoutContext);
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle product deletion
  const handleDelete = (productId) => {
    setCheckoutItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Handle Pay button click
  const handlePay = () => {
    navigate('/payment'); // Navigate to the payment page
  };

  // Calculate total cost
  const totalCost = checkoutItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="checkout-page">
      <h2>Click the Pay button to place your order</h2>
      {checkoutItems.length === 0 ? (
        <p>No products in checkout.</p>
      ) : (
        <div>
          <ul>
            {checkoutItems.map((product) => (
              <li key={product.id}>
                <img
                  src={product.src}
                  alt={product.name}
                  style={{ width: '100px', height: '100px' }}
                />
                <p>{product.name}</p>
                <p>{product.price}€</p>
                <p>{product.quantity} units</p>
                <button
                  className="delete-btn1"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p className="checkout-total">Total: {totalCost.toFixed(2)}€</p>
          <button className="pay-btn" onClick={handlePay}>
            Pay
          </button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
