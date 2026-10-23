import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const distRoot = path.join(projectRoot, "dist");
const serverDir = path.join(distRoot, "server");
const openaiDir = path.join(distRoot, ".openai");

fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(openaiDir, { recursive: true });

// Read the html from dist/index.html
const htmlPath = path.join(distRoot, "index.html");
if (!fs.existsSync(htmlPath)) {
  throw new Error(`Missing ${htmlPath}`);
}
const html = fs.readFileSync(htmlPath, "utf8");

// Read worker/index.js
const workerTemplatePath = path.join(projectRoot, "worker", "index.js");
let workerCode = fs.readFileSync(workerTemplatePath, "utf8");

// Replace placeholder __HTML_PAGE__ with JSON.stringify(html)
workerCode = workerCode.replace("__HTML_PAGE__", JSON.stringify(html));

fs.writeFileSync(path.join(serverDir, "index.js"), workerCode, "utf8");

// Copy hosting.json
fs.copyFileSync(
  path.join(projectRoot, ".openai", "hosting.json"),
  path.join(openaiDir, "hosting.json")
);

// If drizzle exists, ensure it's in dist/.openai/drizzle as well
const drizzleSrc = path.join(projectRoot, "drizzle");
if (fs.existsSync(drizzleSrc)) {
  const drizzleDest = path.join(openaiDir, "drizzle");
  fs.cpSync(drizzleSrc, drizzleDest, { recursive: true });
}

console.log(`Built successfully into ${distRoot}`);
