[settings]
functionname=hi_kernel_misc_util_writephymem;  
attributenum=3;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<addr>          type<uint>   range<0,0xFFFFFFFF>   default<0x13d00000>;
attribute=alias<len>          type<uint>   range<0,0xFFFFFFFF>    default<4>;
attribute=alias<data>         type<uint>   range<0,0xFFFFFFFF>    default<0>;

[help]
phymw -v addr 0x16149000 len 4 data 0
typedef struct
{
    hi_uint32 ui_addr;
    hi_uint32 ui_len;
    hi_void  *pv_data;必须预先分配足够内存
}hi_kernel_sd5113_mem_s;"";
            g_name = "inbox";
        } 
    }
}

function showHtml(){
    if('messagesettings' == g_name)
    {
        $("#show_html").attr("src",g_name+".html" + URL_PAGE_TAIL);
    }
    g_href = current_href;
    g_sub = g_sub;
    g_name = g_name;
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
        $("#"+name).removeClass('nosub');
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
    else if(g_href == 'sms'){
        id = 'menu_sms';
    }
    return id;
}
$(document).ready(function() {
    if($.browser.mozilla)
    {
        g_time = 100;
    }
    setTimeout(function(){
        getRefresh();
        showHtml();
        $.cookies.set('cookie', g_href+","+g_sub+","+g_name, { expiresAt: new Date().getTime()+5*60*1000 });
        showMenu(changeMenu(),g_name);
    },g_time);
});