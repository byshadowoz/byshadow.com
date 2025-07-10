const fs = require('fs');
const path = require('path');
const https = require('https');
const tar = require('tar');

console.log('🚀 Starting Hugo installation...');

const HUGO_VERSION = '0.92.2';
const HUGO_URL = `https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz`;
const HUGO_PATH = path.join(__dirname, '../hugo.tar.gz');

// Download Hugo
https.get(HUGO_URL, (response) => {
  const file = fs.createWriteStream(HUGO_PATH);
  response.pipe(file);
  
  file.on('finish', () => {
    file.close(() => {
      console.log('✅ Hugo downloaded successfully');
      
      // Extract to node_modules/.bin
      const extractPath = path.join(__dirname, '../node_modules/.bin');
      if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath, { recursive: true });
      }
      
      tar.x({
        file: HUGO_PATH,
        cwd: extractPath
      }).then(() => {
        console.log('✅ Hugo extracted to node_modules/.bin');
        
        // Make executable
        const hugoBin = path.join(extractPath, 'hugo');
        fs.chmodSync(hugoBin, 0o755);
        console.log('✅ Hugo made executable');
        
        // Add to PATH
        process.env.PATH = `${extractPath}:${process.env.PATH}`;
        fs.appendFileSync('.env', `PATH=${process.env.PATH}\n`);
        
        // Verify installation
        const { execSync } = require('child_process');
        const version = execSync(`${hugoBin} version`).toString();
        console.log(`🎉 Hugo installed: ${version}`);
        
        // Cleanup
        fs.unlinkSync(HUGO_PATH);
      }).catch(err => {
        console.error('❌ Extraction failed:', err);
        process.exit(1);
      });
    });
  });
}).on('error', (err) => {
  console.error('❌ Download failed:', err.message);
  process.exit(1);
});