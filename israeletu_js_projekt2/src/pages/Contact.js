import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [files, setFiles] = useState([]); // Store uploaded files
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (Object.values(formData).some((value) => !value)) {
      setErrorMessage("All fields are required except file upload.");
      return;
    }

    try {
      // Create a FormData object to include all form data and files
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);

      // Append files to the FormData object
      for (let i = 0; i < files.length; i++) {
        formDataToSend.append("files", files[i]);
      }

      // Send the data to the backend
      const response = await fetch("http://localhost:5000/inquiries", {
        method: "POST",
        body: formDataToSend, // No need for 'Content-Type' header with FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit inquiry: ${errorText}`);
      }

      const result = await response.json();
      console.log("Inquiry submitted successfully:", result);

      // Success feedback
      setSuccessMessage("Message submitted successfully!");
      setErrorMessage("");
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
      setFiles([]); // Clear the files
    } catch (error) {
      console.error("Error submitting the inquiry:", error);
      setErrorMessage("Error connecting to the database or server. Please try again later.");
    }
  };

  return (
    <div className="contact-div">
      <h4>Please fill out the form below to contact us or make your complaints</h4>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Full Name:</label>
        <input
          className="contact-fullname"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          className="contact-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Subject:</label>
        <input
          className="contact-subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <label>Message:</label>
        <textarea
          className="contact-inquiry"
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <label>Upload Files (Optional):</label>
        <input
          className="contact-upload"
          type="file"
          name="upload"
          multiple
          onChange={handleFileChange}
        />

        <button className="contact-button" type="submit">
          Submit
        </button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Contact;
