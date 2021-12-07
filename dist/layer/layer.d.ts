export default Layer;
/***
 * Layer is abstract for chart classes on sdatch. Any chart classes extends this class
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
export class Layer {
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
    round: number;
    roundRaw: any;
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
     * roundDataForEach rounds datasets with specified digit. Any data are assumed as float number data,
     * and any digits under zero are discarded for the result for each `datum * this.round`.
     * This procedure should be done on initialization and update of data.
     */
    roundDataForEach(): void;
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
     * setSVG generate core SVG object from the specified FigConfig argument.
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
     * (But it is immediately modified in the constructor for fail-safe rendering,
     * avoiding character clapping out of figure boundary)
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
     * setArea sets area property for the Layer instance
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
    /**
     * autoScaleY automatically detects the range of Y scale for two dimensional data,
     * and enables FSR for the layer.
     */
    autoScaleY(): void;
    /**
     * autoScaleXYZ automatically detects the range of X and Y scale for
     * three dimensional data on the layer, and enables FSR for that.
     */
    autoScaleXYZ(): void;
    /**
     * styleAxe sets style for specified `dim` of the layer with preset axe style object,
     * specified in `FigConfig.font` and `FigConfig.color.axe`.
     * @param dim["x"|"y"]
     */
    styleAxe(dim: any): void;
    /**
     * [internal] appendAxeX appends X axe for the Layer
     * @param isDefaultAxe
     * @returns {Layer}
     */
    appendAxeX(isDefaultAxe?: boolean): Layer;
    /**
     * [internal] appendAxeY appends Y axe for the Layer
     * @param isDefaultAxe
     * @returns {Layer}
     */
    appendAxeY(isDefaultAxe?: boolean): Layer;
    /***
     * renderAxe renders axe and registers axe element into Layer.el
     * @param {Boolean} initialize
     */
    renderAxe(initialize?: boolean): Layer;
    /**
     * check whether the layer has data or not.
     * With preset data, it returns data length.
     * Without data, it returns false.
     * @returns {false|number}
     */
    hasData(): false | number;
    /**
     * check whether the layer has nested data or not.
     * If it has data ant its data is nested, it returns true
     * @returns {Boolean}
     */
    hasNestedData(): boolean;
    /**
     * check whether it has column or not.
     * With preset column, it returns column length.
     * @returns {false|number}
     */
    hasColumn(): false | number;
    /**
     * check whether the column of the layer is numbered column or not.
     * With the column is numbered, it returns true.
     * @returns {Boolean}
     */
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
    /**
     * setCollisionBar sets new collision area for the layer.
     * It refers preset data and appends calculated collision area for the layer.
     * It needs single dimensional data.
     * (Multi-layer collision detection is not supported at now)
     */
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
    /***
     * getLabelArray returns the array of label string for specified column and data.
     * Each label is concatenated string of column value and corresponding datum.
     * (mainly for Pie charts)
     * @returns {String[]}
     */
    getLabelArray(): string[];
    /**
     * getLabelMax returns the length of the most longest label in the label array.
     * (mainly for Pie charts)
     * @returns {number}
     */
    getLabelMax(): number;
    /**
     * getLabelWidth returns the max label width in the layer, based on font size and
     * the max label length.
     * @returns {number}
     */
    getLabelWidth(): number;
    /**
     * unsetLabel deletes any preset labels for the layer.
     */
    unsetLabel(): void;
    /**
     * getLabelClass returns HTML class string with tagged pattern
     * @return {String}
     */
    getLabelClass(): string;
    /***
     * setLabel is the label initializer for a chart which DOES NOT have explicitly
     * disabled label attribute with `FigConfig.label`.
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
    constructor(msg: any, layerObj: any);
}
