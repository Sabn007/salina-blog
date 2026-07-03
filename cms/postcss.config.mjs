// Isolated PostCSS config for Strapi — prevents picking up the root
// Next.js Tailwind config (../postcss.config.mjs) during admin build.
export default {
  plugins: {},
};
