import {Layer} from "./layer.js";
import {transition, active} from "d3-transition"

/**
 * Visualization class for Bar charts.
 *
 * Bar is one of the most common chart type for generic use cases.
 * It supports styling, ticks control, automatic size adjustment (FSR) and
 * dynamic data changes via Bar.updateData.
 *
 * Stacked bar chart is not supported at now.
 *
 * The Bar constructor needs a FigConfig object with a column array and
 * corresponding single dimensional data for column values.
 *
 * ```
 * let b = new Bar({
 *   id: "korebar",
 *   column: ["Google", "Apple", "Microsoft", "Meta", "Amazon"],
 *   data: [214, 45, 134, 270, 157],
 *   margin: {
 *     left: 20,
 *     top: 100,
 *   },
 *   ticks: { x: {inner: true}, y:{ inner: true, values: [50, 100, 150, 200, 250] }},
 *   axe: {
 *     x: true,
 *     right: true,
 *   },
 *   color: {
 *     fill: function(d){
 *       return `rgb(${d*2},${d*0.5},${200-d})`
 *     },
 *     axe: "#111",
 *     axeText: "#002"
 *   },
 *   font: {size: 12},
 *   label: { rotate: true},
 *   fade: {
 *     area: {
 *       accentColor: "orange"
 *     }
 *   },
 *   safe: false,
 * });
 *
 * b.render().setLabel(true).setTransition();
 * ```
 *
 */
class Bar extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf) {
        super(conf);
        this.type = "bar"
        //reassign data to prevent column intrusion by setXYData
        this.data = conf.data
        this.autoScale()

    }
    autoScale(){
        this.autoScaleY()
    }

    /***
     * updateData updates preset data with given argument.
     * Argument data must be an array and the same shape with the preset data.
     * @param data
     */
    updateData(data){
        const scaleY = this.scale.y,
            areaY = this.area.y
        this.updateDataCore(data)

        this.fig.data(data)
        this.el.bar.data(data)
            .transition()
            .duration(500)
            .attr("fill", this.color.fill)
            .attr("y",d => (scaleY(d) + this.margin.top ) )
            .attr("height", d => ( areaY - scaleY(d)) )
        if(this.label){
            this.unsetLabel()
            this.setLabel(true)
        }
    }

    render(){
        this.renderAxe(true)
        const scaleX = this.scale.x,
            scaleY = this.scale.y,
            areaY = this.area.y,
            marginTop = this.margin.top,
            color = this.color.fill

        //this.fig is core figure which holds data and parent g element
        this.fig = this.svg.body.selectAll("svg")
            .append("g")
            .data(this.data)
            .enter()

        //this.bar is result bar for the visualization
        this.el.bar = this.fig.append("rect")
            .attr("id", (d,i)=> (this.svg.id + "_" + this.id + "_rect_" + i))
            .attr("x",(d,i)=> (i * scaleX.bandwidth()) + this.margin.left + this.safe.margin.left )
            .attr("width",() => scaleX.bandwidth() )
            .attr("y", marginTop + areaY )
        if(this.isAnimated){
            this.el.bar = this.el.bar
                .attr("height", 0 )
                .attr("stroke", this.color.stroke)
                .attr("fill", "rgba(0,0,0,0)")
            this.el.bar
                .transition()
                .delay(250)
                .duration(850)
                .on("start", function(){
                    active(this)
                        .attr("fill", color)
                        .attr("y",d => (scaleY(d) + marginTop ) )
                        .attr("height", d => ( areaY - scaleY(d)) )
                })
        } else {
            this.el.bar = this.el.bar
                .attr("fill", color)
                .attr("y",d => (scaleY(d) + marginTop ) )
                .attr("height", d => ( areaY - scaleY(d)) )
        }

        this.el.collision = this.el.bar

        this.fig.selectAll("svg")
            .append("g")
            .data(this.data)
            .enter()

        return this
    }
}

export {Bar}