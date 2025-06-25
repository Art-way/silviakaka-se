// components/recipe/ElsaBio.js
// (تم تحديثه ليمرر دالة الترجمة)
import React from 'react';
import { Header, Paragraph } from 'flotiq-components-react';
import Image from 'next/image';
import Link from 'next/link';

const ElsaBio = ({ t }) => { // استقبال دالة الترجمة كـ prop
    // التأكد من وجود دالة الترجمة، وإلا استخدام قيمة افتراضية
    const translate = t || ((key) => key);

    return (
        <div className="max-w-3xl mx-auto my-12 p-6 md:p-8 bg-white shadow-lg rounded-lg">
            <Header level={2} additionalClasses={['text-3xl font-semibold text-secondary mb-6 text-center']}>
                {translate('from_elsas_kitchen')}
            </Header>
            <div className="mb-6 flex justify-center">
                 <Image
                    src="/images/elsa-placeholder.jpg"
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
};

export default ElsaBio;
