import {sdatch, createFigure} from "../src/sdatch.js";
import {expect} from "chai";

let s
let sampleConfig, miniConfig

describe('sdatch', () => {
    beforeEach(()=>{
        document.body.innerHTML =
            '<div>' +
            '  <span id="chart" />' +
            '</div>';
        s = createFigure("chart",300.300)

        sampleConfig = {
            column: [1, 3, 4, 5, 7],
            data: [2000, 450, 1550, 2270, 2350],
            type: "line",
            id: "p33",
            area: {
                x: 270,
                y: 200,
            },
            margin: {
                top: 30,
            },
            axe: {
                right: true,
            },
            color: {
                fill: "orange"
            },
        }

        miniConfig = {
            id: "ok1",
            type: "bar",
            data: [1, 2, 3]
        }
    })

    describe("generator",()=>{
        it("failed with nonexistent figure id", ()=>{
            console.log("ss",sdatch)
            try{
                createFigure("chart",300,300)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("create new instance with exist dom id", ()=>{
            let s = createFigure("chart",300,300)
            expect(s).not.to.equal(null)
        })
    })

    describe('pushData', ()=>{

        it("append new data into dataset property", ()=>{
            const data1 = [1,2,3],
                data2 = [4,5,6]
            miniConfig.data = data1

            expect(s.dataset.has("data1")).to.equal(false)
            expect(s.dataset.size).to.equal(0)
            s.pushData(miniConfig)

            expect(s.dataset.has(miniConfig.id)).to.equal(true)
            expect(s.dataset.size).to.equal(1)
            expect(s.dataset.get(miniConfig.id)).to.equal(data1)

            miniConfig.id = "ok2"
            miniConfig.data = data2
            s.pushData(miniConfig)

            expect(s.dataset.has(miniConfig.id)).to.equal(true)
            expect(s.dataset.size).to.equal(2)
            expect(s.dataset.get(miniConfig.id)).to.equal(data2)
        })
        it("fails with no data given", ()=>{
            try{
                s.pushData({
                    id: "noook",
                    type: "bar"
                })
                expect(true).to.equal(false)
            } catch (e){
                expect(true).to.equal(true)
            }
        })
    })

    describe("pushLayer", ()=>{
        it("appends new Layer for the instance after setData", ()=>{
            s.pushData(sampleConfig)
            expect(s.layer[sampleConfig.id]).to.equal(undefined)
            s.pushLayer(sampleConfig)
            expect(typeof s.layer[sampleConfig.id]).to.equal("object")
            expect(s.layer[sampleConfig.id].type).to.equal(sampleConfig.type)
        })
        it("fails without any data registered", ()=>{
            delete(miniConfig.data)
            try {
                s.pushLayer(miniConfig)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("fails with invalid Layer type specified", ()=>{
            try{
                expect(s.layer.nok).to.equal(undefined)
                s.pushLayer({
                    id: "nok",
                    hoge: "fuga"
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })


    describe("closure addLayer", ()=>{
        it("can add new layer for the instance", ()=>{
            const data = [1,23,456]
            s.addLayer({
                id: "barsample",
                type: "bar",
                data: data
            })
            expect(typeof s.layer.barsample).to.equal("object")
            // expect(s.dataset.size).to.equal(1)
            expect(s.dataset.has("barsample")).to.equal(true)
            // expect(s.dataset.get("barsample")).to.equal(data)
            expect(s.layer.barsample.type).to.equal("bar")
        })

        it("fails with unrecognized layer type", ()=>{
            try {
                s.addLayer({
                    id: "barsample",
                    type: "hoge",
                    data: [1,23,456]
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("fails with invalid config object (lack of id)", ()=>{
            try {
                s.addLayer({
                    type: "bar",
                    data: [1,23,456]
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("fails with invalid config object (lack of data)", ()=>{
            try {
                s.addLayer({
                    id: "barsample",
                    type: "bar",
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })

    describe("closure addBar", ()=>{

        it("can add new Bar layer for the instance", ()=>{
            const data = [1,2,3,4,5]
            s.addBar({
                id: "test4",
                data: data
            })
            expect(typeof s.layer.test4).to.equal("object")
            expect(s.dataset.has("test4")).to.equal(true)
            expect(s.dataset.get("test4")).to.equal(data)
            expect(s.layer.test4.type).to.equal("bar")
        })

        it("can generate several Bar layer for the instance", ()=>{
            const data = [1,2,3,4,5]
            const data2 = [2,2,5,5,5]
            s.addBar([
                {
                    id: "test4",
                    data: data
                },
                {
                    id: "test42",
                    data: data2
                },
                {
                    id: "test43",
                    data: data2
                },
            ])
            expect(s.layer.hasOwnProperty("test4")).to.equal(true)
            expect(s.layer.hasOwnProperty("test42")).to.equal(true)
            expect(s.layer.hasOwnProperty("test43")).to.equal(true)
            expect(s.dataset.get("test4")).to.equal(data)
            expect(s.dataset.get("test42")).to.equal(data2)
            expect(s.layer.test4.type).to.equal("bar")
            expect(s.layer.test42.type).to.equal("bar")
        })

        it("fails with invalid object (lack of id)", ()=>{
            const data = [1,2,3,4,5]
            try{
                s.addBar({
                    data: data
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("fails with invalid object (lack of data)", ()=>{
            try{
                s.addBar({
                    id: "bar11"
                })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })

    describe("getLayer", ()=>{
        it("fails with the layer not exist", ()=>{
            try{
                s.getLayer("nothere")
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("gives a layer set by pushLayer", ()=>{
            s.pushData(sampleConfig)
            s.pushLayer(sampleConfig)
            expect(typeof s.layer[sampleConfig.id]).to.equal("object")
            try{
                s.getLayer(sampleConfig.id)
                expect(true).to.equal(true)
            } catch (e) {
                expect(true).to.equal(false)
            }
        })
    })

    describe("relation", ()=>{
        let configs, miniMargin = 0, miniMarginSafe = 0, miniArea = 0
        beforeEach(()=>{
            s = createFigure("chart",300.300)
            configs = [{
                id: "one",
                type: "bar",
                area: {
                    x: 200,
                    y: 100,
                },
                data: [1,2,3]
            },{
                id: "two",
                type: "bar",
                rel: "one",
                margin: {
                    left: 30
                },
                area: {
                    x: 180,
                    y: 120,
                },
                data: [1293,3133,3845]
            },{
                id: "three",
                type: "bar",
                data: [2222,3233,3225]
            }]
        })
        it("is created by makeRelation without any error", ()=>{
            expect(s.rel.length).to.equal(0)
            s.makeRelation(configs)
            expect(s.rel.length).not.to.equal(0)
        })
        it("is assigned as a relations between specified layers", ()=>{
            s.makeRelation(configs)
            expect(s.rel.length).to.equal(1)
            expect(s.rel[0].length).to.equal(2)
            expect(s.rel[0][0]).to.equal("one")
            expect(s.rel[0][1]).to.equal("two")
        })
        it("can be get by name with getRelation", ()=>{
            s.makeRelation(configs)
            const rel = s.getRelation("two")
            expect(rel[0]).to.equal("one")
            expect(rel[1]).to.equal("two")
        })
        it("can be result null with nonexistent layer name with getRelation", ()=>{
            s.makeRelation(configs)
            expect(s.getRelation("tooth")).to.be.null
        })
        it("is not exist, then layers cannot be arranged", ()=>{
            delete(configs[1].rel)
            s.addLayer(configs)
            expect(s.layer.one.area.x).not.to.equal(s.layer.two.area.x)
            expect(s.layer.one.margin.left).not.to.equal(s.layer.two.margin.left)
            expect(s.layer.one.margin.left).to.be.lessThan(s.layer.two.margin.left)
            expect(s.layer.one.safe.margin.left).not.to.equal(s.layer.two.safe.margin.left)
            expect(s.layer.one.safe.margin.left).to.be.lessThan(s.layer.two.safe.margin.left)
            miniMargin = s.layer.one.margin.left
            miniMarginSafe = s.layer.one.safe.margin.left
            miniArea = s.layer.two.area.x
        })
        it("can be used to arrange layers as a layer group", ()=>{
            s.makeRelation(configs)
            s.addLayer(configs)
            // s.arrangeLayer("two") //optional
            expect(s.layer.one.area.x).to.equal(s.layer.two.area.x)
            expect(s.layer.one.margin.left).to.equal(s.layer.two.margin.left)
            expect(s.layer.one.safe.margin.left).to.equal(s.layer.two.safe.margin.left)
        })
        it("can be used to arrange layers with bigger FSR parameters", ()=>{
            s.makeRelation(configs)
            s.addLayer(configs)
            expect(s.layer.one.area.x).to.equal(miniArea)
            expect(s.layer.one.margin.left).to.be.greaterThan(miniMargin)
            expect(s.layer.one.safe.margin.left).to.be.greaterThan(miniMarginSafe)
            expect(s.layer.two.safe.margin.left).to.be.greaterThan(miniMarginSafe)
            expect(s.layer.one.safe.margin.left).to.equal(s.layer.two.safe.margin.left)
        })
        it("also can be used to arrange layers with bigger FSR parameters as an array", ()=>{
            configs[1].rel = ["one","three"]
            s.makeRelation(configs)
            s.addLayer(configs)
            expect(s.layer.one.area.x).to.equal(miniArea)
            expect(s.layer.one.margin.left).to.be.greaterThan(miniMargin)
            expect(s.layer.one.safe.margin.left).to.be.greaterThan(miniMarginSafe)
            expect(s.layer.two.safe.margin.left).to.be.greaterThan(miniMarginSafe)
            expect(s.layer.three.safe.margin.left).to.be.greaterThan(miniMarginSafe)
            expect(s.layer.one.safe.margin.left).to.equal(s.layer.two.safe.margin.left)
            expect(s.layer.three.safe.margin.left).to.equal(s.layer.two.safe.margin.left)
        })
    })

});

