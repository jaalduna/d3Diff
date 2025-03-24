import { data } from './data.js';
import { createBarChart } from './barChart.js';
import { createPieChart } from './pieChart.js';

const updateSelection = {
    selectedElements: [],
    selectedChannel: null,
    update: function() {
        if (this.selectedElements.length === 0 && !this.selectedChannel) {
            d3.selectAll("rect")
                .attr("fill", "#69b3a2");
        } else {
            d3.selectAll("rect")
                .attr("fill", d => this.selectedElements.includes(d.key) || d.channel === this.selectedChannel ? "#69b3a2" : "#d3d3d3");
        }
        this.updatePieChart();
    }
};

createBarChart(data, updateSelection);
createPieChart(data, updateSelection);

