// components/recipe/RecipeInfo.js
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from 'flotiq-components-react';
import { useTranslation } from '../../context/TranslationContext';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid';

// Helper function to parse the initial servings from a string like "Ca 10-12 bitar"
const parseServings = (servingString) => {
    if (!servingString) return 4; // Default to 4 if not specified
    const match = servingString.match(/\d+/); // Find the first number in the string
    return match ? parseInt(match[0], 10) : 4;
};

// Helper function to format numbers nicely (e.g., 2.5, but 2 instead of 2.0)
const formatAmount = (num) => {
    if (isNaN(num)) return '';
    // Round to 2 decimal places and convert to string to remove trailing zeros
    return (Math.round(num * 100) / 100).toString();
};

const RecipeInfo = ({ recipe }) => {
    const { t } = useTranslation();
    
    // The original number of servings from the recipe data
    const originalServings = useMemo(() => parseServings(recipe.servings), [recipe.servings]);
    
    // State for the current, user-adjustable number of servings
    const [currentServings, setCurrentServings] = useState(originalServings);

    const handleIncrease = useCallback(() => {
        setCurrentServings(prev => prev + 1);
    }, []);

    const handleDecrease = useCallback(() => {
        setCurrentServings(prev => (prev > 1 ? prev - 1 : 1)); // Don't go below 1
    }, []);

    return (
        <div className="flex flex-col basis-full lg:basis-1/2 pl-0 lg:pl-12 pt-5 pb-10 bg-white">
            <div className="flex flex-wrap justify-start items-center text-sm font-light gap-3 py-5">
                <p className="px-4 py-3 bg-light-gray rounded">
                    {t('prep_time')}:{' '}
                    <span className="font-semibold">
                        {recipe.prepTime ? recipe.prepTime.replace('PT','').replace('M', ` ${t('minutes_short')}`) : '-'}
                    </span>
                </p>
                <p className="px-4 py-3 bg-light-gray rounded">
                     {t('cook_time')}:{' '}
                    <span className="font-semibold">
                        {recipe.cookingTime ? recipe.cookingTime.replace('PT','').replace('M', ` ${t('minutes_short')}`) : '-'}
                    </span>
                </p>
                {/* Interactive Servings Component */}
                <div className="flex items-center gap-2 px-4 py-3 bg-light-gray rounded">
                    <span>{t('servings')}:</span>
                    <button onClick={handleDecrease} title="Minska portioner" className="text-secondary hover:text-primary disabled:text-gray-300">
                        <MinusCircleIcon className="h-6 w-6" />
                    </button>
                    <span className="font-semibold text-base w-8 text-center">{currentServings}</span>
                    <button onClick={handleIncrease} title="Öka portioner" className="text-secondary hover:text-primary">
                        <PlusCircleIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
            
            <Header level={1} additionalClasses={['text-3xl md:text-4xl !font-semibold text-secondary mb-6']}>
                {recipe.name}
            </Header>
            
            <Header level={2} additionalClasses={['uppercase mt-2 mb-3 !text-2xl font-medium text-primary']}>
                {t('description')}
            </Header>
            <div
                className="prose prose-lg mb-8"
                dangerouslySetInnerHTML={{ __html: recipe.description }}
            />
            
            <Header level={2} additionalClasses={['uppercase mt-8 mb-5 !text-2xl font-medium text-primary']}>
                {t('ingredients')}
            </Header>

            {/* Dynamic Ingredient Checklist */}
            <div className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => {
                    const originalAmount = parseFloat(ingredient.amount);
                    let scaledAmountText = ingredient.amount || '';

                    // Recalculate amount if it's a valid number
                    if (!isNaN(originalAmount) && originalServings > 0) {
                        const scaledAmount = (originalAmount / originalServings) * currentServings;
                        scaledAmountText = formatAmount(scaledAmount);
                    }
                    
                    const ingredientText = `${scaledAmountText} ${ingredient.unit || ''} ${ingredient.product || ''}`.trim();
                    
                    if (!ingredient.unit && !ingredient.amount) {
                        return (
                            <h4 key={index} className="text-xl font-semibold text-primary mt-6 mb-3 border-b pb-2">
                                {ingredient.product}
                            </h4>
                        );
                    }

                    return (
                        <div key={index}>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-opacity-50"
                                />
                                <span className="text-lg text-gray-800 peer-checked:text-gray-400 peer-checked:line-through transition-colors duration-200">
                                    {ingredientText}
                                </span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecipeInfo;