// pages/integritetspolicy.js

import Head from 'next/head';
import Link from 'next/link';
import Layout from '../layouts/layout';
import { Header, Paragraph, List } from 'flotiq-components-react';

const IntegritetspolicyPage = () => {
  const pageTitle = "Integritetspolicy | Silviakaka.se";
  const metaDescription = "Läs om hur Silviakaka.se, med Elsa Lundström, hanterar och skyddar dina personuppgifter i enlighet med GDPR. Din integritet är viktig för oss.";

  return (
    <Layout title={pageTitle} description={metaDescription}>
      <Head>
        {/* Inga extra meta-taggar behövs här */}
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
        <Header level={1} additionalClasses={['text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8']}>
          Integritetspolicy för Silviakaka.se
        </Header>

        <Paragraph additionalClasses={['text-center text-gray-600 mb-10 italic']}>
          Senast uppdaterad: 28 augusti 2024
        </Paragraph>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          1. Inledning och Personuppgiftsansvarig
        </Header>
        <Paragraph className="mb-4">
          Välkommen till Silviakaka.se! Vi, med Elsa Lundström i spetsen, värnar om din personliga integritet och strävar efter att skydda dina personuppgifter på bästa sätt. Denna integritetspolicy förklarar hur vi, som personuppgiftsansvarig, samlar in och använder dina personuppgifter i enlighet med Dataskyddsförordningen (GDPR).
        </Paragraph>
        <Paragraph className="mb-4 font-medium">
          Personuppgiftsansvarig:
        </Paragraph>
        <Paragraph className="mb-4 pl-4 border-l-2 border-yellow-400">
          Elsa Lundström (Silviakaka.se)   
          E-post: elsa@silviakaka.se
        </Paragraph>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          2. Vilka uppgifter samlar vi in?
        </Header>
        <Paragraph className="mb-4">
          Vi samlar in information för att kunna tillhandahålla och förbättra vår tjänst. De typer av uppgifter vi kan samla in är:
        </Paragraph>
        <List
          items={[
            { content: "<strong>Teknisk information:</strong> När du besöker vår webbplats samlar vi automatiskt in teknisk data som din IP-adress (ofta anonymiserad), webbläsartyp, operativsystem och vilka sidor du besöker. Detta görs för att säkerställa webbplatsens funktionalitet, säkerhet och för att förstå hur den används." },
            { content: "<strong>Uppgifter du själv lämnar:</strong> När du kontaktar oss via vårt kontaktformulär eller via e-post (elsa@silviakaka.se), samlar vi in de uppgifter du anger, såsom ditt namn, din e-postadress och innehållet i ditt meddelande för att kunna kommunicera med dig." },
            { content: "<strong>Användningsdata via cookies:</strong> Vi använder cookies och liknande tekniker för att analysera hur vår webbplats används, anpassa innehåll och för att visa relevanta annonser. För fullständig information, se vår <Link href='/cookiepolicy' className='text-yellow-600 hover:underline'>Cookiepolicy</Link>." }
          ]}
          additionalClasses={['list-disc list-inside text-gray-700 space-y-3']}
        />

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          3. Varför samlar vi in dina uppgifter och på vilken laglig grund?
        </Header>
        <Paragraph className="mb-4">
          Dina personuppgifter behandlas för följande ändamål och med stöd av följande lagliga grunder:
        </Paragraph>
        <List
          items={[
            { content: "<strong>För att driva och säkra webbplatsen:</strong> Behandlingen är nödvändig för vårt berättigade intresse av att kunna erbjuda en fungerande, säker och användarvänlig webbplats. (Laglig grund: Berättigat intresse)." },
            { content: "<strong>För att analysera och förbättra vår tjänst:</strong> Vi använder analysverktyg som Google Analytics för att förstå besöksmönster, vilket hjälper oss att skapa bättre recept och en bättre användarupplevelse. (Laglig grund: Samtycke, som du ger via vår cookie-banner)." },
            { content: "<strong>För att visa anpassade annonser:</strong> För att finansiera driften av Silviakaka.se samarbetar vi med annonsnätverk. Dessa partners kan använda cookies för att visa annonser som är relevanta för dig. (Laglig grund: Samtycke, som du ger via vår cookie-banner)." },
            { content: "<strong>För att kommunicera med dig:</strong> När du kontaktar oss via vårt kontaktformulär eller e-post använder vi dina uppgifter för att kunna besvara dina frågor och ge dig den hjälp du behöver. (Laglig grund: Berättigat intresse)." }
          ]}
          additionalClasses={['list-disc list-inside text-gray-700 space-y-3']}
        />

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          4. Vem delar vi dina uppgifter med?
        </Header>
        <Paragraph className="mb-4">
          Vi säljer aldrig dina personuppgifter. Vi kan dock dela teknisk och anonymiserad data med betrodda tredjepartsleverantörer (personuppgiftsbiträden) som hjälper oss att driva vår webbplats:
        </Paragraph>
        <List
          items={[
            { content: "Leverantörer av webbhotell och teknisk infrastruktur." },
            { content: "Analysverktyg (t.ex. Google Analytics)." },
            { content: "Annonsnätverk och annonspartners (som Prebid och de nätverk som är anslutna via det) för att visa anpassade annonser. Se vår Cookiepolicy för mer information." }
          ]}
          additionalClasses={['list-disc list-inside text-gray-700 space-y-2']}
        />
        <Paragraph className="mt-4">
          Dessa parter har endast tillgång till de personuppgifter som är nödvändiga för att utföra sina tjänster och är genom avtal skyldiga att behandla dem på ett säkert sätt i enlighet med GDPR.
        </Paragraph>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          5. Dina rättigheter enligt GDPR
        </Header>
        <Paragraph className="mb-4">
          Du har flera rättigheter gällande dina personuppgifter:
        </Paragraph>
        <List
          items={[
            { content: "<strong>Rätt till tillgång:</strong> Du har rätt att begära en kopia av de uppgifter vi har om dig." },
            { content: "<strong>Rätt till rättelse:</strong> Du har rätt att korrigera felaktig eller ofullständig information om dig." },
            { content: "<strong>Rätt till radering:</strong> Du har rätt att begära att vi raderar dina personuppgifter ('rätten att bli bortglömd')." },
            { content: "<strong>Rätt att återkalla samtycke:</strong> Du kan när som helst återkalla ditt samtycke för behandling som baseras på samtycke (t.ex. genom att ändra dina cookie-inställningar)." },
            { content: "<strong>Rätt att klaga:</strong> Du har rätt att lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att vi behandlar dina uppgifter i strid med lagen." }
          ]}
          additionalClasses={['list-disc list-inside text-gray-700 space-y-2']}
        />
        <Paragraph className="mt-4">
          Om du vill utöva någon av dina rättigheter, vänligen kontakta oss på: elsa@silviakaka.se
        </Paragraph>

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          6. Cookies (Kakor)
        </Header>
        <Paragraph className="mb-4">
          Vår webbplats använder cookies. För detaljerad information om vilka cookies vi använder, varför vi använder dem, och hur du kan hantera dina val, vänligen läs vår</Paragraph> <Link href='/cookiepolicy' className='text-yellow-600 hover:underline'>Cookiepolicy</Link>.
        

        <Header level={2} additionalClasses={['text-2xl font-semibold text-gray-800 mt-8 mb-4']}>
          7. Ändringar i denna policy
        </Header>
        <Paragraph className="mb-4">
          Vi kan komma att uppdatera denna integritetspolicy för att återspegla ändringar i vår verksamhet eller i lagstiftningen. Den senaste versionen kommer alltid att finnas tillgänglig här på Silviakaka.se.
        </Paragraph>

      </div>
    </Layout>
  );
};

export default IntegritetspolicyPage;
