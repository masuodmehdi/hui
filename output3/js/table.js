[settings]
functionname=hi_kernel_mpcp_set_silencetime;  
attributenum=3;
attributeflag = 4 ;   //0:close 1:open

[parameter]
attribute=alias<llidindex>    type<char>    default<0x0>;
attribute=alias<reason>       type<char>    default<0x0>;
attribute=alias<res>          type<short>   default<0x0>;
attribute=alias<timeout>      type<int>     default<0x3c>;


[help]
usage: 
typedef struct
{
    hi_uchar8   uc_llidindex;
    hi_uchar8   uc_reason;
    hi_ushort16 us_res;
    hi_uint32   ui_timeout;
}hi_kernel_sd5113_mpcp_silence_s;

---------pop ok function---------------*/
function pop_click() {
    deleteFilter(g_deleteIndex, $(".user_add_line"));
    parent.clearDialog();
    button_enable("apply", "1");
    button_enable("add_item", "1");
}

/*------------------pop cancel click-------------*/
function pop_cancel_click() {
    parent.clearDialog();
}

//function for add item
//addFilter(insertNode,tdText1,tdText2,tdText3,...);
function addFilter(insertNode){
    var addLine = null;
    var i = 1;
    addLine = "<tr class=\"user_add_line\">";
    for ( i = 1; i < arguments.length; i++ ) 
    {
        addLine += "<td>" + arguments[i] + "</td>";
    }
    addLine += "<td class='user_options'><span class=\"button_edit_list\">" + common_edit + "</span>&nbsp;&nbsp;<span class=\"button_delete_list\">" + common_delete + "</span></td></tr>";
    
    var currentTrTotal = $(insertNode).size();
    $(insertNode).eq(currentTrTotal - 2).after(addLine);
}

//show add item control
function showAddItemControl(){
    $(".add_item_control").show();
}

//hide add item control
function hideAddItemControl(){
    $(".add_item_control").hide();
}

function getDArrayElement( obj, item, which ){
    var val = "";
    if ( obj && $.isArray(obj) ) 
    {
        $(obj).each( function(i){
            if( "value" == which )
            {                
                if ( obj[i][0] == item ) 
                {
                    val = obj[i][1];
                }
            }
            else if( "key" == which )
            {
                if ( obj[i][1] == item ) 
                {
                    val = obj[i][0];
                }
            }
            else
            {                
            }
        });
    }
    
    return val;
}

function createSelect( where, id, option ){
    where.html("<select id="+ id +"></select>");
    
    if( $.isArray(option) )
    {
        $(option).each( function(n){
            $("#"+ id).append("<option value=" + option[n][0]+ ">"+ option[n][1] + "</option>");             
        });
    }   
}

function initSelectOption( ids, dArray ){
    var i=0; 
    for (i=0; i < dArray.length; i++) {
        if( $.isArray(ids) )
        {
            $(ids).each( function(n){
                $("#" + ids[n]).append("<option value=" + dArray[i][0]+ ">"+ dArray[i][1] + "</option>");                 
            });
        }
        else
        {
            $("#" + ids).append("<option value=" + dArray[i][0]+ ">"+ dArray[i][1] + "</option>");             
        }
    }
}
