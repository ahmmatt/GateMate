const fs = require('fs');

function removeSections() {
  // Settings Page
  const settingsFile = 'src/pages/organizer/AdminSettingsPage.jsx';
  let settings = fs.readFileSync(settingsFile, 'utf8');
  
  // Remove Informasi Rekening
  settings = settings.replace(/\{\/\*\s*Informasi Rekening\s*\*\/\}\s*<section[\s\S]*?<\/section>/g, '');
  
  // Remove Help Card
  settings = settings.replace(/\{\/\*\s*Help Card\s*\*\/\}\s*<div[^>]*>[\s\S]*?arrow_forward<\/span>\s*<\/a>\s*<\/div>/g, '');
  
  fs.writeFileSync(settingsFile, settings);
  console.log('Cleaned AdminSettingsPage');

  // Finance Page
  const financeFile = 'src/pages/organizer/AdminFinancePage.jsx';
  let finance = fs.readFileSync(financeFile, 'utf8');
  
  // Remove Withdrawal Methods & Statistics
  finance = finance.replace(/\{\/\*\s*Withdrawal Methods & Statistics\s*\*\/\}\s*<div className=\"grid[\s\S]*?blur-xl\"><\/div>\s*<\/div>\s*<\/div>/g, '');
  
  fs.writeFileSync(financeFile, finance);
  console.log('Cleaned AdminFinancePage');
}

removeSections();
