/**
 * DTO for agent login request
 */
export interface AgentLoginDto {
    email: string;
}

/**
 * DTO for agent response
 */
export interface AgentResponseDto {
    id: number;
    email: string;
    name: string | null;
}

/**
 * DTO for login success response
 */
export interface LoginSuccessDto {
    success: boolean;
    message: string;
    agent?: AgentResponseDto;
}

/**
 * DTO for login error response
 */
export interface LoginErrorDto {
    success: boolean;
    message: string;
    error?: string;
}
