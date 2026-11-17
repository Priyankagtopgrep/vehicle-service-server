
const {
    createService,
    getServicesByUser,
    getServiceById,
    updateService,
    deleteService
} = require("../models/serviceModel");

const db = require("../config/db");

// Validate service input
const validateService = (vehicle_number, service_type, date) => {
    if (!vehicle_number || !service_type || !date) {
        return false;
    }

    // Validate YYYY-MM-DD format and actual calendar date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
};

// CREATE SERVICE
const createNewService = async (req, res) => {
    try {
        const { vehicle_number, service_type, date } = req.body;

        if (!validateService(vehicle_number, service_type, date)) {
            return res.status(400).json({
                message: "Missing or invalid required fields"
            });
        }

        // Check that authenticated user still exists
        const user = await db("users")
            .where({ id: req.user.id })
            .first();

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const id = await createService({
            vehicle_number,
            service_type,
            date,
            status: "Pending",
            user_id: req.user.id
        });

        return res.status(201).json({
            message: "Service booked successfully",
            id
        });

    } catch (error) {
        console.error("Create service error:", error);

        return res.status(500).json({
            message: "Error saving service in the database"
        });
    }
};

// GET ALL SERVICES
const getAllServices = async (req, res) => {
    try {
        const services = await getServicesByUser(req.user.id);

        if (services.length === 0) {
            return res.status(404).json({
                message: "No services found"
            });
        }

        return res.status(200).json(services);

    } catch (error) {
        console.error("Fetch services error:", error);

        return res.status(500).json({
            message: "Error fetching data from the database"
        });
    }
};

// UPDATE SERVICE
const updateExistingService = async (req, res) => {
    try {
        const { vehicle_number, service_type, date } = req.body;
        const serviceId = Number(req.params.id);

        if (!Number.isSafeInteger(serviceId) || serviceId <= 0) {
            return res.status(404).json({
                message: "Service ID not found"
            });
        }

        if (!validateService(vehicle_number, service_type, date)) {
            return res.status(400).json({
                message: "Missing or invalid required fields"
            });
        }

        const service = await getServiceById(
            serviceId,
            req.user.id
        );

        if (!service) {
            return res.status(404).json({
                message: "Service ID not found"
            });
        }

        await updateService(serviceId, req.user.id, {
            vehicle_number,
            service_type,
            date
        });

        return res.status(200).json({
            message: "Service updated",
            id: serviceId
        });

    } catch (error) {
        console.error("Update service error:", error);

        return res.status(500).json({
            message: "Error updating the service"
        });
    }
};

// DELETE SERVICE
const deleteExistingService = async (req, res) => {
    try {
        const serviceId = Number(req.params.id);

        if (!Number.isSafeInteger(serviceId) || serviceId <= 0) {
            return res.status(404).json({
                message: "Service ID not found"
            });
        }

        const service = await getServiceById(
            serviceId,
            req.user.id
        );

        if (!service) {
            return res.status(404).json({
                message: "Service ID not found"
            });
        }

        await deleteService(serviceId, req.user.id);

        return res.status(200).json({
            message: "Service deleted",
            id: serviceId
        });

    } catch (error) {
        console.error("Delete service error:", error);

        return res.status(500).json({
            message: "Error deleting the service"
        });
    }
};

module.exports = {
    createNewService,
    getAllServices,
    updateExistingService,
    deleteExistingService
};
