/**
 * Visualization class for Pie charts.
 *
 * Pie chart is a portion chart based on centroid.
 * The constructor can accept FigConfig object with `radius`, `innerRadius`,
 * radStart or radEnd attributes.
 *
 * ```
 * new Pie({
 *   type: "pie",
 *   column: ["liberty", "power", "wise", "humor", "commune", "unity", "passion", "thought", "other"],
 *   data: [21, 12, 11, 27, 10, 9, 10 , 21, 13],
 *   margin: {
 *     top: 30,
 *     left: 30
 *   },
 *   id: "p62",
 *   animation: false,
 *   radius: 70,
 *   innerRadius: 50,
 *   radStart: Math.PI / 2,
 *   radEnd: Math.PI * 3 / 2,
 *   clockwise: false
 * }).renderAll()
 * ```
 */
export class Pie extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf: any);
    radStart: any;
    radEnd: any;
    radRange: number;
    innerRadius: any;
    autoScale(): void;
    /**
     * Pie.updateData overrides Layer.updateData and it updates Pie chart state
     * itself.
     * FIXME: label cannot be updated after updateData.
     * @param data
     */
    updateData(data: any): void;
    render(): Pie;
    arcDatum: import("d3-shape").Arc<any, import("d3-shape").DefaultArcObject>;
}
import { Layer } from "./layer.js";
