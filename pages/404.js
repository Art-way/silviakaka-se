import { Header } from 'flotiq-components-react';
import React, { useRef } from 'react';
import Link from 'next/link';
import Button from 'flotiq-components-react/dist/components/Button/Button';
import Layout from '../layouts/layout';
import { getAllRecipes } from '../lib/recipe'; // Import
import replaceUndefinedWithNull from '../lib/sanitize'; // Import
const title = 'Page not found';
const NotFoundPage = ({ allRecipes }) => {
    const ref = useRef();
    return (
        <Layout title={title} allRecipesForSearch={allRecipes}>
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
    // جلب جميع الوصفات للبحث حتى في صفحة الخطأ
    const recipeData = await getAllRecipes();
    const allRecipes = recipeData && recipeData.data ? replaceUndefinedWithNull(recipeData.data) : [];
    return {
        props: {
            allRecipes,
        },
    };
}
export default NotFoundPage;
