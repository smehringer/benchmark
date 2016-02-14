var width = "600",
    subcat_name_length = 200,
    barHeight = 50;

var filenames = ["seqan 1.0","seqan-intel 2.0"]

var colors_single   = ["#8BC1F2", "#EBC199", "#72BCAF"]; //todo:: this restricts the number of files that can be compared. should be set to for example 5...
var colors_multiple = ["#56A5EC", "#E2A76F", "#438D80"];

function createResultpage(data2, scale){
    // build summary
    var sum = [];
    var max_by_category = {};

    for(var i = 0; i < filenames.length; ++i){
        var pair = [0,0];
        sum.push(pair);
    }

    for (category in data2){            // returns name
        max_by_category[category] = 0;
        for (i in data2[category]){     // returns index..?
            var subcategory = data2[category][i];
            for(j = 0; j < subcategory["measures_single"].length; ++j){
                var s = parseInt(subcategory["measures_single"][j]);
                var m = parseInt(subcategory["measures_multiple"][j]);
                if(s > max_by_category[category]){
                    max_by_category[category] = s;
                }
                if(m > max_by_category[category]){
                    max_by_category[category] = m;
                }
                sum[j][0] = sum[j][0] + s;
                sum[j][1] = sum[j][1] + m;
            }
        }
    }

    d3.select("#result-chart").append("p")
        //.style("background-image","url('numbers.jpg')")
        .style("background-color","#282828")
        .style("text-shadow","1px 0px 2px #fff")
        //.style("-webkit-box-reflect","below -30px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(255, 255, 255, 0.3)))")
        .style("color","#ffdb4d")
        .style("margin-left","5px")
        .style("margin-right","5px")
        .style("margin-top","-10px")
        .style("text-align","center")
        .style("padding-bottom","3px")
        .style("padding-top","1px")
        .style("border-bottom","2px solid black")
        .style("border-radius","22px 22px 0px 0px")
        .append("h3")
            // .style("margin-top","-2px")
            // .style("height","50px")
            //.style("-webkit-box-reflect","below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(255, 255, 255, 0.3)))")
            .text("Your Benchmark results");

    var result_head = d3.select("#result-chart").append("div").attr("class","col-md-12").style("text-align","center");

    var sum2 = result_head.selectAll("div")
        .data(sum).enter();

    var sum3 = sum2.append("div")
        .style("margin-top","-11px")
        .attr("class","col-md-6")
        .style("border-right",function(d, i){if (i < filenames.length-1) return "2px solid #888";})

    sum3.append("h3")
                .style("color",function(d, i) { return colors_multiple[i]; })
                .text(function (d, i) {return filenames[i];});
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

//     // append golden star to the best result
//     sum2.append("div")
//         .style("position","absolute")
//         .style("top","-18px")
//         .style("right","-5px")
//         .append("i")
//             .attr("class", function(d){if (d[0]>4000) return "glyphicon glyphicon-star glyphicon-5x";})
//             .style("font-size","40px")
//             .style("color","gold");

//    //append seqan logo to background
//     sum2.append("img")
//         .attr("src","seqan_logo2.png")
//         .attr("width","80px")
//         .style("opacity","0.4")
//         .style("position","absolute")
//         .style("top","5px")
//         .style("left","25px")

    var syst = sum3.append("div")
        .attr("class", "panel-config panel-default-config")
    syst.append("div")
        .attr("class", "panel-heading-config")
        .append("h6")
        .attr("class","panel-title-config")
        .append("a")
            .attr("data-toggle","collapse")
            .attr("href","#collapseOne")
            .attr("class","collapsed")
            .text("system information...");
    syst.append("div")
        .attr("id","collapseOne")
        .attr("class","panel-collapse collapse")
        .style("height","0px")
        .append("div")
            .attr("class","panel-body-config")
            .text("Here go some system information like number of threads, operating system and other stuff....")

     d3.select("#result-chart").append("div").attr("class","col-md-12").style("margin-top","-20px").append("hr")

    // build category boxes
    for (category in data2){
        // new box with header "category"
        var cat = d3.select("#result-chart").append("div").attr("class","col-md-12").append("div")
            .attr("class", "panel panel-default")
            .style("margin-bottom","0px");
        cat.append("div")
            .attr("class", "panel-heading")
            .append("h1")
                .attr("class","panel-title")
                .append("a")
                    .attr("data-toggle","collapse")
                    .attr("href","#" + category.replace(/ /g,''))
                    .attr("class","collapsed")
                    .style("color","black")
                    .text(category);
        cat2 = cat.append("div")
                .attr("id",category.replace(/ /g,''))
                .attr("class","panel-collapse collapse")
                .style("height","0px");

        //var head = cat.append("div").attr("class", "panel-body");
        //head.append("div").attr("class","col-md-4").style("text-align","center").text("File");
        //head.append("div").attr("class","col-md-7").style("text-align","center").text("Results");
        //head.append("div").attr("class","col-md-1").style("text-align","center").text("Quality");

        for (i in data2[category]){

            var subcategory = data2[category][i];

            // scores_* should have the same length...
            var scores_single = subcategory["measures_single"];
            var scores_multiple = subcategory["measures_multiple"];
            var quality_single = subcategory["quality_single"];
            var quality_multiple = subcategory["quality_multiple"];

            var mymax = max_by_category[category];
            if(scale=="subcat"){
                mymax = d3.max(scores_single.concat(scores_multiple) );
            }
            var x = d3.scale.linear()
                .domain([0, mymax])
                .range([0, width]);

            var subcat2 = cat2.append("div")
                             .attr("class", "panel-body");
            subcat2.append("p")
                .style("text-align","center")
                .style("font-size","14px")
                .text(function(d, i) { return subcategory["title"] + " (" + subcategory["subtitle"] + ")"});

            var subcat3 = subcat2.selectAll("div").data(scores_single).enter().append("div").attr("class","col-md-12");

            subcat3.append("div")
                .attr("class","col-md-3")
                .style("font-size","10pt")
                .text(function(d, i) { return filenames[i] });
            var subcat4 = subcat3.append("div")
                .attr("class","col-md-9")
            subcat4.append("div")
                .attr("class","col-md-2")
                .style("font-size","8pt")
                .text("single-core").style("color","grey");
            subcat4.append("div").attr("class","col-md-9").append("div")
                .attr("class", "progress")
                .append("div").attr("class","progress-bar")
                    .attr("aria-volumenow", function(d) { return d*100/mymax; })
                    .attr("aria-valuemin","0")
                    .attr("aria-valuemax", 100)
                    .style("width",function(d) { return d*100/mymax +"%"; })
                    .text(function(d) { if(d==0){return "unavailable"} else {return d}; })
                    .style("color",function(d){if(d==0){return "darkgrey"} else {return "black"}})
                    .style("background-color",function(d, i) { return colors_multiple[i]; })
                    .style("font-size","10pt");
            var qual = subcat4.append("div").attr("class","col-md-1")
                .style("text-align","center")
            qual.style("color", function(d, i){ if(quality_single[i]==1){ return "green"}; if (quality_single[i]==0){return "red"} else {return "orange"} });
            qual.text(function(d, i){ if(quality_single[i]!=1 && quality_single[i]!=0){return quality_single[i]*100 +"%"} })
            qual.append("i")
                .attr("class", function(d,i) {if(quality_single[i]==1){ return "glyphicon glyphicon-ok glyphicon-1x"}; if (quality_single[i]==0 && d!=0){return "fa fa-flash fa-1x"}});

            subcat3.append("div")
                .attr("class","col-md-3");
            var subcat4 = subcat3.append("div")
                .attr("class","col-md-9")
            subcat4.append("div")
                .attr("class","col-md-2")
                .style("font-size","8pt")
                .text("16-Thread").style("color","grey");

            subcat4.append("div").attr("class","col-md-9").append("div")
                .attr("class", "progress")
                .append("div").attr("class","progress-bar")
                    .attr("aria-volumenow", function(d, i) { return scores_multiple[i]*100/mymax; })
                    .attr("aria-valuemin","0").attr("aria-valuemax", 100).style("width",function(d,i) { return scores_multiple[i]*100/mymax +"%"; })
                    .text(function(d,i) { if(scores_multiple[i]==0){return "unavailable"} else {return scores_multiple[i]}; })
                    .style("color",function(d, i){if(scores_multiple[i]==0){return "darkgrey"} else {return "black"}})
                    .style("background-color",function(d, i) { return colors_multiple[i]; })
                    .style("font-size","10pt");
            var qual2 = subcat4.append("div")
                .attr("class","col-md-1")
                .style("text-align","center");
            qual2.style("color", function(d, i){ if(quality_multiple[i]==1){ return "green"}; if (quality_multiple[i]==0){return "red"} else {return "orange"} });
            qual2.text(function(d, i){ if(quality_multiple[i]!=1 && quality_multiple[i]!=0){return quality_multiple[i]*100 +"%"} })
            qual2.append("i")
                .attr("class", function(d,i) {if(quality_multiple[i]==1){ return "glyphicon glyphicon-ok glyphicon-1x"}; if (quality_multiple[i]==0 && d!=0){return "fa fa-flash fa-1x"}});
            //var


        }
    }
};

function myStart(scale){
    document.getElementById("result-chart").innerHTML = ""; // reset div to null
    d3.json("data.json", function(error, data2) {
        if (error) throw error;
        createResultpage(data2, scale);
    });
}

myStart("cat");