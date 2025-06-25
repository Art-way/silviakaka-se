import React, { Fragment, useState, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { MenuIcon, XIcon, ChevronDownIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import config from '../lib/config';
import { useRouter } from 'next/router';
import SearchWidget from './SearchWidget';
import { getAllRecipes } from '../lib/recipe';
import { useTranslation } from '../context/TranslationContext'; // استيراد الهوك

const PageHeader = () => {
    const { t } = useTranslation(); // استخدام الهوك
    const router = useRouter();
    const [allRecipesForSearch, setAllRecipesForSearch] = useState([]);

    const navigationLinks = [
        { name: t('home'), href: '/', type: 'link' },
        {
            name: t('recipes'),
            type: 'dropdown',
            href: '/recept',
            subLinks: [
                { name: t('all_recipes'), href: '/recept' },
                { name: t('silviakaka_guide'), href: '/silviakaka' },
                { name: t('kladdkaka_guide'), href: '/kladdkaka' },
            ],
        },
        { name: t('about_us'), href: '/om-oss', type: 'link' },
        { name: t('contact_us'), href: '/kontakta-oss', type: 'link' },
    ];

    useEffect(() => {
        const fetchAllDataForSearch = async () => {
            const recipeData = await getAllRecipes();
            if (recipeData && recipeData.data) {
                setAllRecipesForSearch(recipeData.data);
            }
        };
        fetchAllDataForSearch();
    }, []);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
 <Disclosure as="nav" className="bg-white shadow-md sticky top-0 z-50">
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            {/* Logo & Desktop Navigation Group */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0 mr-4 md:mr-6 lg:mr-10">
                                    <Link href="/" className="flex items-center">
                                        <Image
                                            src="/assets/recipe-logo.png"
                                            alt={`${config.siteMetadata.title} Logotyp`}
                                            width={140}
                                            height={55}
                                            priority
                                        />
                                    </Link>
                                </div>
                                <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
                                    {navigationLinks.map((item) =>
                                        item.type === 'link' ? (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                title={`Gå till ${item.name}`}
                                                className={classNames(
                                                    router.pathname === item.href ? 'text-secondary border-secondary' : 'text-gray-600 hover:text-secondary hover:border-gray-300 border-transparent',
                                                    'inline-flex items-center px-1 pt-1 border-b-2 text-base lg:text-lg font-medium transition-all duration-150 ease-in-out'
                                                )}
                                                aria-current={router.pathname === item.href ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <Menu as="div" className="relative" key={item.name}>
                                                <div>
                                                    <Menu.Button className={classNames(
                                                        router.pathname.startsWith(item.href) || item.subLinks.some(sl => sl.href === router.pathname)
                                                        ? 'text-secondary border-secondary'
                                                        : 'text-gray-600 hover:text-secondary hover:border-gray-300 border-transparent',
                                                        'inline-flex items-center px-1 pt-1 border-b-2 text-base lg:text-lg font-medium group transition-all duration-150 ease-in-out'
                                                    )}>
                                                        <Link href={item.href}  title={`Gå till ${item.name}`} className="group-hover:text-secondary transition-colors">
                                                            {item.name}
                                                        </Link>
                                                        <ChevronDownIcon
                                                            className="ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-transform"
                                                            aria-hidden="true"
                                                        />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-200"
                                                    enterFrom="opacity-0 translate-y-1"
                                                    enterTo="opacity-100 translate-y-0"
                                                    leave="transition ease-in duration-150"
                                                    leaveFrom="opacity-100 translate-y-0"
                                                    leaveTo="opacity-0 translate-y-1"
                                                >
                                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                                                        {item.subLinks.map((subLink) => (
                                                            <Menu.Item key={subLink.name}>
                                                                {({ active }) => (
                                                                    <Link
                                                                        href={subLink.href}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            router.pathname === subLink.href ? 'font-semibold text-secondary' : '',
                                                                            'block px-4 py-3 text-sm hover:bg-gray-50 transition-colors'
                                                                        )}
                                                                    >
                                                                        {subLink.name}
                                                                    </Link>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Desktop Search Widget & Mobile Menu Button Group */}
                              <div className="flex items-center">
                                <div className="hidden md:ml-4 md:flex md:items-center">
                                    <SearchWidget allRecipesData={allRecipesForSearch} placeholder={t('search_placeholder')} />
                                </div>
                                <div className="md:hidden ml-4">
                                    <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary">
                                        <span className="sr-only">{t('open_main_menu')}</span>
                                        {open ? (
                                            <XIcon className="block h-7 w-7" aria-hidden="true" />
                                        ) : (
                                            <MenuIcon className="block h-7 w-7" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu panel */}
                    <Disclosure.Panel className="md:hidden border-t border-gray-200">
                        <div className="pt-4 pb-3 px-3"> {/* Added horizontal padding to panel itself */}
                            <SearchWidget allRecipesData={allRecipesForSearch} placeholder="Sök recept..." />
                        </div>
                        <div className="pt-2 pb-3 space-y-1">
                            {navigationLinks.map((item) =>
                                item.type === 'link' ? (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        href={item.href}
                                        className={classNames(
                                            router.pathname === item.href 
                                            ? 'bg-secondary-50 border-secondary text-secondary' 
                                            : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                                            'block pl-3 pr-4 py-3 border-l-4 text-base font-medium rounded-r-md' // Added rounded-r-md
                                        )}
                                        aria-current={router.pathname === item.href ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ) : (
                                    <Disclosure key={item.name} as="div" className="space-y-1">
                                        {({ open: subOpen }) => (
                                            <>
                                                <Disclosure.Button
                                                    className={classNames(
                                                        router.pathname.startsWith(item.href) || item.subLinks.some(sl => sl.href === router.pathname)
                                                        ? 'bg-secondary-50 border-secondary text-secondary'
                                                        : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                                                        'group w-full flex items-center justify-between pl-3 pr-4 py-3 border-l-4 text-base font-medium rounded-r-md'
                                                    )}
                                                >
                                                    <Link href={item.href} className="flex-grow text-left">{item.name}</Link>
                                                    <ChevronDownIcon
                                                        className={`${subOpen ? 'transform rotate-180' : ''} ml-2 h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-transform`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="pl-7 pr-4 space-y-1 pb-2">
                                                    {item.subLinks.map((subLink) => (
                                                        <Disclosure.Button
                                                            key={subLink.name}
                                                            as={Link}
                                                            href={subLink.href}
                                                            className={classNames(
                                                                router.pathname === subLink.href ? 'bg-gray-100 text-secondary font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800',
                                                                'block px-3 py-2 text-sm rounded-md w-full text-left' // Added px-3
                                                            )}
                                                        >
                                                            {subLink.name}
                                                        </Disclosure.Button>
                                                    ))}
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                )
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default PageHeader;