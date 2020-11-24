// Immediately Invoked Function Expression to limit access to our
// variables and prevent
((() => {
  // Load the data from a csv file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding '')
  d3.csv('data/public_dataset.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    let dispatchString = 'selectionUpdated';

    // // Create a table
    // // a dispatcher (d3-dispatch) for selection events;
    // // a div id selector to put our table in; and the data to use.
    let publicTable = table()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#table', data);


    let lineChart = linechart()
      .x(d => d.Year)
      .xLabel('Year')
      .y(d => d.PercentRecycled)
      .yLabel('% Waste Recycled')
      .yLabelOffset(50)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ('#linechart', data);



      // When the line chart selection is updated via brushing,
      // tell the other charts to update it's selection (linking)
      lineChart.selectionDispatcher().on(dispatchString + ".lc-to-tab", publicTable.updateSelection);
      // When the table selection is updated via brushing,
      // tell the other charts to update it's selection (linking)
      publicTable.selectionDispatcher().on(dispatchString + ".tab-to-lc", lineChart.updateSelection);     
  });

  d3.csv('data/piechart.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    let dispatchString = 'selectionUpdated';

    let dataPie = piechart()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#piechart', data);

  });

  d3.csv('data/stacked1.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    let dispatchString = 'selectionUpdated';

    let dataStacked = stacked()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#stacked', data);

  });

  d3.csv('data/table.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    let dispatchString = 'selectionUpdated';

    // // Create a table
    // // a dispatcher (d3-dispatch) for selection events;
    // // a div id selector to put our table in; and the data to use.
    let dataTable = table()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#table', data);

  });

})());
