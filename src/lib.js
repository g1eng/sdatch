import {select} from "d3-selection";

/***
 *
 * @param {Number} c
 * @return {Number}
 */
function normalizeColor(c){
    if( c < 0 ) return 0
    else if(c>255) return 255
    else return c
}

/***
 *
 * @param {String} id
 * @param {Number} width
 * @param {Number} height
 * @return {Object}
 */
function getFigureCore(id, width, height){
    // console.log(width,height)
    if(!width || !height) throw new Error("Figure size must be specified")
    let core;
    try {
        core = select("#" + id)
            .append("svg")
            .attr("id", getSvgId(id))
            .attr("width", width)
            .attr("height",height);
    } catch (e) {
        console.log(e)
        throw new Error("failed to get a new graph core for the container " + id  + "!")
    }
    // console.log("svg is ", core)
    return core
}

/***
 *
 * @param {String} id
 * @return {String}
 */
function getSvgId(id){
    if(typeof id !== "string")
        throw Error("id must be specified as a string")
    return "sdatch_" + id
}

export {
    normalizeColor,
    getFigureCore,
    getSvgId
}


