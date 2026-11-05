[settings]
functionname = hi_adapter_cli_lsw_vlan_get_vlanbcegr;
attributenum = 3;
attributeflag= 1;

[parameter]
attribute=alias<vlan>        type<ushort>   range<0x0,0xfff>              default<0>;
attribute=alias<res>         type<ushort>   range<0x0,0x0>                default<0>;
attribute=alias<portmap>     type<uint>     range<0x0,0xffffffff>         default<0>;

[help]
typedef struct
{
    hi_ushort16 us_vlan;
    hi_ushort16 us_res;
    hi_uint32   ui_portmap; /*以bit位形式表示，为1则表示该端口在此vlan中*/
}hi_lsw_vlan_get_port_s;

/*端口号定义*/
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




log +"\n";
                g_display_level = res.response.DisplayLevel;
                $("#show_log_area").val(g_save_loginfo);
            }
        }
        
    },{
        sync : true
    });
}

/*---------------------get config data---------------------------*/
function getConfigLevel(){
    getConfigData("config/log/config.xml",function($xml){
        var ret = xml2object($xml);
        var html = "";
        var i = 0;
        for(;i<ret.config.Level.length;i++){
            html += "<option value = '"+ret.config.Level[i]+"'>"+eval(LEVEL_PREFIX+ret.config.Level[i])+"</option>"; 
        }
        $("#level_display_select").append(html);
    },{
        sync : true
    });
}

function getData(){
    var submitObject = null;
    if($('#enable_log').attr('checked')){
        submitObject = {
            LogEnable : log_enable,
            LogLevel : $('#log_level').attr("value"),
            LogServer : 0
         };
    }
    else {
        submitObject = {
            LogEnable : log_disable
        };
    }
    return submitObject;
}


/*------------------function ready---------------------*/
$(document).ready(function(){
    getConfigLevel();
    button_enable("apply",0);
        
    $("#level_display_select,#log_level,#enable_log").bind("change",function(){
        button_enable("apply",1);
    });
    getNewLog();
    if(g_display_level != "") {
        $("#level_display_select").val(g_display_level);
    }
    
    $("#apply").click(function(){
        if(isButtonEnable("apply")){
            var status = "1";
            if($('#enable_log').attr('checked'))
            {
                status = "0";
            }
            var submitObject_Amss_Reboot = 
            {
                Status : status
            };
            var newXmlString = object2xml('request', submitObject_Amss_Reboot);
            saveAjaxData("api/settings/amss-reboot",newXmlString,function($xml){   
            });
            var b_setLoginfo = false;
            var newXmlString = object2xml('request', getData());
            saveAjaxData('api/settings/log-info', newXmlString, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    b_setLoginfo = true;       
                }else{
                    parent.showInfoDialog(common_failed);
                }
            },{
                sync: true
            });

            if(false==b_setLoginfo)
            {
               return;
            } 
            var apply_level =  {
                Display : $("#level_display_select").val()
            };
            var req = object2xml("request",apply_level);
            saveAjaxData("api/settings/displaylevel",req,function($xml){
                var ret = xml2object($xml);
                if(isAjaxReturnOK(ret)){
                    button_enable("apply",0);
                    parent.showInfoDialog(common_success);
                    g_save_loginfo = "";
                    getNewLog();
                }
                else {
                    parent.showInfoDialog(common_failed);
                }
            },{
                sync: true
            });
        }
    });
});
