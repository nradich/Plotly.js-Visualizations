function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    //select table 
    var table = d3.select(`#sample-metadata`);
    //clear the table
    table.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(function([key,value]) {
      var row = table.append('p');
      row.text(`${key}: ${value}`)

    });
  })

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    //bubble chart
    //create trace
    var url = `/samples/${sample}`;

  d3.json(url).then(function(bubble) {
      var trace = {
      "x": bubble.otu_ids,
      "y": bubble.sample_values,
      "text": bubble.otu_labels,
      "mode" : 'markers',
      "marker": {
        "color": bubble.otu_ids,
        "size": bubble.sample_values
      }
    };

    var data = [trace];

    var layout = {
      title: "Bubble Graph",
    };

    Plotly.newPlot('bubble', data, layout)
  
  });


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    //building pie chart
  
    d3.json(url).then(function(response) {
 
      var plotdata = [{
        values: response.sample_values.slice(0,10),
        labels:response.otu_ids.slice(0,10),
        hovertext: response.otu_labels.slice(0,10),
        type: 'pie'
        }];
      
      Plotly.purge('pie');
      Plotly.newPlot('pie', plotdata);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
