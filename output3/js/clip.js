[settings]
functionname = hi_adapter_cli_lsw_port_get_pausetime;
attributenum = 2;
attributeflag= 1;


[parameter]
attribute=alias<port>       type<uint>    range<0x0,0x7>              default<0>;
attribute=alias<time>       type<uint>    range<0x0,0xffff>           default<0>;

[help]
typedef struct
{
    hi_lsw_port_e  em_port;
    hi_uint32      ui_time;
}hi_lsw_port_pausetime_s;

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




    getAjaxData("api/settings/clip",function($xml){    
    var ret =  xml2object($xml);
    if(ret.type == "response")
    { 
        switch(ret.response.ClipMode){
            case CLIP_MODE_DTMF:
            case CLIP_MODE_FSK_ITU:
            case CLIP_MODE_FSK_BELL:
            case CLIP_MODE_FSK_RPAS:
                $("#select_clip_mode").val(ret.response.ClipMode);
                break;
           default:
                break;
        }
    }
    });
    button_enable("apply", 0);
}

function onModeChange(){
    button_enable("apply", 1);
}

$(document).ready(function(){
    initPage();
    $("#apply").click(function(){
        if(isButtonEnable('apply')){
            onApply();
        }
    });
    $("#select_clip_mode").bind("change", onModeChange);
});
