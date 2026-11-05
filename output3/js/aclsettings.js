[settings]
commandtype=0xF800581C;
attributenum=2;
displayattribute = 1 ;

[parameter]
attribute=alias<us_enable>        type<uint>   range<0x0,0x1>               default<0>;
attribute=alias<em_port>          type<uint>   range<0x0,0x7>                default<0>;


[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uchar8     uc_enable;
}hi_lsw_port_status_s;

/*端口号定义*/
typedef enum
{
    HI_LSW_PORT_GE0_E = 0,
    HI_LSW_PORT_FE1_E   = 1,
    HI_LSW_PORT_FE2_E   = 2,
    HI_LSW_PORT_FE3_E   = 3,
    HI_LSW_PORT_FE4_E   = 4,
    HI_LSW_PORT_PON_E   = 5,
    HI_LSW_PORT_CPU_E   = 6,
    HI_LSW_PORT_MAX_E,
}hi_lsw_port_e;

/* 用于某功能属性的使能 */
typedef enum
{
    HI_FALSE_E  = 0   , 
    HI_TRUE_E     
}HI_BOOL_E;




     $('#ftplan' ).get(0).checked = (acl_settings.FTPLanEnable == ENABLE) ? true : false;
            $('#ftpwan' ).get(0).checked = (acl_settings.FTPWanEnable == ENABLE) ? true : false;
        }
    });
}
function relate_ftpserver()
{
    var submitObject_ftpserver_enable = {
        Enable : $('#ftplan').get(0).checked ? 1 : 0
    };
    var ret_enable_ftpserver = '';
    var newXmlString_enable_ftpserver = object2xml('request', submitObject_ftpserver_enable);
    saveAjaxData("api/settings/ftpserverenable",newXmlString_enable_ftpserver,function($xml){   
    });
}

function setacls()
{
    g_acl_settings.HTTPLanEnable = $('#httplan').get(0).checked ? 1 : 0;
    g_acl_settings.HTTPWanEnable = 0;
    g_acl_settings.SSLLanEnable = $('#ssllan').get(0).checked ? 1 : 0;
    g_acl_settings.SSLWanEnable = $('#sslwan').get(0).checked ? 1 : 0;
    g_acl_settings.FTPLanEnable = $('#ftplan').get(0).checked ? 1 : 0;
    g_acl_settings.FTPWanEnable = $('#ftpwan').get(0).checked ? 1 : 0;

    relate_ftpserver();
    
    var acl_object = {
        AclServices : g_acl_settings
    };
    var acl_xml = object2xml("request", acl_object);
    saveAjaxData("api/settings/aclstatus",acl_xml,function($xml){
        var rsp =  xml2object($xml);
        if(isAjaxReturnOK(rsp)) {
            button_enable('apply', "0");
            parent.showInfoDialog(common_success);
            getstatus();
        }
        else {
            parent.showInfoDialog(common_failed);
        }
    });
}

$(document).ready(function(){
    $('#apply').click(function(){
        if(isButtonEnable('apply')){
            setacls();
        }
    });
    button_enable('apply', '0');
    $('input:checkbox').click(function() {
        button_enable('apply', '1');
    });
    getstatus();
});
