const { root: projectRoot, name: projectName } = require("./utils/project");

module.exports = {
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/changelog",
			{
				changelogFile: "CHANGELOG.md",
			},
		],
		[
			"@semantic-release/exec",
			{
				prepareCmd:
					`node ${projectRoot}/node_modules/wp-release/release-prep.js` +
					" ${lastRelease.version} ${nextRelease.version}",
			},
		],
		[
			"@semantic-release/git",
			{
				assets: [
					"CHANGELOG.md",
					"style.css",
					"package.json",
					"package-lock.json",
				],
				message:
					"chore(release): ${nextRelease.version}\n\n${nextRelease.notes}",
			},
		],
		[
			"@semantic-release/github",
			{
				assets: [
					{
						path: `../${projectName}.zip`,
						name: projectName + "-${nextRelease.version}.zip",
						label: projectName + "-${nextRelease.version}",
					},
				],
			},
		],
	],
};
