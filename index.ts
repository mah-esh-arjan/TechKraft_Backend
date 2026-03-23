import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();



const app = express();
app.use(cors())

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

        const isAdmin = req.headers['x-admin'] === 'true';

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        const beds = req.query.beds;
        const baths = req.query.baths;
        const type = req.query.type;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;


        // Build a dynamic filter object
        const filter: any = {};

        if (search) {
            filter.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { suburb: { contains: search, mode: "insensitive" } }
            ]
        }

        if (beds) {
            // Searches for properties with this many beds or more (gte = greater than or equal)
            filter.beds = { gte: parseInt(beds as string) };
        }

        if (baths) {
            filter.baths = { gte: parseInt(baths as string) };
        }

        if (type) {
            filter.type = type;
        }

        if (minPrice || maxPrice) {
            filter.price = {}; // Initialize the price filter object
            if (minPrice) filter.price.gte = parseInt(minPrice as string);
            if (maxPrice) filter.price.lte = parseInt(maxPrice as string);
        }

        const total = await prisma.property.count({
            where: filter
        });

        const properties = await prisma.property.findMany({
            where: filter,
            skip: (page - 1) * limit,
            take: limit
        });

        // 2. Control what to send based on the role
        const items = isAdmin ? properties :
            properties.map(({ metaData, ...rest }) => rest);

        res.send({
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });

    }

    catch (err) {
        console.error("Error occured:", err)
    }
})

app.get("/listing/:id", async (req, res) => {

    try {

        const property = await prisma.property.findUnique({ where: { id: parseInt(req.params.id) } })
        res.send(property)
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
