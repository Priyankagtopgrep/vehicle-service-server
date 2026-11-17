
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    findUserByUsername,
    createUser
} = require("../models/userModel");


const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const existingEmail = await findUserByEmail(email);

        if (existingEmail) {
            return res.status(409).json({
                message: "Email or username already registered"
            });
        }

        const existingUsername = await findUserByUsername(username);

        if (existingUsername) {
            return res.status(409).json({
                message: "Email or username already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const userId = await createUser({
            email,
            username,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered",
            id: userId
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect email/password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        return res.status(200).json({
            message: "Logged in",
            token
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};
