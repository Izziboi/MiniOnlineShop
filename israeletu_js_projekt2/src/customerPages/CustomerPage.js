import React from "react";
import { useLocation } from "react-router-dom";

function CustomerPage() {
  const location = useLocation();
  const { firstName, lastName } = location.state || {}; // Retrieve state passed from SignIn

  return (
    <div class="customer-page">
        <div class="customer-page-header">
          <h2>Welcome, ${firstName} ${lastName}!</h2>
          <a class="logout-link" href="/" onclick="window.close()">Log out</a>
        </div>
        <p>Your account has been successfully created.</p>
      </div>
  );
}

export default CustomerPage;
