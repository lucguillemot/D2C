function forceGraph(id, graph, w, h, margin) {
    /*var width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;*/
    var r = 9;

    var svg = d3.select(id).append("svg")
                .attr("class", "force")
                .attr("width", w)
                .attr("height", h);

    var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d){ return (d.value*140); }))
            .force("center", d3.forceCenter(w / 2, h / 2)) // does not modify relative positions
            .force("collide", d3.forceCollide(10)); 

    var link = svg.append("g")
            .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
            .enter()
          .append("line");

    var nodes = svg.selectAll(".node")
          .data(graph.nodes)
        .enter().append("g")
          .attr("class", "node")
               .call(d3.drag()
                     .on("start", dragstarted)
                     .on("drag", dragged));

    var node = nodes.append("circle")
          .attr("class", function(d) { return "force-circle "+d.id; })
          .attr("r", r);

    var label = nodes.append("text")
          .attr("class", "force-labels")
          .text(function(d) { return d.id; });   

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
          .attr("x1", function(d) { return d.source.x = Math.max(r, Math.min(w - r, d.source.x)); })
          .attr("y1", function(d) { return d.source.y = Math.max(r, Math.min(h - r, d.source.y)); })
          .attr("x2", function(d) { return d.target.x = Math.max(r, Math.min(w - r, d.target.x)); })
          .attr("y2", function(d) { return d.target.y = Math.max(r, Math.min(h - r, d.target.y)); });

        node
          .attr("cx", function(d) { return d.x = Math.max(r, Math.min(w - r, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(r, Math.min(h - r, d.y)); });

        label.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });

        updateMapColor(); // Update color on the map
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3);
      //d.fx = null;
      //d.fy = null;
      d.fx = d.x;
      d.fy = d.y;
    }    
}