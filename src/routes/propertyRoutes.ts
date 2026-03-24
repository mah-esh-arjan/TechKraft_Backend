import { Router } from "express";
import { getListings, getListingById } from "../controllers/propertyController";

const router = Router();

router.get("/listing", getListings);
router.get("/listing/:id", getListingById);

export default router;
