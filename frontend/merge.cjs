const fs = require('fs');

const userMessage = fs.readFileSync('extracted_code.txt', 'utf8');
const lines = userMessage.split('\n');

// Find where the code block starts
let startIdx = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('import { useState, useEffect }')) {
        startIdx = i;
        break;
    }
}

let codeSnippet = lines.slice(startIdx).join('\n');

// It ends exactly at className="w-full px-4 py-2 bg-surface-container-
let splitStr = 'className="w-full px-4 py-2 bg-surface-container-';
let indexInSnippet = codeSnippet.lastIndexOf(splitStr);

if (indexInSnippet === -1) {
    console.log("Could not find split string in snippet!");
    process.exit(1);
}

let userCodeTop = codeSnippet.substring(0, indexInSnippet + splitStr.length);

const originalCode = fs.readFileSync('src/pages/organizer/AdminEventShowPage.jsx', 'utf8');
let indexInOriginal = originalCode.indexOf(splitStr);

if (indexInOriginal === -1) {
    console.log('Could not find split point in original code! Trying fallback...');
    // fallback, let's search for just the input placeholder
    let fallbackStr = 'placeholder="Misal: VIP, Regular"';
    indexInOriginal = originalCode.indexOf(fallbackStr);
    if (indexInOriginal !== -1) {
        // Find the start of the className line
        let classIndex = originalCode.lastIndexOf('className="', indexInOriginal);
        userCodeTop = codeSnippet.substring(0, codeSnippet.lastIndexOf('className="'));
        indexInOriginal = classIndex;
    } else {
        console.log('Fallback failed too.');
        process.exit(1);
    }
}

let newCode = userCodeTop + originalCode.substring(indexInOriginal + splitStr.length);

// Also let's clean up any weird artifacts at the end of userCodeTop if it was truncated weirdly.
// Not needed if we used exact split string match

fs.writeFileSync('src/pages/organizer/AdminEventShowPage.jsx', newCode);
console.log('Successfully merged user code with the original code bottom half!');
