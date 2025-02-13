import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config} */
export default {
	files: ["**/*.{js,mjs,cjs,ts}"],
	extends: ["alloy", "alloy/typescript", pluginJs.configs.recommended, ...tseslint.configs.recommended],
	languageOptions: {
		globals: globals.browser,
	},
};
