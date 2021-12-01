import {scaleBand, scaleLinear} from "d3-scale";
import {select, selectAll} from "d3-selection";
import {max, min, range} from "d3-array";
import {axisBottom, axisLeft, axisRight, axisTop} from "d3-axis";
import {getFigureCore, getSvgId} from "../lib.js";
import {active} from "d3-transition";

class LayerError extends Error{
    constructor(msg,id) {
        if(id) console.log(id)
        super(msg);
    }
}
/***
 * Layer is abstract for chart classs on sdatch. Any chart classes extends this class
 * and shared core methods implemented within this class.
 *
 * The Layer constructor is the default constructor for Layer family classes.
 * The constructor has common features with other constructors of families
 * (e.g. Bar, Plot, etc.), but there are several lack of the initialization
 * process.
 *
 * (1) the constructor does not set any scales with autoScale* methods.
 *
 * (2) it made simply register data with specified one and does not modify them.
 *
 * (3) it does not validate or rewrite layer type by default.
 *
 * So users must specify valid type or other options to use `raw` Layer constructor like this:
 *
 * ```
 * let sta = createFigure("sample", 300,300)
 * sta.addLayer([{
 *   id: "line-big",
 *   type: "line",
 *   column: [1020,1292,1319,1235],
 *   data: [2008,2005,2001,1994],
 *   color: {
 *     fill: "orange"
 *   },
   }])
 * ```
 *
 * @param {FigConfig} conf
 */
class Layer{


    constructor(conf) {
        this.id = conf.id

        this.setSVG(conf)

        if (conf.rel)
            this.rel = conf.rel

        this.font = {
            family: "",
            size: 10
        }
        if (conf.font)
            Object.assign(this.font, conf.font)
        this.setMargin(conf)
        this.setArea(conf)

        //layer containers
        this.fig = this.svg.body  //origin container

        this.scale = {
            x: null,
            y: null
        }

        this.isAnimated = (conf.animation !== false)

        this.data = conf.data
        if(conf.hasOwnProperty("column"))
            this.column = conf.column

        // focusing
        this.focus = {}
        if(typeof conf.focus == "object"){
            Object.assign(this.focus, conf.focus)
            for (let i in this.focus)
                if (this.focus.hasOwnProperty(i))
                    if (typeof this.focus[i] !== "object" || typeof this.focus[i][0] !== "number")
                        throw new LayerError("invalid focus array")
        } else if ( conf.focus === true ){
            this.focus = true
        }

        this.axis = {}
        Object.assign(this.axis, conf.axe)
        this.ticks = {
            x: {
                inner: false,
                values: []
            },
            y: {
                inner: false,
                values: []
            },
        }
        if (conf.ticks)
            for (let i in conf.ticks)
                if (conf.ticks.hasOwnProperty(i) && this.ticks.hasOwnProperty(i))
                    Object.assign(this.ticks[i], conf.ticks[i])

        this.type = conf.type
        this.label = {
            visible: true,
            fade: true,
            rotate: false,
        }
        if (typeof conf.label === "object")
            Object.assign(this.label, conf.label)
        else if (conf.label === true || conf.label === false)
            this.label = conf.label

        if (conf.hasOwnProperty("plot"))
            this.plot = (conf.plot === true)

        this.el = {
            collision: null,
            label: null,
            labelRect: null,
            axe: null,
        }
        this.color = {
            fill: "green",
            stroke: "black",
            text: "black",
            textBackground: "white",
            axe: "black",
            axeText: "black"
        }
        if (conf.color)
            Object.assign(this.color, conf.color)
        this.fade = {
            label: {
                in: null,
                out: null,
                accentColor: null,
                init: null
            },
            area: {
                in: null,
                out: null,
                accentColor: null,
                init: null
            },
        }
        for (let i in conf.fade)
            if (conf.fade.hasOwnProperty(i) && this.fade.hasOwnProperty(i))
                Object.assign(this.fade[i], conf.fade[i])

        if(this.fade.area.accentColor){
            this.setHoverColor()
        }

        //FSR
        // FSR is enabled only for array data, not for object type data
        if (this.data.length){
            this.safe = {
                margin: {top: 0, left: 0, right: 0, bottom: 0, z: 0},
                area: {x: this.area.x, y: this.area.y, z: 0},
                range:0
            }
            if (typeof conf.safe === "object")
                Object.assign(this.safe, conf.safe)
            else if (conf.safe !== false) {
                const labelLength = String(this.getDataWith(max).y).length,
                    labelWidth =  this.font.size * ((labelLength === 1)? 2 : labelLength)
                //preset safe rendering parameters
                this.safe = {
                    margin: {
                        top: this.font.size * 4,
                        left: (this.axis.right)? this.font.size: labelWidth,
                        right: (this.axis.right)? labelWidth: this.font.size,
                        bottom: 0,
                        z: 10
                    },
                    area: {
                        x: this.area.x - this.font.size,
                        y: this.area.y - this.font.size * 3,
                    },
                    range:  0.1,
                }
                this.safe.area.z = Math.floor(this.area.x / 4 )
            }
        }

    }

    /***
     * updateDataCore sets data with given argument.
     * The data must have same length with previous one
     * @param data - data to assign to Layer.data
     */
    updateDataCore(data){
        if(!data.length)
            throw new LayerError("data must be an array with one or more length")
        if(this.data.length !== data.length)
            throw new LayerError("data length must be same as previous one")
        this.data = data
    }

    /***
     * getDataWith gets minimal or maximum data from data or column.
     * It needs d3-array's min or max function as a argument and invoke it at the
     * execution.
     *
     * @param func
     * @return {{x: (*|number), y}|{x, y}|{x, y, z}}
     */
    getDataWith(func){
        if (func !== min && func !== max)
            throw new LayerError("function must be min or max of d3-array")
        if (!this.data)
            throw new LayerError("data not set")
        else if (this.data[0].length && this.data[0].length === 2) {
            let data = [[],[]]
            this.data.forEach((d) => {
                data[0].push(d[0])
                data[1].push(d[1])
            })
            return {
                x: func(data[0]),
                y: func(data[1])
            }
        } else if (this.data[0].length && this.data[0].length === 3) {
            let data = [[],[],[]]
            this.data.forEach((d) => {
                data[0].push(d[0])
                data[1].push(d[1])
                data[2].push(d[2])
            })
            return {
                x: func(data[0]),
                y: func(data[1]),
                z: func(data[2])
            }
        } else if (typeof this.data[0] !== "number") {
            console.log("DATA: ",this.data)
            throw new LayerError("data must be values")
        } else {
            let minVal
            if (func === min) minVal = 0
            else minVal = this.data.length
            return {
                x: (this.column && typeof this.column[0] === "number")
                    ?func(this.column) : minVal,
                y: func(this.data)
            }
        }
    }

    /***
     * setSVG generate core SVG object from the specified FigConfig argument.
     * @param {FigConfig} conf
     */
    setSVG(conf){
        this.svg = {}
        if(!conf.svg)
            throw new LayerError("Layer constructor needs a svg property")
        Object.assign(this.svg, conf.svg)
        const defaultHeight = 200,
            defaultWidth = 300,
            target = (this.svg.target)? this.svg.target: "there_is_no_target_for_set_svg",
            hasNoId = !this.svg.id,
            hasNoTarget = !this.svg.target,
            hasNoWidth = !this.svg.width,
            hasNoHeight = !this.svg.height,
            hasNoBody = !this.svg.body,
            hasExistSvg = this.svg.id
                && document.getElementById(this.svg.id) !== null
                && select("#"+this.svg.id)._groups[0].length,
            hasExistTarget = this.svg.target
                && document.getElementById(target) !== null,
            setBodyWithSvgId = ()=>{
                this.svg.body = select("#"+this.svg.id)
            },
            setBodyWithTarget = ()=>{
                this.svg.body = getFigureCore(this.svg.target, this.svg.width, this.svg.height)
                this.svg.id = getSvgId(this.svg.target)
            }

        switch (typeof conf.svg) {
            case "object":
                if ( hasNoId && hasNoTarget && hasNoBody)
                    throw new LayerError("svg property must contain either id, body or target field")
                if ( !hasNoId && !hasNoTarget)
                    throw new LayerError("either svg id or target is only specified")
                if( this.svg.target && !hasExistTarget)
                    throw new LayerError("target is not exist")
                // if( hasExistSvg)
                //     this.svg.width = select("#" + this.svg.target)._groups[0][0].scrollWidth
                if( hasNoWidth )
                    this.svg.width = defaultWidth
                if( hasNoHeight )
                    this.svg.height = defaultHeight

                if( this.svg.body )
                    break
                else if( hasExistSvg )
                    setBodyWithSvgId()
                else if( hasExistTarget )
                    setBodyWithTarget()
                else if ( hasNoBody )
                    throw new LayerError("unconditional error")
                break
            case "string":
                if(document.getElementById(conf.svg) === null)
                    throw new LayerError("no svg exist with id " + conf.svg)
                this.svg = {
                    id: getSvgId(conf.svg),
                    target: conf.svg,
                    body: null
                }
                this.svg.width = defaultWidth
                this.svg.height = defaultHeight
                this.svg.body = getFigureCore(conf.svg, this.svg.width, this.svg.height)
                break
            default:
                throw new LayerError("invalid svg property specified")
        }
        if (!this.svg.id)
            this.svg.id = "unknown"
    }

    /***
     * setMargin sets margin property for the Layer instance.
     * By default, this method sets 0, 0 margin for top and left.
     * (But it is immediately modified in the constructor for fail-safe rendering,
     * avoiding character clapping out of figure boundary)
     * @param {FigConfig} conf
     */
    setMargin(conf){
        this.margin = {
            top: 0,
            left: 0
        }
        switch (typeof conf.margin) {
            case "number":
                this.margin = {
                    top: conf.margin,
                    left: conf.margin,
                }
                break
            case "object":
                if( typeof conf.margin.length === "number"){
                    if (conf.margin.length === 2) {
                        this.margin = {
                            top: conf.margin[0],
                            left: conf.margin[1],
                            z: conf.margin[2]? conf.margin[2]: 0
                        }
                        break
                    } else {
                        throw new LayerError("margin array length must be 2 ")
                    }
                } else {
                    Object.assign(this.margin, conf.margin)
                }
                break
            case "undefined":
                this.margin = {
                    top: 0,
                    left: 0,
                }
                break
            default:
                throw new LayerError("margin must be specified in a number, array or object")
        }
        if(this.margin.right===undefined) this.margin.right = 0
        if(this.margin.z===undefined) this.margin.z = 0
    }

    /***
     * setArea sets area property for the Layer instance
     * @param {FigConfig} conf
     */
    setArea(conf){
        this.area = {}
        if (typeof conf.area === "object")
            Object.assign(this.area, conf.area)
        else if (typeof conf.area === "number")
            this.area = {
                x: conf.area,
                y: conf.area,
                z: Math.floor(conf.area / 4)
            }
        else
            this.area = {
                x: this.svg.width,
                y: this.svg.height,
                z: Math.floor(this.svg.height / 4),
            }
        if (!this.area.hasOwnProperty("x"))
            this.area.x = this.svg.width
        if (!this.area.hasOwnProperty("y"))
            this.area.y = this.svg.height
        if (!this.area.hasOwnProperty("z"))
            this.area.z = Math.sqrt(this.area.x * this.area.y) / 5
    }

    /**
     * autoScaleY automatically detects the range of Y scale for two dimensional data,
     * and enables FSR for the layer.
     */
    autoScaleY(){
        let scaleX, scaleY, xBoundary

        if ( this.focus === true )
            this.focus = {
                y: [
                    Math.floor(min(this.data) / (1 + this.safe.range)),
                    Math.ceil(max(this.data) * (1 + this.safe.range) ),
                ]
            }

        // console.log(this.id, this.margin.left, this.safe)

        xBoundary = this.area.x - this.getLabelWidth() / 2 - this.margin.right - this.safe.margin.right

        if (this.column)
            scaleX = scaleBand()
                .domain( this.column )
                .range([
                    this.margin.left + this.safe.margin.left,
                    xBoundary
                ])
        else {
            scaleX = scaleBand()
                .domain(
                    range(1, this.data.length + 1  , 1)
                )
                .range([
                    this.margin.left + this.safe.margin.left,
                    xBoundary
                ])
        }
        if (this.focus.hasOwnProperty("y"))
            scaleY = scaleLinear()
                .domain([
                    this.focus.y[0],
                    this.focus.y[1]
                ])
                .range([
                    this.area.y,
                    this.safe.margin.top
                ])
                .nice()
        else
            scaleY = scaleLinear()
                .domain([
                    min(this.data) > 0 ? 0 : min(this.data),
                    max(this.data) + 1
                ])
                .range([
                    this.area.y ,
                    this.safe.margin.top
                ])
                .nice()
        this.scale = {
            "x": scaleX,
            "y": scaleY
        }
    }

    /**
     * autoScaleXYZ automatically detects the range of X and Y scale for
     * three dimensional data on the layer, and enables FSR for that.
     */
    autoScaleXYZ() {
        let column
        if (this.column) column = this.column
        else if (this.data[0].length) {
            column = []
            this.data.forEach((d)=>{
                column.push(d[0])
            })
        } else {
            throw new LayerError("data is not multi-dimensional")
        }
        let scaleX, scaleY, scaleZ=null
        const maxValues = this.getDataWith(max),
            minValues = this.getDataWith(min),
            xMax = Math.ceil(maxValues.x * (1 + this.safe.range)),
            xMin = minValues.x > 0 ? 0 : min(column),
            yMax = Math.ceil(maxValues.y * (1 + this.safe.range)),
            yMin = minValues.y > 0 ? 0 : minValues.y,
            getXScaleWithMargin = (additionalMargin )=>(
                scaleLinear()
                    .domain([
                        this.focus.x[0] - additionalMargin * 1.5,
                        this.focus.x[1] + additionalMargin * 1.5
                    ])
                    .range([
                        this.margin.left + this.safe.margin.left,
                        this.area.x - this.safe.margin.right
                    ])
            ),
            getYScaleWithMargin = (additionalMargin = 0)=>(
                scaleLinear()
                    .domain([
                        this.focus.y[0] - additionalMargin * 1.5,
                        this.focus.y[1] + additionalMargin * 1.5
                    ])
                    .range([
                        this.area.y - this.margin.top,
                        this.safe.margin.top
                    ])
            )


        if ( this.focus === true )
            this.focus = {
                x: [
                    Math.floor(min(column) / (1 + this.safe.range)),
                    xMax
                ],
                y: [
                    Math.floor( minValues.y / (1 + this.safe.range)),
                    yMax
                ]
            }

        if (maxValues.hasOwnProperty("z"))
            scaleZ = scaleLinear()
                .domain([
                    minValues.z,
                    maxValues.z
                ])
                .range([
                    (this.margin.z!==undefined)? this.margin.z: this.safe.area.z,
                    this.area.z
                ])

        let marginSafeByZ
        if (scaleZ !== null )  marginSafeByZ = scaleZ(maxValues.z)
        else marginSafeByZ = 0

        if (this.focus.hasOwnProperty("x") ){
            scaleX = getXScaleWithMargin(0)
            const xScaleRatio = scaleX(2) - scaleX(1)
            // re-declare scaleX with scaleX
            scaleX = getXScaleWithMargin(marginSafeByZ / xScaleRatio)
        } else {
            scaleX = scaleLinear()
                .domain([
                    xMin,
                    xMax
                ])
                .range([
                    this.margin.left + this.safe.margin.left,
                    this.area.x - this.safe.margin.right
                ])
        }

        if (this.focus.hasOwnProperty("y") ){
            scaleY = getYScaleWithMargin(0)
            const yScaleRatio = scaleY(1) - scaleY(2)
            // re-declare scaleY with scaleY
            scaleY = getYScaleWithMargin(marginSafeByZ / yScaleRatio)
        } else{
            scaleY = scaleLinear()
                .domain([
                    yMin,
                    yMax
                ])
                .range([
                    this.area.y - this.margin.top,
                    this.safe.margin.top
                ])
        }

        Object.assign(
            this.scale,
            {
                "x": scaleX,
                "y": scaleY,
                "z": scaleZ,
            }
        )
    }

    /**
     * styleAxe sets style for specified `dim` of the layer with preset axe style object,
     * specified in `FigConfig.font` and `FigConfig.color.axe`.
     * @param dim["x"|"y"]
     */
    styleAxe(dim){
        const axeId = this.svg.id + "_" + this.id + "_axe_" + dim
        if (dim === "y")
            selectAll(`#${axeId}>path`)
                .attr("font-size", `${this.font.size}px`)
                .attr("stroke", this.color.axe)
                .attr("transform", "matrix(-0.1, 0, 0, 1, 1, 1)")
        else
            selectAll(`#${axeId}>path`)
                .attr("font-size", `${this.font.size}px`)
                .attr("stroke", this.color.axe)
        selectAll(`#${axeId}>g>line`)
            .attr("font-size", `${this.font.size}px`)
            .attr("stroke", this.color.axe)
        selectAll(`#${axeId}>g>text`)
            .attr("font-size", `${this.font.size}px`)
            .attr("stroke", this.color.axeText)
            .attr("fill", this.color.axeText)
    }

    /**
     * [internal] appendAxeX appends X axe for the Layer
     * @param isDefaultAxe
     * @returns {Layer}
     */
    appendAxeX (isDefaultAxe = false){
        let axeX, ticksValues = [], xOrigin
        if (this.ticks.x.values && this.ticks.x.values.length)
            ticksValues = this.ticks.x.values
        const scaleX = this.scale.x
        if (this.axis.top === true){
            axeX = axisTop(scaleX)
        } else if (this.axis.x === true || this.axis.bottom === true){
            axeX = axisBottom(scaleX)
        } else if(!axeX && isDefaultAxe) axeX = axisBottom(scaleX)
        else if(!axeX) return this

        if (!ticksValues || ticksValues.length === 0)
            axeX = axeX.ticks(5)
        else
            axeX = axeX.tickValues(ticksValues)
        if (this.ticks.x && this.ticks.x.inner)
            axeX = axeX.tickSizeInner( this.safe.margin.top - this.area.y )

        xOrigin = 0


        const axeId = this.svg.id + "_" + this.id + "_axe_x"
        this.el.axe = this.svg.body.append("g")
            .attr("id", axeId)
            .attr("class","sdc-axis sdc-axis-x")
            .attr("stroke","white")
            .attr("stroke-width","1px")
            .attr("transform", `translate(${xOrigin},${this.area.y + this.margin.top})`)
            .call(axeX)
        this.styleAxe("x")
    }

    /**
     * [internal] appendAxeY appends Y axe for the Layer
     * @param isDefaultAxe
     * @returns {Layer}
     */
    appendAxeY (isDefaultAxe = false){
        let axeY, xOrigin, yOrigin, ticksValues = []
        if (this.ticks.y.values && this.ticks.y.values.length)
            ticksValues = this.ticks.y.values
        const scaleY= this.scale.y
        if (this.axis.right === true){
            xOrigin = this.area.x - this.margin.right - this.safe.margin.right
            yOrigin = this.margin.top
            axeY = axisRight(scaleY)
        } else if (this.axis.y === true || this.axis.left === true){
            xOrigin = this.margin.left + this.safe.margin.left
            yOrigin = this.margin.top
            // console.log("ok",xOrigin, this.safe.margin, this.margin)
            axeY = axisLeft(scaleY)
        } else if(isDefaultAxe) {
            xOrigin = this.margin.left + this.safe.margin.left
            yOrigin = this.margin.top
            axeY = axisLeft(scaleY)
        }
        else if(!axeY) return this

        if (!ticksValues || ticksValues.length === 0)
            axeY = axeY.ticks(5)
        else
            axeY = axeY.tickValues(ticksValues)
        if (this.ticks.y && this.ticks.y.inner)
            axeY = axeY.tickSizeInner( -this.area.x + this.safe.margin.left + this.margin.right + this.safe.margin.right)

        // console.log(`${this.id}: xOrigin, ${xOrigin}, area ${this.area.x}, margin: ${this.margin.left} , safe: `,this.safe)

        if(xOrigin === undefined) xOrigin = this.margin.left + this.safe.margin.left
        if(yOrigin === undefined) yOrigin = this.safe.margin.top
        if(this.type === "bar" && typeof this.scale.x.bandwidth === "function")
            xOrigin -= this.getLabelWidth() / 2
        if(this.type === "area" && typeof this.scale.x.bandwidth === "function")
            xOrigin += this.scale.x.bandwidth() /2.5
        const axeId = this.svg.id + "_" + this.id + "_axe_y"
        this.el.axe = this.svg.body.append("g")
            .attr("id", axeId)
            .attr("class","sdc-axis sdc-axis-y")
            .attr("stroke","white")
            .attr("stroke-width","1px")
            .attr("transform", `translate(${xOrigin},${yOrigin})`)
            .call(axeY)
        this.styleAxe("y")
    }

    /***
     * renderAxe renders axe and registers axe element into Layer.el
     * @param {Boolean} initialize
     */
    renderAxe(initialize=false){
        if (initialize && !this.axis) return

        const hasAxeX = this.axis.x === true
                || this.axis.top ===true
                || this.axis.bottom === true,
            hasAxeY = this.axis.y === true
                || this.axis.left === true
                || this.axis.right === true

        if(initialize && this.axis && hasAxeX )
            this.appendAxeX()
        if(initialize && this.axis && hasAxeY )
            this.appendAxeY()
        if(!initialize){
            this.appendAxeX(true)
            this.appendAxeY(true)
        }
        if( (initialize || hasAxeX) && this.label.rotate )
            this.rotate("axe", 90)

        return this
    }

    /**
     * check whether the layer has data or not.
     * With preset data, it returns data length.
     * Without data, it returns false.
     * @returns {false|number}
     */
    hasData(){
        return typeof this.data === "object" && this.data.length
    }

    /**
     * check whether the layer has nested data or not.
     * If it has data ant its data is nested, it returns true
     * @returns {Boolean}
     */
    hasNestedData(){
        return this.hasData()
            && typeof this.data[0] === "object"
            && this.data[0].length
    }

    /**
     * check whether it has column or not.
     * With preset column, it returns column length.
     * @returns {false|number}
     */
    hasColumn(){
        return typeof this.column === "object" && this.column.length
    }

    /**
     * check whether the column of the layer is numbered column or not.
     * With the column is numbered, it returns true.
     * @returns {Boolean}
     */
    hasNumberColumn(){
        return typeof this.column === "object"
            && this.column.length
            && typeof this.column[0] === "number"
    }

    /***
     * getNormalizedXYData returns normalized data for two-dimensional data.
     * It returns data within an array of arrays of numbers.
     * All datum is ensured to contains only `number` typed values.
     *
     *
     * If the Layer has a number column, its data will be included in returned data.
     * If the Layer has a string column, its data will not be included but sequences added for the data.
     * If the Layer has data within array of arrays, it will be returned simply.
     *
     * @return {Array<Array<Number>>}
     */
    getNormalizedXYData(){
        let i=0;
        let data = []

        if (this.hasNestedData()){
            data = this.data
        } else if (this.hasColumn()){
            if(!this.column.length || this.data.length > this.column.length)
                throw new LayerError("invalid column length")
            else if (this.hasNumberColumn())
                for (let i=0;i<this.data.length; i++)
                    data.push([this.column[i], this.data[i]])
            else
                this.data.forEach((d)=>{ data.push([i++, d]) })
        }
        else
            this.data.forEach((d)=>{ data.push([i++, d]) })

        return data
    }

    /***
     * getScaleForData returns scales tuned for two-dimensional data.
     * Returned functions (scale x, y and optional z) are receiving an array for the argument and returns
     * scaled value for x or y (or z) dimension of the data array.
     *
     * If x scale is a band scale, it sets band x scaling for the x function.
     *
     * @return {{x: (function(*): *), y: (function(*): *), z: (function(*): *)}}
     */
    getScaleForData(){
        let scaleX, scaleY, scaleZ
        const scaleS = this.scale.x,
            scaleT = this.scale.y,
            scaleU = this.scale.z? this.scale.z: d=>d
        if (scaleS.bandwidth !== undefined){
            scaleX = (d) => (
                this.margin.left + this.safe.margin.left + d[0] * scaleS.bandwidth() + scaleS.bandwidth() /2
            )
            scaleY = (d) => (this.scale.y(d[1]))
            scaleZ = scaleU
        } else {
            scaleX = d => scaleS(d[0])
            scaleY = d => scaleT(d[1])
            scaleZ = d => scaleU(d[2])
        }
        return {
            x: scaleX,
            y: scaleY,
            z: scaleZ
        }
    }

    /***
     * setCollision sets collision area for each plot.
     * It assumes any data can be mapped to plot and needs two dimensional data.
     */
    setCollision(){
        let scale = this.getScaleForData()

        this.el.collision = this.svg.body.selectAll("svg")
            .append("g")
            .data(this.getNormalizedXYData())
            .enter()
        this.el.collision = this.el.collision.append("circle")
            .attr("id", (d,i)=> (this.svg.id + "_" + this.id + "_collision_" + i))
            .attr("class", "circle-boundary")
            .attr("cx", (d)=>(scale.x(d) + this.margin.left) )
            .attr("cy", (d)=>(scale.y(d) + this.margin.top) )
            .attr("r", "1.5em")
            .attr("stroke", "rgba(0,0,0,0)")
            .attr("stroke-width","1px")
            .attr("fill", "rgba(0,0,0,0)")
    }

    /**
     * setCollisionBar sets new collision area for the layer.
     * It refers preset data and appends calculated collision area for the layer.
     * It needs single dimensional data.
     * (Multi-layer collision detection is not supported at now)
     */
    setCollisionBar(){
        const scaleX = this.scale.x,
            areaY = this.area.y

        this.el.collisionBar = this.svg.body.selectAll("svg")
            .append("g")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("id", (d,i)=> (this.svg.id + "_" + this.id + "_collision-bar_" + i))
            .attr("x",(d,i)=> (i * scaleX.bandwidth()) + this.margin.left + this.safe.margin.left )
            .attr("width",() => scaleX.bandwidth() )
            .attr("y", 0 )
            .attr("height", areaY )
            .attr("stroke", "rgba(0,0,0,0)")
            .attr("fill", "rgba(0,0,0,0)")
    }

    /***
     * plot makes plot even if the instance is not a Plot class.
     * You can draw plot on the values which is registered in Layer.data.
     *
     * That's useful for lines, which needs popups or edge emphasis.
     * @return {Layer|Bar|Line|Plot}
     */
    renderPlot(){
        let scale = this.getScaleForData()

        this.fig = this.fig.selectAll("svg")
            .append("g")
            .data(this.getNormalizedXYData())
            .enter()
        this.el.plot = this.fig.append("circle")
            .attr("id", (d,i)=> (this.svg.id + "_" + this.id + "_plot_" + i))
            .attr("class", "plot")
            .attr("cx", scale.x )
            .attr("cy", scale.y )
            .attr("stroke", this.color.fill)
            .attr("stroke-width","1px")
            .attr("fill", this.color.fill)

        if(this.isAnimated){
            this.el.plot = this.el.plot
                .attr("r", "0")

            this.el.plot.transition()
                .duration(700)
                .on("start", function(){
                    active(this)
                        .attr("r", "0.2em")
                })
        } else {
            this.el.plot = this.el.plot
                .attr("r", "0.2em")
        }


        return this
    }

    /***
     * rotate rotates specified target SVG element with given degree
     * @param {String} target to rotate
     * @param {Number} deg degree to rotate
     */
    rotate(target, deg){
        // console.log(this.id, "rotating", this.svg.id + "_" + this.id + "_axe_x")
        let xOffset, yOffset
        const getRotate = function(d){
            const labelWidth = String(d).length
            return "rotate(" + deg + ` ${yOffset - labelWidth } ${xOffset + labelWidth})`
        }
        if (this.scale.x.bandwidth !== undefined){
            xOffset = this.scale.x.bandwidth() /4 + 150 / this.font.size
            yOffset = -this.scale.x.bandwidth() /4
        }
        else{
            xOffset = this.font.size * 1.2
            yOffset = 0
        }
        if (typeof deg !== "number")
            throw new LayerError("rotate degree must be specified in number")
        switch (target) {
            case "axe":
                selectAll("#" + this.svg.id + "_" + this.id + "_axe_x")
                    .selectChildren()
                    .selectAll("text")
                    .attr("transform", getRotate)
                break
            case "svg":
            default:
                this.svg.attr("transform", "rotate(" + deg + " -10 -10)")
        }
        return this
    }

    /***
     * setHoverColor sets hover action for layer color changing for
     * each datum.
     */
    setHoverColor(){
        const color = this.color
        const accentColor = this.fade.area.accentColor
        this.fade.area.in = function(){
            select("#" + this.id)
                .transition()
                .duration(200)
                .attr("fill", accentColor)
                .attr("stroke", accentColor)
        }
        this.fade.area.out = function(){
            select("#" + this.id)
                .transition()
                .duration(200)
                .attr("fill",
                    (typeof color.fill === "function")
                        ? color.fill
                        : ()=> (color.fill)
                )
                .attr("stroke",
                    (typeof color.stroke === "function")
                        ? color.fill
                        : ()=> (color.stroke)
                )
        }
    }

    /***
     * setFade activate label fading for the layer label.
     */
    setFade(){
        const textColor = this.color.text
        const rectColor = this.color.textBackground
        this.fade.label.in = function(){
            const labelId = (this.id)
                .replaceAll(
                    /_(rect|collision|collision-bar|area|arc)_/g,
                    "_label_"
                )

            select("#" + labelId)
                .transition()
                .duration(200)
                .selectChildren("rect,path") //TODO: ensure compatibility for other elements
                .attr("fill", rectColor)
                .attr("stroke", rectColor)

            select("#" + labelId)
                .transition()
                .duration(200)
                .selectChildren("text")
                .attr("fill", textColor)
                .attr("stroke", textColor)

        }
        this.fade.label.out =  function(){
            const labelId = (this.id)
                .replaceAll(
                    /_(rect|collision|collision-bar|area|arc)_/g,
                    "_label_"
                )

            select("#" + labelId)
                .transition()
                .duration(200)
                .selectChildren("rect,path")
                .attr("fill", "rgba(255,255,255,0)")
                .attr("stroke", "rgba(255,255,255,0)")

            select("#" + labelId)
                .transition()
                .duration(200)
                .selectChildren("text")
                .attr("fill", "rgba(0,0,0,0)")
                .attr("stroke", "rgba(0,0,0,0)")
        }


    }

    /***
     * getLabelArray returns the array of label string for specified column and data.
     * Each label is concatenated string of column value and corresponding datum.
     * (mainly for Pie charts)
     * @returns {String[]}
     */
    getLabelArray(){
        let label, getLabelDatum, labelArray = []
        if(this.column && !this.data[0].length)     //columned plot is not for the condition
            getLabelDatum = (i)=>( this.column[i] + ", " + this.data[i] )
        else if (!this.data[0].length)
            getLabelDatum = (i)=>( this.data[i] )
        else if (this.column && this.data[0].length){              //bubble or xyz data
            getLabelDatum = (i)=>{
                return this.column[i] + ", " + this.data[i].join(", ")
            }
        }
        else if (this.data[0].length){              //plot or xy data
            getLabelDatum = (i)=>{
                return this.data[i].join(", ")
            }
        }

        for(let i=0;i<this.data.length; i++){
            label = getLabelDatum(i)
            labelArray.push(label)
        }
        return labelArray
    }

    /**
     * getLabelMax returns the length of the most longest label in the label array.
     * (mainly for Pie charts)
     * @returns {number}
     */
    getLabelMax(){
        let labelMax=0, labelArray = this.getLabelArray()

        for(let i=0;i<labelArray.length; i++){
            if (String(labelArray[i]).length > labelMax)
                labelMax = String(labelArray[i]).length
        }

        return labelMax
    }

    /**
     * getLabelWidth returns the max label width in the layer, based on font size and
     * the max label length.
     * @returns {number}
     */
    getLabelWidth(){
        return (this.getLabelMax() + 2) * this.font.size / 2
    }

    /**
     * unsetLabel deletes any preset labels for the layer.
     */
    unsetLabel(){
        this.el.label.remove()
        delete(this.el.label)
        this.el.label = null
        this.el.labelRect.remove()
        delete(this.el.labelRect)
        this.el.labelRect = null
    }

    /**
     * getLabelClass returns HTML class string with tagged pattern
     * @return {String}
     */
    getLabelClass(){
        return this.svg.id + "_" + this.id + "_label sdc-label"
    }

    /***
     * setLabel is the label initializer for a chart which DOES NOT have explicitly
     * disabled label attribute with `FigConfig.label`.
     * @param {Boolean} [fade=false]
     * @return {Layer|Bar|Line|Plot|Pie}
     */
    setLabel(fade=false){
        if (!this.data.length)
            throw new LayerError("data not defined for this instance", this.id)

        let rectHeight = this.font.size * 2,
            rectWidth = 0,
            getX,
            getY
        const scaleX = this.scale.x,
            scaleY = this.scale.y,
            getLabelId = (d,i)=> ( this.svg.id + "_" + this.id + "_label_" + i)

        rectWidth = this.getLabelWidth()

        if(scaleX.bandwidth !== undefined){
            getX = (d,i) => (
                i * scaleX.bandwidth() + this.margin.left + this.safe.margin.left + scaleX.bandwidth()/2 - rectWidth / 2
            )
            getY = (d) => {
                if (d.length) d = d[1]
                return scaleY(d) - this.font.size * 2 - rectHeight / 1.5 + this.margin.top
            }
        } else {
            getX = (d) => {
                return scaleX(d[0]) - rectWidth / 2
            }
            getY = (d) => {
                return scaleY(d[1]) - this.font.size * 2 - rectHeight / 1.5 + this.margin.top
            }
        }

        this.el.label = this.svg.body.selectAll("svg")
            .append("g")
            .data(this.getNormalizedXYData())
            .enter()
            .append("g")
            .attr("id", getLabelId)
            .attr("class", this.getLabelClass())
            .attr("style", "pointer-events: none")

        const pathWidth = rectWidth,
            pathHeight = rectHeight
        rectHeight = -rectHeight
        rectWidth = 0

        this.el.labelRect = this.el.label.append("path")
            .attr("d", (d,i) => `M ${getX(d,i)}, ${getY(d,i)}
                L ${getX(d,i) - this.font.size/2}  ${getY(d,i) - pathHeight/3} 
                H ${getX(d,i) - pathWidth/2}
                V ${getY(d,i) - pathHeight*3/2}
                H ${getX(d,i) + pathWidth/2}
                V ${getY(d,i) - pathHeight/3}
                H ${getX(d,i) + this.font.size/2}
                Z
                `)
            .attr("stroke", (fade)? "rgba(0,0,0,0)": "#fff")
            .attr("fill", (fade)? "rgba(0,0,0,0)": "#fff")
            .attr("tabindex",100)

        rectHeight = -rectHeight

        let fontColor
        if (fade)
            fontColor = "rgba(0,0,0,0)"
        else
            fontColor = this.color.text


        this.el.label.append("text")
            .text((d,i)=> this.getLabelArray()[i])
            .attr("x", getX)
            .attr("y",d => (getY(d) + rectHeight / 1.5) )
            .attr("text-anchor", "middle")
            .attr("font-size", `${this.font.size}px`)
            .attr("tabindex",100)
            .attr("stroke", fontColor)
            .attr("fill", fontColor)

        if (fade)
            this.setFade()

        return this
    }

    /***
     * setTransition sets transition effect for the Layer instance's elements.
     * @return {Layer|Bar|Line|Plot}
     */
    setTransition(){
        let fadeIn = [], fadeOut = []
        for (let i in this.fade){
            if (this.fade.hasOwnProperty(i) && this.fade[i].in !== null){
                fadeIn.push(this.fade[i].in)
                fadeOut.push(this.fade[i].out)
            }
        }
        if (!this.el.collision && !this.el.collisionBar)
            throw new LayerError("fade label must be set with collision areas", this.id)

        const setCollisionTransition = (target)=> (
            target
                .on("mouseover", function(d, i){
                    for(let j in fadeIn)
                        fadeIn[j].bind(this)(d, i)
                })
                .on("mouseout", function(d, i){
                    for(let j in fadeOut)
                        fadeOut[j].bind(this)(d, i)
                })
        )
        if (fadeIn.length){
            if(this.el.collision)
                this.el.collision = setCollisionTransition(this.el.collision)
            if(this.el.collisionBar)
                this.el.collisionBar = setCollisionTransition(this.el.collisionBar)
        }

        return this
    }
}

export default Layer
export {Layer, LayerError}