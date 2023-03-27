# wp-release

This module is a wrapper around [semantic-release](https://semantic-release.gitbook.io/semantic-release/) for use with WordPress themes and plugins, supported by commitlint, husky, and commitizen to enforce proper commit messages for semantic-release to parse.

## Setup

### Install Package

```sh
npm install kurtrank/wp-release --save-dev
```

### Initial Config

Update `package.json` with the following items:

```json
{
	"commitlint": {
		"extends": ["@commitlint/config-conventional"]
	},
	"config": {
		"commitizen": {
			"path": "./node_modules/cz-conventional-changelog"
		}
	},
	"release": {
		"extends": "wp-release"
	}
}
```

**If you use release branches other than `master` and `beta`, such as `main`, you will need to indicate this by specifying these branches in semantic-release's config. See [semantic-release config](#semantic-release) section in this readme.**

Additionally, it may be helpful to add these items to the `scripts` section of `package.json`:

```json
{
	"scripts": {
		"generate-zip": "node node_modules/wp-release/release-prep.js",
		"test-release": "semantic-release --dry-run",
		"release": "semantic-release"
	}
}
```

- **`generate-zip`**: This is useful if you would like to simply create a zip file as if you were creating a release that you can use to deploy to dev sites for testing purposes. You need to specify a version number after this command like `npm run generate-zip 1.3.0-dev.sjm-999.1`, ideally with a version number following the format for development pre-releases to indicate that it is not a full release.
- **`test-release`**: Runs semantic-release in dry-run mode so you can preview what the release will look like.
- **`release`**: Runs semantic-release for real, and will automatically figure out the next version and publish a release on GitHub.

Note that if you want to run `semantic-release` locally it will expect a github token to be accessible through a `GH_TOKEN` or `GITHUB_TOKEN` environment variable and use the `--no-ci` command.

## Other Options

### wp-release

There are two additional config items that can be specified in `package.json` under `config.wpRelease`:

- **`ignore`**: array of [globs](https://gulpjs.com/docs/en/getting-started/explaining-globs/) to indicate which files to exclude from the generated zip file of the project.
- **`entryFile`**: filename that contains the header that WordPress uses to check version number ("Version: x.x" at the top of the file). By default wp-release will update the version number in `style.css` or a php file that matches the project name listed in `package.json`, but this option can be used if you use a non-standard filename for your main plugin file.

```json
{
	"config": {
		"wpRelease": {
			"entryFile": "custom-name.php",
			"ignore": [
				".env.sample",
				".git/**",
				".gitignore",
				"node_modules/**",
				"some-build-file.js"
			]
		}
	}
}
```

The default ignore list is:

```json
[
	".DS_Store",
	".env",
	".env.sample",
	".git/**",
	".github/**",
	".npm/**",
	".gitignore",
	".huskyrc.js",
	".releaserc",
	"node_modules/**",
	"release.config.js"
]
```

### semantic-release

By default, wp-release uses almost all of the default config options for semantic-release. View [semantic-release's config options](https://semantic-release.gitbook.io/semantic-release/usage/configuration) to see those and further customize things you may need to adjust. For example, using custom branch names and release channels:

```json
{
	"release": {
		"extends": "wp-release",
		"branches": [
			"main",
			{
				"name": "beta",
				"prerelease": true
			}
		]
	}
}
```
