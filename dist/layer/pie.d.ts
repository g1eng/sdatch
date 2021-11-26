export class Pie extends Layer {
    radStart: any;
    radEnd: any;
    radRange: number;
    innerRadius: any;
    autoScale(): void;
    updateData(data: any): void;
    render(): Pie;
    arcDatum: import("d3-shape").Arc<any, import("d3-shape").DefaultArcObject>;
}
import { Layer } from "./layer.js";
