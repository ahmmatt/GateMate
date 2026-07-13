const fs = require('fs');
const path = require('path');
const dir = 'src/pages/organizer';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => path.join(dir, f));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Remove w-full from <main> to prevent horizontal scrollbar on md:ml-[240px]
  content = content.replace(/(<main[^>]*className=\"[^\"]*)\bw-full\b([^\"]*\")/g, '$1flex-1$2');
  
  // Clean up any double spaces inside className
  content = content.replace(/className=\"(.*?)\s\s+(.*?)\"/g, 'className=\"$1 $2\"');
  
  fs.writeFileSync(f, content);
});

console.log('Fixed w-full horizontal scrollbar issue on all pages');
