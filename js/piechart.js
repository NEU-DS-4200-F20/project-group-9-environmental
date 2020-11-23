/* global D3 */

// Initialize a table. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function piechart() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 100,
        left: 50,
        right: 25,
        bottom: 25
      },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      radius = 200;
      selectableElements = d3.select(null)
      //dispatcher
      ;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {
      let svg = d3.select(selector)
          .append('svg')
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
          .classed('svg-content', true);

      svg = svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var g = svg.append("g")
                        .attr("transform", "translate(" + ((width / 2) - 25) + "," + height / 4 + ")");

      console.log(svg)
      // Using tutorial from https://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js for pie chart
      var color = d3.scaleOrdinal(['#4daf4a','#FF0000']);

      var pie = d3.pie().value(function(d) {
          return d.Count;
        });

      var path = d3.arc()
               .outerRadius(radius - 10)
               .innerRadius(0);

      var label = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - 80);

      var arc = g.selectAll(".arc")
                 .data(pie(data))
                 .enter().append("g")
                 .attr("class", "arc");

      arc.append("path")
         .attr("d", path)
         .attr("fill", function(d) { return color(d.data.Name); });

      console.log(arc)

      arc.append("text")
         .attr("transform", function(d) {
                  return "translate(" + label.centroid(d) + ")";
          })
         .text(function(d) { return d.data.Name; })
         .attr("font-size","10px");

      svg.append("g")
         .attr("transform", "translate(" + (width/5) + "," + 300 + ")")
         .append("text")
         .text("Percentage of Students that Recycle")
         .attr("class", "title")
         .attr("font-size","16px")
         //.style("font-weight", "bold")

      arcs.append("path")
         .attr("d", arc)
         .style("fill", function(d,i) {
           return color(i);
         })
         .on("mouseover", function(d, i) {
             console.log(d);
             svg.append("text")
               .attr("dy", ".5em")
               .style("text-anchor", "middle")
               .style("font-size", 45)
               .attr("class","label")
               .style("fill", function(d,i){return "black";})
               .text(names[i]);

         })
         .on("mouseout", function(d) {
           svg.select(".label").remove();
         });


       }

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
