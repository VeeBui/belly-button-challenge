// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    

    // get the metadata field
    let metadata = data.metadata;


    // Filter the metadata for the object with the desired sample number
    let sampleMetadata = metadata.filter(data => data.id === parseInt(sample))[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let samplePanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    samplePanel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let newText = "";
    for (const [key, value] of Object.entries(sampleMetadata)) {
      let newLine = samplePanel.append("p");
      newLine.text(key + ": " + value);
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let thisSample = samples.filter(data => data.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = thisSample.otu_ids;
    let otu_labels = thisSample.otu_labels;
    let sample_values = thisSample.sample_values;


    // Build a Bubble Chart
    let trace = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
      },      
      text: otu_labels
    }

    let layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: {text: "OTU ID"}},
      yaxis: {title: {text: "Number of Bacteria"}}
    }


    // Render the Bubble Chart
    let dataBub = [trace];
    Plotly.newPlot("bubble", dataBub, layout);


    // Dict to array
    let thisSampleArray = [];
    for (i=0;i < sample_values.length;i++) {
      let currDict = {
        otu_id: 0,
        otu_labels: [],
        sample_values: 0
      };

      currDict.otu_id = otu_ids[i];
      currDict.otu_labels = otu_labels[i];
      currDict.sample_values = sample_values[i];
      
      thisSampleArray.push(currDict);
    }

    // Descending top 10
    let sortedSamples = thisSampleArray.sort((a, b) => b.sample_values - a.sample_values);
    let slicedData = sortedSamples.slice(0,10);
    slicedData.reverse();
    
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let trace2 = {
      x: slicedData.map(object => object.sample_values),
      y: slicedData.map(object => "OTU " + object.otu_id),
      text: slicedData.map(object => object.otu_labels),
      type: "bar",
      orientation: "h"
    }

    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: {text: "Number of Bacteria"}},
      yaxis: {title: {text: "OTU ID"}}
    }

    // Build a Bar Chart
    let dataBar = [trace2];
    Plotly.newPlot("bar",dataBar,layout2)
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let dataNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (i=0;i<dataNames.length; i++) {
      // create new option
      let option = dropDown.append("option");

      // set values
      option.attr("value",dataNames[i])
      option.text(dataNames[i]);
    }



    // Get the first sample from the list
    firstSample = dataNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged() {
  // Build charts and metadata panel each time a new sample is selected
  let newSample = d3.select("#selDataset").property("value");
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Initialise the dashboard
init();

d3.select("#selDataset").on("change", optionChanged)
