
// for more about line graphs check out this example:
// https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

/**
 * changes made from linegraph.js:
 * 1. move the code to append div to body to the beginning of the code
 * 2. make a new svg with same dimensions and append it to div variable
 * 3. make new axes and append it to tooltipSvg
 * 4. change svg.append("path").... to tooltipSvg.append("path")
 * 5. make css changes (specified in file)
 */

const margin = {top: 50, right: 50, bottom: 50, left: 50}
, width = 800 - margin.left - margin.right // Use the window's width 
, height = 600 - margin.top - margin.bottom // Use the window's height

const marginTooltip = {top: 70, right: 70, bottom: 70, left: 70}
, widthTooltip = 400 - margin.left - margin.right // Use the window's width 
, heightTooltip = 300 - margin.top - margin.bottom // Use the window's height

// load data
d3.csv('data/gapminder.csv').then((dataPure) => {

    // append the div which will be the tooltip
    // append tooltipSvg to this div
    const div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .attr('width', 400)
        .attr('height', 300)
        .style('opacity', 0)

    // make an svg and append it to body
    const svg = d3.select('body').append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    const tooltipSvg = div.append("svg")
        .attr('width', widthTooltip + marginTooltip.left + marginTooltip.right)
        .attr('height', heightTooltip + marginTooltip.top + marginTooltip.bottom)

    // get only data for USA
    data = dataPure.filter(d => d['year'] == "1980")

    // get year min and max for us
    const yearLimits = d3.extent(data, d => d['fertility'])

    // const year2Limits = d3.extent(dataPure, d => d['year'])
    // const populationLimits = d3.extent(dataPure, d => d['population'])
    // console.log(populationLimits)

    // get scaling function for years (x axis)
    const xScale = d3.scaleLinear()
        .domain([yearLimits[0], yearLimits[1]])
        .range([margin.left, width + margin.left])

    // const xScale2 = d3.scaleLinear()
    //     .domain([year2Limits[0], year2Limits[1]])
    //     .range([marginTooltip.left, widthTooltip + marginTooltip.left])

    // make x axis
    const xAxis = svg.append("g")
        .attr("transform", "translate(0," + (height + margin.top) + ")")
        .call(d3.axisBottom(xScale))

    // const xAxis2 = tooltipSvg.append("g")
    //     .attr("transform", "translate(0," + (heightTooltip + marginTooltip.top) + ")")
    //     .call(d3.axisBottom(xScale2))

    // get min and max life expectancy for US
    const lifeExpectancyLimits = d3.extent(data, d => d['life_expectancy']) 

    // get scaling function for y axis
    const yScale = d3.scaleLinear()
        .domain([lifeExpectancyLimits[1], lifeExpectancyLimits[0]])
        .range([margin.top, margin.top + height])

    // const yScale2 = d3.scaleLinear()
    //     .domain([populationLimits[1], populationLimits[0]])
    //     .range([marginTooltip.top, marginTooltip.top + heightTooltip])

    // make y axis
    const yAxis = svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale))

    // const yAxis2 = tooltipSvg.append("g")
    //     .attr("transform", "translate(" + marginTooltip.left + ",0)")
    //     .call(d3.axisLeft(yScale2))

    // // d3's line generator
    // const line = d3.line()
    //     .x(d => xScale2(d['year'])) // set the x values for the line generator
    //     .y(d => yScale2(d['population'])) // set the y values for the line generator 

    // // append line to svg
    // tooltipSvg.append("path")
    //     // difference between data and datum:
    //     // https://stackoverflow.com/questions/13728402/what-is-the-difference-d3-datum-vs-data
    //     .datum(dataPure)
    //     .attr("d", function(d) { return line(d) })
    //     .attr("fill", "steelblue")
    //     .attr("stroke", "steelblue")
    
    // append dots to svg to track data points
    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d['fertility']))
            .attr('cy', d => yScale(d['life_expectancy']))
            .attr('r', 4)
            .attr('fill', 'steelblue')
            // get rid of .html
            .on("mouseover", function(d) {
                tooltipSvg.selectAll("g").remove()
                tooltipSvg.selectAll("path").remove()

                const dataCountry = dataPure.filter(dd => dd['country'] == d['country'])
                const year2Limits = [dataCountry[0]['year'], dataCountry[dataCountry.length-1]['year']]
                people = (dataCountry.map((row) => { return row['population'] })).filter(word => word != 'NA')
                const populationLimits = [dataCountry[0]['population'], people[people.length-1]]

                const xScale2 = d3.scaleLinear()
                    .domain([year2Limits[0], year2Limits[1]])
                    .range([marginTooltip.left, widthTooltip + marginTooltip.left])

                const xAxis2 = tooltipSvg.append("g")
                    .attr("transform", "translate(0," + (heightTooltip + marginTooltip.top) + ")")
                    .call(d3.axisBottom(xScale2))

                const yScale2 = d3.scaleLinear()
                    .domain([populationLimits[1], populationLimits[0]])
                    .range([marginTooltip.top, marginTooltip.top + heightTooltip])

                const yAxis2 = tooltipSvg.append("g")
                    .attr("transform", "translate(" + marginTooltip.left + ",0)")
                    .call(d3.axisLeft(yScale2))

                const line = d3.line()
                    .x(d => xScale2(d['year'])) // set the x values for the line generator
                    .y(d => yScale2(d['population'])) // set the y values for the line generator 

                // append line to svg
                tooltipSvg.append("path")
                    // difference between data and datum:
                    // https://stackoverflow.com/questions/13728402/what-is-the-difference-d3-datum-vs-data
                    .datum(dataCountry)
                    .attr("d", function(d) { return line(d) })
                    .attr("fill", "steelblue")
                    .attr("stroke", "steelblue")

                div.transition()
                    .duration(200)
                    .style('opacity', 0.9)

                div.style('left', d3.event.pageX + "px")
                    .style('top', (d3.event.pageY - 28) + "px")
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(300)
                    .style('opacity', 0)
            })

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            if (parseInt(d["population"]) > 100000000) {
                return d['country']
            }
        })
        .attr("x", function(d) {
            return xScale(d['fertility'])+2;  // Returns scaled location of x
        })
        .attr("y", function(d) {
            return yScale(d['life_expectancy']);  // Returns scaled circle y
        })
        .attr("font-size", "16px")  // Font size
        .attr("fill", "black");
    

})