/**
 * Visualization class for Bar charts.
 *
 * Bar is one of the most common chart type for generic use cases.
 * It supports styling, ticks control, automatic size adjustment (FSR) and
 * dynamic data changes via Bar.updateData.
 *
 * Stacked bar chart is not supported at now.
 *
 * The Bar constructor needs a FigConfig object with a column array and
 * corresponding single dimensional data for column values.
 *
 * ```
 * let b = new Bar({
 *   id: "korebar",
 *   column: ["Google", "Apple", "Microsoft", "Meta", "Amazon"],
 *   data: [214, 45, 134, 270, 157],
 *   margin: {
 *     left: 20,
 *     top: 100,
 *   },
 *   ticks: { x: {inner: true}, y:{ inner: true, values: [50, 100, 150, 200, 250] }},
 *   axe: {
 *     x: true,
 *     right: true,
 *   },
 *   color: {
 *     fill: function(d){
 *       return `rgb(${d*2},${d*0.5},${200-d})`
 *     },
 *     axe: "#111",
 *     axeText: "#002"
 *   },
 *   font: {size: 12},
 *   label: { rotate: true},
 *   fade: {
 *     area: {
 *       accentColor: "orange"
 *     }
 *   },
 *   safe: false,
 * });
 *
 * b.render().setLabel(true).setTransition();
 * ```
 *
 */
export class Bar extends Layer {
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
    render(): Bar;
}
import { Layer } from "./layer.js";
