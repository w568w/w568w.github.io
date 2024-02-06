/** @type {import('postcss-load-config').Config} */
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssAdvancedVariables from 'postcss-advanced-variables';
export const plugins = [
    autoprefixer({
        overrideBrowserslist: ['last 5 version', '>1%', 'ios 7']
    }),
    postcssAdvancedVariables,
    postcssImport
];