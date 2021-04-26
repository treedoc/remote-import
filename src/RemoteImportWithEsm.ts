#!/usr/bin/env node -r esm
// Doesn't work
// require = require("esm")(module/*, options*/)
const vm = require('vm');
const r = require("repl").start({});
// r.context.RemoteImport = require("./lib/RemoteImport").default;
// r.context.require = require("esm")(module/*, options*/);
console.log(r.eval.toString());
r.context.r = r;
vm.runInContext('require("esm")(module/*, options*/);require("./lib/RemoteImport")', r.context);
// r.eval('require("esm")(module/*, options*/);require("./lib/RemoteImport")', r.context, (a: any) => console.log(JSON.stringify(a)) )


