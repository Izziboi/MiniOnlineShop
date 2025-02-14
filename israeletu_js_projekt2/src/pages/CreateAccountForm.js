import React, { useState } from "react";
//import dotenv from "dotenv";
//import credentials from "../credentials.json";

//require("dotenv").config();
//dotenv.config();

const credentials = {
  user: process.env.COUCHDB_USER,
  password: process.env.COUCHDB_PASSWORD,
  url: process.env.NEWCOUCHDB_URL
};

function CreateAccountForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createDatabaseIfNotExists = async () => {
    const dbUrl = `${credentials.url}/customer`;
    try {
      const response = await fetch(dbUrl, {
        method: "HEAD",
        headers: {
          Authorization: `Basic ${btoa(`${credentials.user}:${credentials.password}`)}`,
        },
      });

      if (response.ok) {
        console.log("Database already exists.");
        return;
      }

      const createResponse = await fetch(dbUrl, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${btoa(`${credentials.user}:${credentials.password}`)}`,
        },
      });

      if (!createResponse.ok) {
        throw new Error(`Database creation failed. Status: ${createResponse.status}`);
      }

      console.log("Database created successfully.");
    } catch (error) {
      console.error("Error checking/creating database:", error);
      throw error;
    }
  };

  const checkEmailExists = async (email) => {
    const dbUrl = `${credentials.url}/customer/_find`;
    const query = {
      selector: { email },
      fields: ["_id"], // Fetch only the `_id` to minimize response size
      limit: 1, // Only check for one match
    };

    try {
      const response = await fetch(dbUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${credentials.user}:${credentials.password}`)}`,
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`Failed to check email existence. Status: ${response.status}`);
      }

      const result = await response.json();
      return result.docs.length > 0; // Returns true if the email exists
    } catch (error) {
      console.error("Error checking email existence:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure all fields are filled
    if (Object.values(formData).some((value) => !value)) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    try {
      // Ensure the database exists
      await createDatabaseIfNotExists();
  
      // Check if the email already exists in the database
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setErrorMessage("This email is already associated with an account.");
        return;
      }
  
      // Proceed with account creation
      const response = await fetch("http://localhost:5000/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create account.");
      }
  
      //const result = await response.json();
  
      // Utilize `result` for feedback
      setSuccessMessage(`Account created successfully!`);
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        email: "",
        password: ""
      });
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(""); // Clear success message if there's an error
    }
  };
  
  return (
    <div className="account-div">
      <h2>Please fill the form below to create an account</h2>
      <form onSubmit={handleSubmit} className="account-form">
        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button className="account-button" type="submit">Submit</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default CreateAccountForm;
