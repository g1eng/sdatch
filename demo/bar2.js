const data = [1, 2, 3, 4, 5], width = 411, height = 200
let fig = sdatch.createFigure("sample-fig", width, height)
fig.addLayer({
    id: "layer2", type: "bar",
    data: data, axe: {y: true}, label: true,
    area: {x: 250, y: 180},
    color: {
        textBackground: "#c0c0c0"
    }
})
fig.renderAll()