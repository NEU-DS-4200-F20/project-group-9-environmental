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
        bottom: 0
      },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      radius = 150;
      selectableElements = d3.select(null)
      ;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {
      let svg = d3.select(selector)
          .append('svg')
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('viewBox', [0, 0, width + margin.left + margin.right, height].join(' '))
          .classed('svg-content', true);

      svg = svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      let g = svg.append("g")
                        .attr("transform", "translate(" + ((width / 2) - 25) + "," + height / 4 + ")");

      // Using tutorial from https://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js for pie chart
      let color = d3.scaleOrdinal(['#88B791','#FF8484']);

      let pie = d3.pie().value(function(d) {
          return d.Count;
        });

      let div = d3.select(selector).append("div")
      .attr("class", "tooltip-piechart")
      .style("opacity", 0);

      let path = d3.arc()
               .outerRadius(radius - 10)
               .innerRadius(0);

      let label = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - 80);


      let arc = g.selectAll(".arc")
                 .data(pie(data))
                 .enter().append("g")
                 .attr("d", "arc")

                 //details on demand functionality
                 .on("mouseover", function (d, i) {
                   d3.select(this).transition().duration("50")
                    .attr("opacity", ".55")

                   div.transition()
                    .duration(50)
                    .style("opacity", 1);

                  let num = (Math.round((i.data.Count / 313) * (100)).toString() + "%");
                  div.html(i.data.Name + ": " + num);
                 })

                 .on("mouseout", function(d, i) {
                   d3.select(this).transition().duration("50")
                   .attr("opacity", "1")

                   div.transition()
                    .duration('50')
                    .style("opacity", 0);
                 })




      arc.append("path")
         .attr("d", path)
         .attr("fill", function(d) { return color(d.data.Name); });

      arc.append("text")
         .attr("transform", function(d) {
                  return "translate(" + label.centroid(d) + ")";
          })
         .text(function(d) { return d.data.Name; })
         .attr("font-size","10px");

      svg.append("text")
              .attr("x", (width / 2))
              .attr("y", -10 - (margin.top / 2))
              .attr("text-anchor", "middle")
              .style("font-size", "12px")
              .attr("font-weight", "bold")
              //.style("text-decoration", "underline")
              .text("Do you participate in routine recycling of your trash?");
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