import React from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import PageHeader from '../components/Header';
import config from '../lib/config'; // Import config
import { Poppins, Sora } from 'next/font/google';
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600'],
    variable: '--font-poppins', // اسم المتغير
    display: 'swap',
});

const sora = Sora({
    subsets: ['latin'],
    weight: ['300', '600'],
    variable: '--font-sora', // اسم المتغير
    display: 'swap',
});

const Layout = ({
    children, additionalClass = [], title, description, ogImage, ogType,
}) => {
    // Use specific title/description if provided, otherwise fallback to siteMetadata
    const pageTitle = title || config.siteMetadata.title;
    const pageDescription = description || config.siteMetadata.description;
    const canonicalUrl = `<span class="math-inline">\{config\.siteMetadata\.siteUrl\}</span>{router.asPath === '/' ? '' : router.asPath}`;
    const imageUrl = ogImage
    ? `<span class="math-inline">\{config\.siteMetadata\.siteUrl\}</span>{ogImage}`
    : `${config.siteMetadata.siteUrl}/images/recipes/silviakaka-klassisk.jpg`; 
    return (
        <main className={[`${poppins.variable} ${sora.variable} font-poppins`, ...additionalClass].join(' ')}>
        <Head>
            <title>{pageTitle}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content={pageDescription} />

            {/* Open Graph Tags */}
            <meta property="og:title" content={pageTitle} key="ogtitle" />
            <meta property="og:description" content={pageDescription} key="ogdesc" />
            <meta property="og:site_name" content={config.siteMetadata.title} key="ogsitename" />
            <meta property="og:url" content={canonicalUrl} key="ogurl" />
            <meta property="og:image" content={imageUrl} key="ogimage" />
            <meta property="og:type" content={ogType || 'website'} key="ogtype" />
            <meta name="twitter:card" content="summary_large_image" key="twittercard" />
                <meta name="twitter:title" content={pageTitle} key="twittertitle" />
                <meta name="twitter:description" content={pageDescription} key="twitterdesc" />
                <meta name="twitter:image" content={imageUrl} key="twitterimage" />
            <link rel="icon" href="/favicon.png" />
            </Head>
            <PageHeader />
            {children}
            <Footer />
        </main>
    )
}

export default Layout;