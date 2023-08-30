import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import writePrettierFile from 'write-prettier-file';
import Stylesheet from './stylesheet.js';

const CACHE_FILE = new URL('../.cache/standard.html', import.meta.url);
const STYLE_FILE = new URL('../index.css', import.meta.url);
const SCRIPT_FILE = new URL('../index.js', import.meta.url);
const SOURCE_URL = 'https://raw.githubusercontent.com/whatwg/html/main/source';
const STYLE_NAMESPACE = '@namespace "http://www.w3.org/1999/xhtml";';

async function getStandardHtml() {
  let stat;

  try {
    stat = await fs.stat(CACHE_FILE);
  } catch {}

  if (stat) {
    if (Date.now() - stat.ctimeMs < /* 10 hours */ 10 * 60 * 60 * 1000) {
      return fs.readFile(CACHE_FILE);
    }

    await fs.rm(CACHE_FILE);
  }

  const response = await fetch(SOURCE_URL);
  const html = await response.text();

  await fs.mkdir(new URL('./', CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, html);

  return html;
}

async function getStyles() {
  const html = await getStandardHtml();
  const $ = cheerio.load(html);
  return $('pre > code[class="css"]')
    .toArray()
    .map((codeBlock) => $(codeBlock).text())
    .filter((style) => style.startsWith(STYLE_NAMESPACE))
    .map((style) => style.slice(STYLE_NAMESPACE.length).trim())
    .join('\n'.repeat(2));
}

async function build() {
  const text = await getStyles();
  const stylesheet = new Stylesheet(text);

  await writePrettierFile(STYLE_FILE, text, { parser: 'css' });
  await writePrettierFile(
    SCRIPT_FILE,
    `export default ${JSON.stringify(stylesheet, undefined, 2)};`,
    { parser: 'meriyah' },
  );
}

await build();
