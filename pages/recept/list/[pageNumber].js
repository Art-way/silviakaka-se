import React from 'react';
import Head from 'next/head';
import Layout from '../../../layouts/layout'; // Path is now deeper
import config from '../../../lib/config'; // Path is now deeper
import RecipeCards from '../../../sections/RecipeCards'; // Path is now deeper
import CustomPagination from '../../../components/CustomPagination';
import { getRecipe, getAllRecipes } from '../../../lib/recipe'; // Path is now deeper
import replaceUndefinedWithNull from '../../../lib/sanitize'; // Path is now deeper
import { Header, Paragraph } from 'flotiq-components-react';
import { getRecipePageLink } from '../../../lib/utils';
import { getTranslations } from '../../../lib/translations'; // استيراد دالة الترجمة
import { useTranslation } from '../../../context/TranslationContext'; // استيراد الهوك
const RecipeListPage = ({ recipes, pageContext }) => { // Renamed component
    const { t } = useTranslation();
    const pageTitle = `Alla Våra Recept - Sida ${pageContext.currentPage} | ${config.siteMetadata.title}`;
    const pageDescription = `Bläddra bland alla läckra recept på ${config.siteMetadata.title}. Sida ${pageContext.currentPage} av ${pageContext.numPages}.`;
    const canonicalUrl = `${config.siteMetadata.siteUrl}/recept/list/${pageContext.currentPage}`;

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Recept - Sida ${pageContext.currentPage}`,
        "description": `Lista över recept, sida ${pageContext.currentPage}`,
        "url": canonicalUrl,
        "numberOfItems": pageContext.totalRecipesOnPage,
        "itemListElement": recipes.map((recipe, index) => ({
            "@type": "ListItem",
            "position": (pageContext.currentPage - 1) * pageContext.recipesPerPage + index + 1,
            "item": {
                 "@type": "Recipe",
                 "name": recipe.name,
                 "url": `${config.siteMetadata.siteUrl}/recept/${recipe.slug}`, // Individual recipes still at /recept/[slug]
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
                {/* Previous page link will be to /recept if current page is 2, else /recept/list/[page-1] */}
                {/* This needs to be correct: page 1 is /recept, page 2 is /recept/list/2 */}
                {pageContext.currentPage > 1 && (
                    <link rel="prev" href={getRecipePageLink(pageContext.currentPage - 1)} />
                )}
                
                {pageContext.currentPage < pageContext.numPages && (
                    <link rel="next" href={getRecipePageLink(pageContext.currentPage + 1)} />
                )}
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-primary mb-10 text-center']}>
                    Alla Våra Recept (Sida {pageContext.currentPage})
                </Header>

                {recipes && recipes.length > 0 ? (
                    <RecipeCards recipes={recipes} />
                ) : (
                    <Paragraph>Inga fler recept att visa.</Paragraph>
                )}

{pageContext.numPages > 1 && (
    <CustomPagination
        currentPage={pageContext.currentPage} // This will be 2, 3, etc.
        numPages={pageContext.numPages}
    />
                )}
            </div>

        </Layout>
    );
};

export async function getStaticProps({ params }) {
    const { translations } = await getTranslations();
    const page = parseInt(params.pageNumber, 10);
    if (isNaN(page) || page < 2) { // Validate page number
        return { notFound: true };
    }
    // ... rest of your getStaticProps logic to fetch data for 'page' ...
    const recipesPerPage = config.blog.postPerPage;
    const recipesResponse = await getRecipe(page, recipesPerPage, undefined, 'desc', 'datePublished');
    const sanitizedRecipes = replaceUndefinedWithNull(recipesResponse.data);

    if (sanitizedRecipes.length === 0) { // No recipes for this page (e.g., page > numPages)
        return { notFound: true };
    }
    
    return {
        props: {
            recipes: sanitizedRecipes,
            pageContext: {
                currentPage: recipesResponse.current_page,
                numPages: recipesResponse.total_pages,
                totalRecipesOnPage: recipesResponse.count,
                recipesPerPage: recipesPerPage
          },
            translations, // تمرير الترجمات إلى الصفحة
        },
    };
}

export async function getStaticPaths() {
    const recipesResponse = await getAllRecipes();
    const numPages = Math.ceil(recipesResponse.total_count / config.blog.postPerPage);
    const paths = [];

    for (let i = 2; i <= numPages; i += 1) { // Start loop from 2
        paths.push({
            params: { pageNumber: i.toString() },
        });
    }
    return { paths, fallback: false };
}
export default RecipeListPage;