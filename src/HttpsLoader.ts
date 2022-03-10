// Modified from: https-loader.mjs on https://nodejs.org/api/esm.html#esm_https_loader
import * as fs from 'fs';
import { CacheableHttpDownloader } from './CacheableHttpDownloader';

// As defined in: https://nodejs.org/api/esm.html#esm_hooks
interface context {
  conditions: string[];
  parentURL: string;
}
type Resolve = (specifier: string, context: context, defaultResolve: Resolve) => { url: string };
type GetFormat = (url: string, context: context, defaultGetFormat: GetFormat) => { format: string };
type GetSource = (url: string, context: context, defaultGetSource: GetSource) => Promise<{source: string | SharedArrayBuffer | Uint8Array}>;

const downloader = new CacheableHttpDownloader();

const resolve: Resolve = (specifier: string, context: context, defaultResolve: Resolve) => { 
  console.log(`resolve: specifier=${specifier}, context=${JSON.stringify(context)}`);
  const { parentURL = null } = context;

  // Normally Node.js would error on specifiers starting with 'https://', so
  // this hook intercepts them and converts them into absolute URLs to be
  // passed along to the later hooks below.
  if (specifier.startsWith('https://')) {
    return {
      url: specifier
    };
  } else if (parentURL && parentURL.startsWith('https://')) {
    return {
      url: new URL(specifier, parentURL).href
    };
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

const getFormat: GetFormat = (url, context, defaultGetFormat) => {
  console.log("getFormat")
  // This loader assumes all network-provided JavaScript is ES module code.
  if (url.startsWith('https://')) {
    return {
      format: 'module'
    };
  }

  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat);
}

const getSource: GetSource = (url: string, context: context, defaultGetSource: GetSource) =>  {
  console.log("getSource")
  // For JavaScript to be loaded over the network, we need to fetch and
  // return it.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => resolve({source: fs.readFileSync(downloader.getOrDownloadUrl(url), "utf-8")}));
    // TODO: support async
    // return new Promise((resolve, reject) => {
    //   get(url, (res) => {
    //     let data = '';
    //     res.on('data', (chunk) => data += chunk);
    //     res.on('end', () => {console.log(data); resolve({ source: data })});
    //   }).on('error', (err) => reject(err));
    // });
  }

  // Let Node.js handle all other URLs.
  return defaultGetSource(url, context, defaultGetSource);
}

export { resolve, getFormat, getSource }