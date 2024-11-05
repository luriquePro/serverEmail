export default {
	parser: "@typescript-eslint/parser",
	extends: [
		"prettier",
		"eslint:recommended",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
	],
	plugins: ["@typescript-eslint", "prettier", "import"],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		project: "./tsconfig.json",
	},
	env: {
		browser: true,
		node: true,
		es2020: true,
	},
	rules: {
		"no-var": "error",
		indent: ["error", "tab", { SwitchCase: 1 }],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"import/order": [
			"warn",
			{
				alphabetize: { order: "asc", caseInsensitive: true },
				"newlines-between": "always",
			},
		],
		"sort-imports": [
			"warn",
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
			},
		],
		"no-multi-spaces": "error",
		"space-in-parens": "error",
		"no-multiple-empty-lines": "error",
		"prefer-const": "error",
		"@typescript-eslint/no-unused-vars": "error",
		"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
		"no-restricted-syntax": [
			"error",
			{
				selector: 'CallExpression[callee.object.name="$match"]',
				message: "$match can be used consecutively.",
			},
		],
		"prettier/prettier": "error",
	},
};
