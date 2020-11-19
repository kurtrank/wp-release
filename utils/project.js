#!/usr/bin/env node

const path = require("path");
const fullPath = path.dirname(require.main.filename);
const regexResp = /^(.*?)\/node_modules/.exec(fullPath);
const projectRoot = regexResp ? regexResp[1] : fullPath;
const packagejson = require(`${projectRoot}/package.json`);
const name = packagejson.name;

module.exports = {
	root: projectRoot,
	name,
};
