import {Layer} from "./layer.js";
import {area, curveMonotoneX} from "d3-shape";
import {active, transition} from "d3-transition";

/**
 * Visualization class for Area charts.
 *
 * Area class is a variant of Line, which means `filled line` chart.
 * It supports styling, ticks control, automatic position adjustment (FSR) and
 * dynamic data changes via Plot.updateData.
 *
 * Stacked area is not supported at now.
 *
 * Dataset (column + data) can be specified in two ways for Plot chart.
 *
 * (1) specify column and data in single dimensional array
 *
 * (2) specify data in two dimensional array
 *
 */
class Area extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf) {
        super(conf);
        this.type = "area"
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

        // this.fig.data(data)
        this.el.area.datum(this.getNormalizedXYData())
            .transition()
            .duration(250)
            .attr("d", this.getAreaGenerator())

        if(this.el.collision)
            this.el.collision.data(this.getNormalizedXYData())
                .transition()
                .attr("cx",scale.x)
                .attr("cy",scale.y)

        if(this.el.label){
            this.unsetLabel()
            this.setLabel(true)
        }
    }

    getAreaGenerator(){
        const scale = this.getScaleForData()
        let generator
        if(this.smooth)
            generator = area().curve(curveMonotoneX)
        else
            generator = area()
        return generator.x( (d) => (scale.x(d)) )
            .y0( () => this.area.y )
            .y1( (d) => (scale.y(d) + this.margin.top) )
    }

    render(){
        const color = this.color.fill,
            strokeColor = this.color.stroke
        this.renderAxe(true)

        this.el.area = this.fig.append("path")
            .datum(this.getNormalizedXYData())
            .attr("id", this.svg.id + "_" + this.id + "_area")
            .attr("class", "area")
            .attr("d", this.getAreaGenerator())
            .attr("stroke-width","1px")
        if(this.isAnimated){
            this.el.area = this.el.area
                .attr("stroke", "rgba(0,0,0,0)")
                .attr("fill", "rgba(0,0,0,0)")

            this.el.area.transition()
                .delay(250)
                .duration(850)
                .on("start",function(){
                    active(this)
                        .attr("stroke", strokeColor)
                        .attr("fill", color)
                })
        } else {
            this.el.area = this.el.area
                .attr("stroke", strokeColor)
                .attr("fill", color)
        }

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

export {Area}