import React from 'react';
import { Header, List, Paragraph,Checkbox  } from 'flotiq-components-react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../layouts/layout';
import RecipeBackButton from '../components/recipe/RecipeBackButton';
import RecipeSteps from '../components/recipe/RecipeSteps';
import HeaderImageWithText from '../components/recipe/HeaderImageWithText';
import RecipeCards from '../sections/RecipeCards';
import FlotiqImage from '../lib/FlotiqImage';
import config from '../lib/config';
import ElsaBio from '../components/recipe/ElsaBio';

const RecipeTemplate = ({ post, pageContext }) => {
    const recipe = post;
    const otherRecipes = pageContext.otherRecipes;

    const schemaAuthor = config.author || { "@type": "Organization", "name": "Silviakaka.se" };

    const recipeSchema = {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        "name": recipe.name,
        "image": recipe.image.map(img => `${config.siteMetadata.siteUrl}${img.url}`),
        "author": schemaAuthor,
        "datePublished": recipe.datePublished,
        "description": recipe.description.replace(/<[^>]*>?/gm, ''),
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
        "recipeIngredient": recipe.ingredients.map(i => `${i.amount || ''} ${i.unit || ''} ${i.product}`.trim()),
        "recipeInstructions": recipe.steps.map((step, index) => ({
            "@type": "HowToStep",
            "name": `Steg ${index + 1}`,
            "text": step.step,
            "url": `${config.siteMetadata.siteUrl}/recept/${recipe.slug}#step${index + 1}`,
            "image": step.image && step.image.length > 0
                ? `${config.siteMetadata.siteUrl}${step.image[0].url}`
                : undefined
        })).filter(step => step.text),
    };
    
    const mainDescription = recipe.description || "<p>Detta recept väntar på en läcker beskrivning!</p>";

    return (
        <Layout 
            additionalClass={['bg-light-gray']} 
            title={`${recipe.name} | ${config.siteMetadata.title}`}
            description={mainDescription.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'}
        >
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
                />
            </Head>
            <div className="flex flex-wrap max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <RecipeBackButton additionalClass={['uppercase']} backButtonText="Tillbaka till recepten" />
            </div>
            <div className="flex flex-wrap max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex basis-full lg:basis-1/2">
                    <Image
                        src={FlotiqImage.getSrc(recipe.image?.[0], 0, 0)}
                        width={1920}
                        height={1287}
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                        alt={recipe.name}
                        priority={true}
                    />
                </div>
                <div className="flex flex-col basis-full lg:basis-1/2 pl-0 lg:pl-12 pt-5 pb-10 bg-white">
                    <div className="flex flex-wrap justify-start text-sm font-light space-x-5 py-5">
                        <p className="px-4 py-3 bg-light-gray rounded">
                            Förberedelsetid:
                            {' '}
                            <span className="font-semibold">
                                {recipe.prepTime ? recipe.prepTime.replace('PT','').replace('M', ' min') : '-'}
                            </span>
                        </p>
                        <p className="px-4 py-3 bg-light-gray rounded">
                            Tillagningstid:
                            {' '}
                            <span className="font-semibold">
                                {recipe.cookingTime ? recipe.cookingTime.replace('PT','').replace('M', ' min') : '-'}
                            </span>
                        </p>
                        <p className="px-4 py-3 bg-light-gray rounded">
                            Portioner:
                            {' '}
                            <span className="font-semibold">{recipe.servings || '-'}</span>
                        </p>
                    </div>
                    {/* Huvudrubrik för receptet (H1) */}
                    <Header level={1} additionalClasses={['text-3xl md:text-4xl !font-semibold text-secondary mb-6']}>
                        {recipe.name}
                    </Header>

                    {/* Beskrivning (kan vara H2 eller bara paragrafer under H1) */}
                    <Header level={2} additionalClasses={['uppercase mt-2 mb-3 !text-2xl font-medium text-primary']}> 
                        Beskrivning
                    </Header>
                    <div 
                        className="prose prose-lg mb-8" // la till mb-8 för lite mer luft
                        dangerouslySetInnerHTML={{ __html: mainDescription }} 
                    />

                    {/* Ingredienser (H2) */}
                    <Header level={2} additionalClasses={['uppercase mt-8 mb-5 !text-2xl font-medium text-primary']}>
                        Ingredienser
                    </Header>
                    <List
    items={recipe.ingredients.map((ingredient, index) => {
        const ingredientText = `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.product}`.trim();
        return {
            // Detta är det viktiga: content blir ett React-element
            content: (
                <label htmlFor={`ingredient-${index}`} className="flex items-center cursor-pointer">
                    <input 
                        id={`ingredient-${index}`} 
                        type="checkbox" 
                        className="h-5 w-5 text-secondary border-gray-300 rounded focus:ring-secondary mr-3" 
                    />
                    <span>{ingredientText}</span>
                </label>
            )
        };
    })}
    additionalClasses={['space-y-2 prose prose-lg']} // Ta bort list-disc, ml-5 eftersom vi har checkboxes
/>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8"> {/* Tog bort flex flex-wrap härifrån */}
                {/* Gör så här (H2), rubriken hanteras inuti RecipeSteps */}
                <RecipeSteps steps={recipe.steps || []} additionalClass={['my-5 py-5 border-t border-gray-200']} headerText="Gör så här" />
            </div>
            
            {recipe.image && recipe.image[0] && (
                 <HeaderImageWithText
                    recipe={recipe}
                    headerText1="Njut av"
                    headerText2="din"
                    headerText3="kaka!"
                />
            )}

            <ElsaBio />

            {otherRecipes && otherRecipes.length > 0 && (
                <RecipeCards recipes={otherRecipes} headerText="Fler Recept att Utforska:" />
            )}
        </Layout>
    );
}

export default RecipeTemplate;