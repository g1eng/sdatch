export class Line extends Layer {
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
