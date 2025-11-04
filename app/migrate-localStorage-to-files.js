// Quick migration script to copy variables from localStorage to file storage
const fs = require('fs');
const path = require('path');

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'variables');

async function migrateFromLocalStorage() {
  // Since this runs server-side, we need to check what's in the actual files
  // The localStorage data would be in the browser
  
  console.log('=== Variable Migration Tool ===');
  console.log('\nNote: This runs on the server side, so we can only access file storage.');
  console.log('If you have variables in localStorage that aren\'t showing up:');
  console.log('\n1. Open your browser console');
  console.log('2. Copy the localStorage data for that variable type');
  console.log('3. Use this curl command to save it to file storage:\n');
  console.log('curl -X POST http://localhost:3000/api/variables/files \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"type": "product", "data": { /* your variable data */ }}\'\n');
  
  console.log('Or simply recreate the variable - it will now save correctly!\n');
}

migrateFromLocalStorage();
