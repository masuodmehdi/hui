[settings]
functionname=hi_kernel_misc_util_inner_mdioread;  
attributenum=4;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<phy_addr>     type<uint>   range<0,0xFFFFFFFF>    default<0x0>;
attribute=alias<reg_addr>     type<uint>   range<0,0xFFFFFFFF>    default<0x0>;
attribute=alias<data>    	  type<short>  range<0,0xFFFF>        default<0x0>;
attribute=alias<resv>         type<short>  range<0,0xFFFF>  	  default<0x0>;

[help]
typedef struct{
    hi_uint32   ui_phy_addr;
    hi_uint32   ui_reg_addr;
    hi_ushort16 us_data;
    hi_ushort16 us_resv;
}hi_kernel_mdio_data_s;
       g_name = "connections";
            }
        } else {
            g_sub = objValue[1];
            g_name = objValue[2];
        }
    } else {
        if(g_href == "setting"){
            g_sub = "";
            g_name = "quicksetup";
        } else if(g_href == "maintenance"){
            g_sub = "";
            g_name = "logview";
        } else if(g_href == "connectionstatus"){
            g_sub = "";
            g_name = "connections";
        }
    }
}

function showHtml(){
    if(current_href == g_href){
        $("#show_html").attr("src",g_name+".html" + URL_PAGE_TAIL);
        g_href = current_href;
        g_sub = g_sub;
        g_name = g_name;
    } else {
        if(current_href == "setting"){
            $("#show_html").attr("src","quicksetup.html" + URL_PAGE_TAIL);
            g_href = current_href;
            g_sub = "";
            g_name = "quicksetup";
        } 
        else if(current_href == "inbox"){
            $("#show_html").attr("src","inbox.html" + URL_PAGE_TAIL);
            g_href = current_href;
            g_sub = "";
            g_name = "inbox";
        }
    }
}
function showMenu(menu,name) {
    var sub = [];
    var getEls = $('.' + menu + ' li');
    $.each(getEls, function(i) {
        if($(getEls[i]).hasClass('nosubclick')){
            $(getEls[i]).removeClass('nosubclick');
            $(getEls[i]).addClass('nosub');
        }
        if($(getEls[i]).hasClass('click')){
            $(getEls[i]).removeClass('click');
        }
        if($(getEls[i]).hasClass('subClick')){
            $(getEls[i]).removeClass('subClick');
        }
        if($(getEls[i]).hasClass('sub')||$(getEls[i]).hasClass('nosub')){
            var str = getEls[i].id;
            sub.push(str);
        }
    });
    var i;
    for(i = 0;i<sub.length;i++){
        $("#"+sub[i]).click(function() {
            if($(this).hasClass('sub')){
                g_sub = this.id;
            } else {
                g_sub = "";
            }
        });
    }
    if(g_sub!=""){
        $("#"+g_sub).addClass('click');
    } 
    if ($("#"+name).hasClass('nosub')) {
        $(getEls).removeClass('subClick');
        $(getEls).removeClass('click');
        $("#"+name).addClass('nosubclick');
    }
    else if ($("#"+name).hasClass('sub')) {
        $(getEls).removeClass('click');
        $("#"+name).addClass('click');
    }
    else {
        $(getEls).removeClass('subClick');
        $("#"+name).addClass('subClick');
    }
    $("#"+name).mouseover(function() {
        $("#"+name).addClass('menu_hover');
    });
    $("#"+name).mouseout(function() {
        $("#"+name).removeClass('menu_hover');
    });
}
function changeMenu(){
    var id = '';
    if(g_href == 'setting'){
        id = 'menu_settings';
    }
    else if(g_href == 'maintenance'){
        id = 'menu_maintenance';
    }
    else if(g_href == 'connectionstatus'){
        id = 'menu_connection';
    }
    return id;
}
$(document).ready(function() {
    
    setTimeout(function(){
        getRefresh();
        showHtml();
        $.cookies.set('cookie', g_href+","+g_sub+","+g_name, { expiresAt: new Date().getTime()+5*60*1000 });
        showMenu(changeMenu(),g_name);
    },g_time);
});