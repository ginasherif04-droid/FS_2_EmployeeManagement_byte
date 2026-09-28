require("dotenv").config();

const mongoose = require("mongoose");
const Employee = require("./models/Employee");

const seedEmployees = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Employee.deleteMany({});

        const employees = [
            {
                name: "Ahmed Hassan",
                email: "ahmed@example.com",
                department: "IT",
                position: "Software Developer",
                phone: "01011111111"
            },
            {
                name: "Mariam Ali",
                email: "mariam@example.com",
                department: "HR",
                position: "HR Specialist",
                phone: "01022222222"
            },
            {
                name: "Omar Khaled",
                email: "omar@example.com",
                department: "Finance",
                position: "Financial Analyst",
                phone: "01033333333"
            }
        ];

        await Employee.insertMany(employees);

        console.log("Sample employees added successfully!");

        await mongoose.connection.close();
    } catch (error) {
        console.error("Failed to seed employees:");
        console.error(error.message);
    }
};

seedEmployees();