import { build } from "esbuild";
await build({ entryPoints: ["src/native.js"], bundle: true, format: "iife", minify: true, target: "es2020", outfile: "www/native.js" });
console.log("native.js listo");
