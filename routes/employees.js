const express = require("express");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create a new employee - authentication required
router.post("/", authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.create(req.body);

        res.status(201).json({
            message: "Employee created successfully",
            employee
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create employee",
            error: error.message
        });
    }
});

// Get all employees - no authentication required
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get employees",
            error: error.message
        });
    }
});

// Update an employee - authentication required
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update employee",
            error: error.message
        });
    }
});

// Delete an employee - authentication required
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete employee",
            error: error.message
        });
    }
});

module.exports = router;