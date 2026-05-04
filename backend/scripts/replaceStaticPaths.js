const fs = require('fs');
const path = require('path');

const FRONTEND_ROOT = path.resolve(__dirname, '..', '..', 'frontend', 'src');
const MAPPING_FILE = path.join(__dirname, 'static_media_mapping.json');

if (!fs.existsSync(MAPPING_FILE)) {
  console.error('Mapping file not found!');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
const localPaths = Object.keys(mapping).sort((a, b) => b.length - a.length); // Sort longest first to avoid partial replacements

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  localPaths.forEach(localPath => {
    if (content.includes(localPath)) {
      console.log(`  Replacing ${localPath} in ${path.relative(FRONTEND_ROOT, filePath)}`);
      content = content.split(localPath).join(mapping[localPath]);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
};

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (['.jsx', '.js', '.css', '.scss'].includes(path.extname(file))) {
      processFile(filePath);
    }
  });
};

console.log('Starting replacement of static paths in frontend...');
walk(FRONTEND_ROOT);
console.log('Replacement complete.');
