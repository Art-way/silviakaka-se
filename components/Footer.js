import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import config from '../lib/config';

// SVG paths for icons
const facebookPath = "M8.30466 24.1211V13.5346H11.8761L12.407 9.38964H8.30466V6.74947C8.30466 5.55339 8.63791 4.73447 10.3545 4.73447H12.5297V1.03902C11.4714 0.925596 10.4076 0.870832 9.34316 0.874974C6.18633 0.874974 4.01891 2.80214 4.01891 6.34002V9.38189H0.470703V13.5268H4.02666V24.1211H8.30466Z";
const instagramPath = 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772'
    + ' 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.0'
    + '12 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.1'
    + '53c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-'
    + '1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-'
    + '2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.9'
    + '02 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.'
    + '63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35'
    + '.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058'
    + ' 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054'
    + '.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.'
    + '748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058'
    + '-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1'
    + '.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.'
    + '333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z';
const twitterPath = "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84";

const navigation = {
    social: [
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/',
            icon: (props) => (
                <svg fill="currentColor" viewBox="0 0 13 25" {...props}>
                    <path fillRule="evenodd" d={facebookPath} clipRule="evenodd" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/',
            icon: (props) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path fillRule="evenodd" d={instagramPath} clipRule="evenodd" />
                </svg>
            ),
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com/',
            icon: (props) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path d={twitterPath} />
                </svg>
            ),
        },
    ],
};

const Footer = ({ categories = [] }) => {
    // We only want to feature a few key categories in the footer
    const featuredCategories = categories.filter(cat => ['silviakaka', 'kladdkaka', 'mjuka-kakor'].includes(cat.slug)).slice(0, 3);

    return (
        <footer className="bg-primary text-white mt-16">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo and About */}
                    <div className="space-y-4">
                        <Link href="/" title={`${config.siteMetadata.title} Logotyp`}>
                            <Image
                                src="/assets/recipe-logo.png"
                                alt={`${config.siteMetadata.title} Logotyp`}
                                width={140}
                                height={55}
                            />
                        </Link>
                        <p className="text-sm text-gray-300">
                            Din guide till svenska fikaklassiker. Upptäck, baka och njut av de bästa recepten, från Silviakaka till Kladdkaka.
                        </p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Navigation</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/recept" className="text-base text-gray-300 hover:text-secondary hover:underline">Alla Recept</Link></li>
                            <li><Link href="/om-oss" className="text-base text-gray-300 hover:text-secondary hover:underline">Om Oss</Link></li>
                            <li><Link href="/kontakta-oss" className="text-base text-gray-300 hover:text-secondary hover:underline">Kontakta Oss</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Featured Categories */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Kategorier</h3>
                        <ul className="mt-4 space-y-2">
                            {featuredCategories.map(cat => (
                                <li key={cat.slug}>
                                    <Link href={`/${cat.slug}`} className="text-base text-gray-300 hover:text-secondary hover:underline">
                                        {cat.name.sv}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Social Media */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Följ Oss</h3>
                        <div className="flex space-x-4 mt-4">
                            {navigation.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    title={item.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-secondary"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Sub-footer for Copyright */}
            <div className="bg-black bg-opacity-20 mt-8 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
                    <p>Copyright © {new Date().getFullYear()} {config.siteMetadata.title}. Alla rättigheter förbehållna.                 <Link href="/integritetspolicy" className="hover:text-yellow-600 hover:underline">
                    Integritetspolicy
                </Link>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <Link href="/cookiepolicy" className="hover:text-yellow-600 hover:underline">
                    Cookiepolicy
                </Link></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
