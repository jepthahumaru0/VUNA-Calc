import { rmSync, mkdirSync, cpSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
mkdirSync('dist/src', { recursive: true });
mkdirSync('dist/calc', { recursive: true });
mkdirSync('dist/calc/src', { recursive: true });

// Homepage
cpSync('index.html', 'dist/index.html');

// Calculator (at /calc)
cpSync('calc/index.html',        'dist/calc/index.html');
cpSync('src/calculator.js',      'dist/src/calculator.js');
cpSync('src/style.css',          'dist/src/style.css');
cpSync('src/ui.js',              'dist/src/ui.js');
cpSync('src/calculator.js',      'dist/calc/src/calculator.js');
cpSync('src/style.css',          'dist/calc/src/style.css');
cpSync('src/ui.js',              'dist/calc/src/ui.js');

console.log('Build complete -> dist/');
