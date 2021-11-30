const data = [4, 5, 5, 4, 5], width = 300, height = 200
let myAzukiBar = new sdatch.Bar({
    id: "layer1",
    data: data,
    // area: { x: 200, y: 180},
    axe: {y: true},
    svg: {
        target: "sample-fig",
        width: width,
        height: height,
    },
    label: true,
    color: {fill: "#d66"}
}).render()


