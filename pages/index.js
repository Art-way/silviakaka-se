import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../layouts/layout';
import { getAllRecipes } from '../lib/recipe';
import replaceUndefinedWithNull from '../lib/sanitize';
import { Button, Header, Paragraph } from 'flotiq-components-react';
import { StarIcon } from '@heroicons/react/solid';
import { getTranslations } from '../lib/translations'; 
import { useTranslation } from '../context/TranslationContext';
import { getCategories } from '../lib/category';

// Recipe Card component remains the same, used multiple times on the page
const RecipeCard = ({ recipe, additionalClasses = '' }) => {
    if (!recipe) return null;
    return (
        <div className={['h-full', additionalClasses].join(' ')}>
            <Link href={`/recept/${recipe.slug}`} passHref>
                <div className="block bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group h-full flex flex-col">
                    <div className="relative">
                        <Image
                            src={recipe.image?.[0]?.url || '/images/placeholder.jpg'}
                            alt={recipe.name}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold font-sora text-primary group-hover:text-secondary transition-colors">{recipe.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mt-2 mb-3 flex-grow">
                            {recipe.description.replace(/<[^>]*>?/gm, '')}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                            <span>{recipe.cookingTime.replace('PT','').replace('M', ' min')}</span>
                            <div className="flex items-center">
                                <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                                <span>{recipe.aggregateRating?.ratingValue || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

const HomePage = ({ featuredRecipe, latestRecipes, recipesByCategory, allRecipes, categories }) => {
    const { t } = useTranslation();

    if (!featuredRecipe) {
        return (
            <Layout categories={categories}>
                <div className="text-center py-20">
                    <p>Kunde inte ladda recept. Försök igen senare.</p>
                </div>
            </Layout>
        );
    }
    
    return (
       <Layout allRecipesForSearch={allRecipes} categories={categories}>
            {/* Section 1: Hero Section with Featured Recipe */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-gray-700 text-white">
                <Image
                    src={featuredRecipe.image?.[0]?.url || '/images/placeholder.jpg'}
                    alt={featuredRecipe.name}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 z-0 opacity-50"
                    priority
                />
                <div className="relative z-10 p-5">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-sora drop-shadow-lg mb-4">
                        {featuredRecipe.name}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8 drop-shadow-md">
                        {featuredRecipe.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                    </p>
                    <Link href={`/recept/${featuredRecipe.slug}`} passHref>
                        <Button
                            label={t('read_the_recipe')}
                            variant="secondary"
                            size="lg"
                            additionalClasses={['!text-lg !font-bold']}
                        />
                    </Link>
                </div>
            </section>
            
            {/* Section 2: Welcome Text - Important for SEO and User Context */}
            <section className="bg-white py-16 md:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Header level={2} additionalClasses={['text-3xl md:text-4xl font-bold text-primary font-sora']}>
                        Välkommen till Silviakaka.se
                    </Header>
                    <Paragraph additionalClasses={['text-lg text-gray-600 mt-4 leading-relaxed']}>
                        Hej! Jag heter Elsa, och detta är min samlingsplats för svenska bakverk och älskade fikaklassiker. Här delar jag med mig av mina bästa recept, från den ikoniska Silviakakan till den oemotståndliga Kladdkakan. Min förhoppning är att inspirera dig att hitta glädjen i att baka, oavsett om du är nybörjare eller en van hemmabagare.
                    </Paragraph>
                </div>
            </section>

             {/* Section 3: Latest Recipes */}
             <section className="bg-gray-50 py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-primary font-sora">
                            {t('latest_recipes')}
                         </h2>
                         <p className="text-lg text-gray-600 mt-2">
                            {t('fresh_from_oven')}
                         </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Dynamic Category Sections */}
            {recipesByCategory.map(({ name, description, slug, recipes }) => (
                <section key={slug} className="py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <Header level={2} additionalClasses={['text-3xl md:text-4xl font-bold text-primary font-sora']}>
                                {name.sv}
                            </Header>
                            <Paragraph additionalClasses={['text-lg text-gray-600 mt-2 max-w-2xl mx-auto']}>
                                {description.sv.split('\n')[0]}
                            </Paragraph>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link href={`/${slug}`} passHref>
                                <Button label={`Visa alla ${name.sv}-recept`} variant="primary" />
                            </Link>
                        </div>
                    </div>
                </section>
            ))}

        </Layout>
    );
};

export async function getStaticProps() {
    const { translations } = await getTranslations();
    
    try {
        const allRecipesResponse = await getAllRecipes();
        const allRecipesData = allRecipesResponse ? replaceUndefinedWithNull(allRecipesResponse.data) : [];
        
        const categories = await getCategories();

        if (allRecipesData.length === 0) {
            return { 
                props: { 
                    featuredRecipe: null, 
                    latestRecipes: [], 
                    recipesByCategory: [],
                    allRecipes: [], 
                    translations,
                    categories: replaceUndefinedWithNull(categories)
                } 
            };
        }

        // Define latest recipes and the featured one
        const latestRecipes = allRecipesData.slice(0, 3);
        const featuredRecipe = allRecipesData[0];

        // Prepare recipes grouped by main categories
        const mainCategorySlugs = ['silviakaka', 'kladdkaka', 'mjuka-kakor']; // Define which categories to feature
        const recipesByCategory = mainCategorySlugs
            .map(slug => {
                const categoryInfo = categories.find(cat => cat.slug === slug);
                if (!categoryInfo) return null;

                const recipes = allRecipesData
                    .filter(recipe => 
                        recipe.recipeCategory && 
                        recipe.recipeCategory.toLowerCase().includes(categoryInfo.name.sv.toLowerCase())
                    )
                    .slice(0, 4); // Show up to 4 recipes per category on the homepage

                return { ...categoryInfo, recipes };
            })
            .filter(Boolean); // Remove any null entries if a category wasn't found

        return {
            props: {
                featuredRecipe,
                latestRecipes,
                recipesByCategory,
                allRecipes: allRecipesData,
                translations,
                categories: replaceUndefinedWithNull(categories)
            },
        };
    } catch(error) {
         console.error("Error in getStaticProps for index page:", error);
         const categories = await getCategories();
         return { 
             props: { 
                 featuredRecipe: null, 
                 latestRecipes: [], 
                 recipesByCategory: [],
                 allRecipes: [], 
                 translations,
                 categories: replaceUndefinedWithNull(categories)
            } 
        };
    }
}

export default HomePage;