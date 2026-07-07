const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
};

const regexEmojis = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;

const processFile = (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (regexEmojis.test(content)) {
    content = content.replace(regexEmojis, '');
    modified = true;
  }

  const replacements = {
    'btn-primary': 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200/90 h-9 px-4 py-2',
    'btn-secondary': 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80 h-9 px-4 py-2',
    'btn-ghost': 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-800 hover:text-zinc-50 h-9 px-4 py-2',
    'card glass-panel': 'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow p-6',
    'card': 'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow p-6',
    'glass-panel': 'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow p-6',
    'status-badge': 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-100/80',
    'empty-state': 'flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 p-8 text-center animate-in fade-in-50',
    'table-responsive': 'w-full overflow-auto rounded-md border border-zinc-800',
    'data-table': 'w-full caption-bottom text-sm',
    'main-content': 'w-full max-w-7xl mx-auto px-4 md:px-8 py-8',
    'dashboard-header': 'flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-800',
    'event-card': 'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow',
    'event-card-header': 'p-6 border-b border-zinc-800',
    'event-card-body': 'p-6',
    'event-card-footer': 'p-6 border-t border-zinc-800',
    'event-name': 'font-semibold leading-none tracking-tight text-xl',
    'event-description': 'text-sm text-zinc-400'
  };

  for (const [oldClass, newClass] of Object.entries(replacements)) {
    const regex = new RegExp('\\b' + oldClass + '\\b', 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newClass);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log("Cleaned: " + filePath);
  }
};

walkDir(path.join(__dirname, 'frontend/src/pages'), processFile);
console.log('Cleanup complete.');
