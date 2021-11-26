[![codecov](https://codecov.io/gh/g1eng/sdatch/branch/master/graph/badge.svg?token=mJQz4bRmsm)](https://codecov.io/gh/g1eng/sdatch)
[![CircleCI](https://circleci.com/gh/g1eng/sdatch/tree/master.svg?style=svg&circle-token=78cdb6d25075d986cefac72fa3cae880d5824534)](https://circleci.com/gh/g1eng/sdatch/tree/master)
[![logo]](/assets/images/logo-tiny.png)

sdatch.js (statical data-chart) is a d3 wrapper for casual data visualization. 

# Status

v0.1.0 (**alpha release**), the npm package is available on npmjs.com.

The static bundle file is not supplied at now. If you want to get a prebuilt static script as `sdatch.js`, copy it from `dist` directory or bundle it on your machine (follow the process on [here](#Develop)).

# Features

* Simple Layer constructors (e.g. Bar, Plot, Line, etc.) which needs single config object as the argument.
* Easy layer generation with sdatch class and related functions such as `createFigure` and `addLayer`.
* Additional layer operation via method chain syntax, such as `obj.setLabel().setTransition()`.

# Download and Install

```shell
cd path/to/project
npm install sdatch
```

# HowTos

1. Use sdatch Bar constructor on static HTML

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

2. same as previous one, but use addLayer

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

3. Embed sdatch into React App

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


# Core concept

Nowadays, there are many wrappers for d3 and there are many visualization solutions using d3. 
In many conditions, they support much more use cases than we think. 
It seems to be enough to use existing FLOSS wrapper library or SaaS which visualize our data, for business or personal.

We, sdatch developers, recognize two core values of the project, `CASUALTY` and `CONTEXT-ORIENTED` visualization.

### Casualty

* easy to use, for everyone including designers or non-frontend developers, even for beginners.
* easy to embed or bundle, supporting ES6+ `import` and React / Vue3 integration.
* easy to understand, built on top of ES6+ class abstraction with object-oriented layer model.

### Context-oriented (or developer-friendly)

* Any chart is also a context itself. sdatch should enable user to select the most beneficial context for specific use cases, specifying various rendering effects (e.g. color, positioning, font-family, padding, etc.).
* Using [sdatch's FigConfig object](src/sdatch.d.ts), users take powers to make a figure within a few lines, and a few works to implement it. You can make more time to think about the data.
* Built-in fail-safe rendering (FSR) supports you to render objects with few manual position adjustment. Always make it pretty, for coworkers, designers and for end users.

# Develop

* VSCode or WebStorm are recommended for editors.
* `npm run bundle` for make new bundle in `dist` dir.
* before `npm run test`, run `./replace_nyc.sh` to replace native coverage tool from nyc to c8. (dirty hack)

`docker-compose` is convenient to check e2e behavior of bundled script.

# Miscellaneous

### browser support

For this small project, that's so meaningless to support legacy browsers like IE9 or IE10 or IE11 or... Thus, we drop support for these browsers. 

The optimized script is put under `dist` directory, and it is built and bundled with webpack5 + babel-loader.
All UMD compatible stacks (V8, Spidermonkey, etc.) are supported with babel-loader (based on babel-7.14.x).

If you know there is corrupted behavior for the library on any browsers and if you think it should work, please make issues, thanks.

# Contact

make issues or PR, thanks.

# Special Thanks

[D3](https://github.com/d3/d3) is excellent library by [Mike Bostock](https://github.com/mbostock). This library is perfectly depends on his works. Thanks a lot Mr. Bostock! 
His library [d3](https://github.com/d3/d3) and its module is licensed under [ISC](D3_LICENSE). If you use this library, please include both of his [ISC license](/D3_LICENSE) and the license of [this project](/LICENSE).