[settings]
functionname = hi_adapter_cli_lsw_vlan_add_port;
attributenum = 3;
attributeflag= 1;

[parameter]
attribute=alias<port>     type<uint>     range<0x0,0x7>         default<0>;
attribute=alias<vlan>     type<ushort>   range<0x0,0xfff>       default<0>;
attribute=alias<res>      type<ushort>   range<0x0,0x0>         default<0>;
[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_ushort16   us_vlan;
    hi_ushort16   us_res;
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




  }
            else
            {}
        }
    });
}
$(document).ready(function(){
    initPage();
    $("#light_button_turn").live("click",function(){       
        var status_set = { 
            offled : g_led_light_status == led_light_off? led_light_on:led_light_off
        }; 
        var req = object2xml("request",status_set); 
        saveAjaxData("api/settings/offled",req,function($xml){ 
            var ret = xml2object($xml); 
            if(isAjaxReturnOK(ret)){
                parent.showInfoDialog(common_success);         
            } 
            else { 
                parent.showInfoDialog(common_failed);
            }
            initPage();
        }); 
    });  
});
