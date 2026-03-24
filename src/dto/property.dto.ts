import { PropertyType } from "@prisma/client";

/**
 * DTO for property search/filter query parameters
 */
export interface PropertySearchDto {
    page?: number;
    limit?: number;
    search?: string;
    beds?: number;
    baths?: number;
    type?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
}

/**
 * DTO for property response (public view - no metadata)
 */
export interface PropertyResponseDto {
    id: number;
    name: string;
    description: string | null;
    price: number;
    beds: number;
    baths: number;
    type: PropertyType;
    suburb: string;
    agentId: number | null;
    createdAt: Date;
}

/**
 * DTO for property response (admin view - includes metadata)
 */
export interface PropertyAdminResponseDto extends PropertyResponseDto {
    metaData: {
        squareFeet?: number;
        yearBuilt?: number;
        hasPool?: boolean;
        hasGarage?: boolean;
        [key: string]: any;
    };
}

/**
 * DTO for paginated property list response
 */
export interface PropertyListResponseDto {
    items: PropertyResponseDto[] | PropertyAdminResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
