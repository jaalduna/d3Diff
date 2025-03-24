
export function createPieChart(data, updateSelection) {
    const pieWidth = 460;
    const pieHeight = 400;
    const radius = Math.min(pieWidth, pieHeight) / 2;

    const svgPie = d3.select("#pie-chart-container").append("svg")
        .attr("width", pieWidth)
        .attr("height", pieHeight)
      .append("g")
        .attr("transform", `translate(${pieWidth / 2},${pieHeight / 2})`);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function updatePieChart() {
        const selectedData = updateSelection.selectedElements.length === 0 ? data : data.filter(d => updateSelection.selectedElements.includes(d.key));
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
            .style("opacity", d => updateSelection.selectedChannel && d.data.key !== updateSelection.selectedChannel ? 0.2 : 1)
            .each(function(d) { this._current = d; })
            .on("click", function(event, d) {
                updateSelection.selectedChannel = updateSelection.selectedChannel === d.data.key ? null : d.data.key;
                updateSelection.selectedElements = [];
                updateSelection.update();
            });

        arcs.select("path")
            .transition()
            .duration(750)
            .attrTween("d", function(d) {
                const interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return t => arc(interpolate(t));
            })
            .style("opacity", d => updateSelection.selectedChannel && d.data.key !== updateSelection.selectedChannel ? 0.2 : 1);

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

    updateSelection.updatePieChart = updatePieChart;
    updatePieChart();
}

