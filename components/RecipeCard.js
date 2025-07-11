import React from "react";
import Link from "next/link";
import { Card } from "flotiq-components-react";
import Image from "next/image";
import AdComponent from "./AdComponent";

const CustomRecipeCard = ({
  cookingTime,
  servings,
  name,
  image,
  //  tags,
  slug,
}) => (
  <Card
    bordered={false}
    additionalClasses={[
      "mb-4 cursor-pointer basis-full md:basis-1/2 lg:basis-1/3 px-2 !bg-transparent",
    ]}
  >
    <Link
      href={`/recept/${encodeURIComponent(slug)}`}
      title={`Läs receptet: ${name}`}
    >
      <Image
        src={image}
        alt={name}
        width="1920"
        height="1280"
        style={{ objectFit: "cover", width: "100%", height: "auto" }}
        className="w-full"
      />
    </Link>
    <Card.Body
      additionalClasses={[
        "flex flex-col items-start justify-between order-2 lg:order-1 px-5 pt-10 pb-2 border-b-4 bg-white",
      ]}
    >
      <Link
        href={`/recept/${encodeURIComponent(slug)}`}
        title={`Läs receptet: ${name}`}
      >
        <div className="flex flex-wrap justify-start text-xs font-light space-x-5 pb-3">
          <p className="px-4 py-2 bg-light-gray">
            Time:{" "}
            <span className="font-medium">
              {cookingTime.replace("PT", "").replace("M", " min")}
            </span>
          </p>
          <p className="px-4 py-2 bg-light-gray">
            Portions: <span className="font-semibold text-sm">{servings}</span>
          </p>
        </div>
        <AdComponent className="w-full md:w-auto" />
        <Card.Title additionalClasses={["font-normal"]}>{name}</Card.Title>
      </Link>
      {/* Uncomment this to add tags to your recipes */}
      {/* <div className="flex flex-wrap justify-start text-sm font-light mt-5"> */}
      {/*    {tags && tags.map((tag) => ( */}
      {/*        <a */}
      {/*            href="/" */}
      {/*            className="mr-5 my-1 py-2 inline-flex items-center justify-center */}
      {/*            rounded-md underline text-xs font-light hover:text-secondary" */}
      {/*        > */}
      {/*            {tag} */}
      {/*        </a> */}
      {/*    ))} */}
      {/* </div> */}
    </Card.Body>
  </Card>
);

export default CustomRecipeCard;
