import {Layer} from "./layer.js";
import {pie, arc} from "d3-shape"
import {interpolateSpectral} from "d3-scale-chromatic"
import {active, transition} from "d3-transition";

function getColor(i, len=12){
    const dS = Math.PI / len,
        r = 255 * Math.sin(i*dS),
        g = 255 * Math.sin((i+7.5)*dS),
        b = 255 * Math.sin((i+10.5)*dS)
    return `rgb(${r},${g},${b})`
}

/**
 * Visualization class for Pie charts. (unstable)
 *
 * Pie chart is a portion chart based on centroid.
 * The constructor can accept FigConfig object with `radius`, `innerRadius`,
 * radStart or radEnd attributes.
 *
 * ```
 * new Pie({
 *   type: "pie",
 *   column: ["liberty", "power", "wise", "humor", "commune", "unity", "passion", "thought", "other"],
 *   data: [21, 12, 11, 27, 10, 9, 10 , 21, 13],
 *   margin: {
 *     top: 30,
 *     left: 30
 *   },
 *   id: "p62",
 *   animation: false,
 *   radius: 70,
 *   innerRadius: 50,
 *   radStart: Math.PI / 2,
 *   radEnd: Math.PI * 3 / 2,
 *   clockwise: false
 * }).renderAll()
 * ```
 */

class Pie extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf) {
        super(conf);
        this.type = "pie"

        this.area.radius = Math.sqrt(this.area.x * this.area.y) /2.5

        this.radStart = (conf.radStart)? conf.radStart: 0
        this.radEnd = (conf.radEnd)? conf.radEnd: Math.PI * 2
        if(this.radStart === this.radEnd)
            this.radEnd += Math.PI * 2
        this.radRange = (this.radEnd - this.radStart) / Math.PI / 2
        if (conf.clockwise === false)
            this.radRange = -this.radRange
        this.innerRadius = (conf.innerRadius)? conf.innerRadius: 0
        if (typeof conf.radius === "number")
            this.area.radius = conf.radius

    }
    autoScale(){
    }

    /**
     * Pie.updateData overrides Layer.updateData and it updates Pie chart state
     * itself.
     * FIXME: label cannot be updated after updateData.
     * @param data
     */
    updateData(data){
        this.updateDataCore(data)
        this.fig.data(pie()(data))
        this.el.pie.data(pie()(data))
            .transition()
            .duration(500)
            .attr("d", (d, i)=>{
                d.startAngle = d.startAngle * this.radRange + this.radStart
                d.endAngle = d.endAngle * this.radRange + this.radStart
                return this.arcDatum(d,i)
            })
        this.el.collision = this.el.pie

        if(this.el.label){
            this.unsetLabel()
            this.setLabel()
        }
    }

    setLabel(fade=true){
        const getLabelId = (d,i)=> ( this.svg.id + "_" + this.id + "_label_" + i),
            rectWidth = (this.getLabelMax() + 2) * this.font.size / 2,
            rectHeight = this.font.size * 2,
            rightLimit = this.area.x - (this.safe.margin.left ) - rectWidth * 2

        const getLabelPosition = function(d,arc){
            return [
                rightLimit,
                arc.centroid(d)[1]
            ]
        }

        this.el.label = this.fig
            .append("g")
            .attr("id", getLabelId)
            .attr("style", "pointer-events: none")

        this.el.label.append("rect")
            .attr("id", getLabelId + "_rect")
            .attr("width", `${rectWidth}px`)
            .attr("height", `${rectHeight}px`)
            .attr("border-radius", "1em")
            .attr("x", d => getLabelPosition(d, this.arcDatum)[0] - rectWidth / 2)
            .attr("y", d => getLabelPosition(d, this.arcDatum)[1] - rectHeight / 1.5)
            .attr("rx", this.font.size / 3)
            .attr("fill", "rgba(0,0,0,0)")
            .attr("stroke", "rgba(0,0,0,0)")

        this.el.label.append("text")
            .attr("transform", (d) => `translate(${getLabelPosition(d, this.arcDatum)})`)
            .attr("text-anchor","middle")
            .attr("font-size",this.font.size)
            .attr("fill", "rgba(0,0,0,0)")
            .attr("stroke", "rgba(0,0,0,0)")
            .text( (d,i) => (this.getLabelArray()[i]) )

        if (fade)
            this.setFade()

        this.setTransition()

        return this
    }

    render(){

        const color = typeof(this.color.fill) === "function" ? this.color.fill : (d,i) => interpolateSpectral(i/this.data.length),
            stroke = this.color.stroke

        this.arcDatum = arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.area.radius)
            .padAngle(0.02)

        this.fig = this.svg.body.selectAll("g.arc")
            .data(pie()(this.data))
            .enter()
            .append("g")
            .attr("class","pie")
            .attr("transform", `translate(${this.area.radius + this.margin.left},${this.area.radius + this.margin.top})`)

        this.el.pie = this.fig.append("path")
            .attr("id", (d,i) => (this.svg.id + "_" + this.id + "_arc_" + i))
            .attr("class","pie-arc")
            .attr("d", (d, i)=>{
                d.startAngle = d.startAngle * this.radRange + this.radStart
                d.endAngle = d.endAngle * this.radRange + this.radStart
                return this.arcDatum(d,i)
            })
        this.el.collision = this.el.pie

        if(this.isAnimated){
            this.el.pie = this.el.pie
                .attr("fill", "rgba(0,0,0,0)")
                .attr("stroke", "rgba(0,0,0,0)")
            this.el.pie
                .transition()
                .delay(250)
                .duration(850)
                .on("start", function(d,i) {
                    active(this)
                        .attr("fill", color(d,i))
                        .attr("stroke", stroke)
                })

        } else {
            this.el.pie = this.el.pie
                .attr("fill", color)
                .attr("stroke", stroke)
        }

        return this
    }

}

export {Pie}