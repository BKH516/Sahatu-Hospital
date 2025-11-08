const fs = require('fs');
const path = require('path');

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValue(obj, keyPath) {
  const keys = keyPath.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

try {
  const enPath = path.join(__dirname, 'locales', 'en.json');
  const arPath = path.join(__dirname, 'locales', 'ar.json');
  
  const enContent = fs.readFileSync(enPath, 'utf8');
  const arContent = fs.readFileSync(arPath, 'utf8');
  
  const en = JSON.parse(enContent);
  const ar = JSON.parse(arContent);
  
  const enKeys = getAllKeys(en);
  const arKeys = getAllKeys(ar);
  
  const missingInAr = enKeys.filter(key => !arKeys.includes(key));
  const missingInEn = arKeys.filter(key => !enKeys.includes(key));
  
  console.log('=== Translation Check Report ===\n');
  console.log(`Total keys in en.json: ${enKeys.length}`);
  console.log(`Total keys in ar.json: ${arKeys.length}\n`);
  
  if (missingInAr.length > 0) {
    console.log(`❌ Missing in ar.json (${missingInAr.length}):`);
    missingInAr.forEach(key => {
      console.log(`  - ${key}`);
    });
    console.log('');
  }
  
  if (missingInEn.length > 0) {
    console.log(`❌ Missing in en.json (${missingInEn.length}):`);
    missingInEn.forEach(key => {
      console.log(`  - ${key}`);
    });
    console.log('');
  }
  
  if (missingInAr.length === 0 && missingInEn.length === 0) {
    console.log('✅ All translation keys match!');
  } else {
    console.log(`\n⚠️  Found ${missingInAr.length + missingInEn.length} mismatch(es)`);
    process.exit(1);
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}











