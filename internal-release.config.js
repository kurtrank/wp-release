// This is used to actually release this project. `release.config.js` is used for WordPress projects that depend on this.

module.exports = {
	branches: [
		"main",
		{
			"name": "beta",
			"prerelease": true
		}
	],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/changelog",
			{
				changelogFile: "CHANGELOG.md",
			},
		],
		["@semantic-release/npm", {
			"npmPublish": false,
			tarballDir: "dist",
		}],
		[
			"@semantic-release/git",
			{
				assets: [
					"CHANGELOG.md",
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
				assets: "dist/*.tgz"
			},
		],
	],
};
