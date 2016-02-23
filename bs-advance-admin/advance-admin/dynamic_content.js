// ==========================================================================
// Global Variables
// ==========================================================================

// the filenames of the uploaded files. Those shall be replaced when the server file upload is set up.
var filenames = ["seqan 1.0", "seqan-intel 2.0"]

// the colors to be used for the different input files. The number of colors will restrict the number of possible files to compare.
var colors = ["#56A5EC", "#E2A76F", "#438D80"];

// ==========================================================================
// Functions
// ==========================================================================

// --------------------------------------------------------------------------
// Function get_template()
// --------------------------------------------------------------------------
var get_template = function(template_id)
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
}

// --------------------------------------------------------------------------
// Function getSubcatMax()
// --------------------------------------------------------------------------
var getSubcatMax = function(subcat_data)
{
    var tmp_max_value_single = Math.max.apply(Math, subcat_data["measures_single"]);
    var tmp_max_value_multiple = Math.max.apply(Math, subcat_data["measures_multiple"]);
    var max_value = Math.max(tmp_max_value_single, tmp_max_value_multiple);
    return max_value;
}

// --------------------------------------------------------------------------
// Function createResult()
// --------------------------------------------------------------------------
var createResult = function(i, file, subcategory_template, subcategory, m)
{
    var results_template = get_template('#template-result');

    var name = results_template.find('.result_filename');
    name.empty();
    name.append(file);

    var score_single = subcategory["measures_single"][i];
    var score_multiple = subcategory["measures_multiple"][i];
    var quality_value_single = subcategory["quality_single"][i];
    var quality_value_multiple = subcategory["quality_multiple"][i];

    // update resultbar single-core 
    var bar_single = results_template.find('.result_bar_single');
    bar_single.empty();
    bar_single.append(score_single==0 ? "unavailable" : score_single);
    bar_single.css('width', score_single*100/m +"%");
    bar_single.attr('aria-volumenow', score_single*100/m);
    bar_single.css('color', score_single==0 ? "darkgrey" : "black");
    bar_single.css('background-color', colors[i]);

    // update resultbar multi-core 
    var bar_multiple = results_template.find('.result_bar_multiple');
    bar_multiple.empty();
    bar_multiple.append(score_multiple==0 ? "unavailable" : score_multiple);
    bar_multiple.css('width', score_multiple*100/m +"%");
    bar_multiple.attr('aria-volumenow', score_single*100/m);
    bar_multiple.css('color', score_multiple==0 ? "darkgrey" : "black");
    bar_multiple.css('background-color', colors[i]);

    // update quality single-core 
    var qual_single = results_template.find('.result_quality_single');
    qual_single.empty();
    if (quality_value_single==1)
    {
        qual_single.css('color', "green");
        qual_single.append('<i class="glyphicon glyphicon-ok glyphicon-1x"></i>');
    } 
    else if (quality_value_single==0)
    {
        qual_single.css('color', "red");
        qual_single.append('<i class="fa fa-flash fa-1x"></i>');
    }
    else 
    {
        qual_single.css('color', "orange");
        qual_single.append(quality_value_single * 100 + "%");
    }

    // update quality multi-core 
    var qual_multiple = results_template.find('.result_quality_multiple');
    qual_multiple.empty();
    if (quality_value_multiple==1)
    {
        qual_multiple.css('color', "green");
        qual_multiple.append('<i class="glyphicon glyphicon-ok glyphicon-1x"></i>');
    } 
    else if (quality_value_multiple==0)
    {
        qual_multiple.css('color', "red");
        qual_multiple.append('<i class="fa fa-flash fa-1x"></i>');
    }
    else 
    {
        qual_multiple.css('color', "orange");
        qual_multiple.append(quality_value_multiple * 100 + "%");
    }

    subcategory_template.append(results_template);
}

// --------------------------------------------------------------------------
// Function createSubcategory()
// --------------------------------------------------------------------------
var createSubcategory = function(div_subcategories, subcategory_index, cat_data)
{
    var subcategory = cat_data[subcategory_index];
    var subcategory_template = get_template('#template-subcategory');

    var name = subcategory_template.find('.subcategory_name');
    name.empty();
    var subtitle = subcategory["subtitle"];
    if (subtitle)
    {
        subtitle = " <small>(" + subtitle + ")</small>";
    }
    else
    {
        subtitle = "";
    }
    name.append(subcategory["title"] + subtitle); // set subcategory name

    // default scaling is by subcategory
    max_value = getSubcatMax(subcategory);

    $.each(filenames, function(i, file)
    {
        createResult(i, file, subcategory_template, subcategory, max_value);
    });

    div_subcategories.append(subcategory_template);
}

// --------------------------------------------------------------------------
// Function createCategory()
// --------------------------------------------------------------------------
var createCategory = function(cat_data)
{
    var category_template = get_template('#template-category');

    max_value = getCatMax(cat_data);

    var head = category_template.find('.category_head');
    head.empty();
    head.append(category);                             // set category name to panel title
    head.attr('href', "#" + category.replace(/ /g,'')) // set reference for collapse panel
    head.data("max_value", max_value)                  // save max value
    $('#result-body2').append(category_template);      // append category to result body

    var div_subcategories = category_template.find('.subcategories');
    div_subcategories.attr('id', category.replace(/ /g,'')) // set panel-body id for collapse

    for (subcategory in cat_data) // returns index
    {
        createSubcategory(div_subcategories, subcategory, cat_data);
    }
}

// --------------------------------------------------------------------------
// Function main()
// --------------------------------------------------------------------------
$(function()
{
    $.getJSON( "data.json", function(data)
    {
        for(category in data)
        {
            createCategory(data[category]);
        }
    });
});
