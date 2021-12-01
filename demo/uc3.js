//data initialization

let column = [],
    data = [] ,
    data2 = [],
    curveData = [[1,50],[30,85],[60,120],[80,30],[120,55],[160, 115],[220,81]],
    pieColumn = ["yes", "no", "nop", "never", "WYL"],
    pieData = [5203, 3350, 180, 1281, 15],
    pieData2 = [2553, 3500, 1521, 281, 357]

for (let i=1;i<=100;i++){
    column.push(i)
    data.push(Math.floor(i / 2 + Math.random() * i))
    data2.push(1)
}
for (let i=101;i<=240;i++){
    column.push(i)
    data.push(Math.floor(i / 2 + Math.random() * i - i * i / 500))
    data2.push(
        (i < 120)? -1 : (i<150) ? 3 : (i<200) ? 2 : 0
    )
}

// coloring function for arcs
const arcColorFunc = (d,i)=>{
    const uRad = Math.PI / 5
    console.log(i)
    let r = 128 + 128 * Math.sin(i * uRad),
        g = 96 + 96 * Math.cos(i * uRad),
        b = 25 * i
    let color = `rgb(${r},${g},${b})`
    console.log(color)
    return color
}

// declare a set of FigConfig objects
// 1. curved area
// 2. colored bar
// 3. line shape
// 4. pie
// 5. pie
// 6. arcs
// 7. nested arcs

let curveConf = {
        id: "pre-curve",
        type: "area",
        area: {
            x: window.innerWidth * 0.9,
            y: 300,
        },
        margin: {
            top: 100,
        },
        color: {
            fill: "#2070a0"
        },
        data: curveData,
        smooth: true,
        plot: false,
    },
    barConf1 = {
        id: "base-bar",
        type: "bar",
        area: {
            x: window.innerWidth * 0.9,
            y: 300,
        },
        column: column,
        data: data,
        color: {
            fill: function(d){
                return `rgb(${d},${200-d},${d*0.8})`
            },
            axe: "#111",
            axeText: "#002",
            stroke: "#00000000"
        },
    },
    lineConf = {
        id: "next-line",
        type: "line",
        area: {
            x: window.innerWidth * 0.9,
            y: 200,
        },
        margin: {
            top: 100
        },
        color: {
            axe: "#111",
            axeText: "#002",
            stroke: "#e0a050"
        },
        column: column,
        data: data2,
        plot: false,
    },
    pieConf1 = {
        id: "future-pie",
        type: "pie",
        area: {
            x: 100,
            y: 100
        },
        margin: {
            left: 100
        },
        column: pieColumn,
        data: pieData
    },
    pieConf2 = {
        id: "future-pie2",
        type: "pie",
        area: {
            x: 100,
            y: 100
        },
        margin: {
            left: 250
        },
        column: pieColumn,
        data: pieData2
    },
    arcConf1 = {
        id: "nested-pie1",
        type: "pie",
        area: {
            x: 100,
            y: 100
        },
        innerRadius: 40,
        radius: 70,
        radStart: -Math.PI / 2,
        radEnd: Math.PI / 2,
        margin: {
            top: 30,
            left: 430
        },
        color: {
            fill: arcColorFunc
        },
        column: pieColumn,
        data: pieData
    },
    arcConf2 = {
        id: "nested-pie2",
        type: "pie",
        area: {
            x: 100,
            y: 100
        },
        innerRadius: 80,
        radius: 100,
        radStart: -Math.PI / 2,
        radEnd: Math.PI / 2,
        margin: {
            left: 400
        },
        color: {
            fill: arcColorFunc
        },
        column: pieColumn,
        data: pieData2
    }

// create sdatch instance

let fig = sdatch.createFigure("para", "100%",300)

// add all layer which is declared in previous section

fig.addLayer([
    curveConf,
    barConf1,
    lineConf,
    pieConf1,
    pieConf2,
    arcConf1,
    arcConf2
]).renderAll()

//and render. That's all