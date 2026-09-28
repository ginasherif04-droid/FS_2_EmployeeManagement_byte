require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const employeeRoutes = require("./routes/employees");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));


// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    });