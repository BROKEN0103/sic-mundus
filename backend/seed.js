require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        const demoUsers = [
            {
                name: "System Admin",
                email: "admin@vault.io",
                password: "demo",
                role: "admin"
            },
            {
                name: "Content Editor",
                email: "editor@vault.io",
                password: "demo",
                role: "editor"
            },
            {
                name: "External Viewer",
                email: "viewer@vault.io",
                password: "demo",
                role: "viewer"
            }
        ];

        for (const u of demoUsers) {
            const existingUser = await User.findOne({ email: u.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                await User.create({
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    role: u.role
                });
                console.log(`Created user: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }
        }

        console.log("Seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedUsers();
