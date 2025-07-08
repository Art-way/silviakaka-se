import React from 'react';
import RecipeTemplate from '../../templates/RecipePost'; // This will be used for ALL individual recipes
import { getRecipeBySlug, getAllRecipeSlugs, getAllRecipes } from '../../lib/recipe'; // Updated imports
import replaceUndefinedWithNull from '../../lib/sanitize';
import config from '../../lib/config';
import { getTranslations } from '../../lib/translations';

// Renamed component to avoid conflict
// It now receives `allRecipes` to pass down for the search functionality
const RecipeDetailPage = ({ postData, pageContext, allRecipes }) => {
    return <RecipeTemplate post={postData} pageContext={pageContext} allRecipes={allRecipes} />;
};

export async function getStaticProps({ params }) {
    const requestedSlug = params.slug;

    // 1. جلب الوصفة (الدالة المعدلة ستبحث في slug و slugHistory)
    const recipeBySlugResponse = await getRecipeBySlug(requestedSlug);

    // إذا لم يتم العثور على الوصفة، أرجع صفحة 404
    if (!recipeBySlugResponse || !recipeBySlugResponse.data || recipeBySlugResponse.data.length === 0) {
        return { notFound: true };
    }

    const recipeData = replaceUndefinedWithNull(recipeBySlugResponse.data[0]);
    const currentOfficialSlug = recipeData.slug;

    // 2. *** منطق إعادة التوجيه ***
    // إذا كان الـ slug المطلوب في الرابط لا يساوي الـ slug الرسمي الحالي للوصفة
    if (currentOfficialSlug !== requestedSlug) {
        return {
            redirect: {
                destination: `/recept/${currentOfficialSlug}`, // وجه إلى الرابط الصحيح
                permanent: true, // 301 Redirect (دائم)
            },
        };
    }
    // *** نهاية منطق إعادة التوجيه ***

    // 3. إذا كان الرابط صحيحاً، أكمل كالمعتاد
    const otherRecipesResponse = await getAllRecipes();
    const sanitizedOtherRecipes = replaceUndefinedWithNull(otherRecipesResponse.data)
                                    .filter(recipe => recipe.slug !== recipeData.slug)
                                    .slice(0, config.blog.postPerPage);
    const allRecipesForSearch = replaceUndefinedWithNull(otherRecipesResponse.data);
    const { translations } = await getTranslations();

    return {
        props: {
            postData: recipeData,
            pageContext: {
                otherRecipes: sanitizedOtherRecipes,
            },
            allRecipes: allRecipesForSearch,
            translations,
        },
        revalidate: 60, // أعد التحقق من الصفحة كل 60 ثانية (جيد للأداء)
    };
}


export async function getStaticPaths() {
    const slugs = await getAllRecipeSlugs();
    return {
        paths: slugs.map((slug) => ({
            params: { slug },
        })),
        fallback: 'blocking', // *** هذا هو التغيير الأهم ***
    };
}

export default RecipeDetailPage;