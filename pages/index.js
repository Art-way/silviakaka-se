import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import config from '../lib/config';
import { Header, Paragraph, Button } from 'flotiq-components-react';
import Link from 'next/link';
import RecipeFeaturedCard from '../components/RecipeFeaturedCard';
import RecipeCards from '../sections/RecipeCards';
import { getRecipe, getRecipeBySlug } from '../lib/recipe';
import replaceUndefinedWithNull from '../lib/sanitize';

// Component name can remain HomePage or change to IndexPage, etc.
const HomePage = ({ featuredSilviakaka, featuredKladdkaka, latestRecipes }) => {
    const pageTitle = `${config.siteMetadata.title} - Klassiska Svenska Recept`;
    const pageDescription = `Välkommen till ${config.siteMetadata.title}! Upptäck de bästa recepten på Silviakaka, Kladdkaka och andra svenska bakverk.`;
    const pageUrl = `${config.siteMetadata.siteUrl}/`;

    const homePageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": pageTitle,
        "description": pageDescription,
        "url": pageUrl,
        "publisher": {
            "@type": "Organization",
            "name": config.siteMetadata.title,
            "logo": {
                "@type": "ImageObject",
                "url": `${config.siteMetadata.siteUrl}/assets/recipe-logo.svg`
            }
        },
        "mainEntity": [
            ...(featuredSilviakaka ? [{
                "@type": "WebPageElement",
                "name": "Silviakaka Höjdpunkter",
                "url": `${config.siteMetadata.siteUrl}/silviakaka`
            }] : []),
            ...(featuredKladdkaka ? [{
                "@type": "WebPageElement",
                "name": "Kladdkaka Höjdpunkter",
                "url": `${config.siteMetadata.siteUrl}/kladdkaka`
            }] : []),
        ]
    };

    const latestRecipesSchema = latestRecipes && latestRecipes.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Senaste Recepten på Silviakaka.se",
        "itemListElement": latestRecipes.map((recipe, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Recipe",
                "name": recipe.name,
                "url": `${config.siteMetadata.siteUrl}/recept/${recipe.slug}`,
                "image": recipe.image && recipe.image[0] ? `${config.siteMetadata.siteUrl}${recipe.image[0].url}` : undefined,
                "description": recipe.description ? recipe.description.replace(/<[^>]*>?/gm, '').substring(0,100) + '...' : undefined
            }
        }))
    } : null;

    return (
        <Layout
            title={pageTitle}
            description={pageDescription}
            additionalClass={['bg-light-gray']}
        >
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
                />
                {latestRecipesSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(latestRecipesSchema) }}
                    />
                )}
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-primary mb-4 text-center']}>
                    Välkommen till Silviakaka.se!
                </Header>
                <Paragraph additionalClasses={['text-xl text-gray-700 text-center mb-12']}>
                    Din guide till den perfekta Silviakakan, Kladdkakan och mycket mer.
                </Paragraph>

                {featuredSilviakaka && (
                    <div className="mb-16">
                        <Header level={2} additionalClasses={['text-3xl font-semibold text-secondary mb-6']}>
                            Allt om Silviakaka
                        </Header>
                        <RecipeFeaturedCard
                            title={featuredSilviakaka.name}
                            excerpt={featuredSilviakaka.description.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...'}
                            preparationTime={featuredSilviakaka.prepTime}
                            cookTime={featuredSilviakaka.cookTime}
                            portions={featuredSilviakaka.servings}
                            image={featuredSilviakaka.image[0]}
                            imageAlt={featuredSilviakaka.name}
                            slug={featuredSilviakaka.slug} // slug passed to RecipeFeaturedCard for its internal link
                        />
                        <div className="text-center mt-6">
                            <Link href="/silviakaka">
                                <Button label="Utforska allt om Silviakaka" variant="secondary" />
                            </Link>
                        </div>
                    </div>
                )}

                {featuredKladdkaka && (
                    <div className="mb-16">
                        <Header level={2} additionalClasses={['text-3xl font-semibold text-secondary mb-6']}>
                            Kladdkakans Värld
                        </Header>
                        <RecipeFeaturedCard
                            title={featuredKladdkaka.name}
                            excerpt={featuredKladdkaka.description.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...'}
                            preparationTime={featuredKladdkaka.prepTime}
                            cookTime={featuredKladdkaka.cookTime}
                            portions={featuredKladdkaka.servings}
                            image={featuredKladdkaka.image[0]}
                            imageAlt={featuredKladdkaka.name}
                            slug={featuredKladdkaka.slug} // slug passed to RecipeFeaturedCard for its internal link
                        />
                        <div className="text-center mt-6">
                            <Link href="/kladdkaka">
                                <Button label="Utforska alla Kladdkakerecept" variant="secondary" />
                            </Link>
                        </div>
                    </div>
                )}

                {latestRecipes && latestRecipes.length > 0 && (
                    <div className="mt-12">
                        <RecipeCards recipes={latestRecipes} headerText="Senaste Recepten" />
                        <div className="text-center mt-8">
                            {/* This link will now point to the first page of the new all-recipes listing */}
                            <Link href="/recept"> {/* This should now correctly go to pages/recept/index.js */}
    <Button label="Visa alla recept" />
</Link>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

// getStaticProps is for fetching data for this specific homepage
export async function getStaticProps() { // No params needed as it's not dynamic based on URL param
    const silviakakaPillarResponse = await getRecipeBySlug('silviakaka');
    const featuredSilviakaka = (silviakakaPillarResponse?.data?.[0])
        ? replaceUndefinedWithNull(silviakakaPillarResponse.data[0])
        : null;

    const kladdkakaPillarResponse = await getRecipeBySlug('kladdkaka-recept');
    const featuredKladdkaka = (kladdkakaPillarResponse?.data?.[0])
        ? replaceUndefinedWithNull(kladdkakaPillarResponse.data[0])
        : null;
    
    const latestRecipesResponse = await getRecipe(1, 3, undefined, 'desc', 'datePublished');
    let latestRecipes = (latestRecipesResponse?.data)
        ? replaceUndefinedWithNull(latestRecipesResponse.data)
        : [];

    const pillarSlugs = [featuredSilviakaka?.slug, featuredKladdkaka?.slug].filter(Boolean);
    latestRecipes = latestRecipes.filter(recipe => !pillarSlugs.includes(recipe.slug)).slice(0,3);

    return {
        props: {
            featuredSilviakaka,
            featuredKladdkaka,
            latestRecipes,
            // No pageContext needed for pagination on this specific homepage
        },
    };
}

// No getStaticPaths needed for pages/index.js

export default HomePage;