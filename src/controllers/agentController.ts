import { Request, Response } from "express"
import { agentLogin } from "../repositories/agent.repo"
import { AgentLoginDto, LoginSuccessDto, LoginErrorDto } from "../dto/agent.dto"


export const login = async (req: Request, res: Response) => {
    try {
        const loginDto: AgentLoginDto = req.body;

        if (!loginDto.email) {
            const errorResponse: LoginErrorDto = {
                success: false,
                message: "Email is required",
                error: "MISSING_EMAIL"
            };
            return res.status(400).json(errorResponse);
        }

        const agent = await agentLogin(loginDto.email);

        if (agent) {
            const successResponse: LoginSuccessDto = {
                success: true,
                message: "Login successful",
                agent: {
                    id: agent.id,
                    email: agent.email,
                    name: agent.name
                }
            };
            return res.status(200).json(successResponse);
        } else {
            const errorResponse: LoginErrorDto = {
                success: false,
                message: "Invalid credentials",
                error: "INVALID_CREDENTIALS"
            };
            return res.status(401).json(errorResponse);
        }

    } catch (err: any) {
        const errorResponse: LoginErrorDto = {
            success: false,
            message: "Internal server error",
            error: err.message
        };
        return res.status(500).json(errorResponse);
    }
}