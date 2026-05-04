const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

const STATIC_ASSETS_ROOT = path.resolve(__dirname, '..', '..', 'static', 'assets');
const MAPPING_FILE = path.join(__dirname, 'static_media_mapping.json');

const getFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.webp', '.png', '.jpg', '.jpeg', '.pdf', '.svg', '.gif'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
};

const uploadFiles = async () => {
  let files = getFiles(STATIC_ASSETS_ROOT);
  
  // Prioritize critical folders
  files.sort((a, b) => {
    const isAPrio = a.includes('main\\img') || a.includes('main\\RoadX_Products_Broucher.pdf');
    const isBPrio = b.includes('main\\img') || b.includes('main\\RoadX_Products_Broucher.pdf');
    if (isAPrio && !isBPrio) return -1;
    if (!isAPrio && isBPrio) return 1;
    return 0;
  });

  const mapping = {};

  if (fs.existsSync(MAPPING_FILE)) {
    Object.assign(mapping, JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8')));
  }

  console.log(`Found ${files.length} static assets. Starting upload...`);

  for (const file of files) {
    const relPath = path.relative(STATIC_ASSETS_ROOT, file).replace(/\\/g, '/');
    const staticPath = `/static/assets/${relPath}`;

    if (mapping[staticPath]) {
      console.log(`[SKIPPING] Already uploaded: ${staticPath}`);
      continue;
    }

    console.log(`[UPLOADING] ${staticPath}`);
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: `roadx/static/${path.dirname(relPath)}`,
        use_filename: true,
        unique_filename: false,
        resource_type: relPath.endsWith('.pdf') ? 'raw' : 'image'
      });
      mapping[staticPath] = result.secure_url;
      fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
      console.log(`  ✅ ${result.secure_url}`);
    } catch (err) {
      console.error(`  ❌ FAILED: ${staticPath}`, err.message);
    }
  }

  console.log('Upload complete. Mapping saved to static_media_mapping.json');
};

uploadFiles();
