import prettierPluginNunjucks from 'prettier-plugin-nunjucks'

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    plugins: [prettierPluginNunjucks],
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    overrides: [
        {
            files: '*.md',
            options: {
                embeddedLanguageFormatting: 'off',
            },
        },
        {
            files: ['*.njk', '*.nunjucks', '*.nunj'],
            options: {
                parser: 'nunjucks',
            },
        },
    ],
}

export default config
