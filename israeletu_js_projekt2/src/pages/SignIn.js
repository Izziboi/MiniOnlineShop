import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [customerPageComponent, setCustomerPageComponent] = useState(null); // Store the component to render
  const navigate = useNavigate(); // Initialize useNavigate instead of useHistory

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validateLogin = async () => {
    const loginUrl = "http://localhost:5000/login"; // Login endpoint

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const result = await response.json();

      // If login is successful, pass the result to fetchCustomerPage
      fetchCustomerPage(result);

    } catch (error) {
      setErrorMessage(error.message); // Display error if login fails
    }
  };

  const fetchCustomerPage = async (result) => {
    try {
      const response = await fetch(`http://localhost:5000/customer-pages/${result.email}`);

      if (!response.ok) {
        throw new Error("Customer page not found");
      }

      const pageContent = await response.text(); // Assuming the response is a React component string (JSX)
      console.log(pageContent); // Verify the content in console

      // Dynamically load the JSX content, or render a React component
      const DynamicCustomerPage = () => {
        return (
          <div>
            {/* Render the fetched component here, for now rendering the pageContent as plain text */}
            <h2>Welcome, {result.firstName} {result.lastName}!</h2>
            <div>{pageContent}</div>
          </div>
        );
      };

      // Set the component to display in state
      setCustomerPageComponent(<DynamicCustomerPage />);

      // Call navigateToCustomerPage to navigate after fetching customer page
      navigateToCustomerPage(result.email);

    } catch (error) {
      setErrorMessage(error.message); // Display error if customer page fetch fails
    }
  };

  // Function to navigate to the customer page
  const navigateToCustomerPage = (email) => {
    navigate(`/customer-pages/${email}`);  // Navigate to the dynamic page
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    validateLogin(); // Perform login validation
  };

  return (
    <div className="signin-div">
      <h3>Please sign in below</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="signin-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          className="signin-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button className="signin-button" type="submit">
          Login
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

      <p>You do not have an account yet?</p>
      <p>Then use the link below to create one</p>
      <Link to="/create-account">
        <p>Create a new account</p>
      </Link>

      {/* If the customer page component is fetched, render it dynamically */}
      {customerPageComponent && customerPageComponent}
    </div>
  );
}

export default SignIn;
