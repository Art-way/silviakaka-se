import { Header } from 'flotiq-components-react';
import React, { useRef } from 'react';
import Link from 'next/link';
import Button from 'flotiq-components-react/dist/components/Button/Button';
import Layout from '../layouts/layout';
import { getAllRecipes } from '../lib/recipe';
import replaceUndefinedWithNull from '../lib/sanitize';
import { getCategories } from '../lib/category'; // <-- ADDED

const title = 'Page not found';
const NotFoundPage = ({ allRecipes, categories }) => { // <-- ADDED categories
    const ref = useRef();
    return (
        <Layout 
            title={title} 
            allRecipesForSearch={allRecipes}
            categories={categories} // <-- PASS categories
        >
            <main className="flex flex-col h-screen justify-center items-center">
                <Header alignment="center" additionalClasses={['my-20', '!py-20']}>
                    Page not found, sorry
                </Header>
                <div className="text-center my-20 py-20">
                    <Link href="/" ref={ref}>
                        <Button ref={ref} variant="secondary" label="Go back to index" />
                    </Link>
                </div>
            </main>
        </Layout>
    );
};

export async function getStaticProps() {
    const recipeData = await getAllRecipes();
    const allRecipes = recipeData?.data ? replaceUndefinedWithNull(recipeData.data) : [];
    const categories = await getCategories(); // <-- FETCH categories

    return {
        props: {
            allRecipes,
            categories: replaceUndefinedWithNull(categories) // <-- PASS categories
        },
    };
}

export default NotFoundPage;