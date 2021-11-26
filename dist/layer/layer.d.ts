export default Layer;
export class Layer {
    /***
     * Layer constructor is the default constructor for Layer family classes.
     * The constructor has common features with other constructors of families
     * (e.g. Bar, Plot, etc.), but there are several lack of the initialization
     * process.
     *
     * First, the constructor does not set any scales with autoScale* methods.
     * Second, it made simply register data with specified one and does not modify them.
     * Third, it does not validate or rewrite layer type by default.
     * So users must specify valid type or other options to use `raw` Layer constructor.
     *
     * @param {FigConfig} conf
     */
    constructor(conf: any);
    id: any;
    rel: any;
    font: {
        family: string;
        size: number;
    };
    fig: any;
    scale: {
        x: any;
        y: any;
    };
    isAnimated: boolean;
    data: any;
    column: any;
    focus: {};
    axis: {};
    ticks: {
        x: {
            inner: boolean;
            values: any[];
        };
        y: {
            inner: boolean;
            values: any[];
        };
    };
    type: any;
    label: any;
    plot: boolean;
    el: {
        collision: any;
        label: any;
        labelRect: any;
        axe: any;
    };
    color: {
        fill: string;
        stroke: string;
        text: string;
        textBackground: string;
        axe: string;
        axeText: string;
    };
    fade: {
        label: {
            in: any;
            out: any;
            accentColor: any;
            init: any;
        };
        area: {
            in: any;
            out: any;
            accentColor: any;
            init: any;
        };
    };
    safe: {
        margin: {
            top: number;
            left: number;
            right: number;
            bottom: number;
            z: number;
        };
        area: {
            x: any;
            y: any;
            z: number;
        };
        range: number;
    } | {
        margin: {
            top: number;
            left: number;
            right: number;
            bottom: number;
            z: number;
        };
        area: {
            x: number;
            y: number;
            z?: undefined;
        };
        range: number;
    };
    /***
     * updateDataCore sets data with given argument.
     * The data must have same length with previous one
     * @param data - data to assign to Layer.data
     */
    updateDataCore(data: any): void;
    /***
     * getDataWith gets minimal or maximum data from data or column.
     * It needs d3-array's min or max function as a argument and invoke it at the
     * execution.
     *
     * @param func
     * @return {{x: (*|number), y}|{x, y}|{x, y, z}}
     */
    getDataWith(func: any): {
        x: (any | number);
        y;
    } | {
        x;
        y;
    } | {
        x;
        y;
        z;
    };
    /***
     *
     * @param {FigConfig} conf
     */
    setSVG(conf: any): void;
    svg: {
        id?: undefined;
        target?: undefined;
        body?: undefined;
    } | {
        id: string;
        target: any;
        body: any;
    };
    /***
     * setMargin sets margin property for the Layer instance.
     * By default, this method sets 0, 0 margin for top and left.
     * (But it is immediately modified in the constructor for safe-rendering, avoiding
     * character clapping out of figure boundary)
     * @param {FigConfig} conf
     */
    setMargin(conf: any): void;
    margin: {
        top: any;
        left: any;
        z?: undefined;
    } | {
        top: any;
        left: any;
        z: any;
    };
    /***
     * setArea set area property for the Layer instance
     * @param {FigConfig} conf
     */
    setArea(conf: any): void;
    area: {
        x?: undefined;
        y?: undefined;
        z?: undefined;
    } | {
        x: any;
        y: any;
        z: number;
    };
    autoScaleY(): void;
    autoScaleXYZ(): void;
    styleAxe(dim: any): void;
    appendAxisX(isDefaultAxe?: boolean): Layer;
    appendAxisY(isDefaultAxe?: boolean): Layer;
    /***
     * renderAxe renders axe and registers axe element into Layer.el
     * @param {Boolean} initialize
     */
    renderAxe(initialize?: boolean): Layer;
    hasData(): any;
    hasNestedData(): any;
    hasColumn(): any;
    hasNumberColumn(): boolean;
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
    getNormalizedXYData(): Array<Array<number>>;
    /***
     * getScaleForData returns scales tuned for two-dimensional data.
     * Returned functions (scale x, y and optional z) are receiving an array for the argument and returns
     * scaled value for x or y (or z) dimension of the data array.
     *
     * If x scale is a band scale, it sets band x scaling for the x function.
     *
     * @return {{x: (function(*): *), y: (function(*): *), z: (function(*): *)}}
     */
    getScaleForData(): {
        x: ((arg0: any) => any);
        y: ((arg0: any) => any);
        z: ((arg0: any) => any);
    };
    /***
     * setCollision sets collision area for each plot.
     * It assumes any data can be mapped to plot and needs two dimensional data.
     */
    setCollision(): void;
    setCollisionBar(): void;
    /***
     * plot makes plot even if the instance is not a Plot class.
     * You can draw plot on the values which is registered in Layer.data.
     *
     * That's useful for lines, which needs popups or edge emphasis.
     * @return {Layer|Bar|Line|Plot}
     */
    renderPlot(): Layer | any | any | any;
    /***
     * rotate rotates specified target SVG element with given degree
     * @param {String} target to rotate
     * @param {Number} deg degree to rotate
     */
    rotate(target: string, deg: number): Layer;
    /***
     * setHoverColor sets hover action for layer color changing for
     * each datum.
     */
    setHoverColor(): void;
    /***
     * setFade activate label fading for the layer label.
     */
    setFade(): void;
    getLabelArray(): any[];
    getLabelMax(): number;
    unsetLabel(): void;
    getLabelClass(): string;
    /***
     *
     * @param {Boolean} [fade=false]
     * @return {Layer|Bar|Line|Plot|Pie}
     */
    setLabel(fade?: boolean): Layer | any | any | any | any;
    /***
     * setTransition sets transition effect for the Layer instance's elements.
     * @return {Layer|Bar|Line|Plot}
     */
    setTransition(): Layer | any | any | any;
}
export class LayerError extends Error {
    constructor(msg: any, id: any);
}