/* global D3 */

// Initialize a table. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function table() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 20
      },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      selectableElements = d3.select(null),
      dispatcher;

    // Create the chart by adding a table to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {
      // Reference: https://www.w3schools.com/tags/tag_tbody.asp
      // Reference: http://bl.ocks.org/jonahwilliams/cc2de2eedc3896a3a96d
      let table = d3.select(selector)
        .append("table")
        .attr("class", "text-unselectable"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

      let columns = Object.keys(data[0]);

      let header = thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(d => d);

      let rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")

      selectableElements = rows;

      tbody.selectAll('tr')
      .on('mouseover', function() {
          // Reference: https://stackoverflow.com/questions/15709304/d3-color-change-on-mouseover-using-classedactive-true
          if(mouseDown)
            d3.select(this).classed('selected', true);

          d3.select(this).classed('mouseover', true);
          dispatch('.selected');
        })
        .on('mouseout', function() {
          d3.select(this).classed('mouseover', false);
          dispatch('.selected');
        })
        .on('mousedown', function() {
          dispatch(null);
          selectableElements.classed('selected', false);
          d3.select(this).classed('selected', true);
        })

      function dispatch(selection) {
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, this, d3.selectAll(selection).data());
      }

      // Reference: https://stackoverflow.com/questions/322378/javascript-check-if-mouse-button-down
      var mouseDown = 0;
      document.body.onmousedown = () => {
        mouseDown = 1;
      }
      document.body.onmouseup = () => {
        mouseDown = 0;
      }

      let cells = rows.selectAll("td")
        .data((row) => {
          return columns.map((d, i) => {
            return {i: d, value: row[d]};
          });
        })
        .enter()
        .append("td")
        .html((d) => d.value);

      return chart;
    }

    // The x-accessor from the datum
    function X(d) {
      return xScale(xValue(d));
    }

    // The y-accessor from the datum
    function Y(d) {
      return yScale(yValue(d));
    }

    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.width = function (_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.x = function (_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

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

    return chart;
  }
