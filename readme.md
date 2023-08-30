# @prettier/html-ua-styles

[![Build Status][github_actions_badge]][github_actions_link]
[![Coverage][codecov_badge]][codecov_link]
[![Npm Version][package_version_badge]][package_link]
[![MIT License][license_badge]][license_link]

[github_actions_badge]: https://img.shields.io/github/actions/workflow/status/prettier/html-ua-styles/continuous-integration.yml?style=flat-square
[github_actions_link]: https://github.com/prettier/html-ua-styles/actions?query=branch%3Amain
[codecov_badge]: https://codecov.io/gh/prettier/html-ua-styles/branch/main/graph/badge.svg?token=Cvu6qhcepg
[codecov_link]: https://codecov.io/gh/prettier/html-ua-styles
[license_badge]: https://img.shields.io/npm/l/@prettier/html-ua-styles.svg?style=flat-square
[license_link]: https://github.com/prettier/html-ua-styles/blob/main/license
[package_version_badge]: https://img.shields.io/npm/v/@prettier/html-ua-styles.svg?style=flat-square
[package_link]: https://www.npmjs.com/package/@prettier/html-ua-styles

>

## Installation

```sh
yarn add @prettier/html-ua-styles
```

## Usage

```js
import htmlUaStyles from '@prettier/html-ua-styles';

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
