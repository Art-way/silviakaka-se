import React from 'react';
import RecipeTemplate from '../../templates/RecipePost';
import { getRecipeBySlug, getAllRecipeSlugs, getAllRecipes } from '../../lib/recipe';
import replaceUndefinedWithNull from '../../lib/sanitize';
import config from '../../lib/config';
import { getTranslations } from '../../lib/translations';
import { getCategories } from '../../lib/category'; // <-- ADDED

const RecipeDetailPage = ({ postData, pageContext, allRecipes, categories }) => { // <-- ADDED categories
    return <RecipeTemplate 
                post={postData} 
                pageContext={pageContext} 
                allRecipes={allRecipes} 
                categories={categories} // <-- PASS categories
            />;
};

export async function getStaticProps({ params }) {
    const requestedSlug = params.slug;
    const recipeBySlugResponse = await getRecipeBySlug(requestedSlug);

    if (!recipeBySlugResponse || !recipeBySlugResponse.data || recipeBySlugResponse.data.length === 0) {
        return { notFound: true };
    }

    const recipeData = replaceUndefinedWithNull(recipeBySlugResponse.data[0]);
    const currentOfficialSlug = recipeData.slug;

    if (currentOfficialSlug !== requestedSlug) {
        return {
            redirect: {
                destination: `/recept/${currentOfficialSlug}`,
                permanent: true,
            },
        };
    }

    const otherRecipesResponse = await getAllRecipes();
    const sanitizedOtherRecipes = replaceUndefinedWithNull(otherRecipesResponse.data)
                                    .filter(recipe => recipe.slug !== recipeData.slug)
                                    .slice(0, config.blog.postPerPage);
    const allRecipesForSearch = replaceUndefinedWithNull(otherRecipesResponse.data);
    const { translations } = await getTranslations();
    const categories = await getCategories(); // <-- FETCH categories

    return {
        props: {
            postData: recipeData,
            pageContext: {
                otherRecipes: sanitizedOtherRecipes,
            },
            allRecipes: allRecipesForSearch,
            translations,
            categories: replaceUndefinedWithNull(categories) // <-- PASS categories
        },
        revalidate: 60,
    };
}


export async function getStaticPaths() {
    const slugs = await getAllRecipeSlugs();
    return {
        paths: slugs.map((slug) => ({
            params: { slug },
        })),
        fallback: 'blocking',
    };
}

export default RecipeDetailPage;