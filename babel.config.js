export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        esmodules: true
      },
      bugfixes: true,
      loose: false,
      modules: false
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      importSource: '@emotion/react'
    }],
    ['@babel/preset-typescript', {
      allowDeclareFields: true,
      optimizeConstEnums: true
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: false
    }]
  ]
};