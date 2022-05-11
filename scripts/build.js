const fs = require("fs");
const mkdirp = require("mkdirp");
const opentype = require("opentype.js");
const { fetch, kebab } = require("@compai/util");
const googleFonts = require("../data/fonts.json");

const addUrl = (obj, { variant, weight, url }) => {
  const newObj = { ...obj };
  newObj[variant] = newObj[variant] || {};
  newObj[variant][weight] = url;

  return newObj;
};

const convertGoogleFont = async (name) => {
  const fontData = googleFonts[name];
  const variants = Object.keys(fontData.variants);
  const libraryName = `font-${kebab(name)}`;
  await mkdirp(`packages/${libraryName}/data/typefaces`);
  await mkdirp(`packages/${libraryName}/data/urls`);

  fontData.typefaces = {};
  let eotUrls = {};
  let ttfUrls = {};
  let svgUrls = {};
  let woffUrls = {};
  let woff2Urls = {};
  for await (variant of variants) {
    const weightsForVariant = Object.keys(fontData.variants[variant]);
    fontData.typefaces[variant] = fontData.typefaces[variant] || {};

    for await (weight of weightsForVariant) {
      const variantData = fontData.variants[variant][weight];
      const name = variantData.local[0];
      const url = variantData.url.ttf;

      eotUrls = addUrl(eotUrls, { variant, weight, url: variantData.url.eot });
      ttfUrls = addUrl(ttfUrls, { variant, weight, url: variantData.url.ttf });
      svgUrls = addUrl(svgUrls, { variant, weight, url: variantData.url.svg });
      woffUrls = addUrl(woffUrls, {
        variant,
        weight,
        url: variantData.url.woff,
      });
      woff2Urls = addUrl(woff2Urls, {
        variant,
        weight,
        url: variantData.url.woff2,
      });

      const fullFontName = [name, variant, weight].join(" ");

      const res = await fetch(url);
      const buffer = await res.arrayBuffer();

      const font = opentype.parse(buffer);
      const fontAsJson = convertFont(font, { weight, variant });

      fontData.typefaces[variant][weight] = fontAsJson;

      fs.writeFileSync(
        `packages/${libraryName}/data/typefaces/${kebab(fullFontName)}.json`,
        JSON.stringify(fontAsJson, null, 2)
      );
    }
  }

  fs.writeFileSync(
    `packages/${libraryName}/data/urls/eot.json`,
    JSON.stringify(eotUrls, null, 2)
  );
  fs.writeFileSync(
    `packages/${libraryName}/data/urls/ttf.json`,
    JSON.stringify(ttfUrls, null, 2)
  );
  fs.writeFileSync(
    `packages/${libraryName}/data/urls/svg.json`,
    JSON.stringify(svgUrls, null, 2)
  );
  fs.writeFileSync(
    `packages/${libraryName}/data/urls/woff.json`,
    JSON.stringify(woffUrls, null, 2)
  );
  fs.writeFileSync(
    `packages/${libraryName}/data/urls/woff2.json`,
    JSON.stringify(woff2Urls, null, 2)
  );

  fs.writeFileSync(
    `packages/${libraryName}/readme.md`,
    `# \`@compai/${libraryName}\`

[**Read the docs &rarr;**](https://components.ai/docs/typefaces/${kebab(name)})
`
  )

  try {
    require(`../packages/${libraryName}/package.json`);
  } catch (e) {
    console.log("No package found, creating", libraryName);
    fs.writeFileSync(
      `packages/${libraryName}/package.json`,
      `{
  "name": "@compai/${libraryName}",
  "version": "0.0.0"
}`
    );
  }

  fs.writeFileSync(
    `packages/${libraryName}/index.js`,
    `module.exports = require('./data/info.json')`
  );

  fs.writeFileSync(
    `packages/${libraryName}/data/info.json`,
    JSON.stringify(fontData, null, 2)
  );
};

// https://github.com/gero3/facetype.js/blob/ce2f078003edbb5fd494fe7277face2f312567ca/javascripts/main.js#L49
const convertFont = (font, { weight, variant }) => {
  const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);
  const result = { glyphs: {} };
  const restriction = {
    range: null,
    set: null,
  };
  Object.values(font.glyphs.glyphs).forEach(function(glyph) {
    if (glyph.unicode !== undefined) {
      var glyphCharacter = String.fromCharCode(glyph.unicode);
      var needToExport = true;

      if (restriction.range !== null) {
        needToExport =
          glyph.unicode >= restriction.range[0] &&
          glyph.unicode <= restriction.range[1];
      } else if (restriction.set !== null) {
        needToExport =
          restrictCharacterSetInput.value.indexOf(glyphCharacter) != -1;
      }

      if (needToExport) {
        var token = {};
        token.ha = Math.round(glyph.advanceWidth * scale);
        token.x_min = Math.round(glyph.xMin * scale);
        token.x_max = Math.round(glyph.xMax * scale);
        token.o = "";
        glyph.path.commands.forEach(function(command, i) {
          if (command.type.toLowerCase() === "c") {
            command.type = "b";
          }
          token.o += command.type.toLowerCase();
          token.o += " ";
          if (command.x !== undefined && command.y !== undefined) {
            token.o += Math.round(command.x * scale);
            token.o += " ";
            token.o += Math.round(command.y * scale);
            token.o += " ";
          }
          if (command.x1 !== undefined && command.y1 !== undefined) {
            token.o += Math.round(command.x1 * scale);
            token.o += " ";
            token.o += Math.round(command.y1 * scale);
            token.o += " ";
          }
          if (command.x2 !== undefined && command.y2 !== undefined) {
            token.o += Math.round(command.x2 * scale);
            token.o += " ";
            token.o += Math.round(command.y2 * scale);
            token.o += " ";
          }
        });
        result.glyphs[String.fromCharCode(glyph.unicode)] = token;
      }
    }
  });

  result.familyName = font.familyName;
  result.ascender = Math.round(font.ascender * scale);
  result.descender = Math.round(font.descender * scale);

  result.underlinePosition = Math.round(
    font.tables.post.underlinePosition * scale
  );

  result.underlineThickness = Math.round(
    font.tables.post.underlineThickness * scale
  );

  result.boundingBox = {
    yMin: Math.round(font.tables.head.yMin * scale),
    xMin: Math.round(font.tables.head.xMin * scale),
    yMax: Math.round(font.tables.head.yMax * scale),
    xMax: Math.round(font.tables.head.xMax * scale),
  };

  result.resolution = 1000;
  result.original_font_information = font.tables.name;
  result.cssFontWeight = weight;
  result.cssFontStyle = variant;

  return result;
};

(async () => {
  const fonts = Object.keys(googleFonts);
  for await (font of fonts) {
    console.log(font);
    await convertGoogleFont(font);
  }
})();
