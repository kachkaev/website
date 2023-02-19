const baseConfig = require("@kachkaev/prettier-config");

module.exports = {
  ...baseConfig,
  plugins: [require("prettier-plugin-tailwindcss"), ...baseConfig.plugins],
};
