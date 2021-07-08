#!/usr/bin/env node

import * as repl from "repl";
import * as vm from "vm"
import * as path from 'path'
import { homedir } from 'os';

const r = repl.start("rn> ");
path.join(homedir(),'.node_repl_history');
r.setupHistory(".remote_node_repl_history", () => null)
// r.context.require = require("esm")(module/*, options*/);  // Seems this is equivalent as runInContext
vm.runInContext("require=require('esm')(module); require('remote-import')", r.context);
