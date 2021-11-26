import {Bar} from "../src/layer/bar.js"
import {expect} from "chai";

describe("Bar class", ()=>{
    describe("constructor", ()=>{
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="test1"></span></div>';
        })
        it("should generate new instance, even if it lacks `type` field", ()=>{
            const data = [1,2,3]
            let b = new Bar({
                id: "test1",
                data: data,
                svg: { target: "test1"}
            })
            for (let i=0; i<b.data.length; i++){
                expect(b.data[i]).to.equal(data[i])
            }
            expect(b.id).to.equal("test1")
            expect(b.type).to.equal("bar")
        })
        it("should generate a new SVG element in the initialization", ()=>{
            expect(document.getElementsByTagName("svg").length).to.equal(0)
            const data = [1,2,3]
            new Bar({
                id: "test1",
                data: data,
                svg: { target: "test1"}
            })
            expect(document.getElementsByTagName("svg").length).to.equal(1)
        })
        it("should generate new instance with default field values, based on font size", ()=>{
            const fontSize = 15
            let b = new Bar({
                id: "test1",
                data: [1,2,3],
                svg: { target: "test1"},
                font: {size: fontSize}
            })
            expect(b.font.size).to.equal(fontSize)
            expect(b.safe.area.x).to.be.lessThan(b.area.x)
            expect(b.safe.area.y).to.be.lessThan(b.area.y)
            expect(b.safe.margin.top).to.be.greaterThan( 0 )
            expect(b.safe.margin.left).to.be.greaterThan( 0 )
        })
        it("should generate new instance without safe margins, if FSR is disabled", ()=>{
            let b = new Bar({
                id: "test1",
                data: [1,2,3],
                svg: { target: "test1"},
                font: {size: 12},
                safe: false
            })
            expect(b.safe.margin.top).to.equal( 0 )
            expect(b.safe.margin.left).to.equal( 0 )
        })
        it("may generate new instance with several field to be undefined", ()=>{
            let b = new Bar({
                id: "test1",
                data: [1,2,3],
                svg: { target: "test1"}
            })
            expect(typeof b.margin).to.equal("object")
            expect(b.margin.left).not.be.undefined
            expect(b.margin.top).not.be.undefined
            expect(typeof b.area).to.equal("object")
            expect(typeof b.el).to.equal("object")
            expect(typeof b.scale).to.equal("object")
            expect(typeof b.scale.x).to.equal("function")
            expect(typeof b.scale.y).to.equal("function")
            expect(typeof b.ticks).to.equal("object")
            expect(typeof b.color).to.equal("object")
            expect(typeof b.fade).to.equal("object")
            expect(typeof b.fade.label).to.equal("object")
            expect(typeof b.fade.area).to.equal("object")
        })
    })
    describe("render method", ()=>{
        let b
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            b = new Bar({
                id: "test3",
                data: [1,2,333,4,5],
                svg: {target: "chart"}
            })

        })
        it("should set Bar.el.bar to draw new bar chart", ()=>{
            expect(b.el.bar).to.be.undefined
            try{
                b.render()
                expect(b.el.bar).not.to.equal(null)
            } catch (e) {
                expect(true).to.equal(false)
            }
        })
        it("can generate five rect element in the SVG", ()=>{
            expect(document.getElementsByTagName("rect").length).to.equal(0)
            b.render()
            expect(document.getElementsByTagName("rect").length).to.equal(5)
        })
        it("should generate new instance with animation", ()=>{
            new Bar({
                id: "test3",
                data: [1,2,3,4,5],
                svg: {target: "chart"}
            }).render()
            let el = document.getElementsByTagName("rect")
            for (let i in el) {
                if (typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__).to.be.lessThan(10)
                    expect(el[i].__transition).to.not.be.undefined
                }
            }
        })
        it("should generate new instance without animation", ()=>{
            new Bar({
                id: "test3",
                data: [1,2,3,4,5],
                svg: {target: "chart"},
                animation: false
            }).render()
            let el = document.getElementsByTagName("rect")
            for (let i in el) {
                if (typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__).to.be.lessThan(10)
                    expect(el[i].__transition).to.be.undefined
                }
            }
        })
    })

    describe("updateData method", () => {
        let b
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            b = new Bar({
                id: "test3",
                data: [1, 2, 3, 4, 5],
                svg: {target: "chart"},
                label: false,
                animation: false
            })

        })
        it("should generate rect with updated height", () => {
            b.render()
                let el = document.getElementsByTagName("rect")
                for (let i in el)
                    if (typeof el[i] === "object")
                        expect(el[i].__data__).to.be.lessThan(10)
                let newData = [10, 20, 343, 40, 50]
                b.updateData(newData)
                el = document.getElementsByTagName("rect")
                for (let i in el)
                    if (typeof el[i] === "object")
                        expect(el[i].__data__).to.be.greaterThanOrEqual(10)
        })
    })

})
