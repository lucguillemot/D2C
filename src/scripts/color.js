function labSpace(id, width, height) {
    var labAScale = d3.scaleLinear()
            .domain([width, 0])
            .range([-100, 100]);
    var labBScale = d3.scaleLinear()
            .domain([height, 0])
            .range([-100, 100]);
    var labLScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, height])
            .clamp(true);

    var canvas =  d3.select(id)
        .append("canvas")
        .attr("width", width)
        .attr("height", height)
        .style("width", width + "px")
        .style("height", height + "px")
        .node(),

    context = canvas.getContext("2d"),
    image = context.createImageData(width, height);

    var y = -1,
        i = -1;

    while (++y < height) {
        for (var x = 0, c; x < width; ++x) {
            var a = Math.round(labAScale(x)),
                b = Math.round(labBScale(y));
            c = d3.lab(L, a, b).rgb();
            image.data[++i] = c.r;
            image.data[++i] = c.g;
            image.data[++i] = c.b;
            image.data[++i] = 255;
        }
    }

    context.putImageData(image, 0, 0);
}

function labColor(La, Lb, MinMaxA, MinMaxB) {

    var labAScale = d3.scaleLinear()
        .domain(MinMaxA) // PC1 min and max
        .range([100, -100]);
    
    var labBScale = d3.scaleLinear()
        .domain(MinMaxB) // PC2 min and max
        .range([100, -100]);
   
    /*var labLScale = d3.scaleLinear()
        .domain([-8, 4])
        .range([0, height])
        .clamp(true);*/

    var a = labAScale(La),
        b = labBScale(Lb);

    //console.log(d3.lab(L, a, b));
    return d3.lab(L, a, b);
}