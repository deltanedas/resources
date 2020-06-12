if (this.global.resources === undefined) {
	this.global.resources = {};
	require("resources/library");
	require("builtin");
}
