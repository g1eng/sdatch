import {select} from "d3-selection";
import {getFigureCore, getSvgId} from "./lib.js";
import {Layer, Bar, Plot, Area, Line, Bubble, Pie, Geo} from "./layer/index.js";

class ChartError extends Error{}


/***
 * createFigure returns a new sdatch instance for the specified DOM element
 * @param {String} id
 * @param {Number} width
 * @param {Number} height
 * @return {sdatch}
 */
function createFigure(id, width, height){
    return new sdatch(id, width, height)
}


/***
 * @typedef {Layer|Bar|Line|Plot|Bubble|Pie|Geo} LayerClass
 */

/***
 * Margin object consists of top and left margin numbers
 * @typedef {Object} MarginConf
 * @prop {Number} [top] - top margin
 * @prop {Number} [left] - left margin
 * @prop {Number} [radius] - for Bubble layer, radius margin for the minimal value
 */

/***
 * Area object is specified with width and height
 * @typedef {Object} AreaConf
 * @prop {Number} [x] - width
 * @prop {Number} [y] - height
 * @prop {Number} [z] - for Bubble layer, radius limit for the layer
 */

/***
 * SvgConf is the data object which refers to parent SVG element, which is necessary to render charts.
 * @typedef {Object} SvgConf
 * @property {String} target - target id for append methods on d3-selection
 * @property {Number} width - SVG width
 * @property {Number} height - SVG height
 * @prop {String} [id] - SVG id
 * @prop {Object} [body] - SVG selection by d3-selection
 */

/***
 * Scale map contains d3-scale object for x, y or z axe
 * @typedef {Object} DimFunction
 * @prop {Function} [x] - function for x dimension
 * @prop {Function} [y] - function for y dimension
 * @prop {Function} [z] - function for z dimension
 */

/***
 * Tick
 * @typedef {Object} Tick
 * @prop {Boolean} [inner]
 * @prop {Array<Number>} [values]
 */

/***
 * TicksConf holds properties for tick manipulation
 * @typedef {Object} TicksConf
 * @prop {Tick} [x]
 * @prop {Tick} [y]
 */

/***
 * ColorConf
 * @typedef {Object} ColorConf
 * @prop {String} fill
 * @prop {String} stroke
 * @prop {String} text
 * @prop {String} textBackground
 * @prop {String} axe
 * @prop {String} axeText
 */

/***
 * FadeActions
 * @typedef {Object} FadeActions
 * @property {Function|null} in
 * @property {Function|null} out
 * @property {Function|String|null} accentColor
 */

/***
 * Focus is a focus range for a sdatch instance.
 * Its field x or y accept an array of numbers, which represent start and end of the range.
 * @typedef {Object} Focus
 * @property {Array<Number>} [x]
 * @property {Array<Number>} [y]
 */

/***
 * Font is a FigConfig field to set font parameter for sdatch instances.
 * @typedef {Object} Font
 * @property {Number} [size]
 * @property {String} [family]
 */

/***
 * Axis holds axe parameter for which axe are enabled in the Layer
 * @typedef {Object} Axis
 * @property {Boolean} [x]
 * @property {Boolean} [y]
 * @property {Boolean} [left]
 * @property {Boolean} [right]
 * @property {Boolean} [top]
 * @property {Boolean} [bottom]
 */

/***
 * Fade
 * @typedef {Object} Fade
 * @property {FadeActions} [label]
 * @property {FadeActions} [area]
 */

/***
 * FSR
 * @typedef {Object} FSR
 * @property {MarginConf} [margin]
 * @property {AreaConf} [area]
 * @property {Number} [range]
 */

/***
 * Label
 * @typedef {Object} Label
 * @property {String} [prefix] now for Geo layers, prefix for any labels
 * @property {String} [size]
 */

/***
 * Rel holds the relationship of the layer with other layers.
 * It is used to auto-adjust FSR parameters for related layers for each.
 * @typedef {Array<String>} Rel
 */

/***
 *  FigConfig is an object which contains configuration options for Layer object.
 *
 * @typedef {Object} FigConfig
 * @property {String} id identical name of the layer
 * @property {String} type line, bar or plot
 * @property {Array<Number>} data data for the layer
 * @property {Array<Number|String|Date>} [column] column for data of the layer
 * @prop {FSR|Boolean} [safe=false] fail-safe rendering parameter
 * @prop {SvgConf} [svg]
 * @prop {MarginConf|Number} [margin={ top:0, left:0 }]
 * @prop {AreaConf} [area={ top:0, left:0 }]
 * @prop {DimFunction} [scale]
 * @prop {TicksConf} [ticks]
 * @prop {Boolean} [animation=true] false for no animation
 * @prop {Focus|Boolean} [focus]
 * @prop {Object} [font]
 * @prop {Axis} [axe]
 * @prop {Rel} [rel]
 * @prop {Object | Boolean} [label]
 * @prop {Boolean} [plot]
 * @prop {ColorConf} [color]
 * @prop {Fade} [fade]
 * @prop {Boolean} [smooth] for Line or Area chart, smoothing edges or not
 * @prop {Number} [radStart] for Pie chart, start radian for arcs
 * @prop {Number} [radEnd] for Pie layer, end radian for arcs
 * @prop {Number} [radius] for Pie layer, outer radius in pixel
 * @prop {Number} [innerRadius] for Pie layer, inner radius in pixel
 * @prop {Boolean} [clockwise] for Pie layer, false for anti-clockwise
 * @prop {Array<Number>} [center] for Geo layer, [lat,lng] array for center position
 * @prop {Number} [zoom] for Geo layer, zoom for the chrolopleth
 */


/***
 * getType detects layer type and returns a class extending Layer object
 * @return {LayerClass}
 */
function getType(figObject){
    switch (figObject.type){
        case "plain": return Layer;
        case "bar": return Bar
        case "line": return Line
        case "area": return Area
        case "plot": return Plot
        case "bubble": return Bubble
        case "pie": return Pie
        case "geo": return Geo
        default: throw new ChartError("invalid layer type")
    }
}


class sdatch {
    /***
     * sdatch constructor
     * @param {String} chartId
     * @param {Number} width
     * @param {Number} height
     */
    constructor(chartId=null, width, height=150) {
        if(typeof chartId !== "string")
            throw new ChartError("chrtId must be specfied as a string")
        this.dataset = new Map()
        this.columns = new Map()
        width = width? width: select("#" + chartId)._groups[0][0].scrollWidth * 0.8
        this.width = width
        this.height = height
        // console.log("height",height)
        this.chartId = chartId
        console.log(chartId)
        this.svg = getFigureCore(chartId, this.width, this.height)
        this.layer = {}
        this.rel = []
        this.target = new Map([
            ["id", chartId]
        ])
    }

    /***
     * pushData makes new data mapping with a series name and assigned data.
     *
     * It assigns data into a new map element keyed with seriesName.
     * @param {FigConfig} figConfig is figure config options which contains id and data (may contain column)
     */
    pushData(figConfig){
        let hasData = () => (typeof figConfig.data === "object" && figConfig.data.length),
            hasColumn = () => (typeof figConfig.column === "object" && figConfig.column.length),
            hasValidLength = () => (figConfig.column.length === figConfig.data.length)
        if (!figConfig.id)
            throw new ChartError("layer ID must be specified")
        else if ( figConfig.data && !hasData() )
            throw new ChartError("data must be an array")
        else if ( figConfig.column && !hasColumn() )
            throw new ChartError("column must be an array")
        else if ( hasColumn() && !hasValidLength() )
            throw new ChartError("column length must be same as data length")
        else if (hasColumn() && hasValidLength())
            this.columns.set(figConfig.id, figConfig.column)
        this.dataset.set(figConfig.id, figConfig.data)
    }

    /***
     * pushLayer appends new layer with specified seriesName and LayerType class.
     *
     * This method must be invoked after pushData and the new layer holds corresponding data
     * already set by pushData within same series name.
     *
     * LayerType is a class which inherit Layer class
     *
     * @param {FigConfig} figConfig is figure config options for the argument of LayerType constructor
     */
    pushLayer(figConfig){
        // console.log(this.width,this.height)
        if(!figConfig.id)
            figConfig.id = "layer_" + this.layer.size
        const seriesName = figConfig.id,
            LayerType = getType(figConfig)
        figConfig.svg = {
            id: getSvgId(this.chartId),
            body: this.svg
        }

        this.layer[seriesName] = new LayerType(
            figConfig
        )
    }

    /***
     * getLayer returns reference to the layer with a specified seriesName
     *
     * @param seriesName is a layer key (or a data identifier in the sdatch instance)
     * @return {Layer|Bar|Line|Plot}
     */
    getLayer(seriesName){
        if (!this.layer.hasOwnProperty(seriesName))
            throw new ChartError(`no series ${seriesName}`)
        return this.layer[seriesName]
    }

    /***
     * getRelation returns relation for the layer specified in id.
     * If the layer is nor registered in sdatch.rel, it returns null.
     * @param {String} id
     * @return {String}
     */
    getRelation(id){
        for(let i=0; i<this.rel.length; i++){
            if(this.rel[i].indexOf(id) !== -1)
                return this.rel[i]
        }
        return null
    }

    /***
     * makeRelation defines relation of layers to make sdatch.rel.
     * It generates and holds relations for each layer group.
     * @param {Array<FigConfig> } figs
     */
    makeRelation(figs){
        for (let i in figs)
            if(figs.hasOwnProperty(i))
                if(figs[i].hasOwnProperty("rel")){
                    if(typeof figs[i].rel === "string")
                        this.rel.push([figs[i].rel, figs[i].id])
                    else if(figs[i].rel.length){
                        if(figs[i].rel.indexOf(figs[i].id) === -1)
                            figs[i].rel.push(figs[i].id)
                        this.rel.push(figs[i].rel)
                    }
                }
    }

    /***
     * arrangeLayer arranges for each Layer which is registered in this.rel.
     * It unifies FSR properties such as Layer.safe.margin and Layer.safe.area atomic for related
     * layers. The FSR properties of the most biggest margin and less minimal area in the
     * layer group is applied to every layers in the groups.
     * @param {String} id layer id to be arranged
     */
    arrangeLayer(id){
        this.getLayer(id)
        let rel = this.getRelation(id), brosLayer = null
        if (rel !== null)
            for(let i in rel)
                if(rel[i] && rel[i] !== id){
                    try {
                        brosLayer = this.getLayer(rel[i])
                        break
                        // eslint-disable-next-line no-empty
                    } catch (e) {

                    }
                }
        if (brosLayer !== null){
            if(this.layer[id].margin.left >= brosLayer.margin.left)
                brosLayer.margin.left = this.layer[id].margin.left
            else
                this.layer[id].margin.left = brosLayer.margin.left
            if(this.layer[id].margin.right >= brosLayer.margin.right)
                brosLayer.margin.right = this.layer[id].margin.right
            else
                this.layer[id].margin.right = brosLayer.margin.right

            if(this.layer[id].area.x >= brosLayer.area.x)
                this.layer[id].area.x = brosLayer.area.x
            else
                brosLayer.area.x = this.layer[id].area.x

            for (let i in brosLayer.safe.margin){
                if (brosLayer.safe.margin.hasOwnProperty(i)){
                    if(this.layer[id].safe.margin[i] >= brosLayer.safe.margin[i])
                        brosLayer.safe.margin[i] = this.layer[id].safe.margin[i]
                    else
                        this.layer[id].safe.margin[i] = brosLayer.safe.margin[i]
                }
            }
            for (let i in brosLayer.safe.area){
                if (brosLayer.safe.area.hasOwnProperty(i)){
                    if(this.layer[id].safe.area[i] >= brosLayer.safe.area[i])
                        this.layer[id].safe.area[i] = brosLayer.safe.area[i]
                    else
                        brosLayer.safe.area[i] = this.layer[id].safe.area[i]
                }
            }
        }
    }

    /***
     * addLayerAtomic is atomic strategy to generate individual layers and push them into
     * sdatch.layer. Any configuration options from the argument object are parsed and
     * corresponding state setter methods are triggered for options.
     *
     * At least, layer id, type and data array must be specified
     * as a configuration option argument.
     *
     * @param {FigConfig} figConfig
     */
    addLayerAtomic(figConfig){

        if (!figConfig.hasOwnProperty("id"))
            throw new ChartError("id field must be specified")
        else if (!figConfig.hasOwnProperty("data"))
            throw new ChartError("data field must be specified")

        this.pushData(figConfig)
        // console.log("layer", figConfig.id, figConfig)
        this.pushLayer(figConfig)

    }

    /***
     * addLayer method is a closure to add new Layer into sdatch.layer Object with
     * specified config options. The method validates given config object and parse its
     * internal data with sdatch.addLayerAtomic.
     *
     * A config option can be an array or an object with valid
     * config field required for chart generation.
     *
     * @param {Array<FigConfig> | FigConfig} figs a config option array or config object
     */
    addLayer(figs=[]){
        if(typeof figs !== "object")
            throw new ChartError("argument must be an array")
        if(typeof figs.length !== "number")
            figs = [figs]
        if(figs.length === 0)
            throw new ChartError("config object has zero length")

        this.makeRelation(figs)
        figs.forEach((fig)=>{
            this.addLayerAtomic(fig)
        })
        figs.forEach((fig)=>{
            this.arrangeLayer(fig.id)
            if(this.getRelation(fig.id) !== null)
                this.getLayer(fig.id).rel = this.getRelation(fig.id)
        })
        for (let i in this.layer)
            if (this.layer.hasOwnProperty(i))
                this.layer[i].autoScale()
        return this
    }

    /***
     * addBar appends and render new Bar instance for the sdatch.layer, with specified
     * seriesName and data.
     *
     * @param {Array<FigConfig>, FigConfig} fig is an object which contains data an config options for the figure
     */
    addBar(fig=[]){
        if (typeof fig !== "object")
            throw new ChartError("fig must be an object")
        if (typeof fig.length === "number"){
            fig.forEach((e)=>{
                if(typeof e !== "object")
                    throw ChartError("invalid figure object detected")
                e.type = "bar"
            })
            this.addLayer(fig)
        } else {
            fig.type = "bar"
            this.addLayer([fig])
        }
    }

    /***
     * renderAll renders all layer assigned in the chart
     */
    renderAll(){
        for (let i in this.layer){
            if(this.layer.hasOwnProperty(i)){
                this.layer[i].renderAxe(true)
                this.layer[i].render()
            }
        }
        for (let i in this.layer){
            if(this.layer.hasOwnProperty(i)){
                if (this.layer[i].label !== false)
                    this.layer[i].setLabel(true)
                this.layer[i].setTransition()
            }
        }
    }

}

export {sdatch, createFigure}