import { vi, describe, it, expect, beforeEach } from "vitest";

// MOCK PRISMA AT THE ABSOLUTE TOP TO AVOID STARTUP ERRORS
vi.mock("../../lib/prisma", () => ({
    prisma: {
        property: {
            findMany: vi.fn(),
            count: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}));

import { getListings } from "../controllers/propertyController";
import * as propertyRepo from "../repositories/property.repo";

describe("Property Controller Unit Tests", () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        mockReq = { query: {}, headers: {} };
        mockRes = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        };
    });

    it("should return properties with correct pagination", async () => {
        const mockData: any = {
            items: [{ id: 1, name: "Test Property", price: 500000 }],
            total: 1
        };
        vi.mocked(propertyRepo.getAllProperties).mockResolvedValue(mockData);

        await getListings(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            total: 1,
            page: 1,
            limit: 10
        }));
    });
});
