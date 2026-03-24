import { Request, Response } from "express";
import { getAllProperties, getPropertyById } from "../repositories/property.repo";
import { PropertySearchDto, PropertyListResponseDto, PropertyResponseDto, PropertyAdminResponseDto } from "../dto/property.dto";

export const getListings = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.headers['x-admin'] === 'true';

        // Parse query params into DTO
        const searchDto: PropertySearchDto = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            search: req.query.search as string,
            beds: req.query.beds ? parseInt(req.query.beds as string) : undefined,
            baths: req.query.baths ? parseInt(req.query.baths as string) : undefined,
            type: req.query.type as any,
            minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        };

        // Build a dynamic filter object
        const filter: any = {};

        if (searchDto.search) {
            filter.OR = [
                { name: { contains: searchDto.search, mode: "insensitive" } },
                { description: { contains: searchDto.search, mode: "insensitive" } },
                { suburb: { contains: searchDto.search, mode: "insensitive" } }
            ]
        }

        if (searchDto.beds) {
            filter.beds = { gte: searchDto.beds };
        }

        if (searchDto.baths) {
            filter.baths = { gte: searchDto.baths };
        }

        if (searchDto.type) {
            filter.type = searchDto.type;
        }

        if (searchDto.minPrice || searchDto.maxPrice) {
            filter.price = {};
            if (searchDto.minPrice) filter.price.gte = searchDto.minPrice;
            if (searchDto.maxPrice) filter.price.lte = searchDto.maxPrice;
        }

        const { items, total } = await getAllProperties(filter, searchDto.page!, searchDto.limit!);

        // Control what to send based on the role
        const finalItems = isAdmin ? items :
            items.map(({ metaData, ...rest }: any) => rest);

        const response: PropertyListResponseDto = {
            items: finalItems,
            total,
            page: searchDto.page!,
            limit: searchDto.limit!,
            totalPages: Math.ceil(total / searchDto.limit!)
        };

        res.json(response);

    } catch (err: any) {
        console.error("Error occurred:", err);
        res.status(500).json({ error: "Internal server error", detail: err.message });
    }
}

export const getListingById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const isAdmin = req.headers['x-admin'] === 'true';
        const property = await getPropertyById(id);

        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        if (isAdmin) {
            return res.send(property);
        } else {
            const { metaData, ...rest } = property as any;
            return res.send(rest); // Hides all metadata for non-admins
        }
    } catch (err: any) {
        console.error("Error occurred:", err);
        res.status(500).send("Internal server error");
    }
}
