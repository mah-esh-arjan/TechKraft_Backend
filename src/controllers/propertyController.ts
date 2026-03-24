import { Request, Response } from "express";
import { getAllProperties, getPropertyById } from "../repositories/property.repo";

export const getListings = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.headers['x-admin'] === 'true';

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        const beds = req.query.beds as string;
        const baths = req.query.baths as string;
        const type = req.query.type as string;
        const minPrice = req.query.minPrice as string;
        const maxPrice = req.query.maxPrice as string;

        // Build a dynamic filter object
        const filter: any = {};

        if (search) {
            filter.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { suburb: { contains: search, mode: "insensitive" } }
            ]
        }

        if (beds) {
            filter.beds = { gte: parseInt(beds as string) };
        }

        if (baths) {
            filter.baths = { gte: parseInt(baths as string) };
        }

        if (type) {
            filter.type = type;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.gte = parseInt(minPrice as string);
            if (maxPrice) filter.price.lte = parseInt(maxPrice as string);
        }

        const { items, total } = await getAllProperties(filter, page, limit);

        // Control what to send based on the role
        const finalItems = isAdmin ? items :
            items.map(({ metaData, ...rest }: any) => rest);

        res.send({
            items: finalItems,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });

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
