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

// قائمة الـ slugs الخاصة بوصفات Kladdkaka
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

const KladdkakaPillarPage = ({ recipesInSilo, pageContent }) => {
    const { t } = useTranslation();
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
    // دالة مساعدة للحصول على النص باللغة الصحيحة
    const translateContent = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[pageContent.lang] || field['sv'];
        }
        return field;
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
                    {t('our_kladdkaka_recipes')}
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
        kladdkakaRecipeSlugs.includes(recipe.slug)
    ).sort((a,b) => a.name.localeCompare(b.name));

    const pageContentPath = path.join(process.cwd(), 'data', 'pageContent.json');
    const allContent = JSON.parse(fs.readFileSync(pageContentPath, 'utf-8'));
    
    const siteConfigPath = path.join(process.cwd(), 'data', 'siteConfig.json');
    const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8'));


    return {
        props: {
            recipesInSilo,
            translations,
            pageContent: {
                ...allContent.kladdkakaGuide,
                lang: siteConfig.language
            }
        },
    };
}

export default KladdkakaPillarPage;

   