[settings]
functionname = hi_adapter_cli_lsw_vlan_del_vlanbcegr;
attributenum = 3;
attributeflag= 1;


[parameter]
attribute=alias<port>        type<uint>       range<0x0,0x7>                  default<0>;
attribute=alias<vlan>        type<ushort>     range<0x0,0xfff>                default<0>;
attribute=alias<res>         type<ushort>     range<0x0,0x0>                  default<0>;

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
}hi_lsw_port_e;ress').val('').attr('disabled', true);
        $('#log_primary_port').val('').attr('disabled', true);
        $('#log_second_address').val('').attr('disabled', true);
        $('#log_second_port').val('').attr('disabled', true);
    }
}

function initPage(){
    getAjaxData('api/settings/log-info', function($xml) {
        var dms_ret = xml2object($xml);
        if (dms_ret.type == 'response') {
            dms_status = dms_ret.response;
            $('#enable_log').get(0).checked = (log_enable == dms_status.LogEnable);
            $('#log_level').attr("value",dms_status.LogLevel);
            $("input[name='mode'][value=" + dms_status.LogServer + ']').attr('checked', true);
            checkLogEnable();
        } else {
            return;
        }
    });
}
function getData(){
    var submitObject = null;
    if($('#enable_log').attr('checked')){
        if("1"==$("[name='mode']:checked").val()){
            submitObject = {
                LogEnable : log_enable,
                LogLevel : $('#log_level').attr("value"),
                LogServer : $("[name='mode']:checked").val(),
                PrimaryServerAddress : $('#log_primary_address').attr("value"),
                PrimaryServerPort : $.trim($('#log_primary_port').attr("value")),
                SecondServerAddress : $('#log_second_address').attr("value"),
                SecondServerPort : $.trim($('#log_second_port').attr("value"))
            };
        }
        else{
            submitObject = {
                LogEnable : log_enable,
                LogLevel : $('#log_level').attr("value"),
                LogServer : $("[name='mode']:checked").val()
            };
        } 
    }
    else {
        submitObject = {
            LogEnable : log_disable
        };
    }
    return submitObject;
}

function Amss_Reboot()
{
    var status = "1";
    if($('#enable_log').attr('checked'))
    {
       if("1"==$("[name='mode']:checked").val())
       {
            status = "0";
       }
    }
    var submitObject_Amss_Reboot = 
    {
        Status : status
    };
    var newXmlString = object2xml('request', submitObject_Amss_Reboot);
    saveAjaxData("api/settings/amss-reboot",newXmlString,function($xml){   
    });
}
function postData(){
    Amss_Reboot();
    var newXmlString = object2xml('request', getData());
    saveAjaxData('api/settings/log-info', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            parent.showInfoDialog(common_success);
            initPage();
            checkLogEnable();
            button_enable('apply', '0');
        }else{
            parent.showInfoDialog(common_failed);
        }
    });
}

function inputnullcheck(){
        if(log_enable ==  $("[name='mode']:checked").val()){
          if(($.trim($('#log_primary_address').val()) == '')
                &&($.trim($('#log_second_address').val()) == '' )){
                    if($.trim($('#log_primary_address').val()) == '')
                    {
                         showErrorUnderTextbox("log_primary_address", dialup_hint_ip_address_empty);
                          $('#log_primary_address').focus();
                     }else if($.trim($('#log_second_address').val()) == '')
                     {
                         showErrorUnderTextbox("log_second_address", dialup_hint_ip_address_empty);
                         $('#log_second_address').focus();
                      }
                    return false;
               }
    }
    return true;
}

function inputPortCheck(id){
    if(log_enable ==  $("[name='mode']:checked").val()){
        if("" == $.trim($('#'+id).val())){
            $('#'+id).attr("value",DEFAULT_PORT);
            return true;
        }
        if (-1 != $('#'+id).val().indexOf('.')){
            showErrorUnderTextbox(id, log_port_integer);
            $('#'+id).focus();
            return false;
        }
        else if (true == isNaN($('#'+id).val())){
            showErrorUnderTextbox(id, log_port_number);
            $('#'+id).focus();
            return false;
        }
        else if ((0 == $('#'+id).val().indexOf('0')) && (0 != $('#'+id).val())){
            showErrorUnderTextbox(id, log_port_invalid);
            $('#'+id).focus();
            return false;
        }
        else if (($('#'+id).val() < MIN_PORT) || ($('#'+id).val() > MAX_PORT)){
            showErrorUnderTextbox(id, log_port_range);
            $('#'+id).focus();
            return false;
        }
    }
    return true;
}
function inputAddressCheck(id){
    var str_ip = $('#'+id).val();
    if("" == str_ip){
        return true;
    }
    var str = /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+\.)*([0-9a-zA-Z][0-9A-Za-z-]{0,61})?[0-9A-Za-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
    if(isIpFormat(str_ip)){
        if (!isValidIpAddress(str_ip) || ( $('#log_primary_address').val() == $('#log_second_address').val())){
            showErrorUnderTextbox(id, dialup_hint_ip_address_empty);
            $('#'+id).focus();
            return false;
        }
    }else{
        if(!str.test(str_ip)){
            showErrorUnderTextbox(id, dialup_hint_ip_address_empty);
            $('#'+id).focus();
            return false;
        }
    }
    return true;
}
function onApply(){
          return inputnullcheck()&&inputAddressCheck('log_primary_address')&&inputPortCheck('log_primary_port')&&inputAddressCheck('log_second_address')&&inputPortCheck('log_second_port');
}
$(document).ready(function() {
    initPage();
    $('input[type=radio]').click(function(){
        checkRadioStatus();
        button_enable('apply', '1');
    });
    $('#enable_log').click(function() {
        checkLogEnable();
        button_enable('apply', '1');
    });
    $('#apply').click(function(){
        if (!isButtonEnable('apply')) {
            return;
        }
        clearAllErrorLabel();
        if($('#enable_log').attr('checked') && !onApply()){
            return;
        }
        parent.showConfirmDialog(firewall_hint_submit_list_item, postData);
    });
    $('.input_style,#log_level,#log_server').bind('change input paste cut keydown',function(){
        button_enable("apply", 1);
    });
});