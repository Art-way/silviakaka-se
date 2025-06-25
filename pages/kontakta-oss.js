import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import { Header, Paragraph, Button } from 'flotiq-components-react';
import { useTranslation } from '../context/TranslationContext';
import { getTranslations } from '../lib/translations';
import fs from 'fs';
import path from 'path';

const ContactUsPage = ({ pageContent }) => {
    const { t } = useTranslation();

    const translateContent = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[pageContent.lang] || field['sv'];
        }
        return field;
    };
    
    const handleDummySubmit = (event) => {
        event.preventDefault();
        alert("Tack för ditt meddelande! Detta är ett demoformulär och ditt meddelande har inte skickats. Vänligen använd e-postadressen.");
    };

    return (
        <Layout title={translateContent(pageContent.title)} description={translateContent(pageContent.meta_description)}>
            <Head>
                {/* Meta tags */}
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <Header
                    level={1}
                    additionalClasses={['text-4xl md:text-5xl font-semibold mb-12 text-center text-primary']}
                >
                    {translateContent(pageContent.headline)}
                </Header>
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <div className="prose prose-lg lg:prose-xl max-w-full text-gray-700">
                        {translateContent(pageContent.body).split('\n').map((paragraph, index) => (
                             <Paragraph key={index} additionalClasses={['text-lg leading-relaxed']}>
                                {paragraph}
                            </Paragraph>
                        ))}
                         <br />
                        <a href={`mailto:${pageContent.email}`} className="text-xl font-semibold text-secondary hover:underline mt-2 inline-block">
                            {pageContent.email}
                        </a>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                        <Header level={2} additionalClasses={['!text-2xl md:!text-3xl text-secondary mb-6 text-center']}>
                            {t('contact_form_title')}
                        </Header>
                        <form onSubmit={handleDummySubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('your_name')}</label>
                                <input type="text" name="name" id="name" required className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-300 rounded-md" placeholder={t('your_name')} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('your_email')}</label>
                                <input id="email" name="email" type="email" required className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-ray-300 rounded-md" placeholder={t('your_email')} />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">{t('subject')}</label>
                                <input type="text" name="subject" id="subject" className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-300 rounded-md" placeholder={t('subject')} />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('message')}</label>
                                <textarea id="message" name="message" rows={4} required className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-300 rounded-md" placeholder={t('message')} />
                            </div>
                            <div>
                                <Button type="submit" label={t('send_message')} variant="primary" additionalClasses={["w-full"]} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps() {
    const { translations } = await getTranslations();
    const pageContentPath = path.join(process.cwd(), 'data', 'pageContent.json');
    const allContent = JSON.parse(fs.readFileSync(pageContentPath, 'utf-8'));
    const siteConfigPath = path.join(process.cwd(), 'data', 'siteConfig.json');
    const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8'));

    return {
        props: {
            translations,
            pageContent: {
                ...allContent.contact,
                lang: siteConfig.language
            }
        },
    };
}


export default ContactUsPage;

