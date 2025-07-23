// pages/kategorier/[slug].js
import React from 'react';
import Layout from '../../layouts/layout';
import { Header, Paragraph } from 'flotiq-components-react';
import RecipeCards from '../../sections/RecipeCards';
import { getCategoryBySlug, getAllCategorySlugs, getCategories } from '../../lib/category';
import { getAllRecipes } from '../../lib/recipe';
import replaceUndefinedWithNull from '../../lib/sanitize';
import { getTranslations } from '../../lib/translations';

const CategoryPage = ({ category, recipes, allRecipesForSearch, categories }) => {
    if (!category) {
        return (
            <Layout categories={categories}>
                <div className="text-center py-20">
                    <Header level={1}>Kategori hittades inte</Header>
                    <Paragraph>Tyvärr kunde vi inte hitta den kategori du letade efter.</Paragraph>
                </div>
            </Layout>
        );
    }

    const siteLanguage = 'sv';
    const pageTitle = category.title?.[siteLanguage] || category.name?.[siteLanguage];
    const pageDescription = category.meta_description?.[siteLanguage] || category.description?.[siteLanguage];

    return (
        <Layout 
            title={pageTitle} 
            description={pageDescription} 
            allRecipesForSearch={allRecipesForSearch}
            categories={categories}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-primary mb-4 text-center']}>
                    {category.name?.[siteLanguage]}
                </Header>
                <Paragraph additionalClasses={['text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12']}>
                    {category.description?.[siteLanguage]}
                </Paragraph>

                {recipes.length > 0 ? (
                    <RecipeCards recipes={recipes} />
                ) : (
                    <Paragraph additionalClasses={['text-center']}>
                        Det finns inga recept i denna kategori ännu.
                    </Paragraph>
                )}
            </div>
        </Layout>
    );
};

export async function getStaticProps({ params }) {
    const categorySlug = params.slug;

    const category = await getCategoryBySlug(categorySlug);
    if (!category) {
        return { notFound: true };
    }

    const allRecipesResponse = await getAllRecipes();
    const allRecipesData = replaceUndefinedWithNull(allRecipesResponse.data);
    const categories = await getCategories();

    // --- THIS IS THE FIX ---
    // The filter logic is now case-insensitive to ensure reliable matching.
    const recipesInCategory = allRecipesData.filter(recipe => 
        recipe.recipeCategory && category.name.sv &&
        recipe.recipeCategory.toLowerCase().includes(category.name.sv.toLowerCase())
    );
    // ----------------------
    
    const { translations } = await getTranslations();

    return {
        props: {
            category: replaceUndefinedWithNull(category),
            recipes: recipesInCategory,
            allRecipesForSearch: allRecipesData,
            translations,
            categories: replaceUndefinedWithNull(categories)
        },
        revalidate: 60,
    };
}

export async function getStaticPaths() {
    const slugs = await getAllCategorySlugs();
    return {
        paths: slugs.map((slug) => ({
            params: { slug },
        })),
        fallback: 'blocking',
    };
}

export default CategoryPage;