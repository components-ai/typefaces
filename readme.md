# [Components AI](https://components.ai) - Typefaces

Collection of [Google Fonts](https://fonts.google.com) typeface
packages for [three.js](https://threejs.org/),
[react-three-fiber](https://github.com/pmndrs/react-three-fiber),
and other tools.

[Read the docs &rarr;](https://components.ai/docs/typefaces)

## Development

Below documents how to install dependencies and run the build scripts. If
you're looking to use the packages that are already built,
[check out the docs](https://components.ai/docs/typefaces).

### Installation

Install dependencies for package generation.

```sh
yarn
```

### Usage

The build script takes the Google Fonts listing, fetches their `ttf` font
files from the CDN, and then uses
[opentype.js](https://github.com/opentypejs/opentype.js) to convert to a
typeface.js format.

The conversion is adapted from
[facetype.js](https://github.com/gero3/facetype.js/blob/ce2f078003edbb5fd494fe7277face2f312567ca/LICENSE)
by [@gero3](https://github.com/gero3).

```sh
yarn build
```

### Release

This project uses [changesets](https://github.com/atlassian/changesets) to
handle versioning and package building.

```sh
yarn changeset
yarn version:packages
yarn release
```

## Resources

The following projects were used to aggregate, transform, and curate font data:

- [**Typewolf**](https://www.typewolf.com/google-fonts)
- [**facetype.js**](https://gero3.github.io/facetype.js/)
- [**opentype.js**](https://github.com/opentypejs/opentype.js)
- [**google-fonts-complete**](https://github.com/jonathantneal/google-fonts-complete)
