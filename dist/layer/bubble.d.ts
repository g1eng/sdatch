export class Bubble extends Layer {
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
