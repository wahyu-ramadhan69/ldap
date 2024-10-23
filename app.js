import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Import cookie-parser
import authRoute from "./route/authRoute.js"; // Import the auth route

dotenv.config(); // Initialize dotenv

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser()); // Enable cookie-parser

// Routes
app.use(authRoute); // Use the auth route

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
