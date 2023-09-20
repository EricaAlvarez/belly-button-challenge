
// USE THE D3 LIBRARY TO READ IN THE JSON FROM THE URL
// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// DISPLAY THE SAMPLE METADATA, I.E., AN INDIVIDUAL'S DEMOGRAPHIC INFORMATION
function init() {
// Use D3 to select the dropdown menu
let dropdownMenu = d3.select("#selDataset");

// Assign the value of the dropdown menu option to a variable
d3.json(url).then((data) => {
    // Set the names variable
    let names = data.names;

    // Loop troughout the id
    names.forEach((id) => {
        console.log(id);
        dropdownMenu.append("option").text(id).property("value",id);
    });

    // Assign a variable to the first sample from the list
    let first_sample = names[0];
    // Log the value of sample_one
    console.log(first_sample);
});
};

// DISPLAY EACH KEY-VALUE PAIR FROM THE METADATA JSON OBJECT
function buildMetadata(sample) {

    // Uses D3 to retrieve all of the data into an array
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        console.log(value)

        // Gets the first index from the array
        let valueData = value[0];

        // Clears metadata
        d3.select("#sample-metadata").html("");

        // Assign the values to each key
        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// CREATE A HORIZONTAL BAR CHART WITH A DROPDOWN MENU
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Add variales to otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Sorts the info in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// CREATE A BUBBLE CHART THAT DISPLAYS EACH SAMPLE
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// UPDATE ALL THE PLOTS WHEN A NEW SAMPLE IS SELECTED
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call the initialize function
init();