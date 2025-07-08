const withImages = require('next-images')
const nextComposePlugins = require('next-compose-plugins');
const { withPlugins } = nextComposePlugins.extend(() => ({}));
const withTM = require('next-transpile-modules')(['flotiq-components-react'])

module.exports = withPlugins(
    [
        withTM,
        withImages,
    ],
    {   

        images: {
            imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // You can keep or remove if not needed
            dangerouslyAllowSVG: true,
            disableStaticImages: true, // Recommended to be true for next/image with remote patterns or loader
            remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000', // تأكد من أن هذا هو البورت الذي تستخدمه في التطوير
                pathname: '/images/**', // اسمح بكل الصور في مجلد /images
            },
            
            {
                 protocol: 'https',
                 hostname: 'silviakaka.se',
                port: '',
                pathname: '/images/**',
         },
        ], // No remote patterns needed if all images are local
        },
        webpack: (config, options) => {
            if (!options.isServer) {
                // config.resolve.alias['@sentry/node'] = '@sentry/browser' // Keep if using Sentry
            }
            config.module.rules.push({
                test: /\.svg$/,
                issuer: { and: [/\.(js|ts)x?$/] },
                use: ['@svgr/webpack'],
            });
            return config;
        },
    }
);