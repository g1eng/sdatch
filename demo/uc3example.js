
let fig2 = sdatch.createFigure("target-elem-id", 300,250)
fig2.addLayer({
    id: "layer-1",
    type: "area",
    column: ["a","b","c","d","e","f","g"],
    data: [11525, 27382, 33121, 18151, 12523, 23431, 19989],
    axe: {
        x: true,
        y: true,
    },
    animation: false,
    smooth: true,
    color: {
        stroke: "#f07030",
        fill: "#f07030",
        axe: "white",
        axeText: "white",
        textBackground: "#b8b8b8",
    },

}).renderAll()