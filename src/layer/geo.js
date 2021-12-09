import {Layer, LayerError} from "./layer.js"
import {geoPath, geoMercator} from "d3-geo"
import {transition} from "d3-transition";
import {select} from "d3-selection";
import * as topojson from "topojson-client"
import {fetch as fetchPolyfill} from "whatwg-fetch"

if (typeof window.fetch !== "function")
    window.fetch = fetchPolyfill

/**
 * Visualization class for geological shapes. (unstable)
 *
 * The constructor for the class Geo needs topojson or geojson file(s)
 * for spatial visualization and it can be simply used to implement Chrolopleth.
 *
 * ```
 * new Geo({
 *   id: "sample",
 *   src: [
 *     "/path1/to/file.topojson",
 *     "/path2/to/file.topojson",
 *     "/path3/to/file.topojson",
 *   ],
 *   data: [100,121,95],
 *   location: [140.5,35.48],
 *   zoom: 8,
 * })
 * ```
 *
 * The source file path for topojson/geojson can be specified with URI format and
 * any shape files are fetched over network in such case.
 */

class Geo extends Layer {
    constructor(conf) {
        super(conf);
        this.type = "geo"
        //Geo does not use setLabel
        this.label = false
        this.el.geo = {}
        this.geoLabel = {
            prefix: "",
            properties: [],
            map: new Map()
        }
        if(conf.label && conf.label.properties){
            this.geoLabel.properties = conf.label.properties
        }
        if(conf.label && conf.label.prefix)
            this.geoLabel.prefix = conf.label.prefix
        if(conf.zoom)
            this.zoom = conf.zoom
        else
            this.zoom = 1
        if(conf.location)
            this.location = conf.location
        else
            this.location = [140.78,35.48]

        if(conf.src){
            if (typeof conf.src === "string")
                this.src = [conf.src]
            else if (typeof conf.src === "object" && conf.src.length)
                this.src = conf.src
            else if (typeof conf.src === "object")
                this.src = [conf.src]
            else
                throw new LayerError("conf.src must be a string or an array")
        } else {
            throw new LayerError("conf.src must be specified for Geo constructor")
        }

    }
    autoScale(){
    }

    getSeqWithId(featureId){
        if (this.column.indexOf(parseInt(featureId)) !== -1)
            return this.column.indexOf(parseInt(featureId))
        else
            return this.column.indexOf(featureId)
    }

    getDatumWithId(featureId) {
        console.log("data=",this.data)
        console.log("column=",this.column)
        const seq = this.getSeqWithId(featureId)
        if(seq !== -1)
            return this.data[seq]
        else
            return 0
    }

    updateData(data){
        console.log("geo updated")
        console.log("get", this.el.geo)
        this.updateDataCore(data)

        this.column.forEach((e)=>{
            if(this.el.geo[e] !== undefined){
                const dummyFeatures = {
                    properties:{
                        id: e,
                        datum: this.getDatumWithId(e)
                    }
                }
                if(typeof this.src[0] === "object")
                    Object.assign(
                        this.src[this.getSeqWithId(e)].features[0].properties,
                        dummyFeatures.properties
                    )
                // console.log(e, "datum", dummyFeatures.properties.datum)
                // console.log("color", this.color.fill(dummyFeatures))

                if (typeof this.color.fill === "function")
                    select("#" + this.getElemId(e))
                        .transition()
                        .duration(250)
                        .attr("fill", this.color.fill(dummyFeatures))
                else
                    select("#" + this.getElemId(e))
                        .transition()
                        .duration(250)
                        .attr("fill", this.color.fill)

                select("#" + this.getElemId(e) + "_label")
                    .transition()
                    .text(this.getLabel(e, dummyFeatures))
            }
        })
    }

    getElemId(featureId){
        return this.svg.id + "_" + this.id + "_geo_" + featureId
    }

    setLabelProperties(fid,f){
        const properties = f.properties
        let p = []
        this.geoLabel.properties.forEach((l)=>{
            if (properties[l]){
                p.push(properties[l])
            }
        })
        console.log("label proto", p)
        this.geoLabel.map.set(fid, p)
    }

    getLabel(fid,f){
        const d = f.properties.datum
        let label = ""
        if(this.geoLabel.prefix)
            label = this.geoLabel.prefix
        //parsing any specified properties
        if (this.geoLabel.map.has(fid))
            label += this.geoLabel.map.get(fid).join(" ") + " "
        else if (this.geoLabel.map.has(String(fid)))
            label += this.geoLabel.map.get(String(fid)).join(" ") + " "
        label += d
        return label
    }


    renderCore(s,e){
        let path = geoPath()
            .projection(
                geoMercator()
                    .scale(1000 * this.zoom)
                    .translate([200,150])
                    .center(this.location)
            )
        const featureId = e.id.replaceAll(/(^.+:|A.+$)/g,"")
        if(s.match(/\.topojson$/) !== null){
            e = topojson.feature(e, "city")
        }

        const geoId = this.getElemId(featureId)
        e.features[0].properties.datum = this.getDatumWithId(featureId)

        let chart = this.fig.selectAll()
            .data(e.features)
            .enter()
            .append("path")
            .attr("id", geoId)
            .attr("d", path)
            .attr("class","sdc-geo")
            .attr("stroke","rgba(0,0,0,0)")

        if (this.isAnimated){
            chart = chart
                .attr("fill","rgba(0,0,0,0)")

            chart.transition()
                .on("start",()=>{
                    select("#" + geoId)
                        .transition()
                        .duration(250)
                        .attr("fill", this.color.fill)
                })
        } else {
            chart = chart
                .attr("fill", this.color.fill)
        }

        let label = chart.append("title")
            .attr("id", this.getElemId(featureId) + "_label")
            .text(f=>{
                this.setLabelProperties(featureId, f)
                return this.getLabel(featureId, f)
            })

        this.el.geo[featureId] = {
            chart,
            label
        }
    }

    render(){

        this.fig = this.svg.body

        this.src.forEach( t => {
            if(typeof t === "string"){ //URI
                fetch(t).then( r => r.json().then( e => {
                    this.renderCore(t,e)
                }).catch(e=>{
                    console.log("error", e)
                })).catch((e)=>{
                    console.log("failed", e)
                })
            } else if (typeof t === "object") {
                this.renderCore("", t)
            }
        })

        return this
    }
}

export {Geo}