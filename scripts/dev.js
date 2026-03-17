/**
 * Dev Startup Script
 * ------------------
 * Xóa biến ELECTRON_RUN_AS_NODE trước khi chạy electron-vite.
 * 
 * Trên một số hệ thống (như khi chạy trong IDE), biến môi trường
 * ELECTRON_RUN_AS_NODE=1 được set sẵn, khiến Electron chạy như
 * Node.js thay vì desktop app.
 */

// Xóa ELECTRON_RUN_AS_NODE
delete process.env.ELECTRON_RUN_AS_NODE;

const { execSync } = require('child_process');

// Lấy command args (dev, build, preview)
const args = process.argv.slice(2);
if (args.length === 0) {
  args.push('dev');
}

console.log(`Starting electron-vite ${args.join(' ')}...`);
console.log('ELECTRON_RUN_AS_NODE cleared from environment.\n');

try {
  execSync(`npx electron-vite ${args.join(' ')}`, {
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname.replace(/[\\\/]scripts$/, '')
  });
} catch (err) {
  // execSync throws on non-zero exit code
  process.exit(err.status || 1);
}
