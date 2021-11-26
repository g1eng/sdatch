export class Area extends Layer {
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
