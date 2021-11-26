/**
 * *
 */
export type LayerClass = Layer | Bar | Line | Plot | Bubble | Pie | Geo;
/**
 * *
 * Margin object consists of top and left margin numbers
 */
export type MarginConf = {
    /**
     * - top margin
     */
    top?: number;
    /**
     * - left margin
     */
    left?: number;
    /**
     * - for Bubble layer, radius margin for the minimal value
     */
    radius?: number;
};
/**
 * *
 * Area object is specified with width and height
 */
export type AreaConf = {
    /**
     * - width
     */
    x?: number;
    /**
     * - height
     */
    y?: number;
    /**
     * - for Bubble layer, radius limit for the layer
     */
    z?: number;
};
/**
 * *
 * SvgConf is the data object which refers to parent SVG element, which is necessary to render charts.
 */
export type SvgConf = {
    /**
     * - target id for append methods on d3-selection
     */
    target: string;
    /**
     * - SVG width
     */
    width: number;
    /**
     * - SVG height
     */
    height: number;
    /**
     * - SVG id
     */
    id?: string;
    /**
     * - SVG selection by d3-selection
     */
    body?: any;
};
/**
 * *
 * Scale map contains d3-scale object for x, y or z axe
 */
export type DimFunction = {
    /**
     * - function for x dimension
     */
    x?: Function;
    /**
     * - function for y dimension
     */
    y?: Function;
    /**
     * - function for z dimension
     */
    z?: Function;
};
/**
 * *
 * Tick
 */
export type Tick = {
    inner?: boolean;
    values?: Array<number>;
};
/**
 * *
 * TicksConf holds properties for tick manipulation
 */
export type TicksConf = {
    x?: Tick;
    y?: Tick;
};
/**
 * *
 * ColorConf
 */
export type ColorConf = {
    fill: string;
    stroke: string;
    text: string;
    textBackground: string;
    axe: string;
    axeText: string;
};
/**
 * *
 * FadeActions
 */
export type FadeActions = {
    in: Function | null;
    out: Function | null;
    accentColor: Function | string | null;
};
/**
 * *
 * Focus is a focus range for a sdatch instance.
 * Its field x or y accept an array of numbers, which represent start and end of the range.
 */
export type Focus = {
    x?: Array<number>;
    y?: Array<number>;
};
/**
 * *
 * Font is a FigConfig field to set font parameter for sdatch instances.
 */
export type Font = {
    size?: number;
    family?: string;
};
/**
 * *
 * Axis holds axe parameter for which axe are enabled in the Layer
 */
export type Axis = {
    x?: boolean;
    y?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
};
/**
 * *
 * Fade
 */
export type Fade = {
    label?: FadeActions;
    area?: FadeActions;
};
/**
 * *
 * FSR
 */
export type FSR = {
    margin?: MarginConf;
    area?: AreaConf;
    range?: number;
};
/**
 * *
 * Label
 */
export type Label = {
    /**
     * now for Geo layers, prefix for any labels
     */
    prefix?: string;
    size?: string;
};
/**
 * *
 * Rel holds the relationship of the layer with other layers.
 * It is used to auto-adjust FSR parameters for related layers for each.
 */
export type Rel = Array<string>;
/**
 * *
 * FigConfig is an object which contains configuration options for Layer object.
 */
export type FigConfig = {
    /**
     * identical name of the layer
     */
    id: string;
    /**
     * line, bar or plot
     */
    type: string;
    /**
     * data for the layer
     */
    data: Array<number>;
    /**
     * column for data of the layer
     */
    column?: Array<number | string | Date>;
    /**
     * fail-safe rendering parameter
     */
    safe?: FSR | boolean;
    svg?: SvgConf;
    margin?: MarginConf | number;
    area?: AreaConf;
    scale?: DimFunction;
    ticks?: TicksConf;
    /**
     * false for no animation
     */
    animation?: boolean;
    focus?: Focus | boolean;
    font?: any;
    axe?: Axis;
    rel?: Rel;
    label?: any | boolean;
    plot?: boolean;
    color?: ColorConf;
    fade?: Fade;
    /**
     * for Line or Area chart, smoothing edges or not
     */
    smooth?: boolean;
    /**
     * for Pie chart, start radian for arcs
     */
    radStart?: number;
    /**
     * for Pie layer, end radian for arcs
     */
    radEnd?: number;
    /**
     * for Pie layer, outer radius in pixel
     */
    radius?: number;
    /**
     * for Pie layer, inner radius in pixel
     */
    innerRadius?: number;
    /**
     * for Pie layer, false for anti-clockwise
     */
    clockwise?: boolean;
    /**
     * for Geo layer, [lat,lng] array for center position
     */
    center?: Array<number>;
    /**
     * for Geo layer, zoom for the chrolopleth
     */
    zoom?: number;
};
export class sdatch {
    /***
     * sdatch constructor
     * @param {String} chartId
     * @param {Number} width
     * @param {Number} height
     */
    constructor(chartId: string, width: number, height?: number);
    dataset: Map<any, any>;
    columns: Map<any, any>;
    width: number;
    height: number;
    chartId: string;
    svg: any;
    layer: {};
    rel: any[];
    target: Map<string, string>;
    /***
     * pushData makes new data mapping with a series name and assigned data.
     *
     * It assigns data into a new map element keyed with seriesName.
     * @param {FigConfig} figConfig is figure config options which contains id and data (may contain column)
     */
    pushData(figConfig: FigConfig): void;
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
    pushLayer(figConfig: FigConfig): void;
    /***
     * getLayer returns reference to the layer with a specified seriesName
     *
     * @param seriesName is a layer key (or a data identifier in the sdatch instance)
     * @return {Layer|Bar|Line|Plot}
     */
    getLayer(seriesName: any): Layer | Bar | Line | Plot;
    /***
     * getRelation returns relation for the layer specified in id.
     * If the layer is nor registered in sdatch.rel, it returns null.
     * @param {String} id
     * @return {String}
     */
    getRelation(id: string): string;
    /***
     * makeRelation defines relation of layers to make sdatch.rel.
     * It generates and holds relations for each layer group.
     * @param {Array<FigConfig> } figs
     */
    makeRelation(figs: Array<FigConfig>): void;
    /***
     * arrangeLayer arranges for each Layer which is registered in this.rel.
     * It unifies FSR properties such as Layer.safe.margin and Layer.safe.area atomic for related
     * layers. The FSR properties of the most biggest margin and less minimal area in the
     * layer group is applied to every layers in the groups.
     * @param {String} id layer id to be arranged
     */
    arrangeLayer(id: string): void;
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
    addLayerAtomic(figConfig: FigConfig): void;
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
    addLayer(figs?: Array<FigConfig> | FigConfig): sdatch;
    /***
     * addBar appends and render new Bar instance for the sdatch.layer, with specified
     * seriesName and data.
     *
     * @param {Array<FigConfig>, FigConfig} fig is an object which contains data an config options for the figure
     */
    addBar(fig?: any[]): void;
    /***
     * renderAll renders all layer assigned in the chart
     */
    renderAll(): void;
}
/***
 * createFigure returns a new sdatch instance for the specified DOM element
 * @param {String} id
 * @param {Number} width
 * @param {Number} height
 * @return {sdatch}
 */
export function createFigure(id: string, width: number, height: number): sdatch;
import { Layer } from "./layer/index.js";
import { Bar } from "./layer/index.js";
import { Line } from "./layer/index.js";
import { Plot } from "./layer/index.js";
import { Bubble } from "./layer/index.js";
import { Pie } from "./layer/index.js";
import { Geo } from "./layer/index.js";
