import { Request, Response } from "express"
import { agentLogin } from "../repositories/agent.repo"


export const login = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const agent = await agentLogin(email);

        if (agent) {
            return res.status(200).json({ success: true, id: agent.id, message: "Login successful" });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

    } catch (err: any) {
        return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
}