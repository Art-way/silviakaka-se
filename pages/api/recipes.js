import fs from 'fs';
import path from 'path';

const recipesFilePath = path.join(process.cwd(), 'data', 'recipes.json');

const verifyToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    return token === 'fake-secure-token';
};

export default async function handler(req, res) {
    if (!verifyToken(req)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const readRecipes = () => JSON.parse(fs.readFileSync(recipesFilePath, 'utf8'));
    const writeRecipes = (data) => fs.writeFileSync(recipesFilePath, JSON.stringify(data, null, 2));

    switch (req.method) {
        case 'GET':
            try {
                const recipes = readRecipes();
                // الترتيب حسب تاريخ النشر، من الأحدث إلى الأقدم
                recipes.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
                res.status(200).json(recipes);
            } catch (error) {
                res.status(500).json({ message: 'Could not read recipes file.' });
            }
            break;

        case 'POST': // إضافة وصفة جديدة
            try {
                const newRecipe = req.body;
                const recipes = readRecipes();
                recipes.unshift(newRecipe); // إضافة الوصفة في بداية القائمة
                writeRecipes(recipes);
                res.status(200).json({ message: 'Recipe added successfully!' });
            } catch (error) {
                res.status(500).json({ message: 'Could not write to recipes file.', error: error.message });
            }
            break;
            
        case 'PUT': // تعديل وصفة موجودة
            try {
                const updatedRecipe = req.body;
                let recipes = readRecipes();
                const recipeIndex = recipes.findIndex(r => r.id === updatedRecipe.id);
                if (recipeIndex === -1) {
                    return res.status(404).json({ message: 'Recipe not found.' });
                }
                recipes[recipeIndex] = updatedRecipe;
                writeRecipes(recipes);
                res.status(200).json({ message: 'Recipe updated successfully!' });
            } catch (error) {
                 res.status(500).json({ message: 'Could not update recipe.', error: error.message });
            }
            break;
            
        case 'DELETE': // حذف وصفة
            try {
                const { id } = req.query;
                if (!id) {
                     return res.status(400).json({ message: 'Recipe ID is required.' });
                }
                let recipes = readRecipes();
                const newRecipes = recipes.filter(r => r.id !== id);
                if (recipes.length === newRecipes.length) {
                    return res.status(404).json({ message: 'Recipe not found.' });
                }
                writeRecipes(newRecipes);
                res.status(200).json({ message: 'Recipe deleted successfully!' });
            } catch (error) {
                res.status(500).json({ message: 'Could not delete recipe.', error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
