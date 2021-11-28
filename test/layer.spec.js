import {Layer} from "../src/layer/layer.js"
import {getFigureCore} from "../src/lib.js";
import {max, min} from "d3-array";
import {expect} from "chai";

let s, conf
describe("Layer class (unit tests)", ()=>{

    describe("constructor",()=>{
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="test1"></span></div>';
            conf = {
                id: "test-layer",
                data: [1,2,3],
                type: "plain",
                svg: {
                    target: "test1",
                }
            }
        })
        it("should generate a new instance without any error", ()=>{
            new Layer(conf)
        })
        it("should generate a new SVG element in the initialization", ()=>{
            expect(document.getElementsByTagName("svg").length).to.equal(0)
            new Layer(conf)
            expect(document.getElementsByTagName("svg").length).to.equal(1)
        })
        it("should fail to generate without id", ()=>{
            delete(conf.id)
            try {
                new Layer(conf)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("should fail to generate without type", ()=>{
            delete(conf.type)
            try {
                new Layer(conf)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("should fail to generate without svg", ()=>{
            delete(conf.svg)
            try {
                new Layer(conf)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })

    describe('setSVG',  ()=> {
        beforeEach(()=>{
            document.body.innerHTML =
                '<div>' +
                '  <span id="test1" />' +
                '</div>';
            conf = {
                id: "test-layer",
                data: [1,2,3],
                type: "plain",
                svg: {
                    target: "test1"
                }
            }
        })

        it("can generate a new instance with specified SVG properties", ()=>{
            let s = new Layer(conf)
            expect(s.id).to.equal(conf.id)
            expect(s.type).to.equal(conf.type)
            expect(typeof s.svg).to.equal("object")
            expect(document.getElementById("test1")).not.to.be.null
            expect(s.svg.width).to.not.be.undefined
            expect(s.svg.height).to.not.be.undefined
        })

        it("should fail without id nor target specified",()=>{
            delete(conf.target)
            try {
                new Layer(conf)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("should fail with both of id and target specified",()=>{
            conf.id = "hoge"
            try {
                new Layer(conf)
                expect(true).to.equal(true)
            } catch (e) {
                expect(true).to.equal(false)
            }
        })

        it("should fail with nonexistent target specified",()=>{
            conf.target="hoge"
            try {
                new Layer(conf)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("can generate a new instance with specified SVG properties without body but width and height", ()=>{
            conf.svg.width = 100
            conf.svg.height = 120
            let s = new Layer(conf)
            expect(s.id).to.equal(conf.id)
            expect(s.type).to.equal(conf.type)
            expect(typeof s.svg).to.equal("object")
            expect(typeof s.svg.id).to.equal("string")
            expect(s.svg.id).to.equal("sdatch_test1")
            expect(document.getElementById(s.svg.id)).not.to.be.null
            expect(s.svg.width).to.equal(100)
            expect(s.svg.height).to.equal(120)
        })

        it("can generate a new instance with valid svg object having id for exist SVG element", ()=>{
            delete(conf.svg.target)
            getFigureCore("test1",100,100)
            conf.svg.id = "sdatch_test1"
            try{
                let s = new Layer(conf)
                expect(true).to.equal(true)
                expect(typeof s.svg).to.equal("object")
                expect(document.getElementById("sdatch_test1")).not.to.be.null
                expect(s.svg.width).to.not.be.undefined
                expect(s.svg.height).to.not.be.undefined
            } catch (e) {
                expect(true).to.equal(false)
            }
        })

        it("can generate a new instance with valid svg object having SVG selection", ()=>{
            delete(conf.svg.target)
            conf.svg.body = getFigureCore("test1",100,100)
            try{
                let s = new Layer(conf)
                expect(true).to.equal(true)
                expect(typeof s.svg).to.equal("object")
                expect(s.svg.id).to.equal("unknown")
                expect(s.svg.width).to.not.be.undefined
                expect(s.svg.height).to.not.be.undefined
            } catch (e) {
                expect(true).to.equal(false)
            }
        })

        it("can generate a new instance with svg property as a string, for the single layer", ()=>{
            conf.svg = "test1"
            let s = new Layer(conf)
            expect(s.id).to.equal(conf.id)
            expect(s.type).to.equal(conf.type)
            expect(typeof s.svg).to.equal("object")
            expect(typeof s.svg.body).to.equal("object")
            expect(document.getElementById("sdatch_test1")).not.to.be.null
            expect(document.getElementById("sdatch_test1")).to.not.be.undefined
            expect(s.svg.width).to.not.be.undefined
            expect(s.svg.height).to.not.be.undefined
        })
    });

    describe("setMargin", ()=>{
        beforeEach(()=>{
            conf = {
                id: "test1",
                data: [1,2,3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: {},
                    dummy: true
                }
            }
            s = new Layer(conf)
        })
        it("should fail without any argument", ()=>{
            try {
                s.setMargin()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("should set margin with the argument object", ()=>{
            let m = { margin: {top: 1, left: 2} }
            s.setMargin(m)
            expect(s.margin.top).to.equal(m.margin.top)
            expect(s.margin.left).to.equal(m.margin.left)
        })
        it("should set margin with the argument array", ()=>{
            let m = { margin: [1, 2] }
            s.setMargin(m)
            expect(s.margin.top).to.equal(m.margin[0])
            expect(s.margin.left).to.equal(m.margin[1])
        })
        it("should fail with invalid length argument array", ()=>{
            let m = { margin: [1,2,3,5,4,5,6] }
            try {
                s.setMargin(m)
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("can set same number with the argument number ", ()=>{
            s.setMargin({margin: 500})
            expect(s.margin.top).to.equal(500)
            expect(s.margin.left).to.equal(500)
        })
    })

    describe("setArea", ()=>{
        let s
        beforeEach(()=>{
            s = new Layer({
                id: "test1", type: "dummy",
                data: [1,2,3],
                svg: {
                    id: "test1",
                    body: {},
                }
            })
        })
        it("can set area with area config object", ()=>{
            const a = {area: {x:345, y:789}}
            s.setArea(a)
            expect(s.area.x).to.equal(a.area.x)
            expect(s.area.y).to.equal(a.area.y)
        })
    })

    describe("updateDataCore", ()=>{
        let s
        beforeEach(()=>{
            conf = {
                id: "test1",
                data: [1,2,3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: {},
                    dummy: true
                }
            }
            s = new Layer(conf)
        })
        it("can assign valid data without any errors", ()=>{
            s.updateDataCore([4,5,6])
        })
        it("should fail with a data which has different length with previous data", ()=>{
            try {
                s.updateDataCore([4,5,6,7.8])
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })

    describe("getDataWith", ()=>{
        let s
        beforeEach(()=>{
            s = new Layer({
                id: "test1", type: "dummy",
                column: [1,2,3],
                data: [0.1,20,300],
                svg: {
                    id: "test1",
                    body: {},
                }
            })
        })
        it("can get data with max values", ()=>{
            const d = s.getDataWith(max)
            expect(d.x).equal(3)
            expect(d.y).equal(300)
        })
        it("can get data with min values", ()=>{
            const d = s.getDataWith(min)
            expect(d.x).equal(1)
            expect(d.y).equal(0.1)
        })
        it("cannot accept other functions", ()=>{
            try {
                s.getDataWith(function(){ return false })
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })

    describe("autoScaleY", ()=>{
        beforeEach(()=>{
            conf = {
                id: "test1",
                data: [1,2,3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: {},
                    dummy: true
                }
            }
            s = new Layer(conf)
        })
        it("can set x (bandscale) and y scale with a data array",()=>{
            expect(s.scale.x).to.be.null
            expect(s.scale.y).to.be.null
            s.autoScaleY()
            expect(s.scale.x).not.to.be.null
            expect(s.scale.x.bandwidth).to.not.be.undefined
            expect(s.scale.y).not.to.be.null
        })
        it("can set scales, even with a column",()=>{
            s.column = ["a","b","c"]
            expect(s.scale.x).to.be.null
            expect(s.scale.y).to.be.null
            s.autoScaleY()
            expect(s.scale.x).not.to.be.null
            expect(s.scale.x.bandwidth).to.not.be.undefined
            expect(s.scale.y).not.to.be.null
        })
        it("can set scales, even with a broken column but a valid data",()=>{
            s.column = ["a","b"]
            expect(s.scale.x).to.be.null
            expect(s.scale.y).to.be.null
            s.autoScaleY()
            expect(s.scale.x).not.to.be.null
            expect(s.scale.x.bandwidth).to.not.be.undefined
            expect(s.scale.y).not.to.be.null
        })
        it("cannot set scales with an invalid data", ()=>{
            try {
                s.data = ["t","h","p","r",123]
                s.autoScaleY()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
    })

    describe("autoScaleXYZ", ()=>{
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="test1"></span></div>';
            conf = {
                id: "test1",
                column: [10,11,12],
                data: [1,2,3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: {},
                    dummy: true
                }
            }
            s = new Layer(conf)
        })
        it("can generate scale x and y with a valid column and data set",()=>{
            s.autoScaleXYZ()
        })
        it("cannot set scales without a column", ()=>{
            try {
                delete(s.column)
                s.autoScaleXYZ()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("cannot set scales with a column of strings", ()=>{
            try {
                s.column = ["a","b","c"]
                s.autoScaleXYZ()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("cannot set scales with unmatched column length", ()=>{
            try {
                s.column = [1000, 2000]
                s.autoScaleXYZ()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

    })

    describe("setCollision", ()=>{
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="test1"></span></div>';
            conf = {
                id: "test1",
                data: [1,2,3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: getFigureCore("test1",100,100),
                }
            }
            s = new Layer(conf)
        })
        it("cannot set collision area without any preset scales", ()=>{
            try {
                s.setCollision()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("cannot set collision area without any valid svg core", ()=>{
            delete(s.svg.body)
            try {
                s.autoScaleY()
                s.setCollision()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("can set collision area with circle element and with scaleBand", ()=>{
            s.autoScaleY()
            s.setCollision()
        })
        it("can set collision area with circle element and with scaleLinear", ()=>{
            s.column = ["a","b","c"]
            s.autoScaleXYZ()
            s.setCollision()
        })
    })

    describe("setCollisionBar", ()=>{
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="test1"></span></div>';
            conf = {
                id: "test1",
                data: [1,2,3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: getFigureCore("test1",100,100),
                }
            }
            s = new Layer(conf)
        })
        it("cannot set collision area without any preset scales", ()=>{
            try{
                s.setCollisionBar()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("cannot set collision area without any valid preset svg core", ()=>{
            delete(s.svg.body)
            try{
                s.autoScaleY()
                s.setCollisionBar()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("can set collision area with rect elements", ()=>{
            s.autoScaleY()
            s.setCollisionBar()
        })
    })

    describe("labels", ()=>{
        let s
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="test1"></span></div>';
            conf = {
                id: "test1",
                data: [1,2,3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: getFigureCore("test1",100,100),
                }
            }
            s = new Layer(conf)
        })

        it("can be dumped with getLabelArray", ()=>{
            const labels = s.getLabelArray()
            expect(labels.length).not.to.be.undefined
            expect(labels.length).equal(s.data.length)
            for(let i in labels)
                expect(labels[i]).to.equal(s.data[i])
        })

        it("can be formatted and extracted with getLabelArray with column and data", ()=>{
            s.column = ["a","b","c"]

            const labels = s.getLabelArray(),
                comp = ["a, 1","b, 2", "c, 3"]
            for(let i in labels)
                expect(labels[i]).to.equal(comp[i])
        })

        it("can be formatted and extracted with getLabelArray with column and nested data", ()=>{
            s.column = ["a","b","c"]
            s.data = [[1,2],[3,4],[5,6]]
            s.autoScaleXYZ()
            const labels = s.getLabelArray(),
                comp = ["a, 1, 2","b, 3, 4", "c, 5, 6"]
            for(let i in labels)
                expect(labels[i]).to.equal(comp[i])
        })

        it("max length should be gotten by getLabelMax", ()=>{
            s.data = [123,12345,12345678]
            expect(s.getLabelMax()).to.equal(8)
        })

        it("should be generated by setLabel for Y data", ()=>{
            s.autoScaleY()
            expect(document.getElementsByClassName("sdc-label").length).to.equal(0)
            s.setLabel()
            expect(document.getElementsByClassName("sdc-label").length).to.equal(s.data.length)
        })

        it("should be generated by setLabel for XY data (two dimension)", ()=>{
            s.column = ["a","b","c"]
            s.autoScaleXYZ()
            expect(document.getElementsByClassName("sdc-label").length).to.equal(0)
            expect(s.el.label).to.be.null
            expect(s.el.labelRect).to.be.null
            s.setLabel()
            expect(document.getElementsByClassName("sdc-label").length).to.equal(s.data.length)
            expect(s.el.label).not.to.be.null
            expect(s.el.labelRect).not.to.be.null
        })

        it("should be removed by unsetLabel", ()=>{
            s.column = ["a","b","c"]
            s.autoScaleXYZ()
            s.setLabel()
            s.unsetLabel()
            expect(document.getElementsByClassName("sdc-label").length).to.equal(0)
            expect(s.el.label).to.be.null
            expect(s.el.labelRect).to.be.null
        })

        it("fade-in and fade-out animation can be set by setFade", ()=>{
            expect(s.fade.label.in).to.be.null
            expect(s.fade.label.out).to.be.null
            s.setFade()
            expect(typeof s.fade.label.in).to.equal("function")
            expect(typeof s.fade.label.out).to.equal("function")
        })

    })
    describe("axis", ()=> {
        let s
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="test1"></span></div>';
            conf = {
                id: "test1",
                data: [1, 2, 3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: getFigureCore("test1", 100, 100),
                }
            }
            s = new Layer(conf)
        })

        it("x should be set by appendAxeX", ()=>{
            expect(document.getElementsByTagName("path").length).to.equal(0)
            s.autoScaleY()
            s.appendAxeX(true)
            expect(document.getElementsByTagName("path").length).to.equal(1)
            expect(document.getElementsByClassName("sdc-axis-x").length).to.equal(1)
        })

        it("y should be set by appendAxeY", ()=>{
            expect(document.getElementsByTagName("path").length).to.equal(0)
            s.autoScaleY()
            s.appendAxeY(true)
            expect(document.getElementsByTagName("path").length).to.equal(1)
            expect(document.getElementsByClassName("sdc-axis-y").length).to.equal(1)
        })

        it("x and y should be rendered onetime by renderAxe as default axe", ()=>{
            expect(document.getElementsByTagName("path").length).to.equal(0)
            s.autoScaleY()
            s.renderAxe()
            expect(document.getElementsByTagName("path").length).to.equal(2)
            expect(document.getElementsByClassName("sdc-axis-x").length).to.equal(1)
            expect(document.getElementsByClassName("sdc-axis-y").length).to.equal(1)
        })
    })

    describe("getNormalizedXYData", ()=> {
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="test1"></span></div>';
            conf = {
                id: "test1",
                column: ["a", "b", "c"],
                data: [1, 2, 3],
                type: "plain",
                svg: {
                    id: "test1",
                    body: getFigureCore("test1", 100, 100),
                }
            }
            s = new Layer(conf)
        })
        it("should fail with unmatched column length to data length", ()=>{
            try {
                s.column = ["A","Z"]
                s.getNormalizedXYData()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })

        it("should return indexed data for columned data", ()=>{
            const d = s.getNormalizedXYData()
            for(let i=0; i<d.length; i++){
                expect(d[i][0]).to.equal(i)
                expect(d[i][1]).to.equal(s.data[i])
            }
        })

        it("should simply return data for nested data", ()=>{
            s.data = [[1,3],[4,5],[6,9]]
            const d = s.getNormalizedXYData()
            for(let i=0; i<d.length; i++){
                expect(d[i][0]).to.equal(s.data[i][0])
                expect(d[i][1]).to.equal(s.data[i][1])
            }
        })

        it("should return combined data for number column", ()=>{
            s.column = [11,22.52,35]
            const d = s.getNormalizedXYData()
            for(let i=0; i<d.length; i++){
                expect(d[i][0]).to.equal(s.column[i])
                expect(d[i][1]).to.equal(s.data[i])
            }
        })

        it("should return indexed data without column", ()=>{
            s.column = undefined
            const d = s.getNormalizedXYData()
            for(let i=0; i<d.length; i++){
                expect(d[i][0]).to.equal(i)
                expect(d[i][1]).to.equal(s.data[i])
            }
        })
    })

    //TODO: add test cases for following methods:
    // [class B] important internal methods
    // * getScaleForData
    // * hasData
    // * hasNestedData
    // * hasColumn
    // * hasNumberColumn
    // [class C] representational or optional
    // * rotate
    // * setHoverColor
    // * setFade
    // * getLabelClass

})