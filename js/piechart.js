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

      // Using tutorial from https://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js for pie chart
      var color = d3.scaleOrdinal(['#88B791','#FF8484']);

      var pie = d3.pie().value(function(d) {
          return d.Count;
        });

      var div = d3.select(selector).append("div")
      .attr("class", "tooltip-piechart")
      .style("opacity", 0);

      var path = d3.arc()
               .outerRadius(radius - 10)
               .innerRadius(0);

      var label = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - 80);


      var arc = g.selectAll(".arc")
                 .data(pie(data))
                 .enter().append("g")
                 .attr("d", "arc")

                 .on("mouseover", function (d, i) {
                   d3.select(this).transition().duration("50")
                    .attr("opacity", ".55");

                   div.transition()
                    .duration(50)
                    .style("opacity", 1);


                  let num = (Math.round((d.Count / d.data) * (100)).toString() + "%");
                  div.html(data);
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

      svg.append("g")
         .attr("transform", "translate(" + (width/5) + "," + 300 + ")")
         .append("text")
         .text("Percentage of Students that Recycle")
         .attr("class", "title")
         .attr("font-size","16px")


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


//
//
// var path = selector.selectAll('path')
//      .data(pie(totals))
//      .enter()
//      .append('path')
//      .attr('d', arc)
//      .attr('fill', function (d, i) {
//           return color(d.data.title);
//      })
//      .attr('transform', 'translate(0, 0)')
//      .on('mouseover', function (d, i) {
//           d3.select(this).transition()
//                .duration('50')
//                .attr('opacity', '.85');
//           //Makes the new div appear on hover:
//           div.transition()
//                .duration(50)
//                .style("opacity", 1);
//      })
//      .on('mouseout', function (d, i) {
//           d3.select(this).transition()
//                .duration('50')
//                .attr('opacity', '1');
//           //Makes the new div disappear:
//           div.transition()
//                .duration('50')
//                .style("opacity", 0);
//      });
