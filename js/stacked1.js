
function stacked() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
      top: 100,
      left: 50,
      right: 30,
      bottom: 35
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top  - margin.bottom,
    xLabelText = '',
    yLabelText = '',
    yLabelOffsetPx = 0,
    selectableElements = d3.select(null),
    dispatcher;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {
  //using tutorial from https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
  //using tutorial from https://observablehq.com/@ericd9799/learning-stacked-bar-chart-in-d3-js
  //using tutorial from http://bl.ocks.org/mstanaland/6100713
  // append the svg object to the body of the page
        // Setup svg using Bostock's margin convention
        var svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right + 200)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");


        // // Transpose the data into layers
        // var dataset = d3.stack()(["Recycle", "No Recycle"].map(function(vals) {
        // return data.map(function(d) {
        // return {x: d.Percent, y: +d[vals]};
        // });
        // }));

        // make stack of elements
        dataset = d3.stack().keys(data.columns.slice(1))(data);

        console.log(dataset);

        // Set x, y and colors
        var x = d3.scaleBand()
          .domain(data.map(function(d){return d.Percent;}))
            .range([0, width])
            .padding(.1);


        // d3.scaleOrdinal()
        // .domain(dataset.map(function(d){return d.Percent;}))
        // .range([0, width]);
        //.domain(dataset[0].map(function(d) { return d.x; }));
        //.rangeRoundBands([10, width-10], 0.02);

        var y = d3.scaleLinear()
        .domain([0,d3.max(dataset, d => d3.max(d, d=> d[1]))])
        .range([height,0]);


        var xAxis = svg.append("g")
        .attr("id", "xAxis")
        .attr("transform", "translate(0,"+height+")")
        .call(d3.axisBottom(x));

        // X axis label
        xAxis.append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'translate(' + (width - 50) + ',-10)')
        .text(xLabelText);

        var yAxis = svg.append("g")
        .attr("id", "yAxis")
        .call(d3.axisLeft(y))
        .append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'translate(' + yLabelOffsetPx + ', -12)')
        .text(yLabelText);;


        var colors = ['#88B791','#FF8484'];
        //const color = d3.scaleOrdinal(d3.schemeCategory10);

        svg.append("g")
        .attr("class", "y axis")
        .call(y);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x);


        // // Create groups for each series, rects for each segment
        // var groups = svg.selectAll("g")
        // .data(dataset)
        // .enter().append("g")
        // //.attr("class", "cost")
        // .attr("fill", d => color(d.key));

        var rects = svg.selectAll(selector).data(dataset).enter()
        .append("g")
        .attr("fill", function(d, i) { return colors[i]; })
          //.attr("x axis", function(d) { return x(d.x); })
         //.attr("y axis", function(d) { return y(d.y0 + d.y); })
         //.attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        //.attr("width", x.rangeBand())

        rects.selectAll("rect")
           .data(d => d)
           .join("rect")
           .attr("x", (d, i) => x(d.data.Percent))
           .attr("y", d=> y(d[1]))
           .attr("height", d=> y(d[0]) - y(d[1]))
           .attr("width", x.bandwidth());
           // .on("mouseover", function() { tooltip.style("display", null); })
           // .on("mouseout", function() { tooltip.style("display", "none"); })
           // .on("mousemove", function(d) {
           //   var xPosition = d3.pointer(this) - 15;
           //   var yPosition = d3.pointer(this)  - 25;
           // tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
           // tooltip.select("text").text(d.y);
           // });

        // Draw legend
        var legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 14)
        .attr("height", 14)
        .style("fill", function(d, i) {return colors.slice()[i];});

        legend.append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", "14px")
        .text(function(d, i) {
        switch (i) {
        case 0: return "Recycles";
        case 1: return "Doesn't recycle";
        }
        });

        //
        // // add title
        // svg.append("g")
        //    //.attr("transform", "translate(" + (width/3) + "," - 200 + ")")
        //    .append("text")
        //    .text("What percent of materials placed in recycling bins do you think is actually recycled?")
        //    .attr("class", "title")
        //    .attr("font-size","14x")
        //    //.style("font-weight", "bold")



        svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "13px")
                .attr("font-weight", "bold")
                //.style("text-decoration", "underline")
                .text("What percent of materials put in recycling bins do you think is actually recycled?");



        // Prep the tooltip bits, initial display is hidden
        var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

        tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5)
        .style("position", "absolute");

        tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

      }


        chart.xLabel = function (_) {
          if (!arguments.length) return xLabelText;
          xLabelText = _;
          return chart;
        };

        chart.yLabel = function (_) {
          if (!arguments.length) return yLabelText;
          yLabelText = _;
          return chart;
        };


        chart.yLabelOffset = function (_) {
        if (!arguments.length) return yLabelOffsetPx;
        yLabelOffsetPx = _;
        return chart;
        };



        // Gets or sets the dispatcher we use for selection events
        chart.selectionDispatcher = function (_) {
          if (!arguments.length) return dispatcher;
          dispatcher = _;
          return chart;
        };

        // Given selected data from another visualization
        // select the relevant elements here (linking)
        chart.updateSelection = function (selectedData) {
          if (!arguments.length) return;

          // Select an element if its datum was selected
          selectableElements.classed('selected', d =>
            selectedData.includes(d)
          );

        };
  return chart
  }
