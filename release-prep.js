#!/usr/bin/env node

/**
 * External Dependencies
 */
const replace = require("replace-in-file");
const { writeFileSync, existsSync, createWriteStream } = require("fs");
const archiver = require("archiver");
const spawn = require("cross-spawn");

/**
 * Internal Dependencies
 */
const { root: projectRoot, name: projectName } = require("./utils/project");

const args = process.argv.slice(2);

if (!args[0]) {
	console.log(
		"Missing arguments! Arguments should be supplied in the following format: `release-prep lastRelease nextRelease` or `release-prep nextRelease` for initial version"
	);
	process.exitCode = 1;
} else {
	const lastRelease = args[1] ? args[0] : false;
	const nextRelease = args[1] ? args[1] : args[0];

	const package = require(`${projectRoot}/package.json`);
	const packageLock = require(`${projectRoot}/package-lock.json`);

	const wpFile = package.config?.wpRelease?.entryFile
		? package.config?.wpRelease?.entryFile
		: existsSync(`${projectRoot}/style.css`)
		? "style.css"
		: existsSync(`${projectRoot}/${projectName}.php`)
		? `${projectName}.php`
		: false;

	if (wpFile) {
		const options = {
			files: wpFile,
			from: /Version: (.*)/g,
			to: `Version: ${nextRelease}`,
		};

		try {
			const results = replace.sync(options);
		} catch (error) {
			console.error("Error replacing version in style.css:", error);
		}
	} else {
		console.log(
			'Could not find a file to update with new version. If you\'re using something other than `style.css` or `{plugin-name}.php` to house the "Version: x.y" header WordPress uses, please specify in package.json under `config.wpRelease.entryFile`. Example:\n\n{\n\t"config": {\n\t\t"wpRelease": {\n\t\t\t"entryFile: "custom-filename.php"\n\t\t}\n\t}\n}'
		);
	}

	// update package files
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

	const output = createWriteStream(`${projectRoot}/../${projectName}.zip`);
	const zip = archiver("zip", {
		zlib: { level: 9 },
	});

	output.on("close", function () {
		console.log(`zip file created: ${archive.pointer()} total bytes`);
	});

	zip.on("warning", function (err) {
		if (err.code === "ENOENT") {
			// log warning
		} else {
			// throw error
			throw err;
		}
	});

	zip.pipe(output);

	ignoreList = package.config?.wpRelease?.ignore ?? [
		".DS_Store",
		".env",
		".env.sample",
		".git/*",
		".github/*",
		".gitignore",
		".huskyrc.js",
		".releaserc",
		"node_modules/*",
		"release.config.js",
	];

	zip.glob(
		"**/*",
		{
			cwd: projectRoot,
			ignore: ignoreList,
		},
		{}
	);
	zip.finalize();
}
