/**
 * Visualization class for Area charts.
 *
 * Area class is a variant of Line, which means `filled line` chart.
 * It supports styling, ticks control, automatic position adjustment (FSR) and
 * dynamic data changes via Plot.updateData.
 *
 * Stacked area is not supported at now.
 *
 * Dataset (column + data) can be specified in two ways for Plot chart.
 *
 * (1) specify column and data in single dimensional array
 *
 * (2) specify data in two dimensional array
 *
 */
export class Area extends Layer {
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
    getAreaGenerator(): import("d3-shape").Area<[number, number]>;
    render(): Area;
}
import { Layer } from "./layer.js";
