import React from 'react';
import Head from 'next/head';
import Layout from '../../layouts/layout';
import config from '../../lib/config';
import RecipeCards from '../../sections/RecipeCards';
import CustomPagination from '../../components/CustomPagination';
import { getRecipe } from '../../lib/recipe';
import replaceUndefinedWithNull from '../../lib/sanitize';
import { Header, Paragraph } from 'flotiq-components-react';
import { getRecipePageLink } from '../../lib/utils';
import { getTranslations } from '../../lib/translations'; // استيراد دالة الترجمة
import { useTranslation } from '../../context/TranslationContext'; // استيراد الهوك
const RecipeIndexPage = ({ recipes, pageContext }) => {
      const { t } = useTranslation();
    const pageTitle = `Alla Våra Recept | ${config.siteMetadata.title}`; // Page 1 doesn't need "Sida 1"
    const pageDescription = `Bläddra bland alla läckra recept på ${config.siteMetadata.title}. Upptäck nya favoriter!`;
    const canonicalUrl = `${config.siteMetadata.siteUrl}/recept`;

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Alla Recept på Silviakaka.se",
        "description": "En komplett lista över alla publicerade recept.",
        "url": canonicalUrl,
        "numberOfItems": pageContext.totalRecipesOnPage,
        "itemListElement": recipes.map((recipe, index) => ({
            "@type": "ListItem",
            "position": index + 1, // Position on this page (1 to recipesPerPage)
            "item": {
                 "@type": "Recipe",
                 "name": recipe.name,
                 "url": `${config.siteMetadata.siteUrl}/recept/${recipe.slug}`,
                 "image": recipe.image && recipe.image[0] ? `${config.siteMetadata.siteUrl}${recipe.image[0].url}` : undefined,
                 "description": recipe.description ? recipe.description.replace(/<[^>]*>?/gm, '').substring(0,100) + '...' : undefined
            }
        }))
    };

    return (
        <Layout title={pageTitle} description={pageDescription}>
            <Head>
                <link rel="canonical" href={canonicalUrl} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
                />
                {/* No 'prev' link for page 1 */}
                {pageContext.numPages > 1 && ( // Only add next if there are more pages
                    <link rel="next" href={`${config.siteMetadata.siteUrl}/recept/list/2`} /> 
                )}
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-primary mb-10 text-center']}>
                    Alla Våra Recept
                </Header>

                {recipes && recipes.length > 0 ? (
                    <RecipeCards recipes={recipes} />
                ) : (
                    <Paragraph>Inga recept att visa för tillfället.</Paragraph>
                )}

{pageContext.numPages > 1 && (
    <CustomPagination
        currentPage={1} // Explicitly page 1
        numPages={pageContext.numPages} // Page 1 is /recept, Page 2 is /recept/2
                    />
                )}
            </div>
            {pageContext.numPages > 1 && (
                    <link rel="next" href={getRecipePageLink(2)} />
                )}
        </Layout>
    );
};

export async function getStaticProps() {
    const { translations } = await getTranslations();
    const page = 1; // This page is always page 1
    const recipesPerPage = config.blog.postPerPage;
    const recipesResponse = await getRecipe(page, recipesPerPage, undefined, 'desc', 'datePublished');
    
    const sanitizedRecipes = replaceUndefinedWithNull(recipesResponse.data);
    
    return {
        props: {
            recipes: sanitizedRecipes,
            pageContext: {
                currentPage: page,
                numPages: recipesResponse.total_pages,
                recipesPerPage: recipesPerPage
            },
            translations, // تمرير الترجمات إلى الصفحة
        },
    };
}

// No getStaticPaths needed for pages/recept/index.js

export default RecipeIndexPage;