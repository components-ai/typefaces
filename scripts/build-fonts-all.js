const fs = require("fs");
const { kebab } = require("@compai/util");
const googleFonts = require("@compai/fonts/src/data/google-fonts.json");

(async () => {
  const fonts = Object.keys(googleFonts).reduce((acc, curr) => {
    const pkgName = `@compai/font-${kebab(curr)}`;
    return {
      ...acc,
      [pkgName]: {
        name: curr,
        kebabName: kebab(curr),
        packageName: pkgName,
        docs: `https://components.ai/docs/typefaces/${kebab(curr)}`,
        apiEndpoint: `https://components.ai/api/v1/typefaces/${kebab(curr)}`,
        category: googleFonts[curr].category,
        version: require(`../packages/font-${kebab(curr)}/package.json`)
          .version,
      },
    };
  }, {});

  fs.writeFileSync(
    "packages/fonts-all/index.js",
    `module.exports = ${JSON.stringify(fonts, null, 2)}`
  );
})();
