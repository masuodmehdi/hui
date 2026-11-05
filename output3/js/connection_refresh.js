[settings]
functionname = hi_adapter_cli_lsw_port_get_stp;
attributenum = 1;
attributeflag= 1;

[parameter]
attribute=alias<stp>       type<uint>    range<0x0,0x2>                            default<0>;

[help]
typedef enum
{
    HI_LSW_GLB_ETH_NOSTP_E = 0,
    HI_LSW_GLB_ETH_STP,
    HI_LSW_GLB_ETH_RSTP,
}hi_eth_stp_mode_e;

;
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
			name = "log";
		}
		else if(current_href == "connectionstatus"){
			$("#show_html").attr("src","connection.html" + URL_PAGE_TAIL);
			href = current_href;
			g_sub = "";
			name = "connections";
		}
	}
	$.cookies.set('cookie', href+","+g_sub+","+name, { expiresAt: new Date().getTime()+5*60*1000 });
    clickMenu('menu_connection');
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