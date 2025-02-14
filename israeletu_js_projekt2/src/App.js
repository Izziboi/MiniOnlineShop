import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js';
import { CheckoutProvider } from './context/CheckoutContext.js';
import Contact from './pages/Contact.js';
import SignIn from './pages/SignIn.js';
import ShoppingCart from './pages/ShoppingCart.js';
import Checkout from './pages/Checkout.js';
import ProductDetails from './pages/ProductDetails.js';
import HomePage from './pages/HomePage.js';
import PaymentPage from './pages/PaymentPage.js';
import CreateAccountForm from './pages/CreateAccountForm.js';
import DynamicCustomerPage from './customerPages/DynamicCustomerPage.js';
import CustomerPage from "./customerPages/CustomerPage.js";
import './App.css';

function App() {
  return (
    <ShoppingCartProvider>
      <CheckoutProvider> 
        <Router>
          <div className="App">
            {/* Navigation Bar */}
            <nav className="navbar">
              <Link to="/" className="shop-name">
                My Online Shop
              </Link>
              <div className="nav-links">
                <Link to="/contact">Contact</Link>
                <Link to="/signin">Sign In</Link>
                <Link to="/shoppingcart">Shopping Cart</Link>
                <Link to="/checkout">Checkout</Link>
              </div>
            </nav>

            {/* Page Content */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/shoppingcart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path='/create-account' element={<CreateAccountForm/>}/>
              <Route path="/customer-pages/:email" element={<DynamicCustomerPage />} />
              <Route path="/customer-pages/:email" element={<CustomerPage />} />
            </Routes>

            {/* Footer Section */}
            <footer className="App-footer">
              <p>&copy; Izzishopping 2024</p>
            </footer>
          </div>
        </Router>
      </CheckoutProvider>
    </ShoppingCartProvider>
  );
}

export default App;

