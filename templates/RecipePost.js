import React from "react";
import Head from "next/head";
import Image from "next/image";
import Layout from "../layouts/layout";
import RecipeBackButton from "../components/recipe/RecipeBackButton";
import RecipeSteps from "../components/recipe/RecipeSteps";
import HeaderImageWithText from "../components/recipe/HeaderImageWithText";
import RecipeCards from "../sections/RecipeCards";
import FlotiqImage from "../lib/FlotiqImage";
import ElsaBio from "../components/recipe/ElsaBio";
import { useTranslation } from "../context/TranslationContext";
import { Header } from "flotiq-components-react";
import config from "../lib/config";
import AdComponent from "../components/AdComponent";

// A new component for the interactive ingredient list
const IngredientChecklist = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {ingredients.map((ingredient, index) => {
        // Combine amount, unit, and product into a single string
        const ingredientText =
          `${ingredient.amount || ""} ${ingredient.unit || ""} ${ingredient.product || ""}`.trim();

        // Don't render if the ingredient is just a headline (e.g., "Glasyr:")
        if (!ingredient.unit && !ingredient.amount) {
          return (
            <h4
              key={index}
              className="text-xl font-semibold text-primary mt-6 mb-3 border-b pb-2"
            >
              {ingredient.product}
            </h4>
          );
        }

        return (
          <div key={index}>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                className="peer h-5 w-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-opacity-50"
              />
              <span className="text-lg text-gray-800 peer-checked:text-gray-400 peer-checked:line-through transition-colors duration-200">
                {ingredientText}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

const RecipeTemplate = ({ post, pageContext, allRecipes }) => {
  const { t } = useTranslation();

  // Check if post data is available before rendering
  if (!post) {
    return (
      <Layout>
        <p>Receptet kunde inte laddas...</p>
      </Layout>
    );
  }

  const recipe = post;
  const otherRecipes = pageContext.otherRecipes;

  const schemaAuthor = config.author || {
    "@type": "Organization",
    name: "Silviakaka",
  };
  const recipeSchema = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name: recipe.name,
    author: schemaAuthor,
    description: recipe.description.replace(/<[^>]*>?/gm, ""),
    image: recipe.image?.map(
      (img) => `${config.siteMetadata.siteUrl}${img.url}`
    ),
    datePublished: recipe.datePublished,
    recipeCuisine: recipe.recipeCuisine,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookingTime,
    totalTime: recipe.totalTime,
    keywords: recipe.keywords,
    recipeYield: recipe.servings ? recipe.servings.toString() : "1 kaka",
    recipeCategory: recipe.recipeCategory,
    nutrition: recipe.nutrition,
    aggregateRating: recipe.aggregateRating
      ? {
          "@type": "AggregateRating",
          ratingValue: recipe.aggregateRating.ratingValue,
          ratingCount: recipe.aggregateRating.ratingCount,
        }
      : undefined,
    recipeIngredient: recipe.ingredients?.map((i) =>
      `${i.amount || ""} ${i.unit || ""} ${i.product}`.trim()
    ),
    recipeInstructions: recipe.steps
      ?.map((step, index) => ({
        "@type": "HowToStep",
        name: `Steg ${index + 1}`,
        text: step.step,
        url: `${config.siteMetadata.siteUrl}/recept/${recipe.slug}#step${index + 1}`,
        image:
          step.image && step.image.length > 0
            ? `${config.siteMetadata.siteUrl}${step.image[0].url}`
            : undefined,
      }))
      .filter((step) => step.text),
  };

  return (
    <Layout
      allRecipesForSearch={allRecipes}
      additionalClass={["bg-light-gray"]}
      title={recipe.name}
      description={
        recipe.description.replace(/<[^>]*>?/gm, "").substring(0, 160) + "..."
      }
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
        />
      </Head>
      <div className="flex flex-wrap max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <RecipeBackButton
          additionalClass={["uppercase"]}
          backButtonText={t("back_to_recipes")}
        />
      </div>
      <div className="flex flex-wrap max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex basis-full lg:basis-1/2">
          <Image
            src={FlotiqImage.getSrc(recipe.image?.[0], 0, 0)}
            width={1920}
            height={1287}
            alt={recipe.name}
            priority={true}
          />
        </div>
        <div className="flex flex-col basis-full lg:basis-1/2 pl-0 lg:pl-12 pt-5 pb-10 bg-white">
          <div className="flex flex-wrap justify-start text-sm font-light space-x-5 py-5">
            <p className="px-4 py-3 bg-light-gray rounded">
              {t("prep_time")}:{" "}
              <span className="font-semibold">
                {recipe.prepTime
                  ? recipe.prepTime
                      .replace("PT", "")
                      .replace("M", ` ${t("minutes_short")}`)
                  : "-"}
              </span>
            </p>
            <p className="px-4 py-3 bg-light-gray rounded">
              {t("cook_time")}:{" "}
              <span className="font-semibold">
                {recipe.cookingTime
                  ? recipe.cookingTime
                      .replace("PT", "")
                      .replace("M", ` ${t("minutes_short")}`)
                  : "-"}
              </span>
            </p>
            <p className="px-4 py-3 bg-light-gray rounded">
              {t("servings")}:{" "}
              <span className="font-semibold">{recipe.servings || "-"}</span>
            </p>
          </div>
          <Header
            level={1}
            additionalClasses={[
              "text-3xl md:text-4xl !font-semibold text-secondary mb-6",
            ]}
          >
            {recipe.name}
          </Header>
          <Header
            level={2}
            additionalClasses={[
              "uppercase mt-2 mb-3 !text-2xl font-medium text-primary",
            ]}
          >
            {t("description")}
          </Header>
          <div
            className="prose prose-lg mb-8"
            dangerouslySetInnerHTML={{ __html: recipe.description }}
          />
          <Header
            level={2}
            additionalClasses={[
              "uppercase mt-8 mb-5 !text-2xl font-medium text-primary",
            ]}
          >
            {t("ingredients")}
          </Header>
          {/* --- THIS IS THE UPDATED PART --- */}
          <IngredientChecklist ingredients={recipe.ingredients} />
        </div>
        <AdComponent className="w-full md:w-auto" />
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <RecipeSteps
          steps={recipe.steps || []}
          additionalClass={["my-5 py-5 border-t border-gray-200"]}
          headerText={t("instructions")}
        />
      </div>
      {recipe.image && recipe.image[0] && (
        <HeaderImageWithText
          recipe={recipe}
          headerText1={t("enjoy_your")}
          headerText2={t("your")}
          headerText3={t("cake")}
        />
      )}

      <AdComponent className="w-full md:w-auto" />
      <ElsaBio t={t} />
      {otherRecipes && otherRecipes.length > 0 && (
        <RecipeCards
          recipes={otherRecipes}
          headerText={t("more_recipes_to_explore")}
        />
      )}
      <AdComponent className="w-full md:w-auto" />
    </Layout>
  );
};

export default RecipeTemplate;
