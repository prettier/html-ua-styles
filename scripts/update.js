import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import writePrettierFile from 'write-prettier-file';
import Stylesheet from './stylesheet.js';

const CACHE_FILE = new URL('../.cache/standard.html', import.meta.url);
const STYLE_FILE = new URL('../index.css', import.meta.url);
const SCRIPT_FILE = new URL('../index.js', import.meta.url);
const SOURCE_URLS = [
  'https://raw.githubusercontent.com/whatwg/html/main/source',
  'https://cdn.jsdelivr.net/gh/whatwg/html/source',
];
const STYLE_NAMESPACE = '@namespace "http://www.w3.org/1999/xhtml";';

const fetchHtml = async (url) => {
  const response = await fetch(url);
  const html = await response.text();
  return `<!-- Downloaded from ${url} @${new Date()} -->\n\n${html}`;
};

async function getStandardHtml() {
  let stat;

  try {
    stat = await fs.stat(CACHE_FILE);
  } catch {
    // No op
  }

  if (stat) {
    if (Date.now() - stat.ctimeMs < /* 10 hours */ 10 * 60 * 60 * 1000) {
      return fs.readFile(CACHE_FILE, 'utf8');
    }

    await fs.rm(CACHE_FILE);
  }

  const html = await Promise.any(SOURCE_URLS.map((url) => fetchHtml(url)));

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

  await writePrettierFile(
    STYLE_FILE,
    // https://github.com/prettier/prettier/issues/15397
    text.replaceAll(/(?<=\[)(\w+)=(\w+)(?= s])/g, '$1="$2"'),
  );
  await writePrettierFile(
    SCRIPT_FILE,
    `export default ${JSON.stringify(stylesheet, undefined, 2)};`,
  );
}

await build();
