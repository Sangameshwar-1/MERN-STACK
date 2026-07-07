const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
};

const processFile = (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('\\`')) {
    content = content.replace(/\\`/g, '\`');
    fs.writeFileSync(filePath, content);
    console.log("Fixed backticks in: " + filePath);
  }
};

walkDir(path.join(__dirname, 'frontend/src'), processFile);
console.log('Backtick cleanup complete.');
