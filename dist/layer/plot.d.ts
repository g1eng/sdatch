/**
 * Visualization class for Plot.
 *
 * Scatter Plot is one of the most common chart type for generic use cases.
 * It supports styling, ticks control, automatic position adjustment (FSR) and
 * dynamic data changes via Plot.updateData.
 *
 * Dataset (column + data) can be specified in two ways for Plot chart.
 *
 * (1) specify column and data in single dimensional array
 *
 * (2) specify data in two dimensional array
 *
 */
export class Plot extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf: any);
    autoScale(): void;
    /***
     * updateData updates preset data with given argument.
     * Argument data must be an array and the same shape with the preset data.
     * @param data
     */
    updateData(data: any): void;
    render(): Plot;
}
import { Layer } from "./layer.js";
