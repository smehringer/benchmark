var data_m = [800, 1318, 1115, 756, 1123, 1412];
var data = [1316, 1710, 348, 1110, 673, 1832];

var data2 = {
    "Category 1":
        [
            {
                "title":"Subcategory 1",
                "subtitle":"GHz",
                "ranges":[1500,2250],
                "measures_single":[1200],
                "measures_multiple":[1000],
                "markers":[1000]
            },
            {
                "title":"Subcategory 2",
                "subtitle":"MBytes",
                "ranges":[1500,2250],
                "measures_single":[700],
                "measures_multiple":[1400],
                "markers":[1000]
            }
        ],
    "Category 2":
        [
            {
                "title":"Subcategory 1",
                "subtitle":"GHz",
                "ranges":[1500,2250],
                "measures_single":[1200],
                "measures_multiple":[1400],
                "markers":[1000]
            },
            {
                "title":"Subcategory 2",
                "subtitle":"MBytes",
                "ranges":[1500,2250],
                "measures_single":[800],
                "measures_multiple":[1300],
                "markers":[1000]
            }
        ]
}

var width = 750,
    subcat_name_length = 200,
    barHeight = 50;

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, width]);

for (category in data2){
  // new box with header "category"
  var cat = d3.select("body").append("div").attr("class", "wrap").attr("height",900);
  cat.append("h1").text(category);
  
  // for each subcategory create one svg
  // with one bar for each file (multiple files allowed)
  for (i in data2[category]){
    
    var subcategory = data2[category][i];
    
    // scores_* should have the same length...
    var scores_single = subcategory["measures_single"];
    var scores_multiple = subcategory["measures_multiple"];

    var subcat = cat.append("svg")
    .attr("class","chart")
    .attr("width", width + subcat_name_length)
    .attr("height", barHeight * scores_single.length);
    
    // single-core data
    var bars_single = subcat.selectAll("g")
      .data(scores_single)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
    bars_single.append("rect")
        .attr("width", x)
        .attr("x", subcat_name_length)
        .attr("height", barHeight - (barHeight/2) - 2)
        .attr("fill","steelblue");
    bars_single.append("text")
      .attr("x", subcat_name_length + 10)
      .attr("y", barHeight/4 -1)
      .attr("dy", ".35em")
      .attr("fill","white")
      .attr("font-size", 14)
      .attr("text-achnor","end")
      .text(function(d) { return d; });
    
    // multi-core data
    var bars_multiple = subcat.selectAll("g")
        .data(scores_multiple);
    bars_multiple.append("rect")
      .attr("width", x)
      .attr("x", subcat_name_length)
      .attr("y", (barHeight/2)-2)
      .attr("height", barHeight - (barHeight/2) - 2 )
      .attr("fill","blue");
    bars_multiple.append("text")
      .attr("x", subcat_name_length + 10)
      .attr("y", barHeight*3/4 -2)
      .attr("dy", ".35em")
      .attr("fill","white")
      .attr("font-size", 14)
      .attr("text-achnor","end")
      .text(function(d) { return d; });
    
    // titles
    bars_single.append("text")
      .attr("x", 0)
      .attr("y", barHeight/4+5)
      .attr("dy", ".1em")
      .attr("fill","black")
      .attr("font-size", 12)
      .attr("font-weigth","bold")
      .attr("text-achnor","start")
      .text(subcategory["title"]);

    bars_single.append("text")
        .attr("x", 0)
        .attr("y", barHeight/2+10)
        .attr("dy", ".1em")
        .attr("fill","grey")
        .attr("font-size", 12)
        .attr("font-weigth","bold")
        .attr("text-achnor","start")
        .text(subcategory["subtitle"]);
  }
}



