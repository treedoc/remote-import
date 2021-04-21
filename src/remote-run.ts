#!/usr/bin/env node

import path = require('path');

class RemoteRun {
  run() {
    if (process.argv.length < 3) {
      console.log("remote-run <remoteModuleUrl|localModule> [arguments]")
      return -1;
    }
    require = require("esm")(module/*, options*/)
    const RemoteImport = require("./RemoteImport").default;
    
    let url = process.argv[2];
    if (!url.startsWith("http://") && !url.startsWith("https://"))
    url = path.resolve(url);  // Local module, relative to current directory
    require(url);
  }
}

new RemoteRun().run();
