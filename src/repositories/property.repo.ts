import { prisma } from "../../lib/prisma";

export const getAllProperties = async (filter: any, page: number, limit: number) => {
    const total = await prisma.property.count({
        where: filter
    });

    const items = await prisma.property.findMany({
        where: filter,
        skip: (page - 1) * limit,
        take: limit
    });

    return { items, total };
}

export const getPropertyById = (id: number) => {
    return prisma.property.findUnique({
        where: { id },
        include: { agent: true }
    });
}

