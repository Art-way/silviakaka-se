import React from 'react';
import Link from 'next/link';
import { Card } from 'flotiq-components-react';
import Image from 'next/image';
import FlotiqImage from '../lib/FlotiqImage';

const CustomRecipeFeaturedCard = ({
    preparationTime, portions, title, excerpt,
    //  tags,
    image, imageAlt, slug,
}) => (
    <Card
        horizontal
        bordered={false}
        rounded="none"
        additionalClasses={['mb-4 max-w-7xl mx-auto ']}
        proportionsForHorizontal={{
            body: '2/5',
            img: '3/5',
            breakpoint: 'lg',
        }}
    >
        <Card.Body
            additionalClasses={[
                'flex flex-col items-start justify-between '
                + 'order-2 lg:order-1 px-5 md:px-10 pt-10 pb-5',
            ]}
        >
            <div className="flex flex-wrap justify-between text-sm font-light space-x-5 mb-14">
                <p className="px-4 py-3 bg-light-gray">
                    Time:
                    {' '}
                    <span className="font-semibold">{preparationTime}</span>
                </p>
                <p className="px-4 py-3 bg-light-gray">
                    Portions:
                    {' '}
                    <span className="font-semibold">{portions}</span>
                </p>
            </div>
            <Link href={`/recept/${encodeURIComponent(slug)}`}>
                <div>
                    <Card.Title>
                        <span className="block text-3xl md:text-5xl mb-4 mx-1 font-normal">{title}</span>
                    </Card.Title>
                    <div
                        className="text-base font-light my-4 line-clamp-5 lg:line-clamp-4 xl:line-clamp-5"
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />
                </div>
            </Link>
            {/* Uncomment this to add tags to your recipes */}
            {/* <div className="w-full"> */}
            {/*    <div className="flex flex-wrap justify-start text-sm font-light mt-5"> */}
            {/*        {tags && tags.map((tag) => ( */}
            {/*            <a */}
            {/*                href="/" */}
            {/*                className="mr-7 my-1 py-2 inline-flex items-center justify-center */}
            {/*        rounded-md underline text-sm font-light hover:text-secondary" */}
            {/*            > */}
            {/*                {tag} */}
            {/*            </a> */}
            {/*        ))} */}
            {/*    </div> */}
            {/* </div> */}
        </Card.Body>

        <div
            className="w-full lg:w-auto order-1 lg:order-2 lg:basis-3/5"
        >
            <Link href={`/recept/${encodeURIComponent(slug)}`}>
                <Image
                    src={FlotiqImage.getSrc(image, 0, 0)}
                    width="1920"
                    height="1280"
                    style={{ width: '100%', height: 'auto' }}
                    alt={imageAlt}
                />
            </Link>
        </div>

    </Card>
)

export default CustomRecipeFeaturedCard;
