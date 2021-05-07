const fs = require('fs')
const fontsList = require('@compai/fonts-all')

const packages = Object.values(fontsList).map(font => font.packageName)
const packagePatches = packages.map(packageName => `"${packageName}": patch`)

const fullChangeset = `---
${packagePatches.join('\n')}
---

Update font data
`

fs.writeFileSync('.changeset/ham-sandwiches.md', fullChangeset)
