[settings]
commandtype      = 0xF80058B2 ;
attributenum     = 3 ;
displayattribute = 1 ;

[parameter]
attribute=alias<port>            type<uint>     range<0x0,0x7>                default<0>;
attribute=alias<mac>             type<mac>                                    default<00:00:00:00:00:00>;
attribute=alias<res>             type<ushort>    range<0x0,0x0>               default<0>;

[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uchar8     uc_mac[HI_LSW_MAC_LEN];
    hi_ushort16   res;
}hi_lsw_blackmac_s;

#define HI_LSW_MAC_LEN 6


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









mts=='0' && status_Eth=='0')
    {
        Label_status_Umts = hint_Status_redirect_Umts_Eth;
        Label_status_Eth = '';
        gotoPageWithoutHistory('login.html');
        return;
    }
    switch(status_Umts)
    {
        case '0':
                Label_status_Eth = "Error:No Redirect";
                break;
        case '1':
                gotoPageWithoutHistory('nocard.html');
                return;
        case '2':          
                gotoPageWithoutHistory('simlockrequired.html');
                return;
        case '3':
                gotoPageWithoutHistory('pincoderequired.html');
                return;
        case '4':
                gotoPageWithoutHistory('pukrequired.html');
                return;
        case '5':
                gotoPageWithoutHistory('no3g.html');
                return;
        case '6':
                gotoPageWithoutHistory('noprofile.html');
                return;
        case '7':
                gotoPageWithoutHistory('manual.html');
                return;
        case '8':
                gotoPageWithoutHistory('autoupdate.html');
                return;
        case '9':
                gotoPageWithoutHistory('autoupgrade.html');
                return;
        case '11':
                gotoPageWithoutHistory('roaming.html');
                return;
        case '12':
                gotoPageWithoutHistory('errorprofile.html');
                return;
    }
    
    switch(status_Eth)
    {
        case '0':
                Label_status_Eth = "Error:No Redirect";
                break;
        case '1':
                gotoPageWithoutHistory('nonetwork.html');
                break;
        case '2':
                gotoPageWithoutHistory('errorprofile.html');
                return;
        case '3':
                gotoPageWithoutHistory('manual.html');
                return;
    }
}

$(document).ready(function() {
    initPage();
    setLangList();
    showCurrentLanguage();
});
