import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import { Header, Paragraph } from 'flotiq-components-react';
import RecipeCard from '../components/RecipeCard';
import { getRecipe } from '../lib/recipe';
import replaceUndefinedWithNull from '../lib/sanitize';
import FlotiqImage from '../lib/FlotiqImage';
import { getTranslations } from '../lib/translations';
import { useTranslation } from '../context/TranslationContext';
import fs from 'fs';
import path from 'path';
import config from '../lib/config'; // <-- تم إضافة هذا السطر لتصحيح الخطأ
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

const SilviakakaPillarPage = ({ recipesInSilo, pageContent }) => {
       const { t } = useTranslation();

    // دالة مساعدة للحصول على النص باللغة الصحيحة
    const translateContent = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[pageContent.lang] || field['sv'];
        }
        return field;
    };
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
        <Layout title={translateContent(pageContent.title)} description={translateContent(pageContent.meta_description)}>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
                />
            </Head>
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-primary mb-8 text-center']}>
                    {translateContent(pageContent.headline)}
                </Header>
                
                <div className="prose prose-lg lg:prose-xl max-w-3xl mx-auto text-gray-700 mb-12">
                   {translateContent(pageContent.body).split('\n').map((paragraph, index) => (
                         <Paragraph key={index}>
                            {paragraph}
                        </Paragraph>
                    ))}
                </div>

                <Header level={2} additionalClasses={['text-3xl font-semibold text-secondary mb-10 text-center']}>
                    {t('our_silviakaka_recipes')}
                </Header>
                <div className="flex flex-wrap -mx-2">
                    {recipesInSilo.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            name={recipe.name}
                            slug={recipe.slug}
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
    const { translations } = await getTranslations();
    const allRecipesResponse = await getRecipe(1, 100); 
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
const pageContentPath = path.join(process.cwd(), 'data', 'pageContent.json');
    const allContent = JSON.parse(fs.readFileSync(pageContentPath, 'utf-8'));
    
    const siteConfigPath = path.join(process.cwd(), 'data', 'siteConfig.json');
    const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8'));

    return {
        props: {
            recipesInSilo,
            translations,
            pageContent: {
                ...allContent.silviakakaGuide,
                lang: siteConfig.language
            }
        },
    };
}

export default SilviakakaPillarPage;