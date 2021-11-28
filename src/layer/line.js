import {Layer} from "./layer.js";
import {curveMonotoneX, line} from "d3-shape";
import {active, transition} from "d3-transition";

/**
 * Visualization class for Line charts.
 *
 * Line is one of the most common chart type for generic use cases.
 * It supports styling, ticks control, automatic size adjustment (FSR) and
 * dynamic data changes via Line.updateData.
 *
 * Dataset (column + data) can be specified in two ways for Line chart.
 *
 * (1) specify column and data in single dimensional array
 *
 * (2) specify data in two dimensional array
 *
 * This class is implemented as a variant of Plot.
 */
class Line extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf) {
        super(conf);
        this.type = "line"
        this.smooth = conf.smooth === true
        this.autoScale()
    }

    autoScale(){
        if (this.hasNestedData() || this.hasNumberColumn())
            this.autoScaleXYZ()
        else
            this.autoScaleY()
    }

    /***
     * updateData updates preset data with given argument.
     * Argument data must be an array and the same shape with the preset data.
     * @param data
     */
    updateData(data){
        const scale = this.getScaleForData()
        this.updateDataCore(data)

        this.fig.datum(this.getNormalizedXYData())
        this.el.line.datum(this.getNormalizedXYData())
            .transition()
            .duration(250)
            .attr("d", this.getLineGenerator())

        if(this.el.collision)
            this.el.collision.data(this.getNormalizedXYData())
                .transition()
                .attr("cx",scale.x)
                .attr("cy",scale.y)

        // this.setCollision()

        if(this.el.label){
            this.unsetLabel()
            this.setLabel(true)
        }
        if(this.plot !== false){
            this.el.plot.remove()
            delete(this.el.plot)
            this.renderPlot()
        }
    }

    getLineGenerator(){
        const scale = this.getScaleForData()
        let l
        if(this.smooth)
            l = line()
                .curve(curveMonotoneX)
                .x( (d) => (scale.x(d)) )
                .y( (d) => (scale.y(d) + this.margin.top) )
        else
            l = line()
                .x( (d) => (scale.x(d)) )
                .y( (d) => (scale.y(d) + this.margin.top) )
        return l
    }

    render(){
        const color = this.color.stroke
        this.renderAxe(true)

        this.el.line = this.fig.append("path")
            .datum(this.getNormalizedXYData())
            .attr("id", this.svg.id + "_" + this.id + "_line")
            .attr("class", "line")
            .attr("d", this.getLineGenerator())
            .attr("stroke-width","1px")
            .attr("fill", "rgba(0,0,0,0)")
        if(this.isAnimated){
            this.el.line = this.el.line
                .attr("stroke", "rgba(0,0,0,0)")
            this.el.line.transition()
                .delay(250)
                .duration(850)
                .on("start", function(){
                    active(this)
                        .attr("stroke", color)
                })
        } else {
            this.el.line = this.el.line
                .attr("stroke", color)
        }

        if(this.plot!==false)
            this.renderPlot()

        this.fig = this.fig.selectAll("svg")
            .append("g")
            .data(this.getNormalizedXYData())
            .enter()

        if (this.scale.x.bandwidth)
            this.setCollisionBar()
        else
            this.setCollision()

        return this
    }
}

export {Line}