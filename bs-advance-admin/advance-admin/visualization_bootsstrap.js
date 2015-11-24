var width = "600",
    subcat_name_length = 200,
    barHeight = 50;

var filenames = ["seqan 1.0","seqan-intel 2.0", "seqan 3.0"]

var colors_single   = ["#56A5EC", "#E2A76F", "#438D80"]; //todo:: this restricts the number of files that can be compared. should be set to for example 5...
var colors_multiple = ["#8BC1F2", "#EBC199", "#72BCAF"];

d3.json("data.json", function(error, data2) {
    if (error) throw error;

    // build summary
    var sum = [];
    var scores_single_sum = [];
    var scores_multiple_sum = [];

    for(var i = 0; i < data2["Category 1"][0]["measures_single"].length; ++i){ // todo: hard coded 'category 1' needds to be replaced!
        scores_single_sum.push(0.0);
        scores_multiple_sum.push(0.0);
        var pair = [0,0];
        sum.push(pair);
    }

    for (category in data2){
        for (i in data2[category]){
            var subcategory = data2[category][i];
                for(j = 0; j < subcategory["measures_single"].length; ++j){
                scores_single_sum[j] = scores_single_sum[j] + parseInt(subcategory["measures_single"][j]);
                scores_multiple_sum[j] = scores_multiple_sum[j] + parseInt(subcategory["measures_multiple"][j]);
                sum[j][0] = sum[j][0] + parseInt(subcategory["measures_single"][j]);
                sum[j][1] = sum[j][1] + parseInt(subcategory["measures_multiple"][j]);
            }
        }
    }

    var sum1 = d3.select("#result-chart")
        .append("div")
        .attr("class","row");

    var sum2 = sum1.selectAll("p")
        .data(sum).enter()
        .append("div").attr("class", "col-md-6").style("margin-top","15px");

    sum2.append("div").style("position","absolute").style("top","-18px").style("right","-5px").append("i").attr("class", function(d){if (d[0]>4000) return "glyphicon glyphicon-star glyphicon-5x";}).style("font-size","40px").style("color","gold");

    sum3 = sum2.append("p")
            .attr("class", "main-box mb-red")
            .style("background", function(d, i) { return colors_multiple[i]; })
                .append("text")
                .style("font-size", "16px")
                .text(function (d, i) {return filenames[i];})
                .html(function (d, i) {return filenames[i]+"<br/><br/>";});
    sum3.append("text")
        .style("font-size", "25px")
        .style("color","black")
        .text(function(d) { return d[0]; });
    sum3.append("text")
        .style("font-size", "14px")
        .text(" SingleCore ");
    sum3.append("text")
        .style("font-size", "25px")
        .style("color","black")
        .text(function(d) { return d[1]; });
    sum3.append("text")
        .style("font-size", "14px")
        .text(" MultiCore ");

    var syst = d3.select("#result-chart").append("div")
        .attr("class", "panel panel-default")
        .attr("height",900);
    syst.append("div")
        .attr("class", "panel-heading")
        .append("h4")
        .attr("class","panel-title")
        .append("a")
            .attr("data-toggle","collapse")
            .attr("href","#collapseOne")
            .attr("class","collapsed")
            .text("System Information");
    syst.append("div")
        .attr("id","collapseOne")
        .attr("class","panel-collapse collapse")
        .style("height","0px")
        .append("div")
            .attr("class","panel-body")
            .text("Here go some system information like number of threads, operating system and other stuff....")

    // build category boxes
    for (category in data2){
        // new box with header "category"
        var cat = d3.select("#result-chart").append("div").attr("class", "panel panel-default").attr("height",900);
        cat.append("div").attr("class", "panel-heading").append("h4").attr("class","panel-title").text(category);

        var head = cat.append("div").attr("class", "panel-body");
        head.append("div").attr("class","col-md-4").style("text-align","center").text("Name");
        head.append("div").attr("class","col-md-7").style("text-align","center").text("Results (single-core/multi-core)");
        head.append("div").attr("class","col-md-1").style("text-align","center").text("Quality");

        // for each subcategory create one svg
        // with one bar for each file (multiple files allowed) ?
        for (i in data2[category]){

            var subcategory = data2[category][i];

            // scores_* should have the same length...
            var scores_single = subcategory["measures_single"];
            var scores_multiple = subcategory["measures_multiple"];
            var quality_single = subcategory["quality_single"];
            var quality_multiple = subcategory["quality_multiple"];

            var mymax = d3.max(scores_single.concat(scores_multiple) );
            var x = d3.scale.linear()
                .domain([0, mymax])
                .range([0, width]);

            var subcat2 = cat.append("div").attr("class", "panel-body");
            var subcat3 = subcat2.selectAll("div").data(scores_single).enter().append("div").attr("class","col-md-12");

            subcat3.append("div")
                .attr("class","col-md-4").text(function(d, i) { return subcategory["title"] + " (" + filenames[i] + ")" });
            subcat3.append("div")
                .attr("class","col-md-7").append("div")
                .attr("class", "progress")
                .append("div").attr("class","progress-bar")
                    .attr("aria-volumenow", function(d) { return d*100/mymax; })
                    .attr("aria-valuemin","0")
                    .attr("aria-valuemax", 100)
                    .style("width",function(d) { return d*100/mymax +"%"; })
                    .text(function(d) { if(d==0){return "unavailable"} else {return d}; })
                    .style("color",function(d){if(d==0){return "darkgrey"} else {return "white"}})
                    .style("background-color",function(d, i) { return colors_single[i]; })
                    .style("font-size","12pt");
            var qual = subcat3
                .append("div").attr("class","col-md-1")
                .style("color","green")
                .style("text-align","center")
            qual.style("color", function(d, i){ if(quality_single[i]==1){ return "green"}; if (quality_single[i]==0){return "red"} else {return "orange"} });
            qual.text(function(d, i){ if(quality_single[i]!=1 && quality_single[i]!=0){return quality_single[i]*100 +"%"} })
            qual.append("i")
                .attr("class", function(d,i) {if(quality_single[i]==1){ return "glyphicon glyphicon-ok glyphicon-1x"}; if (quality_single[i]==0 && d!=0){return "fa fa-flash fa-1x"}});

            subcat3.append("div")
                .attr("class","col-md-4")
                .text(function(d, i) { return subcategory["subtitle"]}).style("color","grey");
            subcat3.append("div")
                .attr("class","col-md-7")
                .append("div").attr("class", "progress")
                .append("div").attr("class","progress-bar")
                    .attr("aria-volumenow", function(d, i) { return scores_multiple[i]*100/mymax; })
                    .attr("aria-valuemin","0").attr("aria-valuemax", 100).style("width",function(d,i) { return scores_multiple[i]*100/mymax +"%"; })
                    .text(function(d,i) { if(scores_multiple[i]==0){return "unavailable"} else {return scores_multiple[i]}; })
                    .style("color",function(d, i){if(scores_multiple[i]==0){return "darkgrey"} else {return "white"}})
                    .style("background-color",function(d, i) { return colors_multiple[i]; })
                    .style("font-size","12pt");
            var qual2 = subcat3.append("div")
                .attr("class","col-md-1")
                .style("color","green")
                .style("text-align","center");
            qual2.style("color", function(d, i){ if(quality_multiple[i]==1){ return "green"}; if (quality_multiple[i]==0){return "red"} else {return "orange"} });
            qual2.text(function(d, i){ if(quality_multiple[i]!=1 && quality_multiple[i]!=0){return quality_multiple[i]*100 +"%"} })
            qual2.append("i")
                .attr("class", function(d,i) {if(quality_multiple[i]==1){ return "glyphicon glyphicon-ok glyphicon-1x"}; if (quality_multiple[i]==0 && d!=0){return "fa fa-flash fa-1x"}});
            //var


        }
    }
});
