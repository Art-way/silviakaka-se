import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import { Header, Paragraph } from 'flotiq-components-react';
import config from '../lib/config';
import RecipeCard from '../components/RecipeCard';
import { getRecipe } from '../lib/recipe';
import replaceUndefinedWithNull from '../lib/sanitize';
import FlotiqImage from '../lib/FlotiqImage';

// Define which slugs belong to the Kladdkaka silo
const kladdkakaRecipeSlugs = [
    "kladdkaka-recept", // The classic/pillar Kladdkaka recipe
    "basta-kladdkaka-recept",
    "glutenfri-kladdkaka-recept",
    "kladdkaka-recept-arla",
    "kladdkaka-recept-utan-agg",
    "vegansk-kladdkaka-recept",
    "kladdkaka-i-langpanna-recept",
    "kladdkaka-recept-utan-smor",
    "vit-kladdkaka-recept",
    "kladdkaka-recept-med-choklad",
    "kladdkaka-recept-koket",
    "camilla-hamid-kladdkaka-recept",
    "kladdkaka-i-mugg-recept"
];

const KladdkakaPillarPage = ({ recipesInSilo }) => {
    const pageTitle = `Allt om Kladdkaka - Recept & Tips | ${config.siteMetadata.title}`;
    const pageDescription = "Din kompletta guide till Kladdkaka! Upptäck klassiska recept, spännande variationer, baktips, och allt du behöver veta för att baka den perfekta kladdkakan.";

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Kladdkaka Receptsamling",
        "description": "En samling av olika recept och variationer på Kladdkaka.",
        "itemListElement": recipesInSilo.map((recipe, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${config.siteMetadata.siteUrl}/recept/${recipe.slug}`
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
                    Kladdkaka – Sveriges Kladdigaste Favorit
                </Header>
                
                <div className="prose prose-lg lg:prose-xl max-w-3xl mx-auto text-gray-700 mb-12">
                    <Paragraph>
                        Välkommen till den ultimata guiden för alla kladdkakeälskare! Här på Silviakaka.se (ja, vi älskar kladdkaka också!)
                        har vi samlat allt du behöver veta om denna seglivade favorit. Lär dig historien bakom, få det
                        klassiska grundreceptet, ovärderliga tips för perfekt kladdighet, och svar på vanliga frågor.
                    </Paragraph>
                    <Paragraph>
                        Bläddra bland våra recept nedan för att hitta just din kladdkakefavorit – oavsett om du söker den
                        bästa, en glutenfri variant, vegansk, eller kanske en spännande vit kladdkaka.
                    </Paragraph>
                    {/* Add more introductory content, history, general tips, FAQ here */}
                </div>

                <Header level={2} additionalClasses={['text-3xl font-semibold text-secondary mb-10 text-center']}>
                    Våra Kladdkakerecept
                </Header>
                <div className="flex flex-wrap -mx-2">
                    {recipesInSilo.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            name={recipe.name}
                            slug={recipe.slug} // Will be used for /recept/[slug]
                            image={FlotiqImage.getSrc(recipe.image && recipe.image[0], 300, 200)}
                            cookingTime={recipe.cookingTime}
                            servings={recipe.servings}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps() {
    const allRecipesResponse = await getRecipe(1, 100); // Fetch enough to get all
    const allRecipes = replaceUndefinedWithNull(allRecipesResponse.data);
    
    const recipesInSilo = allRecipes.filter(recipe => 
        kladdkakaRecipeSlugs.includes(recipe.slug)
    );

    recipesInSilo.sort((a, b) => {
        if (a.slug === 'kladdkaka-recept') return -1; // Classic Kladdkaka first
        if (b.slug === 'kladdkaka-recept') return 1;
        return a.name.localeCompare(b.name);
    });

    return {
        props: {
            recipesInSilo,
        },
    };
}

export default KladdkakaPillarPage;