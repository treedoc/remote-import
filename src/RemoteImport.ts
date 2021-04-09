
import { Module } from 'module';
import syncReq from 'sync-request';
import { IncomingHttpHeaders } from 'http';
import * as fs from 'fs';
import * as os from 'os';

import decompress = require("brotli/decompress")
// Following won't work in JEST which will cause error: "Uncaught ReferenceError: Browser is not defined"
// import { decompress } from "brotli";

const CACHE_PATH = os.homedir() + "/.remote-import/cache";
const META_EXT = ".json";

class CacheMeta {
  constructor(
    public url = '', 
    public loadTime = 0,
    public lastModified?: string,
    public etag?: string,
  ) {}
  setLoadTime(val: number) { this.loadTime = val; return this; }
}

export class RemoteImportConfig {
  refreshDuration = 24 * 60 * 60 * 1000;  // 24 hours
  /** cache path can't be symbolic links as nodejs will expend the symbolic link */
  cachePath = CACHE_PATH;
  // TODO: support whitelisted URLs for security
}

export default class RemoteImport {
  config = new RemoteImportConfig();
  nodeResolveFilename?: (request: string, parent: NodeModule, isMain: boolean, options: any) => void
  
  static instance = new RemoteImport();
  static get() { return RemoteImport.instance; } 
  public static init(config: Partial<RemoteImportConfig> = {}) { RemoteImport.get().init(config); }

  init(config: Partial<RemoteImportConfig> = {}) {
    this.config = {...this.config, ...config};
    fs.mkdirSync(this.config.cachePath, {recursive: true});
    this.config.cachePath = fs.realpathSync(this.config.cachePath);
    console.error(`RemoteImport initialized: config=${JSON.stringify(this.config)}`);
    const module = Module as any;
    if (this.nodeResolveFilename)
      return;
    this.nodeResolveFilename = module._resolveFilename;
    module._resolveFilename = this.resolveFilename;
  }

  // Can't use member variable as this is not accessible when method is invoked in callback. Arrow function is good
  resolveFilename = (request: string, parent: NodeModule, isMain: boolean, options: any) => {
    try {
      //  console.error(`request: ${request}; parent.filename: ${parent?.filename}; isMain: ${isMain}; options: ${options}; cachPath: ${this.config.cachePath}`)
      return this.nodeResolveFilename!(this.resolveModule(request, parent?.filename), parent, isMain, options);
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  public resolveModule(module: string, parentFileName?: string): string {
    if (module?.startsWith("https:") || module?.startsWith("http"))
      return this.getOrDownloadUrl(module);
    
    if (parentFileName?.startsWith(this.config.cachePath)) {        
      const meta = this.readMeta(parentFileName);
      if (meta) {
        module = new URL(module, new URL(meta.url)).toString();
        return this.getOrDownloadUrl(module);
      } else
        console.error(`Error load parent meta file for parent.filename=${parentFileName}`)
    }
    return module;
  }

  private getOrDownloadUrl(url: string): string {
    const fileName = this.urlToFileName(url);

    let meta: CacheMeta | null = null;
    if (fs.existsSync(fileName)) {
      meta = this.readMeta(fileName);
      if (meta && new Date().getTime() - meta.loadTime < this.config.refreshDuration)
        return fileName;
    }
    console.error(`Downloading: ${url}, to cache folder: ${fileName}`);
    fs.mkdirSync(this.config.cachePath, {recursive: true});

    const reqHeaders: IncomingHttpHeaders = {};
    if (meta?.etag)
      reqHeaders["if-match"] = meta.etag;
    if (meta?.lastModified)
      reqHeaders["if-modified-since"] = meta.lastModified;
    const res = syncReq("GET", url, { headers: reqHeaders})
    console.error(`statusCode: ${res.statusCode}`);
    if (res.statusCode === 304) {
      this.writeMetaFile(fileName, meta!.setLoadTime(new Date().getTime()));
      return fileName;
    }

    if (res.statusCode !== 200) {
      console.error(`Error occurred: ${res.getBody}`);
      return fileName;
    }

    const encoding = res.headers["content-encoding"];
    const content = encoding === "br" ? decompress(res.getBody() as Buffer) : res.body;
    // console.error(`res.headers=${TD.stringify(res.headers, " ")}, encoding=${encoding}; content="${content}`);
    fs.writeFileSync(fileName, content);
    this.writeMetaFile(fileName, new CacheMeta(url, new Date().getTime(), res.headers["last-modified"], res.headers.etag as string));
    return fileName;
  }

  private urlToFileName(url: string) {
    return this.config.cachePath + "/" + url.replace(/[:|\/|?|&]/g , "_")
  }

  private readMeta(fileName: string): CacheMeta | null {
    const metaFile = fileName + META_EXT;
    if (!fs.existsSync(metaFile)) 
      return null;
    try {
      return Object.assign(new CacheMeta(), JSON.parse(fs.readFileSync(metaFile, {encoding: "utf-8"})));
    } catch (e) {
      console.error(`Error reading meta file:${metaFile}`, e);
    }
    return null;
  }

  private writeMetaFile(fileName: string, meta: CacheMeta) {
    const metaFile = fileName + META_EXT;
    fs.writeFileSync(metaFile, JSON.stringify(meta));
  }
}

RemoteImport.get().init();