
function stacked_sig() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
      top: 100,
      left: 50,
      right: 75,
      bottom: 35
    },
    width = 700,
    height = 500 - margin.top  - margin.bottom,
    xLabelText = '',
    yLabelText = '',
    yLabelOffsetPx = 0,
    selectableElements = d3.select(null)
    // dispatcher;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {
    //referencing tutorial from https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
    //referencing tutorial from https://observablehq.com/@ericd9799/learning-stacked-bar-chart-in-d3-js
    //referencing tutorial from http://bl.ocks.org/mstanaland/6100713
    // append the svg object to the body of the page
        // Setup svg using Bostock's margin convention
        let svg = d3.select(selector)
        .classed("svg-container", true)
        .append("svg")
        .attr('viewBox', [0, 0, width + margin.left + margin.right + 100, height + margin.top + margin.bottom].join(' '))
        .append("g")
        .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");

        // make stack of elements
        dataset = d3.stack().keys(data.columns.slice(1))(data);


        // Set x, y and colors
        let x = d3.scaleBand()
          .domain(data.map(function(d){return d.Response;}))
            .range([0, width])
            .padding(.1);

        // create y linear scale
        let y = d3.scaleLinear()
        .domain([0,d3.max(dataset, d => d3.max(d, d=> d[1]))])
        .range([height,0]);


        let xAxis = svg.append("g")
        .attr("id", "xAxis")
        .attr("transform", "translate(0,"+height+")")
        .call(d3.axisBottom(x));

        // X axis label
        xAxis.append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'translate(' + (width/2) + ',25)')
        .text(xLabelText);


        let yAxis = svg.append("g")
        .attr("id", "yAxis")
        .call(d3.axisLeft(y))
        .append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'translate(' + 90 + ', -12)')
        .text(yLabelText);;

        // set colors same as in pie chart, green and red
        let colors = ['#88B791','#FF8484'];

        let div = d3.select(selector).append("div")
        .attr("class", "tooltip-stacked")
        .style("opacity", 0);

        svg.append("g")
        .attr("class", "y axis")
        .call(y);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x);

        // create bars
        let rects = svg.selectAll(selector).data(dataset).enter()
        .append("g")
        .attr("fill", function(d, i) { return colors[i]; })

        // add hover over functionality for details on demand
        rects.selectAll("rect")
           .data(d => d)
           .join("rect")
           .attr("x", (d, i) => x(d.data.Response))
           .attr("y", d=> y(d[1]))
           .attr("height", d=> y(d[0]) - y(d[1]))
           .attr("width", x.bandwidth())

           .on("mouseover", function (d, i) {
            d3.select(this).transition().duration("50")
             .attr("opacity", ".55")

             div.transition()
             .duration(50)
             .style("opacity", 1);

             div.html("Recycle: " + i.data.Yes + "; Do Not Recycle: " + i.data.No);
           })

           .on("mouseout", function(d, i) {
            d3.select(this).transition().duration("50")
            .attr("opacity", "1")

            div.transition()
             .duration('50')
             .style("opacity", 0);
          })

        // Draw legend
        let legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

        // add legend box
        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 14)
        .attr("height", 14)
        .style("fill", function(d, i) {return colors.slice()[i];});

        // add legend text
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

        // add title
        svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .attr("font-weight", "bold")
                //.style("text-decoration", "underline")
                .text("To what extent do you believe the present speed of climate change is an issue?");

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
