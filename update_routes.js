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
  let modified = false;

  // Replace navigate('/dashboard') and to="/dashboard"
  if (content.includes("navigate('/dashboard')")) {
    content = content.replace(/navigate\('\/dashboard'\)/g, "navigate('/participant')");
    modified = true;
  }
  if (content.includes('navigate("/dashboard")')) {
    content = content.replace(/navigate\("\/dashboard"\)/g, 'navigate("/participant")');
    modified = true;
  }
  if (content.includes('to="/dashboard"')) {
    content = content.replace(/to="\/dashboard"/g, 'to="/participant"');
    modified = true;
  }
  if (content.includes("to='/dashboard'")) {
    content = content.replace(/to='\/dashboard'/g, "to='/participant'");
    modified = true;
  }

  // Replace navigate('/events') and to="/events"
  if (content.includes("navigate('/events')")) {
    content = content.replace(/navigate\('\/events'\)/g, "navigate('/participant/events')");
    modified = true;
  }
  if (content.includes('navigate("/events")')) {
    content = content.replace(/navigate\("\/events"\)/g, 'navigate("/participant/events")');
    modified = true;
  }
  if (content.includes('to="/events"')) {
    content = content.replace(/to="\/events"/g, 'to="/participant/events"');
    modified = true;
  }
  if (content.includes("to='/events'")) {
    content = content.replace(/to='\/events'/g, "to='/participant/events'");
    modified = true;
  }
  
  // Replace window.location.href = '/dashboard'
  if (content.includes("window.location.href = '/dashboard'")) {
    content = content.replace(/window\.location\.href = '\/dashboard'/g, "window.location.href = '/participant'");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log("Updated routes in: " + filePath);
  }
};

walkDir(path.join(__dirname, 'frontend/src'), processFile);
console.log('Route update complete.');
