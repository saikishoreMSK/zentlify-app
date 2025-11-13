// types/product.ts (A new file for reusable types)

/**
 * Interface for the minimal Product data needed for ProductCard and Carousels.
 * This is the structure we want to return from our internal API services.
 */
export interface MinimalProduct {
    id: string; // The ASIN
    title: string;
    price: string; // Keep as string to retain currency symbol/formatting
    imageUrl: string; // product_photo from the API
    affiliateUrl?: string; // Will be the `product_url` from the API response
    rating: string;
    numRatings: number;
}

/**
 * Interface for the detailed Product data needed for the Product Detail Page.
 */
export interface DetailedProduct extends MinimalProduct {
    description: string; // product_description
    aboutProduct: string[]; // about_product
    images: string[]; // product_photos
    productUrl: string; // The original Amazon URL
    reviews?: {
        title: string;
        comment: string;
        rating: string;
        date: string;
    }[]; // top_reviews_global (simplified)
}