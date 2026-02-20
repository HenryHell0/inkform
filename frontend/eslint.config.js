import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'

export default [
	{
		files: ['**/*.vue'],

		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.vue'],
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},

		plugins: {
			vue,
			'@typescript-eslint': tsPlugin,
		},

		rules: {
			...vue.configs['flat/recommended'].rules,
			...tsPlugin.configs.recommended.rules,

			'vue/multi-word-component-names': [
				'error',
				{ ignores: ['Widget', 'Toolbar', 'Expression', 'Graph', 'Widgets'] },
			],
			'@typescript-eslint/no-unused-vars': 'warning',
		},
		x,
	},

	{
		// normal TS/JS files
		files: ['**/*.{ts,tsx,js,mjs,jsx}'],

		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: ['./tsconfig.json'],
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},

		plugins: {
			'@typescript-eslint': tsPlugin,
		},

		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': 'warning',
		},
	},

	prettier,
]
