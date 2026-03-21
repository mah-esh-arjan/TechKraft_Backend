import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });
// Middleware to parse JSON request bodies
app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
    res.send("TechKraft Backend API is running");
});


app.get("/listing", async (req, res) => {
    try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const properties = await prisma.property.findMany({
            skip: (page - 1) * limit,
            take: limit

        });
        res.send({ properties: properties })
    }

    catch (err) {
        console.error("Error occured:", err)
    }
})

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
