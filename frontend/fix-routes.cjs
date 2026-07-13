const fs = require('fs');
const path = require('path');

const dir = 'src/pages/organizer';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => path.join(dir, f));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/to="\/admin\/dashboard"/g, 'to="/organizer/dashboard"');
  content = content.replace(/to="\/admin\/events/g, 'to="/organizer/events');
  content = content.replace(/to=\{\`\/admin\/events/g, 'to={`/organizer/events');
  content = content.replace(/to="\/admin\/scanner"/g, 'to="/organizer/check-in"');
  content = content.replace(/to="\/admin\/finance"/g, 'to="/organizer/finance"');
  content = content.replace(/to="\/admin\/settings"/g, 'to="/organizer/settings"');
  
  content = content.replace(/navigate\('\/admin\/events/g, 'navigate(\'/organizer/events');
  content = content.replace(/navigate\(\`\/admin\/events/g, 'navigate(\`/organizer/events');
  content = content.replace(/navigate\('\/admin\/dashboard/g, 'navigate(\'/organizer/dashboard');
  
  fs.writeFileSync(f, content);
});
console.log('Replaced successfully');
