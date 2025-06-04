import React from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import PageHeader from '../components/Header';
import config from '../lib/config'; // Import config

const Layout = ({
    children, additionalClass = [], title, description, // title and description props for specific pages
}) => {
    // Use specific title/description if provided, otherwise fallback to siteMetadata
    const pageTitle = title || config.siteMetadata.title;
    const pageDescription = description || config.siteMetadata.description;

    return (
        <main className={['font-poppins', ...additionalClass].join(' ')}>
            <Head>
                <title>{pageTitle}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} key="ogtitle" /> {/* Added key for OG title */}
                <meta property="og:description" content={pageDescription} key="ogdesc" /> {/* Added key for OG desc */}
                <meta property="og:site_name" content={config.siteMetadata.title} key="ogsitename" />
                {/* You might want to add more OG tags later, e.g., og:image, og:url */}
                {/* Ensure favicon link is correct if you changed its name/location */}
                <link rel="icon" href="/favicon.png" /> 
            </Head>
            <PageHeader />
            {children}
            <Footer />
        </main>
    )
}

export default Layout;