import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import { Header, Paragraph, Button } from 'flotiq-components-react'; // Import Button
import config from '../lib/config';

const ContactUsPage = () => {
    const pageTitle = `Kontakta Oss | ${config.siteMetadata.title}`;
    const pageDescription = `Har du frågor, feedback eller vill du bara säga hej? Kontakta oss på ${config.siteMetadata.title}. Vi ser fram emot att höra från dig!`;
    const contactEmail = "elsa@silviakaka.se"; // Replace with your actual contact email

    // Dummy submit handler for the form
    const handleDummySubmit = (event) => {
        event.preventDefault(); // Prevent actual form submission
        alert("Tack för ditt meddelande! Detta är ett demoformulär och ditt meddelande har inte skickats. Vänligen använd e-postadressen ovan.");
    };

    return (
        <Layout title={pageTitle} description={pageDescription}>
            <Head>
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <Header
                    level={1}
                    additionalClasses={['text-4xl md:text-5xl font-semibold mb-12 text-center text-primary']}
                >
                    Kontakta Oss
                </Header>

                <div className="grid md:grid-cols-2 gap-16 items-start"> {/* Grid for side-by-side layout */}
                    {/* Email Info Section */}
                    <div className="prose prose-lg lg:prose-xl max-w-full text-gray-700"> {/* max-w-full to use grid column width */}
                        <Paragraph additionalClasses={['mb-8 text-center md:text-left']}>
                            Vi på Silviakaka.se älskar att höra från våra läsare! Oavsett om du har en fråga om ett recept,
                            ett förslag på en ny Silviakaka-variant, feedback på vår sajt, eller bara vill dela med dig
                            av din bakglädje, är du varmt välkommen att kontakta oss.
                        </Paragraph>
                        
                        <Header level={2} additionalClasses={['!text-2xl md:!text-3xl text-secondary mb-4 text-center md:text-left']}>
                            Skicka ett E-postmeddelande
                        </Header>
                        <Paragraph additionalClasses={['mb-8 text-center md:text-left']}>
                            Det enklaste sättet att nå oss är via e-post. Skicka ditt meddelande till:
                            </Paragraph>
                            <br />
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-xl font-semibold text-secondary hover:underline mt-2 inline-block"
                            >
                                {contactEmail}
                            </a>
                        

                        <Paragraph additionalClasses={['mt-10 text-center md:text-left']}>
                            Vi strävar efter att svara på alla förfrågningar så snart som möjligt.
                        </Paragraph>
                        <Paragraph  additionalClasses={['text-center md:text-left']}>
                            Tack för ditt intresse för Silviakaka.se!
                        </Paragraph>
                    </div>

                    {/* Dummy Contact Form Section */}
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                        <Header level={2} additionalClasses={['!text-2xl md:!text-3xl text-secondary mb-6 text-center']}>
                            Eller fyll i formuläret
                        </Header>
                        <form onSubmit={handleDummySubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Ditt Namn
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        autoComplete="name"
                                        required
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-300 rounded-md"
                                        placeholder="Förnamn Efternamn"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Din E-postadress
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-300 rounded-md"
                                        placeholder="dittnamn@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                    Ämne
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="subject"
                                        id="subject"
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-300 rounded-md"
                                        placeholder="Angående..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Meddelande
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-300 rounded-md"
                                        placeholder="Ditt meddelande här..."
                                    />
                                </div>
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    label="Skicka Meddelande"
                                    variant="primary" // Or use 'secondary' to match your theme
                                    additionalClasses={["w-full"]}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactUsPage;