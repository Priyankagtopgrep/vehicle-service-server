
const db = require("../config/db");

const findUserByEmail = async (email) => {
    return await db("users")
        .where({ email })
        .first();
};

const findUserByUsername = async (username) => {
    return await db("users")
        .where({ username })
        .first();
};

const createUser = async (userData) => {
    const [id] = await db("users").insert(userData);
    return id;
};

module.exports = {
    findUserByEmail,
    findUserByUsername,
    createUser
};
