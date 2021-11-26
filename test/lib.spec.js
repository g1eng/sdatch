import {getFigureCore} from "../src/lib.js"
import {expect} from "chai";

describe("getFigureCore", ()=>{
    beforeEach(()=>{
        document.body.innerHTML =
            '<div>' +
            '  <span id="chart" />' +
            '</div>';
    })
    it("fails without arguments", ()=>{
        try{
            getFigureCore()
            expect(true).to.equal(false)
        } catch (e) {
            expect(true).to.equal(true)
        }
    })
    it("fails with nonexistent DOM id", ()=>{
        try{
            getFigureCore("hoge",100,100)
            expect(true).to.equal(false)
        } catch (e) {
            expect(true).to.equal(true)
        }
    })
    it("fails with undefined DOM id", ()=>{
        try{
            getFigureCore(undefined,100,100)
            expect(true).to.equal(false)
        } catch (e) {
            expect(true).to.equal(true)
        }
    })
    it("fails with no height", ()=>{
        try{
            getFigureCore("chart", 100)
            expect(true).to.equal(false)
        } catch (e) {
            expect(true).to.equal(true)
        }
    })
    it("generate svg object", ()=>{
        expect(document.getElementsByTagName("svg").length).to.equal(0)
        let svg = getFigureCore("chart", 100, 100)
        expect(typeof svg).to.equal("object")
        expect(document.getElementsByTagName("svg")).not.to.equal(0)
    })
})