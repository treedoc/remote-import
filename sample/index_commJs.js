#!/usr/bin/env -S node -r esm

const RemoteImport = require('../lib/RemoteImport').default;
RemoteImport.init({refreshDuration:10000});

const _ = require("https://jspm.dev/lodash").default;
console.log(_.add(1,3));
