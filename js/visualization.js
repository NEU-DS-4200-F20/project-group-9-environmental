// Immediately Invoked Function Expression to limit access to our
// variables and prevent
((() => {

  d3.csv('data/table.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = 'selectionUpdated';

    // // Create a table
    // // a dispatcher (d3-dispatch) for selection events;
    // // a div id selector to put our table in; and the data to use.
    let dataTable = table()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#table', data);

  });

  // Load the data from a csv file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding '')
  d3.csv('data/public_dataset.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = 'selectionUpdated';

    // // Create a table
    // // a dispatcher (d3-dispatch) for selection events;
    // // a div id selector to put our table in; and the data to use.
    let publicTable = table()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#table', data);

  });

  d3.csv('data/piechart.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = 'selectionUpdated';

    let dataPie = piechart()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#piechart', data);

  });

  d3.csv('data/stacked1.csv').then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = 'selectionUpdated';

    let dataStacked = stacked()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#stacked', data);

  });

})());
