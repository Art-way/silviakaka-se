import recipesData from '../data/recipes.json'; // Import local JSON
import config from './config';

// Helper to simulate Flotiq's pagination structure
const paginate = (items, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);
    return {
        data: paginatedItems,
        total_count: items.length,
        count: paginatedItems.length,
        total_pages: Math.ceil(items.length / limit),
        current_page: parseInt(page, 10), // Ensure page is an integer
    };
};

export async function getRecipe(
    page = 1,
    limit = config.blog.postPerPage || 10,
    filters = undefined,
    direction = 'desc', // Defaulting to desc for newest first (by datePublished)
    orderBy = 'datePublished', // Assuming recipes have a datePublished field
) {
    let processedRecipes = [...recipesData]; // Create a mutable copy

    // Basic filtering example (can be expanded for more complex logic)
    if (filters) {
        try {
            const filterObj = JSON.parse(filters); // Assuming filters is a JSON string
            Object.keys(filterObj).forEach(key => {
                const fieldFilter = filterObj[key];
                if (fieldFilter.type === 'contains') {
                    processedRecipes = processedRecipes.filter(recipe => 
                        recipe[key] && recipe[key].toLowerCase().includes(fieldFilter.filter.toLowerCase())
                    );
                }
                if (fieldFilter.type === 'notContains') {
                    processedRecipes = processedRecipes.filter(recipe => 
                        !recipe[key] || !recipe[key].toLowerCase().includes(fieldFilter.filter.toLowerCase())
                    );
                }
                // Add more filter types here as needed (e.g., 'equals', 'inCategory')
            });
        } catch (e) {
            console.error("Error parsing filters in getRecipe:", e);
            // Decide how to handle filter errors, e.g., return all or empty
        }
    }

    // Sorting
    // Ensure datePublished exists or provide a fallback for sorting
    processedRecipes.sort((a, b) => {
        let valA = a[orderBy] || (orderBy === 'datePublished' ? '1970-01-01' : '');
        let valB = b[orderBy] || (orderBy === 'datePublished' ? '1970-01-01' : '');

        if (orderBy === 'datePublished') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) {
            return direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return paginate(processedRecipes, parseInt(page, 10), parseInt(limit, 10));
}

export async function getRecipeBySlug(slug) {
    const recipe = recipesData.find(r => r.slug === slug);
    // Mimic Flotiq's list-like response for a single item, as components might expect this structure
    return recipe 
        ? { data: [recipe], total_count: 1, count: 1, total_pages: 1, current_page: 1 } 
        : { data: [], total_count: 0, count: 0, total_pages: 0, current_page: 1 }; // ensure current_page for consistency
}

// Function to get all unique slugs for getStaticPaths
export async function getAllRecipeSlugs() {
    return recipesData.map(recipe => recipe.slug);
}

// Function to get all recipes (e.g., for sitemap or full list for getStaticPaths)
export async function getAllRecipes() {
    // For now, just return all data. Could add sorting/filtering later if needed here.
    return {
        data: recipesData,
        total_count: recipesData.length,
        count: recipesData.length,
        total_pages: 1,
        current_page: 1,
    };
}