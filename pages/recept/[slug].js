import React from 'react';
import RecipeTemplate from '../../templates/RecipePost'; // This will be used for ALL individual recipes
import { getRecipe, getRecipeBySlug, getAllRecipeSlugs } from '../../lib/recipe';
import replaceUndefinedWithNull from '../../lib/sanitize';
import config from '../../lib/config';
import { getTranslations } from '../../lib/translations';
const RecipeDetailPage = ({ postData, pageContext }) => { // Renamed to avoid conflict
    return <RecipeTemplate post={postData} pageContext={pageContext} />;
};

export async function getStaticProps({ params }) {
    const recipeBySlugResponse = await getRecipeBySlug(params.slug);

    if (!recipeBySlugResponse || !recipeBySlugResponse.data || recipeBySlugResponse.data.length === 0) {
        return { notFound: true };
    }

    const currentRecipe = replaceUndefinedWithNull(recipeBySlugResponse.data[0]);

    const filtersOtherRecipes = `{"slug":{"type":"notContains","filter":"${params.slug}"}}`;
    const otherRecipesResponse = await getRecipe(1, config.blog.postPerPage + 1, filtersOtherRecipes, 'desc', 'datePublished'); 
    
    const sanitizedOtherRecipes = replaceUndefinedWithNull(otherRecipesResponse.data)
                                    .filter(recipe => recipe.id !== currentRecipe.id)
                                    .slice(0, config.blog.postPerPage);
    const { translations } = await getTranslations();
    return {
        props: {
            postData: currentRecipe, // 'post' is used by RecipeTemplate
            pageContext: {
                otherRecipes: sanitizedOtherRecipes,
            },
            translations,
        },
    };
}

export async function getStaticPaths() {
    const slugs = await getAllRecipeSlugs();
    return {
        paths: slugs.map((slug) => ({
            params: { slug }, // This will match /recept/[slug]
        })),
        fallback: false,
    };
}

export default RecipeDetailPage;