const parseDate = d3.timeParse("%m-%Y");
const margin = {left: 100, right: 50, top: 100, bottom: 0};
const height = 300;
const width = 675;
const marginHeight = height - margin.top - margin.bottom;
const marginWidth = width - margin.left - margin.right;



const svg = d3
  .select("body")
  .append("svg")
  .attr("height", "100%")
  .attr("width", "100%");

  let tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0)


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then((data)=>{
  
  
  
  const entry = data.data;
  const minDate = new Date(entry[0][0]);
  const maxDate = new Date(entry[entry.length - 1][0]);
  const barWidth = marginWidth / entry.length;
  const entryHeight = marginHeight / entry.length;
  
  const greenField = d3.scaleSequential(d3.interpolateGreens).domain([0,entry.length - 1]);
  
const y = d3.scaleLinear().range([height, 0]).domain([0,entry[entry.length - 1][1]]);

const x = d3.scaleTime().range([0, width]).domain([minDate,maxDate]);
const yAxis = d3.axisLeft(y);
const xAxis = d3.axisBottom(x);



const chartGroup = svg.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`)
.attr("class", "chart");
  
  chartGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("class","text")
        .attr("id", "title")
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Federal Reserve Economic Data - Gross Domestic Product");
    
  chartGroup.selectAll("rect")
  .data(data.data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("fill", (d,i) => greenField(i))
  .attr("height", (d, i) => height - y(d[1]))
  .attr("width", barWidth)
  .attr("x", (d, i) => (width / entry.length) * i)
  .attr("y", (d, i) => y(d[1]) )
  .attr("data-date", d => d[0])
  .attr("data-gdp", d => d[1])
  .on("mouseover", d => {
    tooltip
    .transition()
    .duration(50)
    .style('opacity', 0.9)
    
    tooltip
    .html(`Date: ${d[0]} <br/>GDP: ${ d3.format("($.2f")(d[1])}`)
    .style("left", d3.event.pageX - 75 + "px")
    .style("top", d3.event.pageY - 75 + "px");
    
    tooltip.attr("data-date", d[0]);
    
  })
  .on("mouseout", () => {
    tooltip
    .transition()
    .duration(50)
    .style("opacity", 0);
  });
  
  chartGroup.append("g")
    .attr("class","axis y tick")
    .attr("id", "y-axis")
    .call(yAxis);
  chartGroup.append("g")
    .attr("class","axis x tick")
    .attr("id", "x-axis")
    .attr("transform",`translate(0,${height})`)
    .call(xAxis);
  
  chartGroup.append('g')
  .attr("class","tooltip")
  

  

});