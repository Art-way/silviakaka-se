import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import { Header, Paragraph } from 'flotiq-components-react';
import Image from 'next/image';
import { useTranslation } from '../context/TranslationContext';
import { getTranslations } from '../lib/translations';
import fs from 'fs';
import path from 'path';

const OmOssPage = ({ pageContent }) => {
    const { t } = useTranslation();

    // دالة مساعدة للحصول على النص باللغة الصحيحة
    const translateContent = (field) => {
        if (typeof field === 'object' && field !== null) {
            // ملاحظة: لا نستخدم locale من router هنا لأن الصفحة ثابتة
            // اللغة يتم تحديدها أثناء البناء
            return field[pageContent.lang] || field['sv'];
        }
        return field;
    };
    
    return (
        <Layout title={translateContent(pageContent.title)} description={translateContent(pageContent.meta_description)}>
            <Head>
                {/* Add any additional meta tags if needed */}
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <Header
                    level={1}
                    additionalClasses={['text-4xl md:text-5xl font-semibold mb-12 text-center text-primary']}
                >
                    {translateContent(pageContent.headline)}
                </Header>

                <div className="prose prose-lg lg:prose-xl max-w-3xl mx-auto text-gray-700">
                    <div className="my-8 flex justify-center">
                        <Image
                            src="/images/elsa-placeholder.jpg"
                            alt="Elsa Lundström, grundare av Silviakaka.se"
                            width={300}
                            height={300}
                            className="rounded-full shadow-lg"
                        />
                    </div>
                    {/* استخدام الفقرات المقسمة من النص */}
                    {translateContent(pageContent.body).split('\n').map((paragraph, index) => (
                         <Paragraph key={index} additionalClasses={['text-lg leading-relaxed']}>
                            {paragraph}
                        </Paragraph>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps() {
    // جلب الترجمات العامة للواجهة
    const { translations } = await getTranslations();

    // جلب محتوى هذه الصفحة تحديداً
    const pageContentPath = path.join(process.cwd(), 'data', 'pageContent.json');
    const allContent = JSON.parse(fs.readFileSync(pageContentPath, 'utf-8'));
    
    // جلب لغة الموقع الحالية من الإعدادات
    const siteConfigPath = path.join(process.cwd(), 'data', 'siteConfig.json');
    const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8'));


    return {
        props: {
            translations,
            pageContent: {
                ...allContent.about,
                lang: siteConfig.language // تمرير اللغة الحالية إلى الصفحة
            }
        },
    };
}

export default OmOssPage;
