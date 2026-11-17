
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createNewService,
    getAllServices,
    updateExistingService,
    deleteExistingService
} = require("../controllers/serviceController");

// Protect all service routes
router.use(authMiddleware);

// Create service
router.post("/", createNewService);

// Retrieve all user services
router.get("/", getAllServices);

// Update service
router.put("/:id", updateExistingService);

// Delete service
router.delete("/:id", deleteExistingService);

module.exports = router;
