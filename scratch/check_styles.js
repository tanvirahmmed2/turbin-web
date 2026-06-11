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
let issues = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const classMatches = content.match(/className=(?:\"([^\"]*)\"|\'([^\']*)\'|\{`([^`]*)`\})/g);
  if (classMatches) {
    classMatches.forEach(m => {
      if (m.includes('  ')) {
        issues.push({file: f, issue: 'Double space (removed class)', match: m});
      }
      if (m.includes('bg-white') && !m.includes('dark:bg-')) {
        issues.push({file: f, issue: 'bg-white without dark:bg', match: m});
      }
      if (m.includes('border') && m.includes('rounded') && !m.includes('bg-') && !m.includes('transparent')) {
        issues.push({file: f, issue: 'Bordered/rounded without bg', match: m});
      }
    });
  }
});

// remove duplicate files to just get a list of affected files
const affectedFiles = [...new Set(issues.map(i => i.file))];
console.log('Total affected files:', affectedFiles.length);
console.log(affectedFiles);
