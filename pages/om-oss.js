import React from 'react';
import Head from 'next/head';
import Layout from '../layouts/layout';
import { Header, Paragraph } from 'flotiq-components-react';
import config from '../lib/config';
import Image from 'next/image'; // Importera Image om du vill ha en bild på Elsa

const OmElsaPage = () => {
    const pageTitle = `Om Elsa | ${config.siteMetadata.title}`;
    const pageDescription = `Lär känna Elsa Lundström, kvinnan bakom Silviakaka.se, och hennes passion för svenska bakverk.`;

    return (
        <Layout title={pageTitle} description={pageDescription}>
            <Head>
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                {/* Lägg till en bild för sociala medier om du har en representativ bild för Elsa */}
                {/* <meta property="og:image" content={`${config.siteMetadata.siteUrl}/images/elsa-lundstrom.jpg`} /> */}
                {/* <meta property="og:url" content={`${config.siteMetadata.siteUrl}/om-oss`} /> */}
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <Header
                    level={1}
                    additionalClasses={['text-4xl md:text-5xl font-semibold mb-12 text-center text-primary']}
                >
                    Möt Elsa Lundström
                </Header>

                <div className="prose prose-lg lg:prose-xl max-w-3xl mx-auto text-gray-700">
                    
                    <div className="my-8 flex justify-center">
                        <Image
                            src="/images/elsa-placeholder.jpg" // Byt ut mot din bild
                            alt="Elsa Lundström, grundare av Silviakaka.se"
                            width={300}
                            height={300}
                            className="rounded-full shadow-lg"
                        />
                    </div>

                    <Paragraph additionalClasses={['text-lg leading-relaxed']}>
                        Välkommen hit till Silviakaka.se! Jag heter Elsa Lundström, och det är jag som med stor glädje
                        delar med mig av mina allra bästa recept och baktips här på sidan.
                    </Paragraph>

                    <Header level={2} additionalClasses={['mt-10 mb-4 !text-2xl md:!text-3xl text-secondary']}>
                        Min Bakgrund – Från Smålands Köksdofter
                    </Header>
                    <Paragraph>
                        Jag växte upp på den småländska landsbygden, i ett hem där köket alltid var hjärtat och
                        doften av nybakat bröd och kakor spred sig som en varm kram. Min mormor var en sann
                        mästarinna på klassiska svenska bakverk, och det var hon som tände min passion för bakning.
                        Från henne lärde jag mig de traditionella recepten från grunden, vikten av bra råvaror
                        och det kärleksfulla hantverket bakom varje kaka.
                    </Paragraph>

                    <Header level={2} additionalClasses={['mt-10 mb-4 !text-2xl md:!text-3xl text-secondary']}>
                        Min Bakfilosofi – Glädje, Kärlek & Svensk Fika
                    </Header>
                    <Paragraph>
                        För mig ska bakning vara roligt, tillgängligt för alla och framför allt fyllt av kärlek.
                        Jag tror på enkla, ärliga smaker och att de allra bästa recepten är de som delas vidare,
                        från generation till generation. Jag älskar att ge klassiker en liten modern twist,
                        men alltid med största respekt för originalet. Bakning handlar inte bara om att skapa
                        något gott att äta – det handlar om att skapa minnen, sprida glädje och fånga den där
                        speciella svenska fika-känslan.
                    </Paragraph>

                    <Header level={2} additionalClasses={['mt-10 mb-4 !text-2xl md:!text-3xl text-secondary']}>
                        Varför Silviakaka.se?
                    </Header>
                    <Paragraph>
                        Efter att ha finslipat mina färdigheter hemma i köket och genom lokala bakkurser,
                        kände jag att det var dags att dela med mig av min kunskap och mina favoritrecept.
                        Silviakakan har alltid haft en särskild plats i mitt hjärta – den är den ultimata
                        "tröstkakan" och samtidigt en given festkaka. Mitt mål med Silviakaka.se är att
                        bli din go-to källa för allt som rör Silviakaka och andra älskade svenska bakklassiker.
                        Jag vill att du ska känna dig trygg och inspirerad att lyckas i köket!
                    </Paragraph>

                    <Paragraph additionalClasses={['mt-8 pt-4 border-t border-gray-300']}>
                        Jag blir otroligt glad om du provar mina recept! Har du frågor, funderingar eller
                        kanske ett eget favorittips du vill dela med dig av? Tveka inte att
                        <a href="mailto:elsa@silviakaka.se" className="text-secondary hover:underline font-semibold"> kontakta mig</a>.
                        Jag älskar att höra från er och se era fantastiska bakverk!
                    </Paragraph>
                    <Paragraph additionalClasses={['mt-4 font-semibold']}>
                        Varma bakhälsningar,
                        </Paragraph>
                        <Paragraph additionalClasses={['mt-4 font-semibold']}>
                        Elsa Lundström
                    </Paragraph>
                </div>
            </div>
        </Layout>
    );
};

export default OmElsaPage;