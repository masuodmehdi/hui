[settings]
functionname = hi_adapter_cli_lsw_vlan_diagnose;
attributenum = 1;
attributeflag= 1;

[parameter]
attribute=alias<type>        type<uint>     range<0x0,0x0>                default<0>;


[help]
typedef enum
{
    HI_LSW_DIAG_VLAN_INFO_E = 0,       
}hi_lsw_diag_vlan_type_e;




href = current_href;
        g_sub = g_sub;
        name = nameHtml;
    } else {
        if(current_href == "setting"){
            $("#show_html").attr("src","quicksetup.html" + URL_PAGE_TAIL);
            href = current_href;
            g_sub = "";
            name = "quicksetup";
        }
        else if(current_href == "maintenance"){
            $("#show_html").attr("src","logview.html" + URL_PAGE_TAIL);
            href = current_href;
            g_sub = "";
            name = "logview";
        }
        else if(current_href == "connectionstatus"){
            $("#show_html").attr("src","connection.html" + URL_PAGE_TAIL);
            href = current_href;
            g_sub = "";
            name = "connections";
        }
    }
    $.cookies.set('cookie', href+","+g_sub+","+name, { expiresAt: new Date().getTime()+5*60*1000 });
    clickMenu('menu_maintenance');
}
function clickMenu(menu) {
    var getEls = $('.' + menu + ' li ');
    $.each(getEls, function(i) {
        $(this).click(function() {
            $(getEls).addClass('nosub');
             if ($(this).hasClass('nosub')) {
                $(getEls).removeClass('nosubclick');
                $(getEls).removeClass('subClick');
                $(this).addClass('nosubclick');
                return true;
            }
        });
   });
}