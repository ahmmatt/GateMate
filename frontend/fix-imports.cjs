const fs = require('fs');
const path = require('path');
const dir = './src/pages/public';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/from '\.\.\/lib/g, "from '../../lib");
    content = content.replace(/from '\.\.\/store/g, "from '../../store");
    content = content.replace(/from '\.\.\/components/g, "from '../../components");
    content = content.replace(/from "\.\.\/lib/g, 'from "../../lib');
    content = content.replace(/from "\.\.\/store/g, 'from "../../store');
    content = content.replace(/from "\.\.\/components/g, 'from "../../components');
    fs.writeFileSync(filePath, content);
  }
}
