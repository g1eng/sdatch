import {Layer} from "./layer.js";

class Plot extends Layer {
    /***
     * @param {FigConfig} conf
     */
    constructor(conf) {
        super(conf);
        this.type = "plot"
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
        this.el.plot.data(this.getNormalizedXYData())
            .transition()
            .duration(250)
            .attr("cx", scale.x )
            .attr("cy", scale.y )
        this.el.collision.data(data)
            .transition()
            .attr("cx", scale.x )
            .attr("cy", scale.y )
        this.setTransition()

        if(this.el.label){
            this.unsetLabel()
            this.setLabel(true)
        }
    }

    render(){
        this.renderAxe(true)
        this.renderPlot()
        this.setCollision()
        return this
    }
}

export {Plot}
