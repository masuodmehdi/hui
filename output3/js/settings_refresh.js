[settings]
functionname=hi_kernel_misc_util_mdioattrset;  
attributenum=2;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<enable>       type<uint>   range<0,0xFFFFFFFF>    default<0x1>;
attribute=alias<baud_rate>    type<uint>   range<0,0xFFFFFFFF>    default<0x0>;

[help]
/*mdio 基本属性配置*/
typedef struct
{
    HI_BOOL_E em_enable;               //G174254: 待定
    HI_MDIO_BAUD_RATE_E em_baud_rate;   /*波特率*/
} hi_mdio_attr_s;

typedef enum
{
    HI_MDIO_BAUD_RATE_2M5_E = 0,                             /*波特率：2.5MHz*/
    HI_MDIO_BAUD_RATE_250K_E,                                /*波特率：250KHz*/
    HI_MDIO_BAUD_RATE_18M_E,                                 /*波特率：18MHz*/
} HI_MDIO_BAUD_RATE_E;
nt_href;
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
    if(false == parent.g_setting_click)
    {
    	clickMenu('menu_settings');
    }
}
function clickMenu(menu) {
    parent.g_setting_click = true;
    var getEls = $('.' + menu + ' li');
    $.each(getEls, function(i) {
        for(var i=0;i<getEls.length;i++){
            if($(getEls[i]).hasClass('nosubclick')){
                $(getEls[i]).removeClass('nosubclick');
                $(getEls[i]).addClass('nosub');
            }
        }
        $(this).click(function() {
            if ($(this).hasClass('sub') && $(this).hasClass('click')) {
                $(this).removeClass('click');
                return false;
            }
            else if ($(this).hasClass('nosub')) {
                $(getEls).removeClass('subClick');
                $(getEls).removeClass('click');
                $(this).addClass('nosubclick');
                return false;
            }
            else if ($(this).hasClass('sub')){
                $(getEls).removeClass('click');
                $(this).addClass('click');
                return false;
            }
            else {
                $(getEls).removeClass('nosubclick');
                $(getEls).removeClass('subClick');
                $(this).addClass('subClick');
                return false;
            }
        });
        $(this).mouseover(function() {
            $(this).addClass('menu_hover');
        });
        $(this).mouseout(function() {
            $(this).removeClass('menu_hover');
        });
    });
}