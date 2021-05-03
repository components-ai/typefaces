const fs = require("fs");
const { kebab } = require("@compai/util");
const googleFonts = require("../packages/fonts/src/data/google-fonts.json");

(async () => {
  const fonts = Object.keys(googleFonts).reduce((acc, curr) => {
    const pkgName = `@compai/font-${kebab(curr)}`;
    return {
      ...acc,
      [pkgName]: {
        name: curr,
        packageName: pkgName,
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
