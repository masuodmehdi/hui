[settings]
functionname = hi_adapter_cli_lsw_vlan_set_vlanfilter;
attributenum = 4;
attributeflag= 1;

[parameter]
attribute=alias<port>            type<uint>    range<0x0,0x7>                default<0>;
attribute=alias<enable>          type<uchar>   range<0x0,0x1>                default<0>;
attribute=alias<res>             type<uchar>   range<0x0,0x0>                default<0>;
attribute=alias<res2>            type<ushort>  range<0x0,0x0>                default<0>;

[help]
typedef struct
{
    hi_lsw_port_e  em_port;
    hi_uchar8      uc_enable;
    hi_uchar8      uc_res;
    hi_ushort16    us_res1;
}hi_lsw_port_status_s;

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


 NETWORKMODES = {  
    14: plmn_label_3g,  
    38: plmn_label_4g,
    54: common_auto
};
var g_setting_netWorkModeList = [[54, NETWORKMODES[54]],[14, NETWORKMODES[14]], [38, NETWORKMODES[38]]]; //default mode

var g_device_name = "";

function convert_mapping_65(value)
{
    if(g_device_name=="B890-65")
    {
        if(value=='54')
        {
            return "65";
        }
        else if(value=="14")
        {
            return "59";
        }
        else
        {
            return value;
        }
    }
    else
    {
        return value;
    }   
}
function convert_65_mapping(value)
{
    if(g_device_name=="B890-65")
    {
        if(value=='65')
        {
            return "54";
        }
        else if(value=="59")
        {
            return "14";
        }
        else
        {
            return value;
        }
    }
    else
    {
        return value;
    }   
}

var networkBandList = [];
function setting_dialup_getNetworkBand(device_name) {
    var band_list = '';
    var default_band_list = ''; 
    var networkband_conf_file = 'config/network/networkband_' + device_name + '.xml';// device_name;

    getConfigData(networkband_conf_file, function($xml)
    {
        var ret = xml2object($xml);
        if (ret.type == 'config')
        {
            if(typeof(ret.config.NetworkBands) != "undefined") 
            {
                g_networkband.NetworkBands = ret.config.NetworkBands;
            }
        }
    },{
        sync : true,
        errorCB:function(){
            setting_dialup_getNetworkBand("B890-66");
        }
    });
}

function get_allband()
{
    var networkband = "";
    var wcdma_val = g_networkband.NetworkBands.Bands3G;
    var lte_val = g_networkband.NetworkBands.Bands4G;
    
    for(var i=wcdma_val.length;i<16;i++)
    {
        wcdma_val = "0" + wcdma_val;
    }
    if(54 == $('#preferred_mode_select').val())
    {
        networkband = lte_val.concat(wcdma_val) ;
    }
    else if(14 == $('#preferred_mode_select').val())
    {
        networkband = wcdma_val;
    }
    else
    {
        networkband = lte_val + "0000000000000000";
    }
    return networkband;
}

//a method includ 3 function
function setting_dialup_initVar() {
    this.getNetwork = function()
    {
        getAjaxData('api/net/network', function($xml)
        {
            var ret = xml2object($xml);
            if (ret.type == 'response')
            {
                var temp_netband = '';
                g_setting_netWork.NetworkMode = ret.response.NetworkMode;
                temp_netband = ret.response.NetworkBand;
                while('0' == temp_netband.charAt(0))
                {
                    temp_netband = temp_netband.substring(1);
                }
                g_setting_netWork.NetworkBand = temp_netband;

               setTimeout(function() {
                    $('#preferred_mode_select').val(convert_65_mapping(g_setting_netWork.NetworkMode));
                    },1);
                }
        },
        {
            sync:true,
            errorCB: function()
            {
                log.error('MOBILENETWORKSETTING:get api/net/network file failed');
            }
        });
    }; //function 1 end

    this.getInfomation = function()
    {
        if(networkband_enable)
        {
            getAjaxData('api/device/information', function($xml)
            {
                var device_ret = xml2object($xml);
                var device_name = null;
                if (device_ret.type == 'response')
                {
                    device_name = getDeviceType(device_ret.response.DeviceName);
                    g_device_name = device_name;
                    setting_dialup_getNetworkBand(device_name);
                }
                else
                {
                     log.error('MOBILENETWORKSETTING:get api/device/infomation data error');
                }
            },
            {
                sync:true,
                errorCB: function()
                {
                    log.error('MOBILENETWORKSETTING: get api/device/infomation file failed');
                }
            });
        }       
    };

    this.getRegister = function()
    {
        getAjaxData('api/net/register', function($xml)
        {
            var ret = xml2object($xml);
            if (ret.type == 'response')
            {
                g_setting_register.Mode = parseInt(ret.response.Mode, 10);
                g_setting_register.Plmn = ret.response.Plmn;
                g_setting_register.Rat = ret.response.Rat;
                setTimeout(function() {
                    $('#network_select').val(g_setting_register.Mode);
                    if(g_setting_register.Mode == "1")
                    {
                        button_enable("mobilensetting_apply", 1)
                    }
                },1);
            }
            else
            {
                log.error('MOBILENETWORKSETTING:get api/net/register data error');
            }
        },
        {
            errorCB: function()
            {
                log.error('MOBILENETWORKSETTING:get api/net/register file failed');
            }
        });
    };
}

var g_myInitVar = new setting_dialup_initVar();  //new  a method

function getNetworkConfig() {
    getConfigData('config/network/networkmode.xml', function($xml) {
        var tempMode = [];
        var ret = xml2object($xml);
        if (ret.type == 'config')
        {
            if (ret.config.networkband_enable == '0')
            {
                 networkband_enable = false;
            }
            if (ret.config.NetworkModes.Mode)
            {
                ret = ret.config.NetworkModes.Mode;
                if ($.isArray(ret))
                {
                   tempMode = ret;
                }
                else
                {
                    tempMode.push(ret);
                }
                g_setting_netWorkModeList = [];
                $.each(tempMode, function(n, value)
                {
                    value = parseInt(value, 10);
                    if (value >= 0 && value <= 54)
                    {
                            g_setting_netWorkModeList.push([value, NETWORKMODES[value]]);
                    }
                });
            }
        }
    },
    {
        sync: true
    });
}

//    save user selected network (include mode and band)
function setting_dialup_saveVar() {

    if(typeof(g_networkband.NetworkBands.Bands3G) == 'undefined' 
      || typeof(g_networkband.NetworkBands.Bands4G) == 'undefined' )
    {
        parent.showInfoDialog(connection_label_bandnull_error);
        return;
    }
    g_setting_netWork.NetworkBand = get_allband();
    var submitObject = {
        NetworkMode:convert_mapping_65(g_setting_netWork.NetworkMode),
        NetworkBand:g_setting_netWork.NetworkBand
    };
    parent.showWaitingDialog(common_waiting,common_waiting);
    var xmlstr = object2xml('request', submitObject);
    saveAjaxData('api/net/network', xmlstr, function($xml)
    {   
        parent.closeWaitingDialog();
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            button_enable('network_apply', '0');
            parent.showInfoDialog(common_success);
        }
        else
        {
            parent.showInfoDialog(common_failed);
            button_enable('network_apply', '1');
        }
    },
    {
        errorCB: function()
        {
            parent.closeWaitingDialog();
            parent.showInfoDialog(common_failed);
        }
    });
}

function setting_dialup_registerNetMode(mode) {
   
    if (SETTING_DIALUP_AUTO_SEARCH_NET == mode)
    {
        g_setting_register.Plmn = '';
        g_setting_register.Rat = '';
        var xmlstr = object2xml('request', g_setting_register);
        saveAjaxData('api/net/register', xmlstr, function($xml)
        {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret))
            {
                parent.showInfoDialog(common_success);
                button_enable('mobilensetting_apply', '1');
            }
            else
            {
                parent.showInfoDialog(common_failed);
                button_enable('mobilensetting_apply', '1');
            }
            g_myInitVar.getRegister();
        });
        return;
    }

    parent.showWaitingDialog_network(common_waiting, IDS_dialup_label_searching_network);
    getAjaxData('api/net/plmn-list', function($xml)
    {
        var ret = xml2object($xml);
        g_plmn_list = [];
        if (ret.type == 'response')
        {
            if (ret.response.Networks.Network)
            {
                if ($.isArray(ret.response.Networks.Network))
                {
                    g_plmn_list = ret.response.Networks.Network;
                }
                else
                {
                    g_plmn_list.push(ret.response.Networks.Network);
                }
            }
            setting_dialup_showPlmnList(g_plmn_list);
        }
        else
        {
            parent.startLogoutTimer();
            parent.closeWaitingDialog();
            parent.showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:get api/net/plmn-list data error');
            button_enable('mobilensetting_apply', '1');
        }
    },
    {
        timeout: 120000,
        errorCB: function(XMLHttpRequest, textStatus)
        {
            parent.startLogoutTimer();
            parent.closeWaitingDialog();
            var errorInfo = ('timeout' == textStatus) ? common_timeout : common_failed;
            parent.showInfoDialog(errorInfo);
            log.error('MOBILENETWORKSETTING:get api/net/plmn-list file failed');
            button_enable('mobilensetting_apply', '1');
        }
    });
    }
    //
function setting_dialup_setNetMode(numeric, rat) {
    g_setting_register[network_setting_plmn] = numeric;
    g_setting_register[network_setting_rat] = rat;
}
//

function setting_dialup_menuNetMode(mode) {
    switch (mode)
    {
        case SETTING_DIALUP_AUTO_SEARCH_NET:
            g_setting_register.Mode = mode;
            $('#network_select').val(mode);
            break;
        case SETTING_DIALUP_MANUAL_SEARCH_NET:
            g_setting_register.Mode = mode;
            $('#network_select').val(mode);
            break;
        default:
            break;
    }
}
//
function setting_dialup_searchAndRegister(mode) {
    if (mode == SETTING_DIALUP_MANUAL_SEARCH_NET)  // to search
    {
        parent.cancelLogoutTimer();
        g_setting_register.Plmn = '';
        g_setting_register.Rat = '';
        parent.showWaitingDialog_network(common_waiting, common_searching);
    }

    if (mode == null)                            // to g_setting_register
    {
        parent.showWaitingDialog_network(common_waiting, setting_label_registering_network);
    }

    xmlstr = object2xml('request', g_setting_register);
    saveAjaxData('api/net/register', xmlstr, function($xml)
    {
        var ret = xml2object($xml);
        if (ret.type == 'response') //setting success
        {
            //(auto / manual)
            if (isAjaxReturnOK(ret))//(true)//
            {
                switch (mode)
                {
                    case SETTING_DIALUP_MANUAL_SEARCH_NET:      //amnual
                        setting_dialup_registerNetMode();
                        break;
                    case SETTING_DIALUP_AUTO_SEARCH_NET:        //auto
                        parent.showInfoDialog(common_success);
                        break;
                    default:
                        parent.startLogoutTimer();
                        parent.closeWaitingDialog();
                        parent.showInfoDialog(common_success);         //register
                        //myInitVar.getRegister();
                        setting_dialup_getCurrPlmn();
                        break;
                }
                button_enable('mobilensetting_apply', '1');
            }//return ok
            else // setting falid
            {
                parent.startLogoutTimer();
                parent.closeWaitingDialog();
                parent.showInfoDialog(common_failed);
                g_myInitVar.getRegister();
                button_enable('mobilensetting_apply', '1');
                log.error('MOBILENETWORKSETTING:post api/net/register not return OK');
            }
        }
        else  //seetting error
        {
            parent.startLogoutTimer();
            parent.closeWaitingDialog();
            parent.showInfoDialog(common_failed);
            g_myInitVar.getRegister();
            button_enable('mobilensetting_apply', '1');
            log.error('MOBILENETWORKSETTING:post api/net/register data error');
        }
    },
    {
        timeout: 120000,  // 2 minutes
        //sync:true,
        errorCB: function(XMLHttpRequest, textStatus)
        {
            parent.startLogoutTimer();
            parent.closeWaitingDialog();
            var errorInfo = ('timeout' == textStatus) ? common_timeout : common_failed;
            parent.showInfoDialog(errorInfo);
            g_myInitVar.getRegister();
            button_enable('mobilensetting_apply', '1');
            log.error('MOBILENETWORKSETTING:post api/net/register file failed');
        }
    });
}

//api/net/current-plmn
function setting_dialup_getCurrPlmn() {
    getAjaxData('api/net/current-plmn', function($xml)
    {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            $('#current_plmn').css({display: 'none'});
        }
        else
        {
        }
    },
    {
        errorCB: function()
        {
        }
    });
}

//pop ok button click
function popok_button() {
    if(g_plmn_list.length > 0) {
        if (!isButtonEnable('pop_OK'))
        {
            return;
        }
        parent.$('#div_wrapper,.dialog').hide();
        var index = parent.$('#plmn_list :checked').val();
        setting_dialup_setNetMode(g_plmn_list[index].Numeric, g_plmn_list[index].Rat);
        setting_dialup_searchAndRegister(null);
    }
    else {
        parent.$('#div_wrapper,.dialog').hide();
        parent.startLogoutTimer();
        g_myInitVar.getRegister();
    }
}

//cancel click
function cancel_button() {
    parent.$('#div_wrapper,.dialog').hide();
    button_enable('mobilensetting_apply', '1');
    parent.startLogoutTimer();
}

function setting_dialup_showPlmnList(plmnList) {
    parent.closeWaitingDialog();
    parent.call_dialog(setting_label_listing_network, "<table id='plmn_list' class='plmn_list'></table>", common_ok, 'pop_OK', common_cancel, 'pop_Cancel',popok_button,cancel_button);
    var plmn_li_list = [];
    if (plmnList.length > 0)
    {
        var ifChecked = '';
        $.each(plmnList, function(n, value)
        {
            var plmnState = null;
            var Rat_Status = null;
            switch (value.State)
            {
                case PLMN_USABLE:
                    plmnState = plmn_label_usable;
                    break;
                case PLMN_REGISTERED:
                    plmnState = plmn_label_registered;
                    break;
                case PLMN_FORBIDDEN:
                    plmnState = plmn_label_forbidden;
                    break;
                default:
                    plmnState = common_unknown;
                    break;
            }

            switch(value.Rat)
            {
                case SETTING_DIALUP_RAT_2G:
                    Rat_Status = plmn_label_2g;
                    break;
                case SETTING_DIALUP_RAT_3G:
                    Rat_Status = plmn_label_3g;
                    break;
                case SETTING_DIALUP_RAT_4G:
                    Rat_Status = plmn_label_4g;
                    break;
                default:
                    Rat_Status = common_unknown;
                    break;
            }
            
            if (plmnState == plmn_label_registered)
            {
                ifChecked = network_isChecked;
            }
            else
            {
                ifChecked = '';
            }
            plmn_li_list += "<tr><td ><input type = 'radio' name='netMode' value = '" + n + "' " + ifChecked + " id='netMode_" + n + "'></td>"
                        + "<td ><span id ='netMode_" + n + "'>" + value.ShortName + ' '
                        + "</span><span id ='RatMode_" + n + "'>" + Rat_Status + ' '
                        + "</span><span id ='UseMode_" + n + "'>(" + plmnState +")</label></td></tr>";
        });
    }
    else
    {
        plmn_li_list = '<tr><td>' + setting_label_no_network + '</td></tr>';
        parent.$('#pop_Cancel').hide();
        button_enable('mobilensetting_apply', '1');
    }
    parent.$('#plmn_list').append(plmn_li_list);
    
    parent.$("#netMode_0").attr("checked",true);
    
    parent.$('.dialog_close_btn').bind('click', function()
    {
        parent.$('#div_wrapper,.dialog').hide();
        button_enable('mobilensetting_apply', '1');
        parent.startLogoutTimer();
    });
    //reputPosition(parent.$('#sms_dialog'), parent.$('#div_wrapper'));
}

function getDeviceType(deviceName)
{
    var szTmp = deviceName.split('-');
    var deviceType = null;
    deviceType = deviceName.match(/[a-zA-Z]+\d+/);
    if (2 == szTmp.length)
    {
        deviceType = deviceType + '-' + szTmp[1];
    }
    return deviceType;
}

function match_plmn_name() {
    getAjaxData('api/net/current-plmn', function($xml) {
        var currently_plmn = null;
        var current_plmn_ret = xml2object($xml);
        if (current_plmn_ret.type == 'response')
        {
            currently_plmn = current_plmn_ret;
        }
    },
    {
        sync: true
    });
}
function setting_dialup_initSelectOption() {
    var mode_list = '';
    $.each(g_setting_netWorkModeList, function(n, value) {
        mode_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
        $('#preferred_mode_select').append(mode_list);
        });
    $('#preferred_mode_select').change(function() {
        g_setting_netWork.NetworkMode = $('#preferred_mode_select').val();
        button_enable('network_apply', '1');
    });
    var netWork_list = '';
    var searchNetWorkModeList = [[SETTING_DIALUP_MANUAL_SEARCH_NET, common_manual], [SETTING_DIALUP_AUTO_SEARCH_NET, common_auto]];
    $.each(searchNetWorkModeList, function(n, value) {
    netWork_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
    $('#network_select').append(netWork_list);
    });

    $('#network_select').change(function() {
        match_plmn_name();
        button_enable('mobilensetting_apply', '1');
        setting_dialup_menuNetMode(parseInt(this.value, 10));
    });
}


redirectOnCondition(null, 'setting');
$(document).ready(function() {
    button_enable("network_apply",0);
    button_enable('mobilensetting_apply','0');
    getNetworkConfig();
    g_myInitVar.getNetwork();
    g_myInitVar.getInfomation();
    g_myInitVar.getRegister();
    setting_dialup_initSelectOption();
    $("#mobilensetting_apply").bind("click",function(){
        
        if(!isButtonEnable("mobilensetting_apply")) {
            return;
        }
        var dialupStatus = parent.G_MonitoringStatus.response.ConnectionStatus;
        var ipv6dialupStatus = parent.G_MonitoringStatus.response.X_IPv6ConnectionStatus;
        var connectionIsUnFree = (          
            MACRO_CONNECTION_CONNECTED == dialupStatus ||           
            MACRO_CONNECTION_IPV6CONNECTED == ipv6dialupStatus    
            );
        if (connectionIsUnFree)
        {
            parent.showConfirmDialog(label_hint_operation_terminate_connection, 
                function() {setting_dialup_registerNetMode(g_setting_register.Mode);},
                function() {}
            );
        }
        else
        {
            setting_dialup_registerNetMode(g_setting_register.Mode);
        }              
    });
    $('#network_apply').bind('click', function()
    {       
        if (!isButtonEnable('network_apply'))
        {
            return;
        }
        var dialupStatus = parent.G_MonitoringStatus.response.ConnectionStatus;
        var ipv6dialupStatus = parent.G_MonitoringStatus.response.X_IPv6ConnectionStatus;
        var connectionIsUnFree = (          
            MACRO_CONNECTION_CONNECTED == dialupStatus ||           
            MACRO_CONNECTION_IPV6CONNECTED == ipv6dialupStatus    
            );
        if (connectionIsUnFree)
        {
            parent.showConfirmDialog(label_hint_operation_terminate_connection, setting_dialup_saveVar, function() {});
        }
        else
        {
            setting_dialup_saveVar();
        }                       
    });
});


