import { prisma } from "../../lib/prisma"

export const agentLogin = (email: string) => {
    return prisma.agent.findUnique({ where: { email } })
}