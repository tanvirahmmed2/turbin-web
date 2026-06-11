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

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;
  
  // Strip dark: classes to clean up
  content = content.replace(/dark:[a-zA-Z0-9\-\/\[\]#]+/g, '');
  
  // Clean up double spaces from previous removals
  content = content.replace(/className=(?:\"([^\"]*)\"|\'([^\']*)\'|\{`([^`]*)`\})/g, (match, p1, p2, p3) => {
    let classes = p1 || p2 || p3;
    let quote = match.startsWith('className="') ? '"' : (match.startsWith("className='") ? "'" : '`');
    let prefix = match.startsWith('className={`') ? 'className={`' : `className=${quote}`;
    let suffix = match.startsWith('className={`') ? '`}' : quote;

    if (!classes) return match;

    // Split into individual classes
    let classArr = classes.split(/\s+/).filter(Boolean);
    
    // Check if it's a solid colored button/element
    const hasSolidBg = classArr.some(c => 
      c.startsWith('bg-blue') || 
      c.startsWith('bg-red') || 
      c.startsWith('bg-green') || 
      c.startsWith('from-') || 
      c === 'bg-black' || 
      c.startsWith('bg-[#00')
    );

    let newClasses = classArr.map(c => {
      if (c === 'text-white' && !hasSolidBg) return 'text-gray-900';
      if (c === 'text-gray-400') return 'text-gray-600';
      if (c === 'text-gray-300') return 'text-gray-700';
      if (c === 'border-[#222]' || c === 'border-gray-800' || c === 'border-gray-700') return 'border-gray-200';
      if (c === 'divide-[#222]' || c === 'divide-gray-800') return 'divide-gray-200';
      if (c === 'bg-[#222]') return 'bg-white';
      return c;
    });
    
    // Ensure 'bg-white' is added to main bordered containers if missing
    // if it's rounded and bordered but has no bg
    const hasBorder = newClasses.some(c => c.startsWith('border'));
    const hasRounded = newClasses.some(c => c.startsWith('rounded'));
    const hasBg = newClasses.some(c => c.startsWith('bg-'));
    if (hasBorder && hasRounded && !hasBg) {
      newClasses.push('bg-white');
    }

    return `${prefix}${newClasses.join(' ')}${suffix}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated: ' + f);
  }
});
