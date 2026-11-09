# Metro image parsing compatibility

The example resolves `image-size` to 2.0.3 to address CVE-2025-71330.
This requires Node.js 18 or newer.

`metro+0.58.0.patch` adapts Metro's asset reader to the named `imageSize`
export and buffer-only input API. `yarn install` applies it through
`patch-package`; run `yarn test:assets` to verify asset dimensions and the
malformed ICNS regression.
