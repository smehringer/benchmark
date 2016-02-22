var width = "600",
    subcat_name_length = 200,
    barHeight = 50;

var filenames = ["seqan 1.0","seqan-intel 2.0"]

var colors_single   = ["#8BC1F2", "#EBC199", "#72BCAF"]; //todo:: this restricts the number of files that can be compared. should be set to for example 5...
var colors_multiple = ["#56A5EC", "#E2A76F", "#438D80"];

var get_template = function(template_id)
{
    return $(template_id).clone().removeAttr('id');
};

var get_cat_max = function(cat_data)
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

var get_subcat_max = function(cat_data, index)
{
    var tmp_max_value_single = Math.max.apply(Math, cat_data[index]["measures_single"]);
    var tmp_max_value_multiple = Math.max.apply(Math, cat_data[index]["measures_multiple"]);
    var max_value = Math.max(tmp_max_value_single, tmp_max_value_multiple);
    return max_value;
}

var create_result_bars = function(){}

var create_subcategory = function(div_subcategories, subcategory_index, cat_data)
{
    var subcategory = cat_data[subcategory_index];
    var subcategory_template = get_template('#template-subcategory');

    var name = subcategory_template.find('.subcategory_name');
    name.empty();
    name.append(subcategory["title"]); // set subcategory name

    var scores_single = subcategory["measures_single"];
    var scores_multiple = subcategory["measures_multiple"];
    var quality_single = subcategory["quality_single"];
    var quality_multiple = subcategory["quality_multiple"];

    // default scaling is by subcategory
    max_value = get_subcat_max(cat_data, subcategory_index);

    div_subcategories.append(subcategory_template);
}

var create_category = function(cat_data)
{
    var category_template = get_template('#template-category');

    max_value = get_cat_max(cat_data);

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
        create_subcategory(div_subcategories, subcategory, cat_data);
    }
}

$(function(){
    $.getJSON( "data.json", function( data )
    {
        for(category in data)
        {
            create_category(data[category]);
        }
    });
});
