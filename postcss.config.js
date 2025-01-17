export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: ['advanced', {
              discardComments: { removeAll: true },
              reduceIdents: false,
              zindex: false
            }]
          }
        }
      : {})
  }
};