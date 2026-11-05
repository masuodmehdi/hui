[settings]
functionname = hi_adapter_cli_lsw_port_get_defvlan;
attributenum = 3;
attributeflag= 1;


[parameter]
attribute=alias<port>     type<uint>     range<0x0,0x7>         default<0>;
attribute=alias<vlan>     type<ushort>   range<0x0,0xfff>       default<0>;
attribute=alias<res>      type<ushort>   range<0x0,0x0>         default<0>;
[help]
typedef struct
{
    hi_lsw_port_e     em_port;
    hi_ushort16       us_vlan;
    hi_ushort16       us_res;
}hi_lsw_port_defvlan_s;

/*¶Ë¿ÚºÅ¶¨Òå*/
typedef enum
{
    HI_LSW_PORT_GE0_E   = 0,
    HI_LSW_PORT_FE1_E   = 1,
    HI_LSW_PORT_FE2_E   = 2,
    HI_LSW_PORT_FE3_E   = 3,
    HI_LSW_PORT_FE4_E   = 4,
    HI_LSW_PORT_PON_E   = 5,
    HI_LSW_PORT_CPU_E   = 6,
    HI_LSW_PORT_MAX_E,
}hi_lsw_port_e;



ockenable = retsult.response.Simlockstate
    },{sync :true});

}

function check_init_status()
{
    var retsult = null;
    getAjaxData('api/monitoring/status', function($xml) {
        retsult = xml2object($xml);
        if(MACRO_NO_SIM_CARD == retsult.response.SimStatus)
        {
            gotoPageWithoutHistory("nocard.html"+ window.location.search);
            return;
        }
    },{sync :true});
    
    getAjaxData("api/pin/status", function($xml) {
    var ret = xml2object($xml);
    if ('response' == ret.type)
    {
        if (MACRO_NO_SIM_CARD == ret.response.SimState)
        {
            gotoPageWithoutHistory("nocard.html"+ window.location.search);
        }        
        else if (MACRO_PUK_REQUIRED == ret.response.SimState)
        {
            gotoPageWithoutHistory('pukrequired.html'+ window.location.search);
        }
        else if (MACRO_PIN_REQUIRED == ret.response.SimState)
        {
            gotoPageWithoutHistory('pincoderequired.html'+ window.location.search);
        }
        else if (MACRO_CARD_LOCK_PIN_RIGNT == ret.response.SimState) 
        {
            gotoPageWithoutHistory('cardlock.html'+ window.location.search);
        }
        else if (MACRO_CARD_LOCK_PIN_WRONG == ret.response.SimState) 
        {
            gotoPageWithoutHistory('carderror.html'+ window.location.search);
        }
        else if (MACRO_INIT_SIM_CARD == ret.response.SimState)
        {
            setTimeout(check_init_status, LOOP_TIME);   
        }
        else
        {
            succeed_deal(); 
        }          
    }
    else
    {
        setTimeout(check_init_status, LOOP_TIME);  
    }
    });
}
function succeed_deal()
{
    if (('.html' == g_postfix) || ('' == g_postfix)) 
    {
        gotoPageWithoutHistory(LOGIN_PAGE_URL);
    }
    else 
    {
        gotoPageWithoutHistory(g_postfix);
    }
}
main_beforeready();
$(document).ready(function() {
    $('#card_init_leave').show();
    getsimlockstate();
    check_init_status();
    setLangList();
    showCurrentLanguage();
    g_is_login_opened = true;
    $('#card_init_leave').click(function() {        
        if (('.html' == g_postfix) || ('' == g_postfix)) 
        {
            gotoPageWithoutHistory(LOGIN_PAGE_URL);
        }
        else 
        {
            gotoPageWithoutHistory(HOME_PAGE_URL);
        }
    });
});
