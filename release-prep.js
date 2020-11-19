#!/usr/bin/env node

/**
 * External Dependencies
 */
const replace = require("replace-in-file");
const { writeFileSync } = require("fs");
const spawn = require("cross-spawn");

/**
 * Internal Dependencies
 */
const { root: projectRoot, name: projectName } = require("./utils/project");

const args = process.argv.slice(2);

if (!args[0] || !args[1]) {
	console.log(
		"Missing arguments! Arguments should be supplied in the following format: `release-prep lastRelease nextRelease`"
	);
	process.exitCode = 1;
} else {
	const lastRelease = args[0];
	const nextRelease = args[1];

	// update style.css
	const options = {
		files: "style.css",
		from: /Version: (.*)/g,
		to: `Version: ${nextRelease}`,
	};

	try {
		const results = replace.sync(options);
	} catch (error) {
		console.error("Error replacing version in style.css:", error);
	}

	// update package files
	const packageFile = `${projectRoot}/package.json`;
	const packageLockFile = `${projectRoot}/package-lock.json`;
	const package = require(packageFile);
	const packageLock = require(packageLockFile);

	package.version = nextRelease;
	packageLock.version = nextRelease;

	writeFileSync(packageFile, JSON.stringify(package, null, 2), (err) => {
		if (err) return console.log(err);
	});
	writeFileSync(
		packageLockFile,
		JSON.stringify(packageLock, null, 2),
		(err) => {
			if (err) return console.log(err);
		}
	);

	// build zip file
	spawn.sync(
		"zip",
		[
			"-r",
			`../${projectName}.zip`,
			".",
			`-x@${projectRoot}/node_modules/wp-release/.zip-exclude.lst`,
		],
		{
			stdio: "inherit",
		}
	);
}
