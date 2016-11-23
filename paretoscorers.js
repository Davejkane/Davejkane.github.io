/*Here up open up our csv file with the d3.csv function and load it into the dataset variable.*/
var dataSet;
d3.csv('../scorers.csv', function(d) {
	dataSet = d;

/*To make the cumulative line, create an array called cumgoals.
Loop through the dataset and append the cumulative goals to the array*/
cumGoals = [];
cumGoals.push(dataSet[0].goals);
dataLength = dataSet.length;
for (i = 1; i < dataLength; i++) {
	cumGoals.push(parseInt(dataSet[i].goals) + parseInt(cumGoals[i - 1]))
};

/*Calculate the total number of goals.*/
totalGoals = d3.sum(dataSet, function(d) {
	return d.goals;
});

/*Defining the margins, width and height of the graph.*/
var margin = {top: 30, right: 20, bottom: 50, left: 50},
width = 480 - margin.left - margin.right,
//Keep the height small for data banking
height = 240 - margin.top - margin.bottom;

/*Defining the x and y scales*/
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

/*Define the axes*/
var formatAsPercentage = d3.format('.0%');
var xAxis = d3.axisBottom().scale(x).ticks(5).tickFormat(formatAsPercentage);
var yAxis = d3.axisLeft().scale(y).ticks(5).tickFormat(formatAsPercentage);

/*Create line function for percentage of goals per player*/
var valueline = d3.line()
.x(function(d, i) { return x(i / (dataSet.length - 1)); })
.y(function(d) { return y(d.goals / totalGoals)});

/*Create the line function for the cumulative line (CDF)*/
var totalline = d3.line()
.x(function(d, i){ return x(i / (dataSet.length - 1)); })
.y(function(d){
	return y(d / totalGoals);
});

// Define the div for the tooltip
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

// Create the SVG element
var svg = d3.select("#paretoGraph")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Scale the range of the data
x.domain([0, 1]);
y.domain([0, 1]);


// Add the valueline path.
svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(dataSet));

// Add the totalline path
svg.append("path")
    .attr("class", "line")
    .attr("d", totalline(cumGoals));


// Add the scatterplot
svg.selectAll("dot")	
    .data(dataSet)			
.enter().append("circle")								
    .attr("r", 2)		
    .attr("cx", function(d, i) { return x(i / (dataSet.length - 1)); })		 
    .attr("cy", function(d) { return y(d.goals / totalGoals); })
    .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div	.html(d.players + ': ' + d.goals)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
        })					
    .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });

// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the X Axis label
svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 10) + ")")
        .style("text-anchor", "middle")
        .text("Percent of Players");

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add the Y Axis label
svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Percent of Goals");

// Close the csv function
});