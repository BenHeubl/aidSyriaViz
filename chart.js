var margin = {top: 10, right: 20, bottom: 35, left: 45},
    width = 575 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var numberFormat = d3.format(",.0f"),
	numberFormatDetailed = d3.format(",.5f");
	numberFormatMoreDetailed = d3.format(",.2f");


// scales

var radiusScale = d3.scale.linear().range([5, 30])
var xlogscale = d3.scale.log().range([35, width]).domain([0.1, 351])
var x = d3.scale.linear().range([35, width]);
var y = d3.scale.linear().range([height, 0]);
var y2 = d3.scale.linear().range([height, 0]);
var yRemoveUSA = d3.scale.linear().range([height, 0]);

// slope graph
var scaleXslope = d3.scale.linear().range([height, 0]);



// state elements
var indexY = false;
var indexX = false;
var indexSlope = false;

//
// var xlogscale = d3.scale.log()
//   	.range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(xlogscale)
          .tickSize(-height)
          .tickFormat(d3.format("1"))
          .tickValues([1,5, 10, 100, 350])
          .orient("bottom")

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickValues([20, 40, 60, 80, 100, 120, 350])
        .tickSize(-width)

      var yAxis2 = d3.svg.axis()
        .scale(y2)
        .orient("right")
        .tickValues([1,5, 10, 100, 350])
        .tickSize(-100)


      // ####### basic setup


      var svgheader = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", 50)

      var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .classed("chartcontainer", true)
                .attr("transform", "translate(" + margin.left+ "," +margin.top+ ")")


      var svgFooter = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", 30)

      var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

                var coordinates;
                var mouseX;
                var mouseY;
                var thisID;
      // ####### basic setup end


// ##### Axes

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height+2) + ")")
    .attr("visibility", "visible")
		.call(xAxis)
			.append("text")
			.attr("dy", "2.3em")
			.attr("x", (width/2))
			.style("text-anchor","middle")
			.style("font-style", "italic")
			.attr("class", "xlabel")
			.text("Syrian refugees per 100,000 population, end-2014");

  svg.append("text")
		.attr("class", "leftlabel")
		.text("Total aid to Syria, 2015, $m") //insert title here
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "middle")
		.style("font-style", "italic")
		.attr("x", -220)
		.attr("y", -35);



	svg.append("g")
		.attr("class", "y axis")
    .attr("visibility", "visible")
		.call(yAxis);

  svg.append("g")
  		.attr("class", "y axis")
      .attr("transform", "translate(500,0)")
      // .attr("opacity", 0)
      .attr("visibility", "visible")
  		.call(yAxis2);
// Axis end




//not sure what this is
  var legend = svg.append("g")
    .attr("transform", "translate(" + (width - 100) + "," + (height - 400) + ")")
    .selectAll("g")
    .data([0.001000, 0.01000, 0.100000])
    .enter()
    .append("g")
    .attr("opacity", 1)
    .classed("legend1", true)

//legend information for circle size
  legend.append("circle")
    .attr("cy", function(d) { return -1*(Math.pow((d*10000), 1/2)); })
  	.attr("r", function(d) { return (Math.pow((d*10000), 1/2)); })
    .attr("fill", "#fff")
    .attr("opacity", 0.6)
    .attr("stroke-width", 1)
    .attr("stroke", "#000");

  legend.append("line")
    .attr("y1", function(d) { return -1*(Math.pow((d*10000), 1/2)); })
    .attr("x1", 0)
    .attr("y2", function(d) { return -1*(Math.pow((d*10000), 1/2)); })
    .attr("x2", 42)
    .attr("stroke", "black")
      // .attr("y", function(d) { return 10 +(-14 + -2*(Math.pow((d*10000), 1/2))); })
      // .attr("x", 50)
      // .attr("dy", "1.1em")
      // .style("font-size", "11px")
      // .style("font-family", "Officina, Calibri, Arial")
      // .style("text-anchor", "middle")
      // .text(d3.format(",.1"));

  legend.append("text")
    .attr("y", function(d) { if (d == 0.001000) {
      return ((-1*(Math.pow((d*10000), 1/2))) - 5);
    }
      return (-1*(Math.pow((d*10000), 1/2))) - 10; })
    .attr("x", 57)
    .attr("dy", "1.1em")
    .style("font-size", "13px")
    .style("font-family", "Officina, Calibri, Arial")
    .style("text-anchor", "middle")
    .text(d3.format(",.1"));

  legend.append("text")
    .attr("dy", "-85px")
    .style("text-anchor", "middle")
  	.style("font-size", "13px")
  	.style("font-family", "Officina, Calibri, Arial")
    .text("Aid to Syria, 2015, as a % of GDP"); // insert text here










// ######## data loading
d3.csv("aidData.csv", function (error, data) {

data.forEach(function (d) {
  d.xvalue = +d.xvalue;
  d.yvalue = +d.yvalue;
  d.radiusvalue = +d.radiusvalue;
})


// Domains
radiusScale.domain(d3.extent(data, function (d) { return d.radiusvalue}))
x.domain(d3.extent(data, function (d) { return d.xvalue}))
y.domain([0, d3.max(data, function (d) { return d.yvalue})])
y2.domain(d3.extent(data, function (d) { return d.xvalue}))
yRemoveUSA.domain([d3.min(data, function (d) { return d.yvalue}), 130])
// xlogscale.domain([1, d3.max(data, function (d) { return d.xvalue})]);

// scales slopegraph:
scaleXslope.domain(d3.extent(data, function (d) { return d.xvalue}))




// creating the group for all the different countries
var groups = svg.selectAll(".country")
            .data(data)
            .enter()
            .append("svg:g")
            .attr("class", "country")
            .attr("id", function(d) { return "g_" + d.country; });


// lines between the slop dots
groups
            .append("line")
            .classed("SlopegraphLines", true)
            .attr("x1", 100)
            .attr("y1", function (d, i) {
              return scaleXslope(d.xvalue)
            })
            .attr("x2", 400)
            .attr("y2", function (d, i) {
              return y(d.yvalue);
            })
             .style("stroke", function (d, i) {
               if (y(d.yvalue) > scaleXslope(d.xvalue)) {
                 return "red";
               } else { return "#92c5de"}
             })
             .style("stroke-width", 1)
             .style("stroke-opacity", 0.7)
             .attr("opacity", 0.7)
             .attr("opacity", 0)

groups
            .append("circle")
            .classed("dots", true) // change classification
             .attr("cx", function (d, i) {
               if (d.xvalue <= 0.4) {
                 return 35;
               } else if (d.xvalue > 0.4 && d.xvalue < 1.5) {
                 return 169;
               } else { return xlogscale(d.xvalue);}

             })
             .attr("cy", function (d, i) {
               return y(d.yvalue);
             })
             .attr("r", function (d, i) {
              //  return 5;  // add function to represent area instead of radius
              //  return radiusScale(d.radiusvalue);
               return (Math.pow((d.radiusvalue*10000), 1/2));
             })
             .style("fill", "red")
             .style("fill-opacity", 0.6)
             .style("stroke", "red")
             .style("stroke-width", 1)
            //  .attr("opacity", 0.7)


// x Dots for slope graph
     groups
             .append("circle")
             .classed("SlopegraphX", true) // change classification
              .attr("cx", function (d, i) {
                if (d.xvalue <= 0.4) {
                  return 35;
                } else if (d.xvalue > 0.4 && d.xvalue < 1.5) {
                  return 169;
                } else { return xlogscale(d.xvalue);}

              })
              .attr("cy", function (d, i) {
                return y(d.yvalue);
              })
              .attr("r", function (d, i) {
                return 5;
               //  return 5;  // add function to represent area instead of radius
               //  return radiusScale(d.radiusvalue);
                // return (Math.pow((d.radiusvalue*10000), 1/2));
              })
              .style("fill", "red")
              .style("fill-opacity", 1)
              .style("stroke", "red")
              .style("stroke-width", 2)
              // .attr("opacity", 1)
              .attr("visibility", "hidden")














             updateY(y);


             	d3.selectAll(".country")
             		.on("mouseenter", function(d) {
             			thisID = this.id;
             			// d3.select(this)
             			// 	.style("stroke","#000");

             			coordinates = d3.mouse(this);
             			mouseX = coordinates[0];
             			mouseY = coordinates[1];

             			tooltip
             				.html(
             				"<h2>" + d.country + "</h2>" +
             				"<p>Total aid to Syria, 2015: <strong>" + numberFormat(d.yvalue) + " $m</strong></p>" +
             				"<p>Syrian refugees per 100,000 population: <strong>" + numberFormat(d.xvalue) + "</strong></p>" +
                    "<p>Aid to Syria, as a % of GDP: <strong>" + numberFormatDetailed(d.radiusvalue) + "</strong></p>"
             				)
             				.style("left", (d3.event.pageX - 25) + "px")
             				.style("top", (d3.event.pageY - 95) + "px")
             				.transition()
             				.duration(1000)
             				.style("display", "block")
             				.style("opacity", 0.95);

             			if (mouseX > (0.6*width)) {
             				tooltip
             					.style("left", (d3.event.pageX - 250) + "px")
             			}

             			if (mouseY < 40) {
             				tooltip
             					.style("top", (d3.event.pageY + 10) + "px")
             			}


             		// 	if (thisID == "SaoTomeandPrincipe") {
             		// 		d3.select(".tooltip h2")
             		// 			.text("SÃ£o TomÃ© and PrÃ­ncipe");
             		// 	}

             		})
             		.on("mouseleave", function(d) {
             			tooltip
             				.transition()
             				.duration(1000)
             				.style("opacity", 0)
             				.style("display", "none");
             		});


var buttonsY = svgheader.append("g")
                .classed("buttsYscale", true)
                .attr("transform", "translate(10,10)")
                .style("cursor", "pointer")
                .on("click", function () {
                  if (!indexY) {
                    updateY(yRemoveUSA);

                    d3.select(".rectY").attr("fill", "red")
                    d3.select(".textY").text("Click to add US").attr("fill", "white")
                    indexY = true
                  } else {
                    d3.select(".rectY").attr("fill", "white")
                    d3.select(".textY").text("Click to remove US").attr("fill", "red")
                    updateY(y);
                    indexY = false }
                })


    buttonsY
                .append("rect")
                .classed("rectY", true)
                .attr("height", 20)
                .attr("width", 130)
                .attr("fill", "white")
                // .attr("fill", "red")
                .attr("stroke", "red")
                .attr("rx", 1)
                .attr("ry", 1)
    buttonsY
                .append("text")
                .classed("textY", true)
                .text("Click to remove US")
                .attr("x", 5)
                .attr("y", 15)
                .attr("fill", "red")
                .style("font-size", "14px")
                .attr("font-family","Officina_bold")
                // .style("font-family", "Officina, Calibri, Arial")
                .style("pointer-events", "none")


var buttonsX = svgheader.append("g")
                .classed("buttsYscale", true)
                .attr("transform", "translate(150,10)")
                .style("cursor", "pointer")
                .on("click", function () {
                  if (!indexX) {
                    d3.select(this)
                      .attr("fill", "red")
                    d3.select(".rectX").attr("fill", "red")
                    d3.select(".textX").text("Change to log X scale").attr("fill", "white")
                    updateX(x);
                    indexX = true
                  } else {
                    d3.select(".rectX").attr("fill", "white")
                    d3.select(".textX").text("Change to linear X scale").attr("fill", "red")
                    updateX(xlogscale);
                    indexX = false }
                })
    buttonsX
                .append("rect")
                .classed("rectX", true)
                .attr("height", 20)
                .attr("width", 150)
                .attr("fill", "white")
                // .attr("fill", "red")
                .attr("stroke", "red")
                .attr("rx", 1)
                .attr("ry", 1)

    buttonsX
                .append("text")
                .classed("textX", true)
                .text("Change to linear x scale")
                .attr("x", 5)
                .attr("y", 15)
                .attr("fill", "red")
                .style("font-size", "14px")
                .attr("font-family","Officina_bold")
                // .style("font-family", "Officina, Calibri, Arial")
                .style("pointer-events", "none")


/// Slope graph option
var buttonsXSlope = svgheader.append("g")
                .classed("buttsYSlopescale", true)
                .attr("transform", "translate(310,10)")
                .style("cursor", "pointer")
                .on("click", function () {
                  if (!indexSlope) {
                    d3.select(".rectSlope").attr("fill", "#0b4f6d")
                    d3.select(".textSlope").text("Change to scatterplot").attr("fill", "white")
                    updateSlope();
                    updateSlopeAxis();
                    indexX = true
                  } else {
                    d3.select(".rectSlope").attr("fill", "white")
                    d3.select(".textSlope").text("Change to slope graph").attr("fill", "#0b4f6d")
                    updateSlope();
                    updateSlopeAxis();

                    indexX = false }
                })
    buttonsXSlope
                .append("rect")
                .classed("rectSlope", true)
                .attr("height", 20)
                .attr("width", 150)
                .attr("fill", "white")
                // .attr("fill", "red")
                .attr("stroke", "#0b4f6d")
                .attr("rx", 1)
                .attr("ry", 1)

    buttonsXSlope
                .append("text")
                .classed("textSlope", true)
                .text("Change to slope graph")
                .attr("x", 5)
                .attr("y", 15)
                .attr("fill", "#0b4f6d")
                .style("font-size", "14px")
                .attr("font-family","Officina_bold")
                // .style("font-family", "Officina, Calibri, Arial")
                .style("pointer-events", "none")





                function updateSlope(scaley, scalex) {
                        d3.selectAll(".dots")
                          .transition()
                          .duration(1000)
                          .style("fill", "#0b4f6d")
                          .style("stroke", "#0b4f6d")
                          .style("fill-opacity", 0.9)
                          .attr("cx", 400)
                          .attr("r", 5)
                          // .attr("cy")

                        d3.selectAll(".SlopegraphX")
                          .transition()
                          .duration(1000)
                          .attr("visibility", "visible")
                          // .style("fill", "f4a582")
                          .style("fill-opacity", 0.9)
                          // .style("stroke", "red")
                          .attr("cx", 100)
                          .attr("cy", function (d, i) {
                            return scaleXslope(d.xvalue)
                          })

                        d3.selectAll(".SlopegraphLines")
                          // .transition()
                          // .duration(2000)
                          .attr("opacity", 1)
                          .on("mouseenter", function (d, i) {
                            console.log("hello")

                            d3.selectAll(".SlopegraphLines")
                              .style("opacity", 0.1)

                            d3.select(this)
                               .style("opacity", 1)
                          })
                          .on("mouseleave", function () {
                            d3.selectAll(".SlopegraphLines")
                              .style("opacity", 0.9)
                          })



                        yAxis
                          .tickValues([0, 100, 200, 350])
                          .tickSize(-400)
                          .scale(y)

                          // .scale(scaley);

                        svg.selectAll("g.y.axis")
                                      .transition()
                                      .duration(1000)
                                      .call(yAxis);


                        yAxis2
                          .tickValues([0, 100, 200, 350])
                          .tickSize(-100)
                          .scale(y2)
                          // .attr("visibility", "visible")

                          // .scale(scaley);

                        svg.selectAll("g.y.axis")
                                      .transition()
                                      .duration(1000)
                                      .call(yAxis2);



                    // #0b4f6d = blue
                    // red = red

                        svg.selectAll("g.x.axis")
                                    .transition()
                                    .duration(1000)
                                    .attr("visibility", "hidden")

                        // svg.selectAll("g.y.axis")
                        //             .transition()
                        //             .duration(1000)
                        //             .attr("visibility", "hidden")

                        svg.selectAll(".legend1")
                                    .transition()
                                    .duration(1000)
                                    .attr("opacity", 0)



                };

                function updateSlopeAxis() {

                };


                function updateY(scale) {
                  d3.selectAll(".dots")
                              .transition()
                              .duration(1000)
                              .attr("cy", function (d, i) {
                                  return scale(d.yvalue);
                              })
// update axis
                  yAxis
                    .scale(scale);

                  svg.selectAll("g.y.axis")
                              .transition()
                              .duration(1000)
                              .call(yAxis);
                }

                function updateX(scale) {
                  d3.selectAll(".dots")
                              .transition()
                              .duration(1000)
                              .attr("cx", function (d, i) {

                                if (scale === xlogscale) {
                                  if (d.xvalue < 1) {
                                    return 35;
                                  } else if (d.xvalue > 0.4 && d.xvalue < 1.5) {
                                    return 169;
                                  } else { return scale(d.xvalue);}
                                }
                                else {return scale(d.xvalue);}
                              })
                  xAxis
                    .scale(scale);

                  if (scale == x) {
                    xAxis.tickValues([0, 50, 100, 200, 350])

                  } else {
                    xAxis.tickValues([1,5, 10, 100, 350])

                  }


                  svg.selectAll("g.x.axis")
                              .transition()
                              .duration(1000)
                              .call(xAxis);


                }


})


//
// var PISAscale = d3.scale.linear()
// 	.domain([417,542])
// 	.range([5, 20]);
//
// var GDPScale = d3.scale.linear()
//                 .domain([15000,70000])
//                 .range(["#fff","#0e6b9e"]);
//
// var ColourScale = d3.scale.linear()
//       .domain([400,550])
//       .range(["#fff","#0b4f6d"]);
//
//
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .tickSize(-height)
// 	// .tickValues([1.1392, 2.2742, 3.4418, 4.5768, 5.74442, 6.8794])
//     .orient("bottom")
//     // .tickFormat(function(d) { return numberFormat(Math.pow(2.718281828, (d+4.97))); });
//
//
//
//
// var yAxis = d3.svg.axis()
// 	.scale(y)
// 	.orient("left")
// 	.tickFormat(function(d) { return d/1000 })
// 	.tickSize(-width)
// 	// .tickValues([0, 0.486, 1.004, 1.503, 2.007, 2.503, 3.002]);
//
//
//
// var svg = d3.select("#chart").append("svg")
// 	.attr("width", width + margin.left + margin.right)
// 	.attr("height", height + margin.top + margin.bottom)
// 	.append("g")
// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var svgFooter = d3.select("#chart").append("svg")
// 	.attr("width", width + margin.left + margin.right)
// 	.attr("height", 30)
// 	// .append("g")
// 	// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//
//
// var tooltip = d3.select("body").append("div")
// 	.attr("class", "tooltip")
// 	.style("opacity", 0);
//
// var coordinates;
// var mouseX;
// var mouseY;
// var thisID;
//
//
//
// var gradient = svg.append("defs")
//   .append("linearGradient")
//     .attr("id", "gradient")
//     .attr("x1", "0%")
//     .attr("y1", "0%")
//     .attr("x2", "100%")
//     .attr("y2", "0%")
//     .attr("spreadMethod", "pad");
//
// gradient.append("stop")
//     .attr("offset", "0%")
//     .attr("stop-color", ColourScale(400))
//     .attr("stop-opacity", 1);
//
// gradient.append("stop")
//     .attr("offset", "100%")
//     .attr("stop-color", ColourScale(550))
//     .attr("stop-opacity", 1);
//
//
//
// d3.tsv("data.tsv", function(error, data) {
//
// 	data.forEach(function(d) {
// 		d.Salary = +d.Salary
// 		d.GDP = +d.GDP
// 		d.Hours = +d.Hours
// 		d.PISA = +d.PISA
// 	});
//
// 	x.domain([25,55]);
// 	y.domain([0,70000]);
//
// 	svg.append("g")
// 		.attr("class", "x axis")
// 		.attr("transform", "translate(0," + height + ")")
// 		.call(xAxis)
// 			.append("text")
// 			.attr("dy", "2.3em")
// 			.attr("x", (width/2))
// 			.style("text-anchor","middle")
// 			.style("font-style", "italic")
// 			.attr("class", "xlabel")
// 			.text("Average hours worked per week");
//
// 	svg.append("g")
// 		.attr("class", "y axis")
// 		.call(yAxis);
//
// 	svg.append("text")
// 		.attr("class", "leftlabel")
// 		.text("Salary, $'000, at PPP*")
// 		.attr("transform", "rotate(-90)")
// 		.style("text-anchor", "middle")
// 		.style("font-style", "italic")
// 		.attr("x", (-1 * (height/2)))
// 		.attr("y", -35);
//
// 	var groups = svg.selectAll(".country")
// 		.data(data)
// 		.enter()
// 		.append("svg:g")
// 		.attr("class", "country")
// 		.attr("id", function(d) { return "g_" + d.ISO; });
//
// 	groups
// 		.append("circle")
// 		// .attr("class", function(d) { return d.Country.replace(/\s+/g, ''); })
// 		.attr("id", function(d) { return "g_" + d.ISO + "_c"; })
// 		.classed("scatter", true)
// 		// .attr("r", 5)
// 		.attr("r", function(d) {
// 			return 7;
// 			return PISAscale(d.PISA)
// 		})
// 		.attr("cx", function(d) {
// 			return x(d.Hours);
// 		})
// 		.attr("cy", function(d) { return y(d.Salary); })
// 		.attr("fill",function(d){
// 			return ColourScale(d.PISA)
//
// 			return GDPScale(d.GDP)
// 		})
// 		.attr("stroke",function(d){
// 			return ColourScale(d.PISA + 10)
// 			return GDPScale(d.GDP + 10000)
// 		})
// 		.attr("fill-opacity",0.9)
// 		;
//
//
// 	groups.append("text")
// 		.attr("class", "label")
// 		.attr("x", function(d) { return x(d.Hours) - 14; })
// 		.attr("y", function(d) { return y(d.Salary) + 4; })
// 		.text(function(d) { return d.Country; })
// 		.style("font-size", "14px")
// 		.attr("text-anchor","end")
// 		.style("font-family", "Officina, Calibri, Arial");
//
//
// 	// var line = d3.svg.line()
// 	// 	.x(function(d) { return x(d.Hours); })
// 	// 	.y(function(d) { return y(d.trendline); });
//
// 	// var trend = svg.append("path")
// 	// 	.datum(data.sort(function(a, b){ return d3.ascending(a.gdppercapita, b.gdppercapita); }))
// 	// 	.attr("class", "trendline")
// 	// 	.attr("d", line);
//
// 	d3.selectAll(".country")
// 		.on("mouseenter", function(d) {
// 			thisID = this.id;
// 			// d3.select(this)
// 			// 	.style("stroke","#000");
//
//
//
// 			coordinates = d3.mouse(this);
// 			mouseX = coordinates[0];
// 			mouseY = coordinates[1];
//
// 			tooltip
// 				.html(
// 				"<h2>" + d.Country + "</h2>" +
// 				"<p>Salary: <strong>$" + numberFormat(d.Salary) + "</strong></p>" +
// 				"<p>Hours per week: <strong>" + numberFormat(d.Hours) + "</strong></p>" +
// // comments in following are to remove GDP
// // TODO: restore
// 				"<p>PISA score: <strong>" + numberFormat(d.PISA) + "</strong></p>"+
// 				"<p>GDP per person: <strong>$" + numberFormat(d.GDP) + "</strong></p>"
// 				)
//
// 				.style("left", (d3.event.pageX - 25) + "px")
// 				.style("top", (d3.event.pageY - 125) + "px")
// 				.transition()
// 				.duration(250)
// 				.style("display", "block")
// 				.style("opacity", 0.95);
//
// 			if (mouseX > (0.6*width)) {
// 				tooltip
// 					.style("left", (d3.event.pageX - 170) + "px")
// 			}
//
// 			if (mouseY < 40) {
// 				tooltip
// 					.style("top", (d3.event.pageY + 10) + "px")
// 			}
//
//
// 			if (thisID == "SaoTomeandPrincipe") {
// 				d3.select(".tooltip h2")
// 					.text("SÃ£o TomÃ© and PrÃ­ncipe");
// 			}
//
// 		})
//
//
//
// 		.on("mouseleave", function(d) {
//
//
// 			tooltip
// 				.transition()
// 				.duration(250)
// 				.style("opacity", 0)
// 				.style("display", "none");
//
// 			// d3.selectAll(".scatter")
// 			// 	.style("stroke","#00a2d9");
//
// 			// d3.select("#Indonesia circle")
// 			// 	.style("stroke", "#7d270a")
// 			// 	.style("fill", "#f04e33");
//
// 			// d3.select("#Japan circle")
// 			// 	.style("stroke", "#7d270a")
// 			// 	.style("fill", "#f04e33");
//
// 			// d3.select("#Nigeria circle")
// 			// 	.style("stroke", "#7d270a")
// 			// 	.style("fill", "#f04e33");
//
// 			// d3.select("#Nepal circle")
// 			// 	.style("stroke", "#7d270a")
// 			// 	.style("fill", "#f04e33");
//
// 		});
//
//
//
// // arrLegendX = [20, 54  ,96];
// // arrLegendY = [14, 8  ,2];
//
// //   var legend = svg.append("g")
// //     .attr("transform", "translate(" + (width - 150) + "," + (height - 40) + ")");
//
// //     legend
// //     .selectAll("legendCircles")
// //     .data([420, 470, 520])
// //     .enter()
// //     .append("g")
// //     .attr("class","legendCircles")
//
//
// //   // legend
// //   .append("circle")
// //     .attr("cx", function(d,i) { return  arrLegendX[i]})
// //     .attr("cy", function(d,i) { return arrLegendY[i];})
// // 	// .attr("r", function(d) { return (Math.pow((d*1000000/20207), 1/3)); })
// // 	.attr("r", function(d) { return PISAscale(d); })
// //     .attr("fill", "#fff")
// //     .attr("opacity", 0.6)
// //     .attr("stroke-width", 1)
// //     .attr("stroke", "#000");
//
//
// //   d3
// //   .selectAll(".legendCircles")
// // // .data([420, 480, 540])
// // //     .enter()
// //   .append("text")
// //     .attr("y", function(d,i) { return (arrLegendY[i] + PISAscale(d)) + 12})
// //     .attr("x", function(d,i) { return arrLegendX[i]})
// //     // .attr("dy", "1.1em")
// //     .style("font-size", "12px")
// //     .style("font-family", "Officina, Calibri, Arial")
// //     .style("text-anchor", "middle")
// //     .text(function(d){return d});
//
// //   legend.append("text")
// //     // .attr("dy", "-65px")
// //     .attr("x",35)
// //     .attr("y",-15)
// //     .style("text-anchor", "middle")
// // 		.attr("font-family","Officina_bold")
// // 	.attr("font-size","14px")
// //     .text("PISA test score. 2012&dagger;");
//
//
//
// 	d3.select(".y.axis .tick line")
// 		.style("stroke", "#0a0906")
// 		.style("stroke-width", "1px");
//
//
// 	d3.select(".x.axis")
// 	.select("text")
// 	.text("N")
// 	.attr("transform","rotate(45), translate(6,2)")
// 		// .style("stroke", "#0a0906")
// 		// .style("stroke-width", "1px");
//
//
// // *Purchasing-power parity
// // &dagger; Average of reading, maths and science scores for 15-year-olds
//
//
//
// 		// .attr("y", function(d) { return y(d.Salary) - 17; });
//
// 	// d3.select("#Indonesia circle")
// 	// 	.style("stroke", "#7d270a")
// 	// 	.style("fill", "#f04e33");
//
// 	// d3.select("#Japan text")
// 	// 	.style("display", "inline")
// 	// 	.attr("x", function(d) { return x(d.log_gdppercapita) - 17; })
// 	// 	.attr("y", function(d) { return y(d.Salary) - 24; });
//
// 	// d3.select("#Japan circle")
// 	// 	.style("stroke", "#7d270a")
// 	// 	.style("fill", "#f04e33");
//
// 	// d3.select("#Nigeria text")
// 	// 	.style("display", "inline")
// 	// 	.attr("x", function(d) { return x(d.log_gdppercapita) - 19; })
// 	// 	.attr("y", function(d) { return y(d.Salary) + 18; });
//
// 	// d3.select("#Nigeria circle")
// 	// 	.style("stroke", "#7d270a")
// 	// 	.style("fill", "#f04e33");
//
// 	// d3.select("#Nepal text")
// 	// 	.style("display", "inline")
// 	// 	.attr("x", function(d) { return x(d.log_gdppercapita) - 15; })
// 	// 	.attr("y", function(d) { return y(d.Salary) - 11; });
//
// 	// d3.select("#Nepal circle")
// 	// 	.style("stroke", "#7d270a")
// 	// 	.style("fill", "#f04e33");
//
//
// svg.append("g")
// 	.attr("id","key")
// 	.attr("transform","translate(404,456)")
//
// d3.select("#key")
// 	.append("rect")
//     .attr("width", 140)
//     .attr("height", 14)
//     .attr("x",-50)
//     .attr("y",10)
//     .attr("rx",6)
//     .attr("ry",6)
//     .attr("stroke",GDPScale(67000))
//     .style("fill", "url(#gradient)");
//
// d3.select("#key")
// 	.append("text")
// 	.text("PISA test score†, 2012")
// 	.attr("font-family","Officina_bold")
// 	.attr("font-size","14px")
// 	.attr("text-anchor","middle")
// 	.attr("x",18)
// 	.attr("y",0)
//
// d3.select("#key")
// 	.append("text")
// 	.text("400")
// 	.attr("font-family","Officina")
// 	.attr("font-size","14px")
// 	.attr("text-anchor","start")
// 	.attr("x",-56)
// 	.attr("y",40)
//
// d3.select("#key")
// 	.append("text")
// 	.text("550")
// 	.attr("font-family","Officina")
// 	.attr("font-size","14px")
// 	.attr("text-anchor","middle")
// 	.attr("x",84)
// 	.attr("y",40)
//
//
// svgFooter
// .append("text")
// .attr("x",0)
// .attr("y",14)
// .attr("text-anchor","start")
// // .attr("y",574)
// .attr("class","footnote")
// .text("Sources: OECD; IMF")
//
// svgFooter
// .append("text")
// .attr("x",560)
// .attr("text-anchor","end")
// .attr("y",14)
// .attr("class","footnote")
// .text("* Purchasing-power parity")
//
//
//
// svgFooter
// .append("text")
// .attr("x",560)
// .attr("text-anchor","end")
// .attr("y",28)
// .attr("class","footnote")
// .text("†Average of reading, maths and science scores for 15-year-olds")
//
// moveRight();
//
// });
//
// function moveRight(){
//
// arrRight = ["AU","PT","ES","CZ"]
//
// for(r=0;r<arrRight.length;r++){
// 		d3.select("#g_" + arrRight[r] + " text")
// 		.attr("x", function(d) {
// 			return x(d.Hours) + (PISAscale(d.PISA) -1)
// 		})
// 		.attr("text-anchor","start")
// 		;
// }
//
// 		d3.select("#g_SV text")
// 			.attr("y", function(d) { return (y(d.Salary) - 6); })
// 			.attr("x", function(d) { return x(d.Hours) - (PISAscale(d.PISA) ); })
//
//
// 		d3.select("#g_DK text")
// 			.attr("y", function(d) { return (y(d.Salary) - 12); })
// 			.attr("x", function(d) { return x(d.Hours) - (PISAscale(d.PISA) ) + 6; })
//
// }
