const fs = require("fs");
const { kebab } = require("@compai/util");
const googleFonts = require("../data/fonts.json");

(async () => {
  const fonts = Object.keys(googleFonts);
  for await (name of fonts) {
    const libraryName = `font-${kebab(name)}`;

    const pkg = require(`../packages/${libraryName}/package.json`);
    pkg.repository = `https://github.com/components-ai/typefaces/tree/main/packages/${libraryName}`;
    pkg.homepage = `https://components.ai/docs/typefaces/${kebab(name)}`;
    pkg.license = "MIT";

    fs.writeFileSync(
      `packages/${libraryName}/package.json`,
      JSON.stringify(pkg, null, 2)
    );
  }
})();
