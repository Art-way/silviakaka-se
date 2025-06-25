import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parser for this route
export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd(), 'public', 'images', 'recipes');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const verifyToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    return token === 'fake-secure-token';
};

export default async function handler(req, res) {
    if (!verifyToken(req)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // --- THIS IS THE FIX ---
    // Using the modern formidable v3+ API.
    // We call formidable() directly to create the form instance.
    const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        filename: (name, ext, part) => {
            // Sanitize filename and make it unique
            const sanitizedName = part.originalFilename.replace(/\s+/g, '_');
            return `${Date.now()}_${sanitizedName}`;
        }
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: 'Error parsing the file upload.' });
        }

        // 'file' is the name of the field in the FormData from the client.
        // formidable v3+ returns an array for files, so we take the first element.
        const file = files.file?.[0]; 

        if (!file) {
            return res.status(400).json({ error: "No file uploaded. Make sure the form field name is 'file'." });
        }

        // The file is already saved to the uploadDir by formidable.
        // We just need to construct the public path to return to the client.
        const publicPath = `/images/recipes/${path.basename(file.filepath)}`;
        
        res.status(200).json({ url: publicPath });
    });
}
