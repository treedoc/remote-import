#! /usr/bin/env bash

# Doesn't work in interative mode, when conbine esm and remote-import, not sure why
# NODE_PATH=$(npm root -g) node -r esm -r remote-import "$@"

# Have to manually run "import 'remote-import'" in the REPL

# Color code reference: https://dev.to/ifenna__/adding-colors-to-bash-scripts-48g4
RED=31
GREEN=32
BG_BLACK=40
BG_RED=41
BG_GRAY=100

BOLD=1
ENDCOLOR="\e[0m"

color() { echo "\e[$1m" ; }

CODE_COLOR="$(color $BOLD\;$GREEN\;$BG_BLACK)"

# echo -e "Please run $CODE_COLOR import 'remote-import' $ENDCOLOR after node REPL started."
# echo -e "To import remote module, only CommonJs require is supported, e.g.: "
# echo -e "$CODE_COLOR const _ = require('https://jspm.dev/lodash').default; $ENDCOLOR"
# NODE_PATH=$(npm root -g) node -r esm "$@"
NODE_PATH=$(npm root -g) node -r esm -e "require('remote-import')" -i "$@"