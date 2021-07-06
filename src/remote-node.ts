#!/usr/bin/env node

import * as repl from "repl";
import * as vm from "vm"

const r = repl.start("rn> ");
r.setupHistory(".remote_node_repl_history", () => null)
// r.context.require = require("esm")(module/*, options*/);  // Seems this is equivalent as runInContext
vm.runInContext("require=require('esm')(module); require('remote-import')", r.context);
