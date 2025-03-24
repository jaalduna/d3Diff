// Sample data with channels
const data = [
    { key: "A", value: 30, channel: "X" },
    { key: "B", value: 80, channel: "Y" },
    { key: "C", value: 45, channel: "X" },
    { key: "D", value: 60, channel: "Z" },
    { key: "E", value: 20, channel: "Y" },
    { key: "F", value: 90, channel: "X" },
    { key: "G", value: 55, channel: "Z" }
];

data.sort((a, b) => b.value - a.value); // Sort the data in descending
// Set up the SVG dimensions for the bar chart
const margin = { top: 20, right: 30, bottom: 40, left: 90 };
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container for the bar chart
const svgBar = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up the scales for the bar chart
const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, width]);

const y = d3.scaleBand()
    .domain(data.map(d => d.key))
    .range([0, height])
    .padding(0.1);

// List to keep track of selected elements and selected channel
let selectedElements = [];
let selectedChannel = null;

// Add the bars
svgBar.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", d => y(d.key))
    .attr("width", d => x(d.value))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")
    .on("mouseover", function(event, d) {
        if (selectedElements.length === 0 && !selectedChannel) {
            svgBar.selectAll("rect")
                .attr("fill", "#d3d3d3"); // Set all bars to gray
            d3.select(this)
                .attr("fill", "#69b3a2"); // Highlight the hovered bar
        }
    })
    .on("mouseout", function() {
        if (selectedElements.length === 0 && !selectedChannel) {
            svgBar.selectAll("rect")
                .attr("fill", "#69b3a2"); // Reset all bars to original color
        } else {
            svgBar.selectAll("rect")
                .attr("fill", d => selectedElements.includes(d.key) || d.channel === selectedChannel ? "#69b3a2" : "#d3d3d3"); // Highlight selected bars with original color
        }
    })
    .on("click", function(event, d) {
        if (selectedElements.includes(d.key)) {
            selectedElements = selectedElements.filter(key => key !== d.key);
        } else {
            selectedElements.push(d.key);
        }
        selectedChannel = null; // Reset selected channel
        updateSelection();
    });

// Add values within each bar
svgBar.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => x(d.value) + 5)
    .attr("y", d => y(d.key) + y.bandwidth() / 2)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .style("fill", "black")
    .style("font-size", "12px") // Set the text size
    .text(d => `${d.key}: ${d.value}`);

// Function to update the selection
function updateSelection() {
    if (selectedElements.length === 0 && !selectedChannel) {
        svgBar.selectAll("rect")
            .attr("fill", "#69b3a2"); // Reset all bars to original color
    } else {
        svgBar.selectAll("rect")
            .attr("fill", d => selectedElements.includes(d.key) || d.channel === selectedChannel ? "#69b3a2" : "#d3d3d3"); // Highlight selected bars with original color
    }

    console.log("Selected elements:", selectedElements);
    updatePieChart();
}

// Set up the SVG dimensions for the pie chart
const pieWidth = 460;
const pieHeight = 400;
const radius = Math.min(pieWidth, pieHeight) / 2;

// Create the SVG container for the pie chart
const svgPie = d3.select("body").append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
  .append("g")
    .attr("transform", `translate(${pieWidth / 2},${pieHeight / 2})`);

// Set up the pie chart
const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

const color = d3.scaleOrdinal(d3.schemeCategory10);

// Function to update the pie chart
function updatePieChart() {
    const selectedData = selectedElements.length === 0 ? data : data.filter(d => selectedElements.includes(d.key));
    const channelCounts = Array.from(d3.group(selectedData, d => d.channel), ([key, value]) => ({ key, value: value.length }));

    const pieData = pie(channelCounts);

    const arcs = svgPie.selectAll(".arc")
        .data(pieData, d => d.data.key);

    arcs.exit().remove();

    const newArcs = arcs.enter().append("g")
        .attr("class", "arc");

    newArcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.key))
        .style("opacity", d => selectedChannel && d.data.key !== selectedChannel ? 0.2 : 1)
        .each(function(d) { this._current = d; })
        .on("click", function(event, d) {
            selectedChannel = selectedChannel === d.data.key ? null : d.data.key;
            selectedElements = []; // Reset selected elements
            updateSelection();
        });

    arcs.select("path")
        .transition()
        .duration(750)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return t => arc(interpolate(t));
        })
        .style("opacity", d => selectedChannel && d.data.key !== selectedChannel ? 0.2 : 1);

    newArcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text(d => d.data.key);

    arcs.select("text")
        .transition()
        .duration(750)
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .text(d => d.data.key);
}

// Initial pie chart update
updatePieChart();
