module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	transform: {
		"^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
	},
	testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};
