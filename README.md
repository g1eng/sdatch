[![codecov](https://codecov.io/gh/g1eng/sdatch/branch/master/graph/badge.svg?token=mJQz4bRmsm)](https://codecov.io/gh/g1eng/sdatch)
[![CircleCI](https://circleci.com/gh/g1eng/sdatch/tree/master.svg?style=svg&circle-token=78cdb6d25075d986cefac72fa3cae880d5824534)](https://circleci.com/gh/g1eng/sdatch/tree/master) 

<img src="https://raw.githubusercontent.com/g1eng/sdatch/master/assets/images/logo-tiny.png" /> The minimalists' d3 wrapper library

## Status

**alpha release**, the npm package is available.

Any static bundle file is not supplied at now. If you want to get a prebuilt static script as `sdatch.js`, copy it from `dist` directory or bundle it on your machine (follow the procedure [here](#Development)).

# Features

* Simple Layer constructors (e.g. Bar, Plot, Line, etc.) which needs single config object as the argument.
* Easy layer generation with sdatch class and related functions such as `createFigure` and `addLayer`.
* Additional layer operation via method chain syntax, such as `obj.setLabel().setTransition()`.

Sdatch supports 7 layers at now:

| Name | Stability | Test Status |
| --- | --- | --- |
| Bar | semi-stable | logical <br>manual UI test |
| Line | semi-stable | logical <br>manual UI test |
| Area | semi-stable | logical <br>manual UI test |
| Plot | semi-stable | logical <br>manual UI test |
| Bubble | semi-stable | logical <br>  manual UI test |
| Pie | unstable | uncovered UI bugs detected |
| Geo | unstable | problems in error handling<br/>  uncoverd functionalities |

See also our [design concept](#core-concept).

# Download and Install

```shell
cd path/to/project
npm install sdatch
```

# HowTos

Also see [FigConfig guide](docs/figconfig_guide.md) to specify adjustment parameters in `FigConfig` object.

### 1. Use sdatch Bar constructor on static HTML

```html

<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>sample</title></head>
<body>
<div id="sample-fig"></div>
</body>
<script type="text/javascript" src="sdatch.js"></script>
<script type="text/javascript">
    const data = [4, 5, 5, 4, 5], width = 300, height = 200
    let myAzukiBar = new sdatch.Bar({
        id: "layer1",
        data: data,
        area: {x: 200, y: 180},
        axe: {y: true},
        svg: {
            target: "sample-fig",
            width: width,
            height: height,
        },
        label: true,
        color: {fill: "#d66"}
    }).render()
</script>
</html>
```

### 2. same as previous one, but use addLayer

```html

<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>sample</title></head>
<body>
<div id="sample-fig"></div>
</body>
<script type="text/javascript" src="sdatch.js"></script>
<script type="text/javascript">
    const data = [1, 2, 3, 4, 5], width = 411, height = 200
    let fig = sdatch.createFigure("sample-fig", width, height)
    fig.addLayer({
        id: "layer2", type: "bar",
        data: data, axe: {y: true}, label: true,
        area: {x: 250, y: 180},
        color: {textBackground: "gray"}
    })

</script>
</html>
```

### 3. Embed sdatch into React App

```jsx

import React, {Component} from "react";
import sdatch,{Line,createFigure} from "sdatch";

class SomeTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            series: props.series,
            cubicSize: 300,
        }
    }
    componentDidMount(){
        let s = createFigure('fig-' + this.state.series, this.state.cubicSize, this.state.cubicSize),
            column = [1,2,3,5,8],
            data = [2.83,2.15,3.21,3.13,3.35],
            comp = [3,3,3,3,3]

        s.addLayer([{
            id: this.state.series , type: "line",
            column: column, data: data,
            color: { fill: "#f03589" }, label: true
        },{
            id: this.state.series + "-comparative", type: "line",
            column: column, data: comp,
            color: { fill: "#35f089" }, label: true,
            hasPlot: false
        }]).renderAll()
    }

    render() {
        return (
            <div className="card col-12 mb-2 bg-dark">
                <div id={'fig-' + this.state.series}></div>
            </div>
        )
    }
}

export default SomeTemplate
```

# Known problems

See [issues](https://github.com/g1eng/sdatch/issues).

# Core concept

Nowadays, there are many wrappers for d3 and there are many visualization solutions using d3. 
In many conditions, they support much more use cases than we think. 
It seems to be enough to use existing FLOSS wrapper library or SaaS which visualize our data, for business or personal.

We, sdatch developers, recognize three core values of the project, `CASUALTY`, `CONTEXT-ORIENTED VISUALIZATION` and `MINIMALISM`.

### Casualty

* easy to use, for everyone including designers or non-frontend developers, even for beginners.
* easy to embed or bundle, supporting ES6+ `import` and React / Vue3 integration.
* easy to understand, built on top of ES6+ class abstraction with object-oriented layer model.

### Context-oriented (or developer-friendly) visualization

* Any chart is also a context itself. sdatch should enable user to select the most beneficial context for specific use cases, specifying various rendering effects (e.g. color, positioning, font-family, padding, etc.).
* Using [sdatch's FigConfig object](dist/sdatch.d.ts#L187), users take powers to make a figure within a few lines, and a few works to implement it. You can make more time to think about the data.
* Built-in fail-safe rendering (FSR) supports you to render objects with few manual position adjustment. Always make it pretty, for coworkers, designers and for end users.

### Minimalism

* sdatch does not depend on other than d3-* family and essential small libraries. The libraries not in d3 family are mainly for some polyfill and data format converter.
* It should not depend on specific frontend libraries excluding d3.
* In such conditions, this library will be kept as small and simple as possible, ever for any additional functionalities.

# Development

### Environment

* Sdatch is under developing on Unix-like OS. macOS or Debian Bullseye are recommended.
* To develop or test on local, install [Node.js LTS release (13.x)](https://nodejs.org/) and [yarn](https://yarnpkg.com/getting-started/install)
* `npm run bundle` to make new bundle in `dist` dir.
* run `./replace_nyc.sh` before `npm run test`. It replaces native coverage tool from nyc to c8. (dirty hack)
* VSCode, VSCodium or WebStorm are recommended for your editor.

### Testing on localhost

Open `demo/demo.html` in browser.

### Testing on Containers

`docker-compose` is useful to check e2e behavior of bundled script. 

```shell
yarn install
yarn install --dev
docker-compose up -d
your-browser http://localhost:8080/demo.html
```

# Miscellaneous

### browser support

For this small project, that's so meaningless to support legacy browsers like IE9 or IE10 or IE11 or... Thus, we drop support for these browsers. 

The optimized script is put under `dist` directory, and it is built and bundled with webpack5 + babel-loader.
All UMD compatible stacks (V8, Spidermonkey, etc.) are supported with babel-loader (based on babel-7.14.x).

If you know there is corrupted behavior for the library on any browsers and if you think it should work, please make issues, thanks.

# Special Thanks

[D3](https://github.com/d3/d3) is excellent library by [Mike Bostock](https://github.com/mbostock). This library is perfectly depends on his works. Thanks a lot Mr. Bostock and D3 contributors!! 

# License

Sdatch is licensed under [MIT](LICENSE).
If you copy and redistribute bundled library in `dist`, don't forget also to copy [licenses](dist/sdatch.licenses.txt) for its dependencies.

# Contact

Make issues or PR, thanks.

Email can be acceptable for me but not recommended, because my response will be too slow to be notified because of the mailbox is flooded with notifications of GitHub and others.
