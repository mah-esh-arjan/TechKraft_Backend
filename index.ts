import app from "./src/app";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";

dotenv.config();

const port = process.env.PORT || 3000;

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
