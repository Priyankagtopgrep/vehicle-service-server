const db = require("../config/db");

// Create a new service
const createService = async (serviceData) => {
    const [id] = await db("services").insert(serviceData);
    return id;
};

// Get all services belonging to a user
const getServicesByUser = async (userId) => {
    return await db("services")
        .where({ user_id: userId })
        .select(
            "id",
            "vehicle_number",
            "service_type",
            "date",
            "status",
            "user_id"
        );
};

// Find a service belonging to a user
const getServiceById = async (id, userId) => {
    return await db("services")
        .where({
            id,
            user_id: userId
        })
        .first();
};

// Update a service
const updateService = async (id, userId, serviceData) => {
    return await db("services")
        .where({
            id,
            user_id: userId
        })
        .update(serviceData);
};

// Delete a service
const deleteService = async (id, userId) => {
    return await db("services")
        .where({
            id,
            user_id: userId
        })
        .delete();
};

module.exports = {
    createService,
    getServicesByUser,
    getServiceById,
    updateService,
    deleteService
};