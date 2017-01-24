function map(tracts, clusters, id, width, height) {

	var svg = d3.select(id).append("svg").attr("width", width).attr("height", height);
	var map = svg.append("g").attr("class", "map");

	var projection = d3.geoMercator()
		.center([-122.3871, 37.7729])
        .scale(60000)
        .translate([width/2, height/2]);

	clusters.forEach(d => {
		clusterById[d.Geo_FIPS] = +d.cluster;
		pca1ById[d.Geo_FIPS] = +d.PC1;
		pca2ById[d.Geo_FIPS] = +d.PC2;
	});

	

	map.selectAll("path")
		.data(topojson.feature(tracts, tracts.objects.tracts).features)
		.enter().append("path")
			.attr("class", "tract")
			.attr("cluster", function(d){
				return "cl"+clusterById[+d.properties.GEOID];
			})
			.attr("Geo_FIPS", function(d) {
				return +d.properties.GEOID;
			})
			.style("pointer-events", "all")
			/*.style("fill", function(d){ 
				if (pca1ById[+d.properties.GEOID] != null) {
					if (color == "null") { return "#ddd"; }
					else { return setLabColor(pca1ById[+d.properties.GEOID], pca2ById[+d.properties.GEOID], [-8, 8], [-8, 4]); }
				}
			})*/
			.style("fill", "#efefef")
			.attr("d", d3.geoPath().projection(projection))
		  .on("mouseover", function(d) {
		  	console.log("[Geo_FIPS-circle=cl"+d.properties.GEOID+"]");
		  	d3.select("[Geo_FIPS-circle=cl"+(+d.properties.GEOID)+"]").style("stroke-width", 10).style("stroke", "#f00");
		  });
	
	// Overlay rect for pan & zoom function
	svg.append("rect")
	    .attr("width", width)
	    .attr("height", height)
	    .style("fill", "none")
	    .style("pointer-events", "all")
	    .call(d3.zoom()
	        .scaleExtent([1 / 2, 4])
	        .on("zoom", zoomed));


	function zoomed() {
	  map.attr("transform", d3.event.transform);
	}
}


function updateMapColor() {
    // Get node position + update colors on the map.
    d3.selectAll(".force-circle").each(function(d, i) {
        d3.selectAll(".tract[cluster=cl"+(i+1)+"]").style("fill", function(i) {
            return labColor(d.x, d.y, [0, 360], [0, 360]);
        });
        d3.selectAll(".map-key-rect[cluster=cl"+(i+1)+"]").style("fill", function(i) {
            return labColor(d.x, d.y, [0, 360], [0, 360]);
        });
    })
} // getNodeColorValue()