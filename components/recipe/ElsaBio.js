import React from 'react';
import { Header, Paragraph } from 'flotiq-components-react';
import Image from 'next/image'; // Optional: if you want an image of Elsa here
import Link from 'next/link'; // Optional: to link to the full "Om Elsa" page

const ElsaBio = () => (
    <div className="max-w-3xl mx-auto my-12 p-6 md:p-8 bg-white shadow-lg rounded-lg">
        <Header level={2} additionalClasses={['text-3xl font-semibold text-secondary mb-6 text-center']}>
            Från Elsas Kök
        </Header>
        
       
        <div className="mb-6 flex justify-center">
            <Image
                src="/images/elsa-placeholder.jpg" // Replace with Elsa's actual image path
                alt="Elsa Lundström, din receptkreatör på Silviakaka.se"
                width={150}
                height={150}
                className="rounded-full"
            />
        </div>
      

        <Paragraph additionalClasses={['text-lg text-gray-700 leading-relaxed mb-4']}>
            Hej kära bakvänner! Jag heter Elsa Lundström, och det är med stor glädje jag delar med mig av mina
            favoritrecept här på Silviakaka.se. Jag växte upp på landsbygden i Småland där köket alltid var
            fyllt av doften av nybakat. Min mormor lärde mig allt om svenska fikaklassiker, en tradition
            jag nu för vidare med en nypa modern känsla.
        </Paragraph>
        <Paragraph additionalClasses={['text-gray-700 leading-relaxed']}>
            Min filosofi är enkel: bakning ska vara roligt, tillgängligt och fyllt av kärlek.
            Jag hoppas kunna inspirera dig att skapa egna ljuvliga bakverk och minnen i köket.
         <Link href="/om-oss" className="text-secondary hover:underline font-semibold ml-1">
                Läs mer om mig och min bakfilosofi här!
            </Link>
        </Paragraph>
    </div>
);

export default ElsaBio;