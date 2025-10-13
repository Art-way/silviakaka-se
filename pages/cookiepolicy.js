// pages/cookiepolicy.js

import Head from 'next/head';
import Link from 'next/link';
import Layout from '../layouts/layout';
import { Header, Paragraph, List } from 'flotiq-components-react';

const CookiePolicyPage = () => {
  const pageTitle = "Cookiepolicy | Silviakaka.se";
  const metaDescription = "Läs om hur Silviakaka.se använder cookies för att förbättra din upplevelse, analysera trafik och visa relevanta annonser. Hantera dina samtycken här.";

  return (
    <Layout title={pageTitle} description={metaDescription}>
      <Head>
        {/* Inga extra meta-taggar behövs här */}
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
        <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8']}>
          Cookiepolicy (Information om kakor)
        </Header>

        <Paragraph additionalClasses={['text-center text-gray-600 mb-10 italic']}>
          Senast uppdaterad: 14 oktober 2025
        </Paragraph>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          1. Vad är cookies?
        </Header>
        <Paragraph className="mb-4">
          En cookie (eller kaka) är en liten textfil som lagras på din dator, mobil eller surfplatta när du besöker en webbplats. Den hjälper webbplatsen att komma ihåg information om ditt besök, såsom dina inställningar, vilket kan göra ditt nästa besök enklare och webbplatsen mer användbar för dig.
        </Paragraph>
        <Paragraph className="mb-4">
          Enligt lagen om elektronisk kommunikation (LEK) ska alla som besöker en webbplats med cookies få tillgång till information om att webbplatsen innehåller cookies och ändamålet med användningen av cookies. Besökaren ska också lämna sitt samtycke till att cookies används.
        </Paragraph>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          2. Hur vi använder cookies
        </Header>
        <Paragraph className="mb-4">
          På Silviakaka.se använder vi cookies för flera ändamål:
        </Paragraph>
        {/* Här använder vi ul/li direkt för att säkerställa att HTML-taggar fungerar korrekt */}
        <ul className="list-disc list-inside text-gray-700 space-y-3 mb-4">
          <li>
            <strong>Nödvändiga cookies:</strong> Dessa är avgörande för att webbplatsen ska fungera korrekt. De möjliggör grundläggande funktioner som sidnavigering. Webbplatsen kan inte fungera optimalt utan dessa cookies, och de kräver inte ditt samtycke.
          </li>
          <li>
            <strong>Funktionella cookies:</strong> Dessa cookies används för att komma ihåg dina val (t.ex. om du har godkänt cookies) för att förbättra din användarupplevelse.
          </li>
          <li>
            <strong>Analytiska cookies (Statistik):</strong> Dessa hjälper oss att förstå hur våra besökare interagerar med webbplatsen genom att samla in och rapportera information anonymt. Vi använder Google Analytics för att se vilka recept som är mest populära och hur vi kan förbättra innehållet. Dessa aktiveras endast med ditt samtycke.
          </li>
          <li>
            <strong>Marknadsföringscookies (Annonsering):</strong> Dessa cookies används för att visa annonser som är relevanta och engagerande för dig som användare. De används av oss och våra annonspartners (t.ex. via Prebid-skriptet) för att spåra besökare över webbplatser i syfte att visa anpassad reklam. Dessa cookies placeras endast om du ger ditt uttryckliga samtycke.
          </li>
        </ul>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          3. Tredjepartscookies
        </Header>
        <Paragraph className="mb-4">
          Vissa cookies på vår webbplats placeras av tredjepartsleverantörer. Detta gäller främst för analys och marknadsföring.
        </Paragraph>
        <ul className="list-disc list-inside text-gray-700 space-y-3 mb-4">
            <li>
                <strong>Google Analytics:</strong> Används för att samla in anonym statistik om webbplatsanvändning. Googles integritetspolicy finns att läsa{' '}
                <a href='https://policies.google.com/privacy' target='_blank' rel='noopener noreferrer' className='text-yellow-600 hover:underline'>
                    här
                </a>.
            </li>
            <li>
                <strong>Annonspartners (via Prebid):</strong> Vårt annonsskript från Prebid kan anropa flera olika annonsnätverk som i sin tur kan placera cookies för att anpassa annonser. Dessa parter agerar som egna personuppgiftsansvariga för den data de samlar in. Du kan hantera dina samtycken för dessa via vår cookie-banner.
            </li>
        </ul>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          4. Hur du hanterar och raderar cookies
        </Header>
        <Paragraph className="mb-4">
          Du har full kontroll över hur cookies används på vår webbplats.
        </Paragraph>
        <ul className="list-disc list-inside text-gray-700 space-y-3 mb-4">
            <li>
                <strong>Via vår cookie-banner:</strong> När du först besöker Silviakaka.se visas en informationsruta där du kan välja att acceptera alla cookies, avvisa alla icke-nödvändiga cookies, eller anpassa dina inställningar för varje kategori.
            </li>
            <li>
                <strong>Ändra ditt samtycke:</strong> Du kan när som helst ändra eller dra tillbaka ditt samtycke. De flesta lösningar för cookie-hantering erbjuder en liten ikon eller en länk (ofta i sidfoten) där du kan öppna dina inställningar igen.
            </li>
            <li>
                <strong>Via din webbläsare:</strong> Du kan också ställa in din webbläsare så att den blockerar alla cookies eller meddelar dig när en cookie placeras. Du kan även radera tidigare lagrade cookies. Se din webbläsares hjälpsidor för mer information. Observera att om du blockerar nödvändiga cookies kan vissa delar av webbplatsen sluta fungera.
            </li>
        </ul>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          5. Mer information
        </Header>
        <p className="mb-4 text-gray-700">
          Om du vill veta mer om hur vi hanterar personuppgifter i allmänhet, vänligen läs vår{' '}
          <Link href="/integritetspolicy" className="text-yellow-600 hover:underline">
            Integritetspolicy
          </Link>.
        </p>
        <Paragraph className="mb-4">
          För ytterligare frågor om vår användning av cookies, är du välkommen att kontakta oss på: elsa@silviakaka.se.
        </Paragraph>
        <Paragraph>
          Du kan också läsa mer om cookies och lagen om elektronisk kommunikation på Post- och telestyrelsens (PTS) webbplats.
        </Paragraph>
      </div>
    </Layout>
  );
};

export default CookiePolicyPage;
