module.exports = {
	hooks: {
		"prepare-commit-msg":
			"[ $IS_CI ] || exec < /dev/tty && git cz --hook || true",
		"commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
	},
};
