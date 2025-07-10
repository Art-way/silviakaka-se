import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "../layouts/layout";
import { getRecipe, getAllRecipes } from "../lib/recipe";
import replaceUndefinedWithNull from "../lib/sanitize";
import { Button } from "flotiq-components-react";
import { StarIcon } from "@heroicons/react/solid";
import { getTranslations } from "../lib/translations";
import { useTranslation } from "../context/TranslationContext"; // استيراد الهوك من الملف الصحيح
import AdComponent from "../components/AdComponent";

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;
  return (
    <Link href={`/recept/${recipe.slug}`} passHref>
      <div className="block bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group">
        <div className="relative">
          <Image
            src={recipe.image?.[0]?.url || "/images/placeholder.jpg"}
            alt={recipe.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-white text-xl font-bold font-sora">
              {recipe.name}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {recipe.description.replace(/<[^>]*>?/gm, "")}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              {recipe.cookingTime.replace("PT", "").replace("M", " min")}
            </span>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{recipe.aggregateRating?.ratingValue || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const HomePage = ({ featuredRecipe, latestRecipes, allRecipes }) => {
  const { t } = useTranslation(); // الآن يجب أن يعمل هذا بشكل صحيح

  if (!featuredRecipe) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p>Kunde inte ladda recept. Försök igen senare.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout allRecipesForSearch={allRecipes}>
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-gray-700 text-white">
        <Image
          src={featuredRecipe.image?.[0]?.url || "/images/placeholder.jpg"}
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
            {featuredRecipe.description
              .replace(/<[^>]*>?/gm, "")
              .substring(0, 150)}
            ...
          </p>
          <Link href={`/recept/${featuredRecipe.slug}`} passHref>
            <Button
              label={t("read_the_recipe")}
              variant="secondary"
              size="lg"
              additionalClasses={["!text-lg !font-bold"]}
            />
          </Link>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-sora">
              {t("latest_recipes")}
            </h2>
            <p className="text-lg text-gray-600 mt-2">{t("fresh_from_oven")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <AdComponent className="w-full md:w-auto" />
          <div className="text-center mt-12">
            <Link href="/recept" passHref>
              <Button label={t("show_all_recipes")} variant="primary" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const { translations } = await getTranslations();

  try {
    const recipesResponse = await getRecipe(
      1,
      4,
      undefined,
      "desc",
      "datePublished"
    );
    // جلب جميع الوصفات للبحث
    const allRecipesResponse = await getAllRecipes();
    const allRecipesForSearch = allRecipesResponse
      ? replaceUndefinedWithNull(allRecipesResponse.data)
      : [];

    if (
      !recipesResponse ||
      !recipesResponse.data ||
      recipesResponse.data.length === 0
    ) {
      return {
        props: {
          featuredRecipe: null,
          latestRecipes: [],
          allRecipes: allRecipesForSearch,
          translations,
        },
      };
    }

    const allRecipes = replaceUndefinedWithNull(recipesResponse.data);
    const featuredRecipe = allRecipes[0];
    const latestRecipes = allRecipes.slice(1, 4);

    return {
      props: {
        featuredRecipe,
        latestRecipes,
        allRecipes: allRecipesForSearch, // مرر بيانات البحث
        translations,
      },
    };
  } catch (error) {
    console.error("Error in getStaticProps for index page:", error);
    return {
      props: {
        featuredRecipe: null,
        latestRecipes: [],
        allRecipes: [],
        translations,
      },
    };
  }
}

export default HomePage;
