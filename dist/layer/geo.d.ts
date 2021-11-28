/**
 * Visualization class for geological shapes.
 *
 * The constructor for the class Geo needs topojson or geojson file(s)
 * for spatial visualization and it can be simply used to implement Chrolopleth.
 *
 * ```
 * new Geo({
 *   id: "sample",
 *   src: [
 *     "/path1/to/file.topojson",
 *     "/path2/to/file.topojson",
 *     "/path3/to/file.topojson",
 *   ],
 *   data: [100,121,95],
 *   location: [140.5,35.48],
 *   zoom: 8,
 * })
 * ```
 *
 * The source file path for topojson/geojson can be specified with URI format and
 * any shape files are fetched over network in such case.
 */
export class Geo extends Layer {
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
