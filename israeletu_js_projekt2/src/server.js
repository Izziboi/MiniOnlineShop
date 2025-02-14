import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import nano from "nano";
import multer from "multer";
import dotenv from "dotenv";
//import assert from "assert";


const app = express();
const PORT = 5000;
dotenv.config({path: "./.env"});
//require("dotenv").config();

// Set up CouchDB connection
const couchDBUrl = process.env.COUCHDB_URL;
//console.log("CouchDB URL:", couchDBUrl);
//assert(couchDBUrl, "You must specify the CouchDB URL in .env");

const couch = nano(couchDBUrl);

const customerDb = couch.use("customer"); // Use the 'customer' database
const inquiryDb = couch.use("inquiry"); // Use the 'inquiry' database

// Middleware
app.use(cors());
app.use(express.json());
//app.use("/customer-pages", express.static(path.join(process.cwd(), "src/customerPages")));

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // Temporary directory for file uploads

// --- Updated Endpoint for Creating Customer Pages as HTML ---

app.post("/create-account", async (req, res) => {
  const { email, firstName, lastName, address, password } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: "Email, first name, and last name are required." });
  }

  try {
    const newCustomer = { email, firstName, lastName, address, password, createdAt: new Date().toISOString() };
    const doc = await customerDb.insert(newCustomer);

    const customerPageContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Page</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
      <div class="customer-page">
        <div class="customer-page-header">
          <h2>Welcome, ${firstName} ${lastName}!</h2>
          <a class="logout-link" href="/" onclick="window.close()">Log out</a>
        </div>
        <p>Your account has been successfully created.</p>
      </div>
      </body>
      </html>
    `;

    const filePath = path.join(process.cwd(), "src/customerPages", `customer-${email}.html`);
    fs.writeFileSync(filePath, customerPageContent, "utf-8");

    res.status(201).json({ message: "Account created successfully", email });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// --- Endpoint to Fetch Customer Pages ---
app.get("/customer-pages/:email", (req, res) => {
  const email = req.params.email;
  const filePath = path.join(process.cwd(), "src/customerPages", `customer-${email}.html`);

  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) {
      console.error("Error fetching customer page:", err);
      return res.status(404).json({ error: "Customer page not found" });
    }
    res.setHeader("Content-Type", "text/html");
    res.send(content);
  });
});


// --- Login Endpoint ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const userDoc = await customerDb.view("users", "by_email", { key: email, include_docs: true });

    if (userDoc.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = userDoc.rows[0].value;

    if (user.password === password) {
      res.status(200).json({
        message: "Login successful",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        password: user.password
      });
    } else {
      res.status(401).json({ error: "Invalid email or password." });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// --- Inquiry Endpoint ---
app.post("/inquiries", upload.array("files"), async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required except files." });
    }

    // Step 1: Create a document in CouchDB
    const doc = await inquiryDb.insert({
      fullName,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });

    // Step 2: Attach files to the document
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileData = fs.readFileSync(file.path);
        const mimeType = file.mimetype;

        // Add attachment to the document
        await inquiryDb.attachment.insert(
          doc.id,
          file.originalname,
          fileData,
          mimeType,
          { rev: doc.rev }
        );
      }

      // Clean up temporary files
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }

    res.status(201).json({ message: "Inquiry submitted successfully." });
  } catch (error) {
    console.error("Error processing inquiry:", error);
    res.status(500).json({ error: "Error processing inquiry." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
