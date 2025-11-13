// app/search/page.tsx 
// This file routes the /search URL to the shared logic component.

import CategorySearchPage from '../category/[slug]/page';
 
// The /search route uses the same logic. 
// Note that when this runs, `params.slug` will be undefined, 
// and `searchParams.q` will be the search query, which the component handles correctly.
export default CategorySearchPage;

// Optional: If you use the `generateStaticParams` or `revalidate` exports 
// from the Category page, you may need to export them here as well.
export const revalidate = 3600; // Match the category page revalidation