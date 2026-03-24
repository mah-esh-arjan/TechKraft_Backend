import { Router } from "express";
import { login } from "../controllers/agentController";

const router = Router();
router.post("/login", login);

export default router;