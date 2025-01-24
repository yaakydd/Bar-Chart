const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then(data => {
    const dataset = data.data.map(item => ({
        date: new Date(item[0]),
        gdp: item[1]
    }));

    drawChart(dataset);
});

function drawChart(dataset) {
    const width = 800;
    const height = 400;
    const padding = 50;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleTime()
        .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.gdp)])
        .range([height - padding, padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("y", d => yScale(d.gdp))
        .attr("width", (width - 2 * padding) / dataset.length)
        .attr("height", d => height - padding - yScale(d.gdp))
        .attr("data-date", d => d.date.toISOString().split('T')[0])
        .attr("data-gdp", d => d.gdp)
        .on("mouseover", (event, d) => {
            d3.select("#tooltip")
                .style("opacity", 1)
                .html(`Date: ${d.date.toISOString().split('T')[0]}<br>GDP: ${d.gdp} billion USD`)
                .attr("data-date", d.date.toISOString().split('T')[0])
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            d3.select("#tooltip")
                .style("opacity", 0);
        });

    
}
