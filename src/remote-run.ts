#!/usr/bin/env -S node -r esm

console.log(process.argv)

class RemoteRun {
  run() {
    if (process.argv.length < 3) {
      console.log("remote-run <jsURL> [arguments]")
      return -1;
    }
    require = require("esm")(module/*, options*/)
    const RemoteImport = require("./RemoteImport").default;    
    require(process.argv[2]);
  }
}

new RemoteRun().run();
