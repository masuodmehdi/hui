[settings]
functionname = hi_adapter_cli_lsw_port_set_tag_act;
attributenum = 4;
attributeflag= 1;


[parameter]
attribute=alias<port>       type<uint>    range<0x0,0x7>                        default<0>;
attribute=alias<dir>        type<uint>    range<0x0,0x1>                        default<0>;
attribute=alias<tagtype>    type<uint>    range<0x0,0x2>                        default<0>;
attribute=alias<tagact>     type<uint>    range<0x0,0x11>                        default<0>;

[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uint32     ui_dir; /* 表示方向 */
    hi_uint32     ui_tagtype;
    hi_uint32     ui_tagact;
}hi_lsw_port_tag_act_s;

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

/* 方向定义 */
typedef enum 
{
    HI_LSW_IGR_TAG_ACT_E = 0,                                     /* 表示入口方向 */
    HI_LSW_EGR_TAG_ACT_E,                                     /* 表示出口方向*/
}hi_lsw_inout_e;

typedef enum 
{
    HI_LSW_TAG_ACT_E    = 0,                                     /* tag      动作 */
    HI_LSW_PRI_TAG_ACT_E,                                  /* pri tag 动作*/
    HI_LSW_UATAG_ACT_E,                                     /* untag  动作*/ 
}hi_lsw_tag_type_e;

typedef enum
{
    HI_LSW_TAG_NO_ACTION_E = 0,        
    HI_LSW_TAG_ADD_E,
    HI_LSW_TAG_DEL_E,    
    HI_LSW_TAG_DROP_E,
    HI_LSW_TAG_DEFAULT_DROP_E,
    HI_LSW_TAG_REP_OUTER_DEFAULT_E,     
    HI_LSW_TAG_REP_OUTER_TRANS_DROP_E, 
    HI_LSW_TAG_REP_OUTER_TRANS_TRUE_E,
    HI_LSW_TAG_CHECK_E,  
    HI_LSW_TAG_SWITCH_E, 
    HI_LSW_TAG_HYBRID_E,
    HI_LSW_TAG_ACT_NUM_E,
}hi_lsw_tag_act_e; }
    }, {sync: true});
    
    addwanpath();
    getAjaxData('api/security/dmz', function($xml){
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if(typeof(ret.response.Dmzs) != 'undefined'){
                g_dmzData = ret.response.Dmzs.Dmz;
                if(g_dmzData){
                    g_dmzList = [];
                    if($.isArray(g_dmzData)){
                        g_dmzList= g_dmzData;
                    }else{
                        g_dmzList.push(g_dmzData);
                    }
                 }

                if(0 < g_dmzList.length){
                    setDmzInfo(0);
                   $('#dmz_wanpath').change(function(){setDmzInfo(this.value);});
                }else{
                   $("input[name='dmz_status'][value='1']").attr('checked', true);
                   $('#dmz_ip_address').val(g_dhcpData.DhcpIPAddress.substring(0, g_dhcpData.DhcpIPAddress.lastIndexOf('.') + 1));
                    updateDmzRadioStatus();
                }
            }
        }
    });
}

function addwanpath()
{ 
    getAjaxData('api/settings/ddns-wanpath', function($xml) {
    var ret = xml2object($xml);
    var newline = "";
    var wanpath;
    if(ret.type =="response"){
        if(typeof(ret.response.WanPaths)!='undefined' && typeof(ret.response.WanPaths.WanPath)!='undefined') {
            wanpath = ret.response.WanPaths.WanPath;
            $("#dmz_wanpath option").remove();
            var i=0;
            if ($.isArray(wanpath)){
                for(i=0;i<wanpath.length;i++){
                    newline += "<option value='"+wanpath[i].WanPathValue+"'>"+wanpath[i].WanPathName+"</option>";                 
                }                  
            } 
            else {
                newline += "<option value='"+wanpath.WanPathValue+"'>"+wanpath.WanPathName+"</option>";                  
            }
            if(""!=newline){  
                $('#dmz_wanpath').append(newline);
            } 
        }                 
    } 
    else {
        return;
    }
    },{sync: true});
}

function isSameBeforThreeAddrs(ip1,ip2){
    var addrParts1 = ip1.split(".");
    var addrParts2 = ip2.split(".");
    for (i = 0; i < 3; i++) 
    {
        if ((Number(addrParts1[i]))  != (Number(addrParts2[i])) ) 
        {
            return false;
        }
    }
    return true;
}
function validateDmz() {
    var dmzIP = $('#dmz_ip_address').val();
    var checkIPResult = isValidIpAddress(dmzIP);
    if (false == checkIPResult) {
        showErrorUnderTextbox('dmz_error', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    if (false == isSameBeforThreeAddrs(dmzIP, g_dhcpData.DhcpIPAddress))
    {
        showErrorUnderTextbox('dmz_ip_address', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    if (false == isBroadcastOrNetworkAddress(dmzIP, g_dhcpData.DhcpLanNetmask)) {
        showErrorUnderTextbox('dmz_error', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    if (dmzIP == g_dhcpData.DhcpIPAddress) {
        showErrorUnderTextbox('dmz_error', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    return true;
}

function apply() {
    clearAllErrorLabel();
    if (!isButtonEnable('apply_button'))
    {
        return;
    }
    var dmz_status = $("[name='dmz_status']:checked").val();
    var dmz_ipaddress = $('#dmz_ip_address').val();
    //var dmz_wanpath = $('#dmz_wanpath').val();
    var dmz_wanpath = g_dmzList[0].WanPath;
    var dmzData_submit = {
        'Dmz':{
            'WanPath' : dmz_wanpath,
            'DmzStatus' : dmz_status
        }
    };
    if('1' == dmz_status){
        if(!validateDmz()){
            return;
        }
        dmzData_submit.Dmz.DmzIPAddress = dmz_ipaddress;
      }
    var xmlstr = object2xml('request', dmzData_submit);
    saveAjaxData('api/security/dmz', xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            parent.showInfoDialog(common_success);
	    button_enable('apply_button', '0');
        }
        else {
            button_enable('apply_button', '1');
            parent.showInfoDialog(common_failed);
        }
            initPage();
    });
}
$(document).ready(function() {
    $('input').bind('change input paste cut keydown', function() {
        button_enable('apply_button', '1');
    });
    $('select').bind('change', function() {
        button_enable('apply_button', '1');
    });
    $("[name='dmz_status']").click(function() {
        updateDmzRadioStatus();
    });
    $("#apply_button").click(function() {
        apply();
    });
    button_enable('apply_button', '0');
    initPage();
});