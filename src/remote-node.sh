# Doesn't work in interative mode, when conbine esm and remote-import, not sure why
NODE_PATH=$(npm root -g) node -r esm -r remote-import "$@"