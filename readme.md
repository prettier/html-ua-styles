# html-ua-styles

[![Npm Version][package_version_badge]][package_link]
[![MIT License][license_badge]][license_link]
[![Coverage][coverage_badge]][coverage_link]

[coverage_badge]: https://img.shields.io/codecov/c/github/prettier/html-ua-styles.svg?style=flat-square
[coverage_link]: https://app.codecov.io/gh/prettier/html-ua-styles
[license_badge]: https://img.shields.io/npm/l/html-ua-styles.svg?style=flat-square
[license_link]: https://github.com/prettier/html-ua-styles/blob/main/license
[package_version_badge]: https://img.shields.io/npm/v/html-ua-styles.svg?style=flat-square
[package_link]: https://www.npmjs.com/package/html-ua-styles

> User agent stylesheet defined in [the WHATWG HTML specification](https://html.spec.whatwg.org/).

## Installation

```sh
yarn add html-ua-styles
```

## Usage

```js
import htmlUaStyles from 'html-ua-styles';

console.log(htmlUaStyles);
/* =>
[
  {
    type: 'Styles',
    selectors: [ ... ],
    styles: [ ... ]
  },
  ...
]
*/
```

---

Inspired by [`html-styles`](https://github.com/marionebl/html-styles)
