// ==========================================================================
// Global Variables
// ==========================================================================

// the filenames of the uploaded files. Those shall be replaced when the server file upload is set up.
var filenames = ["seqan 1.0", "seqan-intel 2.0", "seqan 3.0"]

// the class for the summary div to be used for layouting reasons.
var summary_class = "";
switch (filenames.length) {
    case 0:
        console.log("something went wrong..")
        break;
    case 1:
        summary_class = "col-md-12";
        break;
    case 2:
        summary_class = "col-md-6";
        break;
    case 3:
        summary_class = "col-md-4";
        break;
    case 4:
        summary_class = "col-md-3";
        break;
}

// the colors to be used for the different input files. The number of colors will restrict the number of possible files to compare.
var colors = ["#56A5EC", "#E2A76F", "#438D80"];

// the current scaling option. default is set to subcat.
var scaling_tag = "subcat"

// ==========================================================================
// Functions
// ==========================================================================

// --------------------------------------------------------------------------
// Function getTemplate()
// --------------------------------------------------------------------------
var getTemplate = function(template_id)
{
    return $(template_id).clone().removeAttr('id');
};

// --------------------------------------------------------------------------
// Function getCatMax()
// --------------------------------------------------------------------------
var getCatMax = function(cat_data)
{
    var max_value = 0;
    for(i in cat_data)
    {
        var tmp_max_value_single = Math.max.apply(Math, cat_data[i]["measures_single"]);
        var tmp_max_value_multiple = Math.max.apply(Math, cat_data[i]["measures_multiple"]);
        max_value = Math.max(max_value, tmp_max_value_single, tmp_max_value_multiple);
    }
    return max_value;
};

// --------------------------------------------------------------------------
// Function getSubcatMax()
// --------------------------------------------------------------------------
var getSubcatMax = function(subcat_data)
{
    var tmp_max_value_single = Math.max.apply(Math, subcat_data["measures_single"]);
    var tmp_max_value_multiple = Math.max.apply(Math, subcat_data["measures_multiple"]);
    var max_value = Math.max(tmp_max_value_single, tmp_max_value_multiple);
    return max_value;
};

// --------------------------------------------------------------------------
// Function updateBarWidth()
// --------------------------------------------------------------------------
var updateBarWidth = function(value, max_value, bar)
{
    bar.css('width', value*100/max_value +"%");
    bar.attr('aria-volumenow', value*100/max_value);
};

// --------------------------------------------------------------------------
// Function updateBar()
// --------------------------------------------------------------------------
var updateBar = function(value, max_value, bar, i)
{
    bar.empty();
    bar.append(value==0 ? "unavailable" : value);
    bar.css('color', value==0 ? "darkgrey" : "black");
    bar.css('background-color', colors[i]);
    updateBarWidth(value, max_value, bar);
    bar.data("value", value);
};

// --------------------------------------------------------------------------
// Function updateQuality()
// --------------------------------------------------------------------------
var updateQuality = function(value, div)
{
    div.empty();
    if (value==1)
    {
        div.css('color', "green");
        div.append('<i class="glyphicon glyphicon-ok glyphicon-1x"></i>');
    }
    else if (value==0)
    {
        div.css('color', "red");
        div.append('<i class="fa fa-flash fa-1x"></i>');
    }
    else
    {
        div.css('color', "orange");
        div.append(value * 100 + "%");
    }
};

// --------------------------------------------------------------------------
// Function createResult()
// --------------------------------------------------------------------------
var createResult = function(i, file, subcategory_template, subcategory, m)
{
    var results_template = getTemplate('#template-result');

    var name = results_template.find('.result_filename');
    name.empty();
    name.append(file);

    var score_single = subcategory["measures_single"][i];
    var score_multiple = subcategory["measures_multiple"][i];
    var quality_value_single = subcategory["quality_single"][i];
    var quality_value_multiple = subcategory["quality_multiple"][i];

    // update resultbar single-core
    var bar_single = results_template.find('.result_bar_single');
    updateBar(score_single, m, bar_single, i);

    // update resultbar multi-core
    var bar_multiple = results_template.find('.result_bar_multiple');
    updateBar(score_multiple, m, bar_multiple, i);

    // update quality single-core
    var qual_single = results_template.find('.result_quality_single');
    updateQuality(quality_value_single, qual_single);

    // update quality multi-core
    var qual_multiple = results_template.find('.result_quality_multiple');
    updateQuality(quality_value_multiple, qual_multiple);

    subcategory_template.append(results_template);
};

// --------------------------------------------------------------------------
// Function createSubcategory()
// --------------------------------------------------------------------------
var createSubcategory = function(div_subcategories, subcategory_index, cat_data)
{
    var subcategory = cat_data[subcategory_index];
    var subcategory_template = getTemplate('#template-subcategory');

    var name = subcategory_template.find('.subcategory_name');
    name.empty();
    var subtitle = subcategory.subtitle;
    if (subtitle)
    {
        subtitle = " <small>(" + subtitle + ")</small>";
    }
    else
    {
        subtitle = "";
    }
    name.append(subcategory.title + subtitle); // set subcategory name

    var max_value;
    if (scaling_tag == "cat")
    {
        max_value = div_subcategories.data("cat_max_value");
    }
    else
    {
        max_value = getSubcatMax(subcategory);
    }

    $.each(filenames, function(i, file)
    {
        createResult(i, file, subcategory_template, subcategory, max_value);
    });

    div_subcategories.append(subcategory_template);
};

// --------------------------------------------------------------------------
// Function createCategory()
// --------------------------------------------------------------------------
var createCategory = function(cat_data)
{
    var category_template = getTemplate('#template-category');

    max_value = getCatMax(cat_data);

    var head = category_template.find('.category_head');
    head.empty();
    head.append(category);                             // set category name to panel title
    head.attr('href', "#" + category.replace(/ /g,'')) // set reference for collapse panel
    $('#result-body2').append(category_template);      // append category to result body

    var div_subcategories = category_template.find('.subcategories');
    div_subcategories.attr('id', category.replace(/ /g,'')); // set panel-body id for collapse
    div_subcategories.data("cat_max_value", max_value);          // save max value

    subcat_max_values = [];
    for (subcategory in cat_data) // returns index
    {
        createSubcategory(div_subcategories, subcategory, cat_data);
        subcat_max_values = subcat_max_values.concat([getSubcatMax(cat_data[subcategory])]);
    }
    div_subcategories.data("subcat_max_values", subcat_max_values);
};

// --------------------------------------------------------------------------
// Function computeSum()
// --------------------------------------------------------------------------
var computeSum = function(data)
{
    var sum = [];

    for(var i = 0; i < filenames.length; ++i)
    {
        var pair = [0,0];
        sum.push(pair);
    }

    for (category in data)
    {
        for (i in data[category])
        {
            var subcategory = data[category][i];
            for(j = 0; j < subcategory["measures_single"].length; ++j)
            {
                var s = parseInt(subcategory["measures_single"][j]);
                var m = parseInt(subcategory["measures_multiple"][j]);
                sum[j][0] = sum[j][0] + s;
                sum[j][1] = sum[j][1] + m;
            }
        }
    }

    return sum;
};

// --------------------------------------------------------------------------
// Function updateSummary()
// --------------------------------------------------------------------------
var updateSummary = function(data)
{
    for(i in filenames)
    {
        var summary_template = getTemplate("#template-summary");
        summary_template.attr("class", "result-comparison " + summary_class);

        var name = summary_template.find("h3");
        name.empty();
        name.append(filenames[i]);
        name.css("color", colors[i]);

        var sum = computeSum(data);

        var single = summary_template.find(".result-single-score");
        single.empty();
        single.append(sum[i][0]);

        var multi = summary_template.find(".result-multi-score");
        multi.empty();
        multi.append(sum[i][1]);

        $("#summary").append(summary_template);
    }
};

// --------------------------------------------------------------------------
// Function updateBarScaling()
// --------------------------------------------------------------------------
var updateBarScaling = function(tag)
{
    if (tag == scaling_tag)
        return false; // nothing has to be changed. Avoid redundant computing.

    $.each($(".id-category"), function(i, cat)
    {
        var div = $(cat).find('.subcategories');
        var bars = $(cat).find(".result-bar");

        max_values = [];
        for (i = 0; i < bars.length; ++i)
        {
            if (tag == "cat")
            {
                max_values = max_values.concat(div.data("cat_max_value"));
            }
            else
            {
                index = Math.floor(i/(2*filenames.length));
                max_values = max_values.concat(div.data("subcat_max_values")[index]);
            }
        }

        $.each(bars, function(i, bar)
        {
            updateBarWidth($(bar).data("value"), max_values[i], $(bar));
        });
    });

    scaling_tag = tag;
};

// ==========================================================================
// MAIN
// ==========================================================================
$(function()
{
    $('#result-body2').empty(); // clear result page

    $.getJSON( "data3.json", function(data)
    {
        updateSummary(data);

        for(category in data)
        {
            createCategory(data[category]);
        }
    });
});
