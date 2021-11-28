/**
 * Visualization class for Line charts.
 *
 * Line is one of the most common chart type for generic use cases.
 * It supports styling, ticks control, automatic size adjustment (FSR) and
 * dynamic data changes via Line.updateData.
 *
 * Dataset (column + data) can be specified in two ways for Line chart.
 *
 * (1) specify column and data in single dimensional array
 *
 * (2) specify data in two dimensional array
 *
 * This class is implemented as a variant of Plot.
 */
export class Line extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf: any);
    smooth: boolean;
    autoScale(): void;
    /***
     * updateData updates preset data with given argument.
     * Argument data must be an array and the same shape with the preset data.
     * @param data
     */
    updateData(data: any): void;
    getLineGenerator(): import("d3-shape").Line<[number, number]>;
    render(): Line;
}
import { Layer } from "./layer.js";
