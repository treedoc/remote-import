#!/usr/bin/env node

import * as repl from "repl";
import * as vm from "vm"
import * as path from 'path'
import { homedir } from 'os';

const r = repl.start("rn> ");

r.setupHistory(path.join(homedir(),'.node_repl_history'), () => null)
// r.context.require = require("esm")(module/*, options*/);  // Seems this is equivalent as runInContext
// use esm-wallaby instead of esm as a work around: https://github.com/standard-things/esm/issues/866
vm.runInContext("require=require('esm-wallaby')(module); require('remote-import')", r.context);
console.log('example: _ = require("https://jspm.dev/lodash").default;')
