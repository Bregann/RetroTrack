// CommonJS bootstrap for running the .erb helper scripts under ts-node on
// modern Node (>=22), where the native ESM loader would otherwise claim these
// `import`-using .js files and enforce JSON import attributes. Forcing ts-node
// into transpile-only CommonJS mode makes `require`/`__dirname` and bare JSON
// imports work exactly as they did on older Node versions.
require('ts-node').register({
  transpileOnly: true,
  skipProject: true,
  compilerOptions: {
    module: 'commonjs',
    ignoreDeprecations: '6.0',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    allowJs: true,
    target: 'es2022',
  },
});
