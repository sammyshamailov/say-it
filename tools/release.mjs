#!/usr/bin/env node
// Prepare a release: set the version everywhere and refresh the file lists.
//
//   npm run release 2.5.0     new version (phones pick up the update)
//   npm run release           same version, just refresh the lists after adding/removing a file
//
// Writes  public/js/version.js            VERSION shown in the parent area
//         public/sw.js                    VERSION and SHELL (files saved for offline use)
//         public/index.html               ?v= on the stylesheet and entry module, and a
//                                         <link rel="modulepreload"> for every module
// `npm test` fails if these are out of date, so a forgotten step shows up before deploying.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "../..");
const PUB = join(ROOT, "public");
const read = f => readFileSync(join(PUB, f), "utf8");

function walk(dir) {
  return readdirSync(dir).flatMap(n => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const rel = p => relative(PUB, p).split(sep).join("/");

export function currentVersion() {
  return read("js/version.js").match(/VERSION = "([^"]+)"/)[1];
}

// Every file the app needs to start offline, in the exact form the page asks for it.
export function shellFiles(v) {
  const modules = walk(join(PUB, "js")).filter(p => p.endsWith(".js")).map(rel).sort()
    .map(f => (f === "js/main.js" ? `js/main.js?v=${v}` : f));
  const icons = walk(join(PUB, "icons")).filter(p => p.endsWith(".png")).map(rel).sort();
  return ["./", "index.html", "manifest.webmanifest", `css/app.css?v=${v}`, "fonts/fredoka.woff", ...modules, ...icons];
}
// modules other than the entry, preloaded from index.html
export const preloadModules = v => shellFiles(v).filter(f => f.startsWith("js/") && !f.startsWith("js/main.js"));

const between = (text, start, end, body) => {
  const a = text.indexOf(start), b = text.indexOf(end);
  if (a < 0 || b < a) throw new Error(`markers ${start} / ${end} not found`);
  return text.slice(0, a + start.length) + "\n" + body + text.slice(b);
};

export function render(v) {
  const sw = between(read("sw.js").replace(/const VERSION = "[^"]*";/, `const VERSION = "${v}";`),
    "// shell:start", "// shell:end", `const SHELL = [\n${shellFiles(v).map(f => `  ${JSON.stringify(f)}`).join(",\n")}\n];\n`);
  const index = between(read("index.html").replace(/\?v=[\w.-]+/g, `?v=${v}`),
    "<!-- modulepreload:start -->", "<!-- modulepreload:end -->", preloadModules(v).map(f => `<link rel="modulepreload" href="${f}">`).join("\n") + "\n");
  const version = read("js/version.js").replace(/VERSION = "[^"]*"/, `VERSION = "${v}"`);
  return { "sw.js": sw, "index.html": index, "js/version.js": version };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const v = process.argv[2] || currentVersion();
  if (!/^\d+\.\d+\.\d+$/.test(v)) { console.error("Version looks like 2.5.0"); process.exit(1); }
  for (const [f, text] of Object.entries(render(v))) writeFileSync(join(PUB, f), text);
  console.log(`Release ${v}: ${shellFiles(v).length} files saved for offline, ${preloadModules(v).length} modules preloaded.`);
}
