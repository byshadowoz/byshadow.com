const { execSync } = require('child_process');
const fs = require('fs');

console.log('Installing Hugo v0.92.2 extended...');

try {
  // Download and extract Hugo
  execSync('wget -q https://github.com/gohugoio/hugo/releases/download/v0.92.2/hugo_extended_0.92.2_Linux-64bit.tar.gz -O hugo.tar.gz');
  execSync('tar -xzf hugo.tar.gz');
  execSync('chmod +x hugo');
  
  // Verify installation
  const version = execSync('./hugo version').toString();
  console.log(`Hugo installed successfully: ${version}`);
  
  // Cleanup
  fs.unlinkSync('hugo.tar.gz');
} catch (error) {
  console.error('Hugo installation failed:');
  console.error(error.message);
  process.exit(1);
}