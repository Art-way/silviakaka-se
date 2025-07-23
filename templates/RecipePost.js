import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../layouts/layout';
import RecipeBackButton from '../components/recipe/RecipeBackButton';
import RecipeSteps from '../components/recipe/RecipeSteps';
import HeaderImageWithText from '../components/recipe/HeaderImageWithText';
import RecipeCards from '../sections/RecipeCards';
import FlotiqImage from '../lib/FlotiqImage';
import ElsaBio from '../components/recipe/ElsaBio';
import { useTranslation } from '../context/TranslationContext';
import config from '../lib/config';
import RecipeInfo from '../components/recipe/RecipeInfo'; // <-- 1. استيراد المكون الجديد

const RecipeTemplate = ({ post, pageContext, allRecipes, categories }) => {
    const { t } = useTranslation();

    if (!post) {
        return <Layout categories={categories}><p>Receptet kunde inte laddas...</p></Layout>;
    }

    const recipe = post;
    const otherRecipes = pageContext.otherRecipes;

    const schemaAuthor = config.author || { "@type": "Organization", "name": "Silviakaka" };
    const recipeSchema = {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        "name": recipe.name,
        "author": schemaAuthor,
        "description": recipe.description.replace(/<[^>]*>?/gm, ''),
        "image": recipe.image?.map(img => `${config.siteMetadata.siteUrl}${img.url}`),
        "datePublished": recipe.datePublished,
        "recipeCuisine": recipe.recipeCuisine,
        "prepTime": recipe.prepTime,
        "cookTime": recipe.cookingTime,
        "totalTime": recipe.totalTime,
        "keywords": recipe.keywords,
        "recipeYield": recipe.servings ? recipe.servings.toString() : "1 kaka",
        "recipeCategory": recipe.recipeCategory,
        "nutrition": recipe.nutrition,
        "aggregateRating": recipe.aggregateRating ? {
            "@type": "AggregateRating",
            "ratingValue": recipe.aggregateRating.ratingValue,
            "ratingCount": recipe.aggregateRating.ratingCount
        } : undefined,
        "recipeIngredient": recipe.ingredients?.map(i => `${i.amount || ''} ${i.unit || ''} ${i.product}`.trim()),
        "recipeInstructions": recipe.steps?.map((step, index) => ({
            "@type": "HowToStep",
            "name": `Steg ${index + 1}`,
            "text": step.step,
            "url": `${config.siteMetadata.siteUrl}/recept/${recipe.slug}#step${index + 1}`,
            "image": step.image && step.image.length > 0
                ? `${config.siteMetadata.siteUrl}${step.image[0].url}`
                : undefined
        })).filter(step => step.text),
    };

    return (
        <Layout
            allRecipesForSearch={allRecipes} 
            categories={categories}
            additionalClass={['bg-light-gray']}
            title={recipe.name}
            description={recipe.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'}
        >
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
                />
            </Head>
            <div className="flex flex-wrap max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <RecipeBackButton additionalClass={['uppercase']} backButtonText={t('back_to_recipes')} />
            </div>
            <div className="flex flex-wrap max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                {/* --- 2. IMAGE STRETCH FIX --- */}
                {/* By adding max-h-[600px] and making the container relative, we constrain the image's height */}
                <div className="relative flex basis-full lg:basis-1/2 max-h-[600px]">
                    <Image
                        src={FlotiqImage.getSrc(recipe.image?.[0], 0, 0)}
                        alt={recipe.name}
                        layout="fill"
                        objectFit="cover" // This will cover the container, cropping if necessary, but not stretching
                        priority={true}
                    />
                </div>
                {/* --- END OF FIX --- */}

                {/* --- 3. Use the new interactive component --- */}
                <RecipeInfo recipe={recipe} />
                {/* --- END OF COMPONENT USAGE --- */}
            </div>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <RecipeSteps steps={recipe.steps || []} additionalClass={['my-5 py-5 border-t border-gray-200']} headerText={t('instructions')} />
            </div>

            {recipe.image && recipe.image[0] && (
                 <HeaderImageWithText
                    recipe={recipe}
                    headerText1={t('enjoy_your')}
                    headerText2={t('your')}
                    headerText3={t('cake')}
                />
            )}

            <ElsaBio t={t}/>

            {otherRecipes && otherRecipes.length > 0 && (
                <RecipeCards recipes={otherRecipes} headerText={t('more_recipes_to_explore')} />
            )}
        </Layout>
    );
};

export default RecipeTemplate;