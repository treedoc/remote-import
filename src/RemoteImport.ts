
import { Module } from 'module';
import { CacheableHttpDownloader, CacheConfig } from './CacheableHttpDownloader';

export class RemoteImportConfig extends CacheConfig {
}

export default class RemoteImport {
  static instance = new RemoteImport();
  static get() { return RemoteImport.instance; } 
  public static init(config: Partial<RemoteImportConfig> = {}) { RemoteImport.get().init(config); }

  config = new RemoteImportConfig();
  downloader = new CacheableHttpDownloader();

  nodeResolveFilename?: (request: string, parent: NodeModule, isMain: boolean, options: any) => void

  init(config: Partial<RemoteImportConfig> = {}) {
    this.downloader = new CacheableHttpDownloader(config);
    console.debug(`RemoteImport initialized: config=${JSON.stringify(this.config)}`);
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
      return this.downloader.getOrDownloadUrl(module);
    
    if (parentFileName?.startsWith(this.downloader.config.cachePath)) {        
      const meta = this.downloader.readMeta(parentFileName);
      if (meta) {
        module = new URL(module, new URL(meta.url)).toString();
        return this.downloader.getOrDownloadUrl(module);
      } else
        console.error(`Error load parent meta file for parent.filename=${parentFileName}`)
    }
    return module;
  }
}

RemoteImport.get().init();