import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import { Header, Paragraph } from 'flotiq-components-react';
import config from '../lib/config';
import RecipeCard from '../components/RecipeCard'; // We'll use this to list recipes
import { getRecipe } from '../lib/recipe'; // To fetch the recipes
import replaceUndefinedWithNull from '../lib/sanitize';
import FlotiqImage from '../lib/FlotiqImage'; // For recipe card images

// Define which slugs belong to the Silviakaka silo
const silviakakaRecipeSlugs = [
    "silviakaka", // The classic recipe itself
    "silviakaka-langpanna",
    "silviakaka-rund-springform",
    "silviakaka-med-saffran",
    "glutenfri-silviakaka",
    "vegansk-silviakaka-utan-agg",
    "silviakaka-med-citron",
    "silviakaka-toppings-variationer",
    "silviakaka-muffins",
    "silviakaka-sockerkaksform",
    "silviakaka-pernilla-wahlgren",
    "silviakaka-langpanna-fredriks-fika",
    "silviakaka-leila",
    "silviakaka-lindas-bakskola"
];

const SilviakakaPillarPage = ({ recipesInSilo }) => {
    const pageTitle = `Allt om Silviakaka - Recept & Tips | ${config.siteMetadata.title}`;
    const pageDescription = "Din kompletta guide till Silviakaka! Upptäck klassiska recept, spännande variationer, bakningstips, och allt du behöver veta för att baka den perfekta Silviakakan.";

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Silviakaka Receptsamling",
        "description": "En samling av olika recept och variationer på Silviakaka.",
        "itemListElement": recipesInSilo.map((recipe, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${config.siteMetadata.siteUrl}/recept/${recipe.slug}`
            // You could also add "name": recipe.name here if desired for the ItemList
        }))
    };

    return (
        <Layout title={pageTitle} description={pageDescription}>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
                />
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-primary mb-8 text-center']}>
                    Silviakaka – En Älskad Svensk Klassiker
                </Header>
                
                <div className="prose prose-lg lg:prose-xl max-w-3xl mx-auto text-gray-700 mb-12">
                    <Paragraph>
                        Välkommen till den ultimata guiden för Silviakaka! Här på Silviakaka.se har vi samlat allt du
                        behöver veta om denna otroligt populära och älskade svenska kaka. Från dess spännande historia
                        till det klassiska grundreceptet, smarta baktips för att garantera en saftig kaka varje gång,
                        och hur du gör den oemotståndliga smörkrämsglasyren.
                    </Paragraph>
                    <Paragraph>
                        Utforska våra många recept nedan för att hitta din favoritvariant – oavsett om du vill
                        baka den i långpanna, som muffins, glutenfri, vegansk, eller med spännande smaksättningar
                        som saffran eller citron. Glad bakning!
                    </Paragraph>
                    {/* Add more introductory content, history, general tips, FAQ here */}
                </div>

                <Header level={2} additionalClasses={['text-3xl font-semibold text-secondary mb-10 text-center']}>
                    Våra Silviakaka Recept
                </Header>
                <div className="flex flex-wrap -mx-2">
                    {recipesInSilo.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            name={recipe.name}
                            slug={recipe.slug} // Will be used for /recept/[slug]
                            image={FlotiqImage.getSrc(recipe.image && recipe.image[0], 300, 200)} // Adjust size as needed
                            cookingTime={recipe.cookingTime}
                            servings={recipe.servings}
                            // tags are not directly in your core recipe JSON for now, but could be added
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps() {
    const allRecipesResponse = await getRecipe(1, 100); // Fetch a large number to get all
    const allRecipes = replaceUndefinedWithNull(allRecipesResponse.data);
    
    const recipesInSilo = allRecipes.filter(recipe => 
        silviakakaRecipeSlugs.includes(recipe.slug)
    );

    // Optional: Sort recipesInSilo if needed, e.g., classic first
    recipesInSilo.sort((a, b) => {
        if (a.slug === 'silviakaka') return -1; // Classic Silviakaka first
        if (b.slug === 'silviakaka') return 1;
        return a.name.localeCompare(b.name); // Then alphabetical
    });

    return {
        props: {
            recipesInSilo,
        },
    };
}

export default SilviakakaPillarPage;