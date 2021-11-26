import {Bubble} from "../src/layer/bubble.js"
import {getFigureCore} from "../src/lib.js";
import {expect} from "chai";

describe("Bubble class", ()=>{
    document.body.innerHTML = '<div><span id="test1"></span></div>';
    describe("constructor", ()=>{
        it("can generate new instance without layer type field", ()=>{
            const data = [[1,2],[5,5],[3,9]]
            let p = new Bubble({
                id: "test1",
                column: [1,2,3],
                data: data,
                svg: { body: getFigureCore("chart", 100,100) },
            })
            for (let i=0; i<p.data.length; i++){
                expect(p.data[i]).to.equal(data[i])
            }
            expect(p.id).to.equal("test1")
            expect(p.type).to.equal("bubble")
        })
        it("generate new instance with default field values, based on font size", ()=>{
            const data = [[1,2],[5,5],[3,9]]
            const fontSize = 15
            let p = new Bubble({
                id: "test1",
                column: [1,2,3],
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
            p = new Bubble({
                id: "test1",
                column: ["adventure", "beginning", "city"],
                data: [[1,2],[5,5],[3,9]],
                svg: { body: getFigureCore("chart", 100,100) }
            })
        })
        it("should generate circle element for multi-dimensional data", ()=>{
            expect(p.el.bubble).to.be.undefined
            let bubble_number = document.getElementsByClassName("bubble").length
            try {
                p.render()
                expect(p.el.bubble).not.be.undefined
                expect(document.getElementsByClassName("bubble").length).to.be.greaterThan(bubble_number)
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
        it("can unset bubble by configuration ", ()=>{
            p.hasBubble = false
            expect(p.el.bubble).to.be.undefined
            p.render()
            expect(p.el.bubble).not.be.undefined
        })
    })

    describe("updateData method", () => {
        let l
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';

            l = new Bubble({
                id: "test1",
                column: ["adventure", "beginning", "city"],
                data: [[1,2],[5,4],[3,6]],
                svg: { body: getFigureCore("chart", 100,100) }
            })

        })
        it("should make bubble positions updated", () => {
            l.render()
            let el = document.getElementsByClassName("bubble")
            for (let i in el)
                if (typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__[0] % 2).to.equal(1)
                    expect(el[i].__data__[1] % 2).to.equal(0)
                }
            let newData = [[10,23], [222,357], [3000000,1]]
            l.updateData(newData)
            el = document.getElementsByClassName("bubble")
            for (let i in el)
                if (typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__[0] % 2).to.equal(0)
                    expect(el[i].__data__[1] % 2).to.equal(1)
                }
        })
    })
})
