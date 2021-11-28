/**
 * Visualization class for bubble charts.
 *
 * The constructor for the class Bubble needs three dimensional data for the
 * visualization. There are two ways to specify three dimensional data.
 *
 * case 1: assign three dimensional array for FigConfig.data
 *
 * ```
 * new Bubble({
 *   id: "sample1",
 *   data: [[120,23,7],[315,5,3],[411,6,2],[177,-34,4.6]],
 *   focus: true,
 *   color: {
 *     fill: "blue"
 *   },
 * })
 *
 * ```
 *
 * case 2: assign two dimensional array for FigConfig.data and set
 * array for FigConfig.column which has same length with its data
 *
 * ```
 * new Bubble({
 *   id: "sample2",
 *   column: [120,315,411,177,-34,]
 *   data: [[23,7],[5,3],[6,2],[4.6]],
 *   focus: true,
 *   color: {
 *     fill: "blue"
 *   },
 * })
 * ```
 */
export class Bubble extends Layer {
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
    render(): Bubble;
}
import { Layer } from "./layer.js";
