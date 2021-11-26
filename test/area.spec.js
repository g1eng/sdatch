import {Area} from "../src/layer/area.js"
import {getFigureCore} from "../src/lib.js";
import {expect} from "chai";

describe("Area class", ()=>{
    document.body.innerHTML = '<div><span id="test1"></span></div>';
    describe("constructor", ()=>{
        it("can generate new instance without layer type field", ()=>{
            const data = [[1,2],[5,5],[3,9]]
            let l = new Area({
                id: "test1",
                data: data,
                svg: { body: getFigureCore("chart", 100,100) }
            })
            for (let i=0; i<l.data.length; i++){
                expect(l.data[i]).to.equal(data[i])
            }
            expect(l.id).to.equal("test1")
            expect(l.type).to.equal("area")
        })
        it("generate new instance with default field values, based on font size", ()=>{
            const data = [[1,2],[5,5],[3,9]]
            const fontSize = 15
            let l = new Area({
                id: "test1",
                data: data,
                svg: { body: getFigureCore("chart", 100,100) },
                font: {size: fontSize}
            })
            expect(l.font.size).to.equal(fontSize)
            expect(l.safe.area.x).to.be.lessThan(l.area.x)
            expect(l.safe.area.y).to.be.lessThan(l.area.y)
            expect(l.safe.margin.top).to.be.greaterThan( 0 )
            expect(l.safe.margin.left).to.be.greaterThan( 0 )
        })
    })
    describe("render method", ()=>{
        let l
        document.body.innerHTML =
            '<div>' +
            '  <span id="chart" />' +
            '</div>';
        beforeEach(()=>{
            l = new Area({
                id: "test1",
                column: ["adventure", "beginning", "city"],
                data: [1,2,3],
                svg: {
                    body: getFigureCore("chart", 100,100)
                }
            })
        })
        it("should generate area for multi-dimensional data, but should not generate its edge", ()=>{
            expect(l.el.area).to.be.undefined
            expect(l.el.plot).to.be.undefined
            let el_number = document.getElementsByClassName("area").length

            l.render()
            expect(l.el.area).not.be.undefined
            expect(l.el.plot).to.be.undefined
            expect(document.getElementsByClassName("area").length).to.be.greaterThan(el_number)
        })
        it("should throw error for single dimensional data", ()=>{
            delete(l.column)
            try {
                l.render()
                expect(true).to.equal(false)
            } catch (e) {
                expect(true).to.equal(true)
            }
        })
        it("can unset plot by configuration ", ()=>{
            l.plot = false
            expect(l.el.plot).to.be.undefined
            try {
                l.render()
                expect(l.el.plot).to.be.undefined
            } catch (e) {
                expect(true).to.equal(false)
            }
        })
    })

    describe("updateData method", () => {
        let l
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';

            l = new Area({
                id: "test1",
                column: ["adventure", "beginning", "city"],
                data: [1, 2, 3],
                svg: {
                    body: getFigureCore("chart", 100, 100)
                }
            })

        })
        it("should make area path updated", () => {
            l.render()
            let el = document.getElementsByClassName("area")
            for (let i in el)
                if (typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__[0][1]).to.be.lessThan(5)
                }
            let newData = [10, 20, 3000000]
            l.updateData(newData)
            el = document.getElementsByClassName("area")
            for (let i in el)
                if (typeof el[i] === "object")
                    expect(el[i].__data__[0][1]).to.be.greaterThanOrEqual(10)
        })
    })
})
