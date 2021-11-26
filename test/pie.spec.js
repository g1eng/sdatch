import {Pie} from "../src/layer/pie.js"
import {expect} from "chai";

describe("Pie class", ()=>{
    describe("constructor", ()=>{
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="test1"></span></div>';
        })
        it("should generate new instance, even if it lacks `type` field", ()=>{
            const data = [1,2,3]
            let b = new Pie({
                id: "test1",
                data: data,
                svg: { target: "test1"}
            })
            for (let i=0; i<b.data.length; i++){
                expect(b.data[i]).to.equal(data[i])
            }
            expect(b.id).to.equal("test1")
            expect(b.type).to.equal("pie")
        })
        it("should generate a new SVG element in the initialization", ()=>{
            expect(document.getElementsByTagName("svg").length).to.equal(0)
            const data = [1,2,3]
            new Pie({
                id: "test1",
                data: data,
                svg: { target: "test1"}
            })
            expect(document.getElementsByTagName("svg").length).to.equal(1)
        })
        it("should generate new instance with default field values, based on font size", ()=>{
            const fontSize = 15
            let b = new Pie({
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
            let b = new Pie({
                id: "test1",
                data: [1,2,3],
                svg: { target: "test1"},
                font: {size: 12},
                safe: false
            })
            expect(b.safe.margin.top).to.equal( 0 )
            expect(b.safe.margin.left).to.equal( 0 )
        })
    })
    describe("render method", ()=>{
        let p
        beforeEach(()=>{
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            p = new Pie({
                id: "test3",
                data: [1,2,333,4,5],
                svg: {target: "chart"}
            })

        })
        it("should set Pie.el.pie to draw new pie chart", ()=>{
            expect(p.el.pie).to.be.undefined
            try{
                p.render()
                expect(p.el.pie).not.to.equal(null)
            } catch (e) {
                expect(true).to.equal(false)
            }
        })
        it("can generate arc element(s) in the SVG", ()=>{
            let el_length = document.getElementsByClassName("pie").length
            expect(el_length).to.equal(0)
            p.render()
            expect(document.getElementsByClassName("pie").length).to.be.greaterThan(el_length)
        })
        it("should render arcs with preset data", ()=>{
            new Pie({
                id: "test3",
                data: [1,2,3,4,5],
                svg: {target: "chart"}
            }).render()
            let el = document.getElementsByClassName("pie")
            expect(el.length).to.equal(5)
            for (let i in el) {
                if (typeof el[i] === "object"){
                    expect(el[i].__data__.data).to.equal(parseInt(i)+1)
                }
            }
        })
    })

    describe("updateData method", () => {
        let p
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            p = new Pie({
                id: "test3",
                data: [1, 2, 3, 4, 5],
                svg: {target: "chart"},
                label: false,
                animation: false
            })
        })
        it("should generate arc with updated height", () => {
            p.render()
            let el = document.getElementsByClassName("pie")
            expect(el.length).not.to.equal(0)
            for (let i in el)
                if (typeof el[i] === "object"){
                    console.log(el[i])
                    expect(el[i].__data__.data).to.equal(parseInt(i)+1)
                }
            let newData = [10, 20, 30, 40, 50]
            p.updateData(newData)
            el = document.getElementsByClassName("pie")
            for (let i in el)
                if (typeof el[i] === "object")
                    expect(el[i].__data__.data).to.equal(( parseInt(i) + 1 ) * 10)
        })
    })

    describe("setLabel method", ()=>{
        let p
        beforeEach(() => {
            document.body.innerHTML = '<div><span id="chart"></span></div>';
            p = new Pie({
                id: "test3",
                data: [1, 2, 3, 4, 5],
                svg: {target: "chart"},
                label: false,
                animation: false
            })
        })
        it("should set labels for each datum", ()=>{
            p.render()
            const el_length = document.getElementsByClassName("pie").length,
                text_num_initial = document.getElementsByTagName("text").length
            expect(el_length).not.to.equal(0)
            p.setLabel()
            const label_num = document.getElementsByTagName("text").length - text_num_initial
            expect(label_num).to.equal(el_length)
        })
    })

})
