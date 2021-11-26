import {Geo} from "../src/layer/geo.js"
import {getFigureCore} from "../src/lib.js";
import {expect} from "chai";

let g, geoJson1, geoJson2, geoJsonArray, topojson, data

describe("Geo class", ()=>{
    beforeEach(()=>{
        geoJson1 = {
            "type":"FeatureCollection",
            "id":"dummy-geo-1",
            "metadata":{"type":["area"], "dc:title":"dummy", "dc:issued":"2020-01-01", },
            "features":[
                {
                    "type":"Feature",
                    "properties":{ "id":"dummy-geo-area-1" },
                    "geometry": {
                        "type":"MultiPolygon",
                        "coordinates": [[[[135.0,38.0],[138.0,38.5],[133.0,38.0]]]]
                    }
                }
            ]
        }
        geoJson2 = {
            "type":"FeatureCollection",
            "id":"dummy-geo-2",
            "metadata":{"type":["area"], "dc:title":"dummy", "dc:issued":"2020-01-01", },
            "features":[
                {
                    "type":"Feature",
                    "properties":{ "id":"dummy-geo-area-2" },
                    "geometry": {
                        "type":"MultiPolygon",
                        "coordinates": [[[[135.0,38.0],[138.0,38.5],[133.0,38.0]]]]
                    }
                }
            ]
        }
        geoJsonArray = [geoJson1, geoJson2]
        topojson = {}
    })

    describe("constructor", ()=>{
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="chart" /></div>';
            data = [1,2]
            g = new Geo({
                id: "test1",
                column: [geoJson1.id, geoJson2.id],
                data: data,
                src: geoJson1,
                svg: { body: getFigureCore("chart", 100,100) }
            })
        })

        it("can generate new instance without layer type field", ()=>{
            for (let i=0; i<g.data.length; i++){
                expect(g.data[i]).to.equal(data[i])
            }
            expect(g.id).to.equal("test1")
            expect(g.type).to.equal("geo")
        })

        it("should generate new instance with default property", ()=>{
            expect(g.zoom).to.equal(1)
            expect(g.location).not.to.be.undefined
            expect(g.location.length).to.equal(2)
            expect(typeof g.location[0]).to.equal("number")
            expect(typeof g.location[1]).to.equal("number")
        })

        it("should set a geojson as an array which contains it", ()=>{
            expect(g.src.length).not.to.be.undefined
            expect(g.src.length).to.equal(1)
            expect(typeof g.src[0]).to.equal("object")
        })

        it("should set geojson array for a source", ()=>{
            g.src = geoJsonArray
            expect(g.src.length).not.to.be.undefined
            expect(g.src.length).to.equal(2)
            for(let i in g.src)
                expect(g.src[i]).to.equal(geoJsonArray[i])
        })

        it("should fail with invalid src format", ()=>{
            try {
                new Geo({
                    id: "test1",
                    column: [geoJson1.id, geoJson2.id],
                    data: data,
                    src: 12.34567,
                    svg: { body: getFigureCore("chart", 100,100) }
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("should fail without src", ()=>{
            try {
                new Geo({
                    id: "test1",
                    column: [geoJson1.id, geoJson2.id],
                    data: data,
                    src: geoJson1,
                    svg: { body: getFigureCore("chart", 100,100) }
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })

    describe("data", ()=> {
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart" /></div>';
            g = new Geo({
                id: "test1",
                column: [
                    geoJson1.id,
                    geoJson2.id,
                ],
                data: [3,5],
                src: [
                    geoJson1,
                    geoJson2
                ],
                svg: {body: getFigureCore("chart", 100, 100)}
            })
        })
        it("should be gotten with id, using getDatumWithId", ()=>{
            expect(
                g.getDatumWithId(geoJson2.id)
            ).to.equal(g.data[1])
        })

        it("should be zero for feature id which is not registered in column", ()=>{
            expect(
                g.getDatumWithId("hoge2")
            ).to.equal(0)
        })
    })
    describe("autoScale method", () => {
        it("should not affect anything", ()=>{
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            new Geo({
                id: "test1",
                column: [
                    geoJson1.id,
                    geoJson2.id
                ],
                data: [8,9],
                src: geoJsonArray,
                svg: {
                    id: "test",
                    body: getFigureCore("chart", 100, 100)
                }
            }).autoScale()
        })
    })

    describe("render method", () => {
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            g = new Geo({
                id: "test1",
                column: [
                    geoJson1.id,
                    geoJson2.id
                ],
                data: [8,9],
                src: geoJsonArray,
                svg: {
                    id: "test",
                    body: getFigureCore("chart", 100, 100)
                }
            })
        })

        it("should generate geojson path with preset data", ()=>{
            let el = document.getElementsByClassName("sdc-geo")
            expect(el.length).to.equal(0)
            g.render()
            el = document.getElementsByClassName("sdc-geo")
            console.log(g.column)
            for(let i in el)
                if(typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__.properties.datum).to.equal(g.data[i])
                }
        })
    })

    describe("updateData", () => {
        let el
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            g = new Geo({
                id: "test1",
                column: [
                    geoJson1.id,
                    geoJson2.id
                ],
                data: [10,20],
                src: geoJsonArray,
                svg: {
                    body: getFigureCore("chart", 100, 100)
                }
            })
        })

        it("should update geo path with specified data", ()=>{
            g.render()
            el = document.getElementsByClassName("sdc-geo")
            expect(el.length).to.equal(g.src.length)

            g.updateData([11,21])
            expect(g.data[0]).to.equal(11)
            expect(g.data[1]).to.equal(21)
            el = document.getElementsByClassName("sdc-geo")
            expect(el.length).to.equal(g.src.length)
            for(let i in el)
                if(typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__.properties.datum).to.equal(g.data[i])
                }
        })
    })
})
