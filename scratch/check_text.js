const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}

const files = walk('d:/code/turbin-web/src');
let whiteTextClasses = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const classMatches = content.match(/className=(?:\"([^\"]*)\"|\'([^\']*)\'|\{`([^`]*)`\})/g);
  if (classMatches) {
    classMatches.forEach(m => {
      if (m.includes('text-white') && !m.includes('bg-blue') && !m.includes('bg-red') && !m.includes('bg-green')) {
        whiteTextClasses.push(m);
      }
    });
  }
});
console.log([...new Set(whiteTextClasses)].slice(0, 30));
