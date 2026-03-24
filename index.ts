import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import agentRoutes from './src/routes/agentRoutes';
import propertyRoutes from './src/routes/propertyRoutes';
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use("/", agentRoutes);
app.use("/", propertyRoutes);

async function main() {
    try {
        // Explicitly test the database connection
        await prisma.$connect();
        console.log("Successfully connected to the database");

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error starting server or connecting to the database:", error);
        // Ensure Prisma disconnects if there's an error
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();

