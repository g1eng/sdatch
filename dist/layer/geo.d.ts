export class Geo extends Layer {
    constructor(conf: any);
    geoLabel: {
        prefix: string;
        properties: any[];
        map: Map<any, any>;
    };
    zoom: any;
    location: any;
    src: any;
    autoScale(): void;
    getSeqWithId(featureId: any): any;
    getDatumWithId(featureId: any): any;
    updateData(data: any): void;
    getElemId(featureId: any): string;
    setLabelProperties(fid: any, f: any): void;
    getLabel(fid: any, f: any): string;
    renderCore(s: any, e: any): void;
    render(): Geo;
}
import { Layer } from "./layer.js";
