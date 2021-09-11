let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData
let educationData

let canvas = d3.select("#canvas")
let tooltip = d3.select("#tooltip")

let drawMap = () => {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class','county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item["fips"] === id
                })
                let percentage = county["bachelorsOrHigher"]
                if (percentage <= 12){
                    return "#e5f4e0"
                }else if (percentage <= 21){
                    return '#c7e9bf'
                }else if (percentage <=30){
                    return '#a1d99b'
                }else if (percentage <=39){
                    return "#74c476"
                }else if (percentage <=48){
                    return "#41AB5D"
                }else if (percentage <= 57){
                    return "#228b44"
                }else {
                    return '#016d2c'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                    let id = countyDataItem['id']
                    let county = educationData.find((item) => {
                        return item["fips"] === id
                    })
                    let percentage = county["bachelorsOrHigher"]
                    return percentage
            })
            .on('mouseover', (countyDataItem) => {
                tooltip.transition()
                .style('visibility', 'visible')
                let id = countyDataItem['id']
                    let county = educationData.find((item) => {
                        return item["fips"] === id
                    })
                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
                tooltip.attr('data-education', county['bachelorsOrHigher'])
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                .style('visibility', 'hidden')
            })
}

// Load JSON using d3 JSON method

d3.json(countyURL).then(
    (data,error) => {
        if (error){
            console.log(log)
        }else{
            // countyData = data
            countyData = topojson.feature(data,data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data,error) => {
                    if (error) {
                        console.log(error)
                    }else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)