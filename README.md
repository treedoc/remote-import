<a href="https://github.com/treedoc/remote-import"><img alt="GitHub Actions status" src="https://github.com/treedoc/remote-import/workflows/Node%20CI/badge.svg"></a> [![codecov](https://codecov.io/gh/treedoc/remote-import/branch/main/graph/badge.svg)](https://codecov.io/gh/treedoc/remote-import)</a> <a href='https://www.npmjs.com/package/remote-import' target="_blank"><img alt="npm" src="https://img.shields.io/npm/v/remote-import"></a>

# REMOTE-IMPORT

Import modules from a URL with a customized module loader. It supports remote import in transitive-dependent modules.

## Background

When `Deno` just debuted, I was so excited with the ability to import any modules from a remote URL so that we can get rid of the cumbersome `packages.json` setup and bloated `node-modules` folders. If not because of the NPM ecosystem, I'd completely move to `Deno`. Unfortunately, `Deno` is not well integrated with the existing NPM ecosystem. I still have to stick with NPM. After a bit of research, I build this small library to bring the ability to import any module from a URL. There're few existing solutions, but non of them satisfy my requirement. Most of them support the first level of remote import. They won't work if there're remote imports within the imported module. This library solved this issue by customizing Node module loader logic. It overrides `Module._resolveFilename()`, so that whenever a remote URL is detected, it will download the remote module and cache it to local. 

## Features
- Support import with URL start with  `http://` and `https://`
- Support transitive imports in the dependent modules
- Support import CommonJs modules
- Support ES6 modules with the pre-loaded library: [esm](https://www.npmjs.com/package/esm). `node -r esm `
- Customizable local cache folder
- Customizable cache refresh duration
- Support Http head of `if-match` and `if-modified-since` for efficient file downloads.

## Usage

### Install & Setup
- npm install: `npm i remote-import`
- In Javascript/Typescript:
  ```
  // During app initialization
  import RemoteImport from 'remote-import';
  RemoteImport.get().init();

  // Anywhere else
  import _ from "https://jspm.dev/lodash";
  _.add(1,2);

  ```
- If the imported module is ES6 module, make sure to add the following parameter when launching the app:
  ```
  node -r esm 
  ```
- It can also be used as preload module, e.g.
  ```
  node -r esm -r remote-import
  ```
- For more living examples, please refer to folder [sample](https://github.com/treedoc/remote-import/tree/main/sample)

## Future Enhancement
- Add URL rules to white list URL and indicate if the URL is immutable for security reason.

## Contributions

Even this library may provide useful functions. It's still rudimentary—lots of opportunities for enhancements. If you find any issues or have any better ideas, you are welcome to open [Github issues](https://github.com/treedoc/remote-import/issues) or submit PRs.

## License

Copyright 2021 TreeDoc.org <BR>
Author/Developer: Jianwu Chen

Use of this source code is governed by an MIT-style license that can be found in the LICENSE file or at <https://opensource.org/licenses/MIT>.

