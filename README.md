# rush-pnpm-webpack-duplicate-module-issue

Demonstration of an issue with Rush + pnpm + webpack where a module is executed & included multiple times.

See https://github.com/Microsoft/web-build-tools/issues/1219.

### Usage

```
npm install --global @microsoft/rush
rush install
cd packages/app/
npm run build
npm run serve
```

Open http://localhost:5000

### Description

The React app in `index.js` uses [emotion](https://emotion.sh) + [emotion-theming](https://emotion.sh/docs/theming) to render a div. The background of the div should be blue since `primaryColor` is passed as a theme property, but the actual background is red due to the following:

The `@emotion/core/dist/core.browser.esm.js` module is included two times:

##### 1

```
webpack:///./index.js
-> webpack:////Users/spencerelliott/Dev/elliottsj/rush-pnpm-webpack-duplicate-module-issue/common/temp/node_modules/.registry.npmjs.org/@emotion/styled/10.0.10/node_modules/@emotion/styled/dist/styled.browser.esm.js
-> webpack:////Users/spencerelliott/Dev/elliottsj/rush-pnpm-webpack-duplicate-module-issue/common/temp/node_modules/.registry.npmjs.org/@emotion/styled-base/10.0.10/node_modules/@emotion/styled-base/dist/styled-base.browser.esm.js
-> webpack:////Users/spencerelliott/Dev/elliottsj/rush-pnpm-webpack-duplicate-module-issue/common/temp/node_modules/.registry.npmjs.org/@emotion/core/10.0.10/node_modules/@emotion/core/dist/core.browser.esm.js
```

With `moduleId === 17`.


##### 2

```
webpack:///./index.js
-> webpack:///core@10.0.10/node_modules/emotion-theming/dist/emotion-theming.browser.esm.js
-> webpack:////Users/spencerelliott/Dev/elliottsj/rush-pnpm-webpack-duplicate-module-issue/common/temp/node_modules/.registry.npmjs.org/@emotion/core/10.0.10/react@16.8.6/node_modules/@emotion/core/dist/core.browser.esm.js
```

With `moduleId === 28`.

This is problematic for emotion because the `ThemeContext` export of `@emotion/core` is meant to have _only one instance_. Due to the module being included multiple times, there ends up being _two instances of ThemeContext_. The instance used by `ThemeProvider` is different than the one used by `StyledDiv`, so `theme.primaryColor` is not passed along.

### Working scenarios

Using npm or pnpm _without Rush_ results in the expected background colour of blue:

##### npm only

```shell
rm -rf node_modules
npm install
npm run build
npm run serve
```

##### pnpm only

```shell
rm -rf node_modules
npm install --global pnpm@2.25.7
pnpm install
npm run build
npm run serve
```

And using npm instead of pnpm with Rush also works:

##### Using Rush with npm

1. Change `rush.json`'s `"pnpmVersion"` to `"npmVersion": "6.9.0"`.
2. 
    ```
    rm common/config/rush/shrinkwrap.yaml
    rush update
    cd packages/app/
    npm run build
    npm run serve
    ```

So, the bug only happens when using pnpm and Rush together.
