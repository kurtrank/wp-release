var packagejson = require("./package.json");
var path = require("path");
var appDir = path.dirname(require.main.filename);
console.log(appDir);

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
				prepareCmd: "sh ./.release-prep.sh ${nextRelease.version}",
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
						path: "../tux-wp-child.zip",
						name: "tux-wp-child-${nextRelease.version}.zip",
						label: "tux-wp-child-${nextRelease.version}",
					},
				],
			},
		],
	],
};
