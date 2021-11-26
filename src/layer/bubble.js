import {Layer} from "./layer.js";
import {active, transition} from "d3-transition";

class Bubble extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf) {
        super(conf);
        this.type = "bubble"
        if (conf.margin && typeof conf.margin.radius === "number")
            this.margin.z = conf.margin.radius
        if (conf.area && typeof conf.area.radius === "number")
            this.area.z = conf.area.radius
        this.autoScale()
    }

    autoScale(){
        this.autoScaleXYZ()
    }

    /***
     * updateData updates preset data with given argument.
     * Argument data must be an array and the same shape with the preset data.
     * @param data
     */
    updateData(data){
        let scale = this.getScaleForData()
        this.updateDataCore(data)

        this.fig.data(data)
        this.el.bubble.data(this.getNormalizedXYData())
            .transition()
            .duration(250)
            .attr("cx", scale.x )
            .attr("cy", scale.y )
            .attr("r", scale.z)
        this.el.collision.data(data)
            .transition()
            .attr("cx", scale.x )
            .attr("cy", scale.y )
            .attr("r", scale.z)

        if(this.el.label){
            this.unsetLabel()
            this.setLabel(true)
        }
    }

    render(){
        this.renderAxe(true)
        let scale = this.getScaleForData()

        this.fig = this.fig.selectAll("svg")
            .append("g")
            .data(this.getNormalizedXYData())
            .enter()
        this.el.bubble = this.fig.append("circle")
            .attr("id", (d,i)=> (this.svg.id + "_" + this.id + "_plot_" + i))
            .attr("class", "bubble")
            .attr("cx", scale.x )
            .attr("cy", scale.y )
            .attr("stroke", this.color.fill)
            .attr("stroke-width","1px")
            .attr("fill", this.color.fill)

        if(this.isAnimated){
            this.el.bubble = this.el.bubble
                .attr("r", 0)

            this.el.bubble.transition()
                .delay(250)
                .duration(850)
                .on("start", function(){
                    active(this)
                        .attr("r", scale.z)
                })
        } else {
            this.el.bubble = this.el.bubble
                .attr("r", scale.z)
        }


        this.el.collision = this.fig.append("circle")
            .attr("id", (d,i)=> (this.svg.id + "_" + this.id + "_collision_" + i))
            .attr("class", "bubble-boundary")
            .attr("cx", scale.x )
            .attr("cy", scale.y )
            .attr("r", scale.z)
            .attr("stroke", "rgba(0,0,0,0)")
            .attr("stroke-width","1px")
            .attr("fill", "rgba(0,0,0,0)")

        this.fig.selectAll("svg")
            .append("g")
            .data(this.data)
            .enter()

        return this
    }
}

export {Bubble}