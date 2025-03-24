export function createBarChart(data2, updateSelection) {
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 260 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svgBar = d3.select("#bar-chart-container").append("svg")
        .attr("width", width * 2 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    const data = data2
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.abs(d.value))])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([0, height])
        .padding(0.1);

    // Filter negative data
    let negativeData = data.filter(d => d.value < 0).sort((a, b) => a.value - b.value);

    let positiveData = data.filter(d => d.value >= 0).sort((a, b) => b.value - a.value);

        // Create separate y scales for positive and negative data
    const yNeg = d3.scaleBand()
        .domain(negativeData.map(d => d.key))
        .range([0, 20*negativeData.length])
        .padding(0.1);

    const yPos = d3.scaleBand()
        .domain(positiveData.map(d => d.key))
        .range([0, 20*positiveData.length])
        .padding(0.1);


    // Left bars (negative values)
    if (negativeData.length > 0) {
        svgBar.selectAll(".bar-left")
            .data(negativeData)
            .enter()
            .append("rect")
            .attr("class", "bar-left")
            .attr("x", d => width - x(Math.abs(d.value)))
            .attr("y", (d, i) => yNeg(d.key))
            .attr("width", d => x(Math.abs(d.value)))
            .attr("height", y.bandwidth())
            .attr("fill", "red")
            .on("mouseover", function(event, d) {
                if (updateSelection.selectedElements.length === 0 && !updateSelection.selectedChannel) {
                    svgBar.selectAll(".bar-left")
                        .attr("fill", "#d3d3d3");
                    d3.select(this)
                        .attr("fill", "red");
                }
            })
            .on("mouseout", function() {
                if (updateSelection.selectedElements.length === 0 && !updateSelection.selectedChannel) {
                    svgBar.selectAll(".bar-left")
                        .attr("fill", "red");
                } else {
                    svgBar.selectAll(".bar-left")
                        .attr("fill", d => updateSelection.selectedElements.includes(d.key) || d.channel === updateSelection.selectedChannel ? "red" : "#d3d3d3");
                }
            })
            .on("click", function(event, d) {
                if (updateSelection.selectedElements.includes(d.key)) {
                    updateSelection.selectedElements = updateSelection.selectedElements.filter(key => key !== d.key);
                } else {
                    updateSelection.selectedElements.push(d.key);
                }
                updateSelection.selectedChannel = null;
                updateSelection.update();
            });

        svgBar.selectAll(".text-left")
            .data(negativeData)
            .enter()
            .append("text")
            .attr("class", "text-left")
            .attr("x", d => width - x(Math.abs(d.value)) - 5)
            .attr("y", (d, i) => yNeg(d.key) + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("fill", "black")
            .style("font-size", "12px")
            .text(d => `${d.key}: ${d.value}`);
    }

    // Right bars (positive values)
    svgBar.selectAll(".bar-right")
        .data(positiveData)
        .enter()
        .append("rect")
        .attr("class", "bar-right")
        .attr("x", width)
        .attr("y", (d, i) => yPos(d.key))
        .attr("width", d => x(d.value))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
        .on("mouseover", function(event, d) {
            if (updateSelection.selectedElements.length === 0 && !updateSelection.selectedChannel) {
                svgBar.selectAll(".bar-right")
                    .attr("fill", "#d3d3d3");
                d3.select(this)
                    .attr("fill", "#69b3a2");
            }
        })
        .on("mouseout", function() {
            if (updateSelection.selectedElements.length === 0 && !updateSelection.selectedChannel) {
                svgBar.selectAll(".bar-right")
                    .attr("fill", "#69b3a2");
            } else {
                svgBar.selectAll(".bar-right")
                    .attr("fill", d => updateSelection.selectedElements.includes(d.key) || d.channel === updateSelection.selectedChannel ? "#69b3a2" : "#d3d3d3");
            }
        })
        .on("click", function(event, d) {
            if (updateSelection.selectedElements.includes(d.key)) {
                updateSelection.selectedElements = updateSelection.selectedElements.filter(key => key !== d.key);
            } else {
                updateSelection.selectedElements.push(d.key);
            }
            updateSelection.selectedChannel = null;
            updateSelection.update();
        });

    svgBar.selectAll(".text-right")
        .data(positiveData)
        .enter()
        .append("text")
        .attr("class", "text-right")
        .attr("x", d => width + x(d.value) + 5)
        .attr("y", (d, i) => yPos(d.key) +  y.bandwidth() / 2  )
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .style("fill", "black")
        .style("font-size", "12px")
        .text(d => `${d.key}: ${d.value}`);
}
