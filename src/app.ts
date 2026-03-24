import express from "express";
import cors from 'cors';
import agentRoutes from './routes/agentRoutes';
import propertyRoutes from './routes/propertyRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", agentRoutes);
app.use("/", propertyRoutes);

export default app;
