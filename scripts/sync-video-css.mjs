import {readFileSync,writeFileSync} from 'node:fs';
writeFileSync('video/product.css',readFileSync('src/app/globals.css','utf8').replace("@import 'tailwindcss';",'').replace("url('/fonts/Inter.ttf')","url('../public/fonts/Inter.ttf')"));
