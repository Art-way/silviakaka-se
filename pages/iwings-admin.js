import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { PlusIcon, TrashIcon, CogIcon, SparklesIcon, BookOpenIcon, DocumentTextIcon, PencilAltIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { useTranslation } from '../context/TranslationContext';

// --- Helper Hook for Secure API Calls ---
const useSecureFetch = () => {
    const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;

    const secureFetch = async (url, options = {}) => {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication token not found. Please log in again.');
        }
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message);
        }
        return response.json();
    };

    return secureFetch;
};


// --- ImageUploader Component ---
const ImageUploader = ({ onUpload, currentImageUrl, label }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('admin-token');


        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

             if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            const data = await res.json();
            onUpload(data.url);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div className="mt-2 p-3 border rounded-lg bg-gray-50">
             <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {currentImageUrl && <img src={currentImageUrl} alt="Preview" className="w-32 h-32 object-cover rounded mb-2 shadow-sm" />}
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                ref={fileInputRef}
            />
             <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
                {uploading ? 'Laddar upp...' : 'Välj bild'}
            </button>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};


// --- AddRecipeForm Component ---
const RecipeForm = ({ t, initialData, onSave }) => {
    const secureFetch = useSecureFetch();
    const initialRecipeState = { id: '', name: '', slug: '', image: [], steps: [{ step: '', image: [] }], servings: '', cookingTime: 'PTM', prepTime: 'PTM', totalTime: 'PTM', description: '', recipeCategory: '', recipeCuisine: '', keywords: '', datePublished: new Date().toISOString().split('T')[0], ingredients: [{ unit: '', amount: '', product: '' }], aggregateRating: { "@type": "AggregateRating", "ratingValue": "4.5", "ratingCount": "1" }, nutrition: { "@type": "NutritionInformation", "calories": "" }};
    
    const [recipe, setRecipe] = useState(initialData || initialRecipeState);
    const [isEditing, setIsEditing] = useState(!!initialData);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setRecipe(initialData || initialRecipeState);
        setIsEditing(!!initialData);
    }, [initialData]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/å|ä/g, 'a').replace(/ö/g, 'o').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setRecipe(prev => ({ ...prev, name: value, slug, id: slug }));
        } else {
             setRecipe(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleListChange = (index, event, listName) => {
        const { name, value } = event.target;
        const list = [...recipe[listName]];
        list[index][name] = value;
        setRecipe({ ...recipe, [listName]: list });
    };

    const addListItem = (listName, item) => {
        setRecipe(prev => ({ ...prev, [listName]: [...prev[listName], item] }));
    };

    const removeListItem = (index, listName) => {
        const list = [...recipe[listName]];
        list.splice(index, 1);
        setRecipe({ ...recipe, [listName]: list });
    };
    
    const handleImageUpload = (url, listName, index) => {
        if(listName) { // For steps
            const list = [...recipe[listName]];
            list[index].image = [{ id: `step-img-${Date.now()}`, url, extension: url.split('.').pop(), width: 1200, height: 800, alt: list[index].step }];
            setRecipe({ ...recipe, [listName]: list });
        } else { // For main recipe image
            setRecipe(prev => ({...prev, image: [{ id: `main-img-${Date.now()}`, url, extension: url.split('.').pop(), width: 1200, height: 800, alt: prev.name }]}));
        }
    };
    
       const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const method = isEditing ? 'PUT' : 'POST';
        try {
            await secureFetch('/api/recipes', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe),
            });
            setMessage(`Receptet har ${isEditing ? 'uppdaterats' : 'lagts till'}! Kom ihåg att bygga om webbplatsen.`);
            if (!isEditing) {
                setRecipe(initialRecipeState); // Reset form only if adding
            }
            onSave(); // Callback to refresh recipe list
        } catch (error) {
            setMessage(`Fel: ${error.message}`);
        }
    };

    const handleJsonImport = (event) => {
         const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = e => {
            try {
                const importedRecipe = JSON.parse(e.target.result);
                // Simple validation
                if(importedRecipe.name && importedRecipe.slug){
                    setRecipe(importedRecipe);
                    setMessage("Receptet har laddats in i formuläret. Granska och spara.");
                } else {
                    throw new Error("Ogiltig JSON-struktur.")
                }
            } catch (error) {
                 setMessage(`Fel vid import: ${error.message}`);
            }
        };
    };

    return (
        <div className="space-y-8">
           <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{isEditing ? `Redigera: ${recipe.name}` : t('add_new_recipe')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={recipe.name} onChange={handleChange} placeholder={t('recipe_name')} className="p-2 border rounded" required />
                    <input name="slug" value={recipe.slug} placeholder={t('url_slug')} className="p-2 border rounded bg-gray-100" readOnly />
                </div>
                 <ImageUploader onUpload={(url) => handleImageUpload(url)} currentImageUrl={recipe.image[0]?.url} label={t('main_image')} />
                
                <div>
                    <h4 className="font-semibold mb-2">{t('ingredients')}</h4>
                    {recipe.ingredients.map((ing, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input name="amount" value={ing.amount} onChange={e => handleListChange(index, e, 'ingredients')} placeholder="Mängd" type="text" className="p-2 border rounded w-1/4" />
                            <input name="unit" value={ing.unit} onChange={e => handleListChange(index, e, 'ingredients')} placeholder="Enhet" className="p-2 border rounded w-1/4" />
                            <input name="product" value={ing.product} onChange={e => handleListChange(index, e, 'ingredients')} placeholder="Ingrediens" className="p-2 border rounded w-2/4" required/>
                            <button type="button" onClick={() => removeListItem(index, 'ingredients')}><TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700"/></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addListItem('ingredients', { unit: '', amount: '', product: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><PlusIcon className="h-4 w-4"/> {t('add_ingredient')}</button>
                </div>
                
                <div>
                    <h4 className="font-semibold mb-2">{t('steps')}</h4>
                    {recipe.steps.map((step, index) => (
                         <div key={index} className="mb-4 p-3 border rounded bg-gray-50">
                            <div className="flex items-start gap-2">
                                <textarea name="step" value={step.step} onChange={e => handleListChange(index, e, 'steps')} placeholder={`Steg ${index + 1}`} className="w-full p-2 border rounded" rows="3" required></textarea>
                                <button type="button" onClick={() => removeListItem(index, 'steps')}><TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700"/></button>
                            </div>
                            <ImageUploader onUpload={(url) => handleImageUpload(url, 'steps', index)} currentImageUrl={step.image?.[0]?.url} label="Valfri bild för steget"/>
                         </div>
                    ))}
                     <button type="button" onClick={() => addListItem('steps', { step: '', image: [] })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><PlusIcon className="h-4 w-4"/> {t('add_step')}</button>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">{t('save_recipe')}</button>
                {message && <p className="text-center mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">{message}</p>}
            </form>
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h3 className="text-xl font-semibold mb-4">{t('import_from_json')}</h3>
                <input type="file" accept=".json" onChange={handleJsonImport} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
        </div>
    );
};


// --- SettingsForm Component ---
const SettingsForm = ({ t }) => {
    const secureFetch = useSecureFetch();
    const [settings, setSettings] = useState({ title: '', description: '', logo: '', favicon: '', language: 'sv' });
    const [adminSettings, setAdminSettings] = useState({ aiApiUrl: '' });
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await secureFetch('/api/settings');
                if (data.siteConfig) {
                    setSettings(data.siteConfig);
                }
                if (data.adminConfig) {
                    setAdminSettings(data.adminConfig);
                }
            } catch (error) {
                setMessage(`Kunde inte ladda inställningar: ${error.message}`);
            }
        };
        fetchSettings();
    }, []);

    const handleSettingsChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleAdminSettingsChange = (e) => {
        setAdminSettings({ ...adminSettings, [e.target.name]: e.target.value });
    };
    
    const handleLogoUpload = (url) => setSettings({ ...settings, logo: url });
    const handleFaviconUpload = (url) => setSettings({ ...settings, favicon: url });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await secureFetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // FIX: Use optional chaining here as well for safety
                body: JSON.stringify({ siteConfig: settings, newPassword, aiApiUrl: adminSettings?.aiApiUrl }),
            });
            setMessage('Inställningarna har sparats! Kom ihåg att bygga om webbplatsen.');
            setNewPassword('');
        } catch (error) {
            setMessage(`Fel: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
             <h3 className="text-xl font-semibold">Allmänna Inställningar</h3>
             <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Webbplatsens Språk</label>
                <select id="language" name="language" value={settings.language} onChange={handleSettingsChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="sv">Svenska</option>
                    <option value="en">English</option>
                </select>
            </div>
            <input name="title" value={settings.title || ''} onChange={handleSettingsChange} placeholder="Webbplatsens titel" className="w-full p-2 border rounded" />
            <textarea name="description" value={settings.description || ''} onChange={handleSettingsChange} placeholder="Webbplatsens SEO-beskrivning" className="w-full p-2 border rounded" rows="3"></textarea>
            
            <ImageUploader onUpload={handleLogoUpload} currentImageUrl={settings.logo} label="Logotyp"/>
            <ImageUploader onUpload={handleFaviconUpload} currentImageUrl={settings.favicon} label="Favicon"/>
            
              <div>
                <label htmlFor="aiApiUrl" className="block text-sm font-medium text-gray-700">AI Server API URL</label>
 <input type="url" name="aiApiUrl" id="aiApiUrl" value={adminSettings?.aiApiUrl || ''} onChange={handleAdminSettingsChange} className="mt-1 w-full p-2 border rounded" placeholder="https://your-ollama-server.com" />             </div>

             <h3 className="text-xl font-semibold mt-6 border-t pt-6">Ändra Lösenord</h3>
             <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nytt lösenord (lämna tomt för att inte ändra)" className="w-full p-2 border rounded" />
             
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Spara Inställningar</button>
            {message && <p className="text-center mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">{message}</p>}
        </form>
    );
};


// --- LoginForm Component ---
const LoginForm = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Felaktigt lösenord');
            }
            const { token } = await res.json();
            localStorage.setItem('admin-token', token);
            onLogin(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Inloggning</h1>
                <form onSubmit={handleSubmit}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord" className="w-full p-3 border border-gray-300 rounded-lg mb-4"/>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Logga in</button>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

// --- PageEditorForm Component ---
// (مكون جديد بالكامل)
const PageEditorForm = ({ t }) => {
    const secureFetch = useSecureFetch();
    const [allPages, setAllPages] = useState(null);
    const [selectedPageKey, setSelectedPageKey] = useState('about');
    const [currentPageContent, setCurrentPageContent] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const data = await secureFetch('/api/admin/pages');
                setAllPages(data);
                setCurrentPageContent(data[selectedPageKey]);
            } catch (error) {
                setMessage(`Kunde inte ladda sidinnehåll: ${error.message}`);
            }
        };
        fetchPageContent();
    }, []);

    useEffect(() => {
        if (allPages) {
            setCurrentPageContent(allPages[selectedPageKey]);
        }
    }, [selectedPageKey, allPages]);

    const handleContentChange = (e, lang, field) => {
        const { value } = e.target;
        setCurrentPageContent(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    const handleSimpleChange = (e, field) => {
        const { value } = e.target;
        setCurrentPageContent(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await secureFetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageKey: selectedPageKey, newContent: currentPageContent }),
            });
            setMessage('Sidan har uppdaterats! Kom ihåg att bygga om webbplatsen.');
        } catch (error) {
            setMessage(`Fel: ${error.message}`);
        }
    };

    if (!currentPageContent) {
        return <p>Laddar sidhanterare...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Redigera Sidans Innehåll</h3>
            
            <div>
                <label htmlFor="page-select" className="block text-sm font-medium text-gray-700">Välj Sida</label>
                <select
                    id="page-select"
                    value={selectedPageKey}
                    onChange={(e) => setSelectedPageKey(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {Object.keys(allPages).map(key => (
                        <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                    ))}
                </select>
            </div>

            {Object.entries(currentPageContent).map(([field, value]) => (
                <div key={field}>
                    <h4 className="font-semibold capitalize">{field.replace('_', ' ')}</h4>
                    {typeof value === 'object' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                           <textarea value={value.sv} onChange={e => handleContentChange(e, 'sv', field)} className="w-full p-2 border rounded" rows="5" placeholder="Svenska"/>
                           <textarea value={value.en} onChange={e => handleContentChange(e, 'en', field)} className="w-full p-2 border rounded" rows="5" placeholder="English"/>
                        </div>
                    ) : (
                        <input type="text" value={value} onChange={e => handleSimpleChange(e, field)} className="w-full p-2 border rounded mt-2"/>
                    )}
                </div>
            ))}
            
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Spara Sidans Innehåll</button>
            {message && <p className="text-center mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">{message}</p>}
        </form>
    );
};

// --- ManageRecipesTab Component ---
// (مكون جديد بالكامل)
    const ManageRecipesTab = ({ t, onEdit }) => {
        const secureFetch = useSecureFetch();
        const [recipes, setRecipes] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [expandedId, setExpandedId] = useState(null);
        
        // --- New State for Pagination ---
        const [currentPage, setCurrentPage] = useState(1);
        const recipesPerPage = 20; // يمكنك تغيير هذا الرقم

        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const data = await secureFetch('/api/recipes');
                setRecipes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchRecipes();
        }, []);

        const handleDelete = async (recipeId, recipeName) => {
            if (window.confirm(`Är du säker på att du vill ta bort receptet "${recipeName}"?`)) {
                try {
                    await secureFetch(`/api/recipes?id=${recipeId}`, { method: 'DELETE' });
                    fetchRecipes(); // Refresh list after delete
                } catch (err) {
                    alert(`Kunde inte ta bort recept: ${err.message}`);
                }
            }
        };

        // --- Pagination Logic ---
        const indexOfLastRecipe = currentPage * recipesPerPage;
        const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
        const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
        const totalPages = Math.ceil(recipes.length / recipesPerPage);

        const paginate = (pageNumber) => setCurrentPage(pageNumber);

        if (loading) return <p>Laddar recept...</p>;
        if (error) return <p className="text-red-500">Fel: {error}</p>;

        return (
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">Hantera Recept ({recipes.length} totalt)</h3>
                <div className="space-y-2">
                    {currentRecipes.map(recipe => (
                        <div key={recipe.id} className="border rounded-lg overflow-hidden">
                            <div className="p-3 bg-gray-50 flex justify-between items-center">
                                <span className="font-semibold">{recipe.name}</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => onEdit(recipe)} className="text-blue-600 hover:underline text-sm p-1 flex items-center gap-1"><PencilAltIcon className="h-4 w-4"/> Redigera</button>
                                    <button onClick={() => handleDelete(recipe.id, recipe.name)} className="text-red-600 hover:underline text-sm p-1 flex items-center gap-1"><TrashIcon className="h-4 w-4"/> Ta bort</button>
                                    <button onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}>
                                        {expandedId === recipe.id ? <ChevronUpIcon className="h-5 w-5"/> : <ChevronDownIcon className="h-5 w-5"/>}
                                    </button>
                                </div>
                            </div>
                            {expandedId === recipe.id && (
                                <div className="p-4 border-t text-sm text-gray-700">
                                    <p><strong>ID:</strong> {recipe.id}</p>
                                    <p><strong>Publicerad:</strong> {recipe.datePublished}</p>
                                    <p><strong>Kategori:</strong> {recipe.recipeCategory}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* --- Pagination UI --- */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center pt-4 border-t">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 flex items-center gap-2"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                            Föregående
                        </button>
                        <span className="text-sm font-semibold">
                            Sida {currentPage} av {totalPages}
                        </span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastRecipe >= recipes.length}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 flex items-center gap-2"
                        >
                            Nästa
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // --- AIToolsTab Component ---
const AIToolsTab = ({ t }) => {
    const secureFetch = useSecureFetch();
    const [keywords, setKeywords] = useState('');
    const [generationLog, setGenerationLog] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [allRecipeNames, setAllRecipeNames] = useState([]);
    const [aiApiUrl, setAiApiUrl] = useState('');
    
    const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
    const [currentKeyword, setCurrentKeyword] = useState('');

    useEffect(() => {
        const initialFetch = async () => {
            try {
                const recipesData = await secureFetch('/api/recipes');
                if (Array.isArray(recipesData)) {
                    setAllRecipeNames(recipesData.map(r => (r.name ? r.name.toLowerCase() : '')));
                }
                const settingsData = await secureFetch('/api/settings');
                const url = settingsData?.adminConfig?.aiApiUrl;
                if (!url) {
                    setError("AI API URL är inte konfigurerad. Gå till Inställningar.");
                } else {
                    setAiApiUrl(url);
                }
            } catch (err) {
                setError("Kunde inte ladda nödvändig data. Kontrollera API-inställningarna.");
            }
        };
        initialFetch();

        const savedLog = localStorage.getItem('aiGenerationLog');
        if (savedLog) {
            setGenerationLog(JSON.parse(savedLog));
        }
    }, []);

    const addToLog = (logEntry) => {
        setGenerationLog(prevLog => {
            const newLog = [logEntry, ...prevLog];
            localStorage.setItem('aiGenerationLog', JSON.stringify(newLog));
            return newLog;
        });
    };
    
    const handleClearLog = () => {
        if(window.confirm("Är du säker på att du vill rensa hela genereringsloggen?")) {
            setGenerationLog([]);
            localStorage.removeItem('aiGenerationLog');
        }
    };

    const processSingleKeyword = async (keyword) => {
        const simplifiedKeyword = keyword.toLowerCase().trim();
        const similarRecipe = allRecipeNames.find(name => name.includes(simplifiedKeyword));

        if (similarRecipe) {
            addToLog({ status: 'skipped', keywords: keyword, message: `Recept liknande detta finns redan.` });
            return; // Skip to the next keyword
        }

const systemPrompt = `
        You are a recipe creation API. You MUST respond with only a single, valid, minified JSON object. Do not include any text, explanations, or markdown formatting before or after the JSON object.
        Generate a complete recipe in Swedish based on the user's keyword EXAMPLE KEYWORD(silviakaka klassisk).
        The JSON object MUST have the following structure and data types:
        - id: string (lowercase, kebab-case, derived from keyword) (exmple: silviakaka-klassisk)
        - name: string (example: Silviakaka – Det Klassiska Receptet)
        - slug: string (same as id)
        - description: string (HTML allowed)
        - servings: string
        - prepTime: string (ISO 8601 format, e.g., "PT15M")
        - cookingTime: string (ISO 8601 format, e.g., "PT25M")
        - totalTime: string (ISO 8601 format, e.g., "PT40M")
        - recipeCategory: string
        - recipeCuisine: string
        - keywords: string (comma-separated)
        - datePublished: string (YYYY-MM-DD format) (we are at 06/2025)
        - ingredients: array of objects, each with { "unit": string, "amount": string, "product": string }
        - steps: array of objects, each with { "step": string, "image": [] }
        - image_alt: string (A descriptive alt text for the main image)
        - image_prompt: string (A detailed, photorealistic prompt for an AI image generator)
        - aggregateRating: object with { "@type": "AggregateRating", "ratingValue": "4.5", "ratingCount": "1" }
        - nutrition: object with { "@type": "NutritionInformation", "calories": "Cirka 350 kcal per portion" }

        All fields are required. Here is an example for a single ingredient: { "unit": "g", "amount": "100", "product": "mörk choklad" }.
        Do not add any fields that are not in this structure.
        THIS IS AN EXAMPLE ABOUT THIS KEYWORD (silviakaka) BUT YOU WILL ADD PROMPT AND EXTRA OPTIONS:
        {
    "id": "silviakaka-klassisk",
    "name": "Silviakaka – Det Klassiska Receptet",
    "slug": "silviakaka",
    "image": [
      {
        "id": "silviakaka-main-image",
        "url": "/images/recipes/silviakaka-klassisk.jpg",
        "extension": "jpg",
        "width": 1200,
        "height": 800,
        "alt": "Klassisk Silviakaka med gyllene glasyr och rikligt med kokos"
      }
    ],
    "steps": [
      {
        "step": "Sätt ugnen på 175°C (varmluft) eller 200°C (över-/undervärme). Smörj och bröa en långpanna, cirka 30x40 cm.",
        "image": []
      },
      {
        "step": "Vispa ägg och socker ljust och pösigt med elvisp.",
        "image": []
      },
      {
        "step": "Blanda vetemjöl och bakpulver i en separat skål. Vänd försiktigt ner mjölblandningen i äggsmeten.",
        "image": []
      },
      {
        "step": "Tillsätt det smälta smöret (eller oljan) och vattnet. Rör om tills smeten är jämn.",
        "image": []
      },
      {
        "step": "Häll smeten i långpannan och grädda i nedre delen av ugnen i cirka 15-20 minuter, eller tills kakan är gyllenbrun och en provsticka kommer ut torr.",
        "image": []
      },
      {
        "step": "Låt kakan svalna helt i formen innan du brer på glasyren.",
        "image": []
      },
      {
        "step": "Glasyr: Smält smöret i en kastrull. Ta kastrullen från värmen och rör ner florsocker, vaniljsocker och äggula. Vispa tills glasyren är slät och blank.",
        "image": []
      },
      {
        "step": "Bred glasyren jämnt över den kalla kakan. Strö över rikligt med kokosflingor.",
        "image": []
      },
      {
        "step": "Låt glasyren stelna något innan du skär kakan i bitar.",
        "image": []
      }
    ],
    "servings": "Ca 24 bitar (1 långpanna)",
    "cookingTime": "PT20M",
    "prepTime": "PT20M",
    "totalTime": "PT40M",
    "description": "Upptäck det klassiska receptet på Silviakaka, en älskad svensk mjuk kaka perfekt för fika och kalas. Detta enkla Silviakaka recept ger en underbart saftig vaniljbotten toppad med en krämig smörglasyr och rikligt med kokos. Lär dig baka denna favorit som ofta görs i långpanna och garanterat blir en succé. Vårt recept silviakaka är lätt att följa och ger en saftig silviakaka med den ikoniska silviakaka glasyr som alla älskar. Perfekt för både nybörjare och erfarna bagare.",
    "recipeCategory": "Mjuk kaka, Långpannekaka, Fika",
    "recipeCuisine": "Svensk",
    "keywords": "silviakaka, silviakaka recept, recept silviakaka, saftig silviakaka, silviakaka glasyr, långpanna",
    "datePublished": "2025-05-28",
    "ingredients": [
      {
        "unit": "",
        "amount": null,
        "product": "Kaka:"
      },
      {
        "unit": "st",
        "amount": 3,
        "product": "stora ägg"
      },
      {
        "unit": "dl",
        "amount": 3,
        "product": "strösocker"
      },
      {
        "unit": "dl",
        "amount": 3,
        "product": "vetemjöl"
      },
      {
        "unit": "tsk",
        "amount": 2,
        "product": "bakpulver"
      },
      {
        "unit": "tsk",
        "amount": 1,
        "product": "vaniljsocker"
      },
      {
        "unit": "dl",
        "amount": 1.5,
        "product": "kallt vatten"
      },
      {
        "unit": "g",
        "amount": 100,
        "product": "smör (smält och avsvalnat) eller 1 dl neutral olja"
      },
      {
        "unit": "",
        "amount": null,
        "product": "Glasyr:"
      },
      {
        "unit": "g",
        "amount": 150,
        "product": "smör"
      },
      {
        "unit": "dl",
        "amount": 2,
        "product": "florsocker"
      },
      {
        "unit": "msk",
        "amount": 2,
        "product": "vaniljsocker"
      },
      {
        "unit": "st",
        "amount": 1,
        "product": "äggula"
      },
      {
        "unit": "",
        "amount": null,
        "product": "Topping:"
      },
      {
        "unit": "dl",
        "amount": 2,
        "product": "kokosflingor (eller mer efter smak)"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "15"
    },
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": "Cirka 250 kcal per bit"
    }
  }
        `; 
        
       const messages = [
            { role: 'system', content: systemPrompt.replace(/\s+/g, ' ').trim() },
            { role: 'user', content: keyword }
        ];

        const MAX_RETRIES = 2; // Total attempts: initial + 1 retry
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                addToLog({ status: 'processing', keywords: keyword, message: `Genererar (försök ${attempt} av ${MAX_RETRIES})...` });

                const generatedRecipe = await secureFetch('/api/admin/generate-ollama-recipe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages, aiApiUrl }),
                });

                if (!generatedRecipe || typeof generatedRecipe.name !== 'string' || !generatedRecipe.name) {
                    throw new Error("AI-modellen returnerade ett ogiltigt format.");
                }

                generatedRecipe.image = [{
                    id: `ai-img-${Date.now()}`,
                    url: '/images/placeholder.jpg',
                    alt: generatedRecipe.image_alt || generatedRecipe.name,
                    imagePrompt: generatedRecipe.image_prompt || 'No prompt generated'
                }];
                
                await secureFetch('/api/recipes', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(generatedRecipe),
                });
                
                addToLog({ status: 'success', keywords: keyword, recipeName: generatedRecipe.name, imagePrompt: generatedRecipe.image[0].imagePrompt });
                setAllRecipeNames(prev => [...prev, generatedRecipe.name.toLowerCase()]);
                return; // Success! Exit the retry loop.

            } catch (err) {
                if (attempt === MAX_RETRIES) {
                    addToLog({ status: 'error', keywords: keyword, message: `Misslyckades efter ${MAX_RETRIES} försök: ${err.message}` });
                } else {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
                }
            }
        }
    };

    const handleStartGeneration = async () => {
        const keywordsList = keywords.split('\n').map(k => k.trim()).filter(k => k.length > 0);
        if (keywordsList.length === 0) {
            setError('Ange minst ett nyckelord.');
            return;
        }

        setIsProcessing(true);
        setError('');
        setBatchProgress({ current: 0, total: keywordsList.length });
        addToLog({ status: 'info', message: `Startar batch-process för ${keywordsList.length} recept...` });

        for (const [index, keyword] of keywordsList.entries()) {
            setCurrentKeyword(keyword);
            setBatchProgress(prev => ({ ...prev, current: index + 1 }));
            await processSingleKeyword(keyword);
        }

        setIsProcessing(false);
        setCurrentKeyword('');
        addToLog({ status: 'info', message: "Batch-generering slutförd." });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                 <h3 className="text-xl font-semibold">AI Receptgenerator (Batch-läge)</h3>
                 <div>
                     <label className="block text-sm font-medium">Nyckelord (ett per rad)</label>
                    <textarea value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="t.ex. saftig morotskaka med frosting&#10;kladdkaka med lakrits" className="w-full p-2 border rounded mt-1 h-32"/>
                </div>
                <button onClick={handleStartGeneration} disabled={isProcessing} className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center gap-2">
                    {isProcessing 
                        ? `Bearbetar (${batchProgress.current}/${batchProgress.total}): "${currentKeyword}"...`
                        : <><SparklesIcon className="h-5 w-5"/> Starta Generering</>
                    }
                </button>
                <div className="h-6 mt-2">
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Genereringslogg</h3>
                    <button onClick={handleClearLog} disabled={generationLog.length === 0} className="text-sm text-red-600 hover:underline disabled:text-gray-400">Rensa Logg</button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto border p-3 rounded-md bg-gray-50">
                    {generationLog.length === 0 ? (
                        <p className="text-gray-500">Inga recept har genererats ännu.</p>
                    ) : (
                        generationLog.map((log, index) => (
                           <div key={index} className={`p-3 rounded-md border-l-4 ${log.status === 'success' ? 'border-green-500 bg-green-50' : log.status === 'skipped' ? 'border-yellow-500 bg-yellow-50' : 'border-red-500 bg-red-50'}`}>
                               <p><strong>Status:</strong> <span className="capitalize">{log.status}</span></p>
                               <p><strong>Nyckelord:</strong> "{log.keywords}"</p>
                               {log.recipeName && <p><strong>Resultat:</strong> {log.recipeName}</p>}
                               {log.message && <p><strong>Info:</strong> {log.message}</p>}
                               {log.imagePrompt && (
                                    <div className="mt-2 text-sm">
                                        <p className="font-semibold">Bildprompt:</p>
                                        <p className="text-gray-600 p-2 bg-gray-100 rounded">{log.imagePrompt}</p>
                                    </div>
                               )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};



// --- AdminDashboard Component ---
const AdminDashboard = ({ t }) => {
    const [activeTab, setActiveTab] = useState('manage-recipes');
    const [recipeToEdit, setRecipeToEdit] = useState(null);

    const handleEditRecipe = (recipe) => {
        setRecipeToEdit(recipe);
        setActiveTab('add-edit-recipe');
    };
    
    const handleSave = () => {
        setRecipeToEdit(null); // Rensa formuläret efter sparande
        setActiveTab('manage-recipes'); // Gå tillbaka till listan
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'manage-recipes': return <ManageRecipesTab t={t} onEdit={handleEditRecipe} />;
            case 'add-edit-recipe': return <RecipeForm t={t} initialData={recipeToEdit} onSave={handleSave} />;
            case 'pages': return <PageEditorForm t={t} />;
            case 'settings': return <SettingsForm t={t} />;
            case 'ai-tools': return <AIToolsTab t={t} onRecipeGenerated={handleEditRecipe} setActiveTab={setActiveTab} />;
            default: return null;
        }
    };

    const TabButton = ({ tabName, icon: Icon, children }) => (
        <button onClick={() => { setRecipeToEdit(null); setActiveTab(tabName); }} className={`flex items-center gap-2 py-3 px-4 rounded-t-lg transition-colors border-b-2 ${activeTab === tabName ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:text-blue-600'}`}>
            <Icon className="h-5 w-5" />
            {children}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100">
             <header className="bg-white shadow-sm">
                {/* ... Header UI ... */}
             </header>
             <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex border-b border-gray-200 flex-wrap">
                     <TabButton tabName="manage-recipes" icon={BookOpenIcon}>Hantera Recept</TabButton>
                     <TabButton tabName="add-edit-recipe" icon={PlusIcon}>Lägg till / Redigera</TabButton>
                     <TabButton tabName="pages" icon={DocumentTextIcon}>Sidhantering</TabButton>
                     <TabButton tabName="settings" icon={CogIcon}>{t('settings')}</TabButton>
                     <TabButton tabName="ai-tools" icon={SparklesIcon}>{t('ai_tools')}</TabButton>
                </div>
                <div className="mt-6">
                    {renderTabContent()}
                </div>
             </main>
        </div>
    );
};
// --- Main Admin Page Component ---
const AdminPage = ({ translations }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

     useEffect(() => {
        setHasMounted(true); // Mark that we are now on the client
        const token = localStorage.getItem('admin-token');
        if (token) {
            // In a real app, you'd verify the token with an API call here
            setIsLoggedIn(true);
        }
    }, []);

    const { t } = useTranslation();
if (!hasMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }
    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
                <title>Admin Panel</title>
            </Head>
            {isLoggedIn ? <AdminDashboard t={t} /> : <LoginForm onLogin={setIsLoggedIn} />}
        </>
    );
};

// We need getStaticProps here to pass translations to the page component
import { getTranslations } from '../lib/translations';

export async function getStaticProps() {
    const { translations } = await getTranslations();
    return {
        props: {
            translations,
        },
    };
}


export default AdminPage;
