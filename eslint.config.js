import antfu from '@antfu/eslint-config';

export default antfu({
    type: 'app',
    svelte: true,
    typescript: true,
    jsonc: false,
    yaml: false,
    markdown: false,
    stylistic: {
        semi: true,
        indent: 4,
    },
    ignores: ['build/', '.svelte-kit/'],
    rules: {
        'node/prefer-global/process': 'off',
        'no-use-before-define': 'off',
        'prefer-arrow-callback': 'off',
    },
}, {
    files: ['**/*.svelte'],
    rules: {
        'style/indent': 'off',
        'style/indent-binary-ops': 'off',
        'svelte/indent': ['error', { indent: 4, alignAttributesVertically: true }],
    },
});
