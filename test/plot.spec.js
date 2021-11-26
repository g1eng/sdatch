import {Plot} from "../src/layer/plot.js"
import {getFigureCore} from "../src/lib.js";
import {expect} from "chai";

describe("Plot class", ()=>{
    document.body.innerHTML = '<div><span id="test1"></span></div>';
    describe("constructor", ()=>{
        it("can generate new instance without layer type field", ()=>{
            const data = [[1,2],[5,5],[3,9]]
            let p = new Plot({
                id: "test1",
                data: data,
                svg: { body: getFigureCore("chart", 100,100) },
            })
            for (let i=0; i<p.data.length; i++){
                expect(p.data[i]).to.equal(data[i])
            }
            expect(p.id).to.equal("test1")
            expect(p.type).to.equal("plot")
        })
        it("generate new instance with default field values, based on font size", ()=>{
            const data = [[1,2],[5,5],[3,9]]
            const fontSize = 15
            let p = new Plot({
                id: "test1",
                data: data,
                svg: { body: getFigureCore("chart", 100,100) },
                font: {size: fontSize}
            })
            expect(p.font.size).to.equal(fontSize)
            expect(p.safe.area.x).to.be.lessThan(p.area.x)
            expect(p.safe.area.y).to.be.lessThan(p.area.y)
            expect(p.safe.margin.top).to.be.greaterThan( 0 )
            expect(p.safe.margin.left).to.be.greaterThan( 0 )
        })
    })
    describe("render method", ()=>{
        let p
        document.body.innerHTML =
            '<div>' +
            '  <span id="chart" />' +
            '</div>';
        beforeEach(()=>{
            p = new Plot({
                id: "test1",
                column: ["adventure", "beginning", "city"],
                data: [1,2,3],
                svg: { body: getFigureCore("chart", 100,100) }
            })
        })
        it("should generate circle element for multi-dimensional data", ()=>{
            expect(p.el.plot).to.be.undefined
            try {
                p.render()
                expect(p.el.plot).not.be.undefined
                expect(document.getElementsByClassName("plot").length).to.equal(p.data.length)
            } catch (e) {
                expect(true).to.equal(false)
            }
        })
        it("should throw error for single dimensional data", ()=>{
            delete(p.column)
            try {
                p.render()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("can unset plot by configuration ", ()=>{
            p.hasPlot = false
            expect(p.el.plot).to.be.undefined
            p.render()
            expect(p.el.plot).not.be.undefined
        })
    })

    describe("updateData method", () => {
        let p
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';

            p = new Plot({
                id: "test1",
                column: ["adventure", "beginning", "city"],
                data: [1,2,3],
                svg: { body: getFigureCore("chart", 100,100) }
            })

        })
        it("should make plot positions updated", () => {
            p.render()
            let el = document.getElementsByClassName("plot")
            for (let i in el)
                if (typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__[1]).to.be.lessThan(5)
                }
            let newData = [10, 20, 3000000]
            p.updateData(newData)
            el = document.getElementsByClassName("plot")
            for (let i in el)
                if (typeof el[i] === "object")
                    expect(el[i].__data__[1]).to.be.greaterThanOrEqual(10)
        })
    })

    describe("setCollision method", ()=>{
        let p
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            p = new Plot({
                id: "test1",
                column: ["adventure", "beginning", "city"],
                data: [1,2,3],
                svg: { body: getFigureCore("chart", 100,100) }
            })
        })
        it("should set collision elements for plots", ()=>{
            p.renderPlot()
            let el_num = document.getElementsByTagName("circle").length
            expect(p.el.collision).to.be.null
            p.setCollision()
            expect(document.getElementsByTagName("circle").length).to.equal(el_num * 2)
            expect(document.getElementsByClassName("circle-boundary").length).to.equal(el_num)
        })
    })
})
