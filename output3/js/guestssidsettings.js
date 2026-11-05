[settings]
commandtype      = 0xF80058A3 ;
attributenum     = 4 ;
displayattribute = 1 ;

[parameter]
attribute=alias<egr>        type<uint>      range<0x0,0x0D>        default<0>;
attribute=alias<queue>      type<uchar>     range<0x0,0xff>        default<0>;
attribute=alias<wrr>        type<uchar>     range<0x0,0x1>         default<0>;
attribute=alias<res>        type<ushort>    range<0x0,0x0>         default<0>;

[help]
typedef struct
{
    hi_lsw_qos_egr_e em_egr;
    hi_uchar8        uc_queue;
    hi_uchar8        uc_wrr;
    hi_ushort16      us_res;
}hi_lsw_port_schattr_s;

/* 队列出口 */
typedef enum {
    HI_LSW_QOS_EGR_TCONT0_E  = 0,
    HI_LSW_QOS_EGR_TCONT1_E,
    HI_LSW_QOS_EGR_TCONT2_E,
    HI_LSW_QOS_EGR_TCONT3_E,
    HI_LSW_QOS_EGR_TCONT4_E,
    HI_LSW_QOS_EGR_TCONT5_E,
    HI_LSW_QOS_EGR_TCONT6_E,
    HI_LSW_QOS_EGR_TCONT7_E, 
    
    HI_LSW_QOS_EGR_GE0_E,
    HI_LSW_QOS_EGR_GE1_E,
    HI_LSW_QOS_EGR_FE2_E,
    HI_LSW_QOS_EGR_FE3_E,
    HI_LSW_QOS_EGR_FE4_E,    
    
    HI_LSW_QOS_EGR_CPU_E,        
}hi_lsw_qos_egr_e;
y3').val(ssidinfo.WifiWepKey3 == '' ?  '' : decrypt(ssidinfo.WifiWepKey3));
    $('#ssid_neworkKey4').val(ssidinfo.WifiWepKey4 == '' ?  '' : decrypt(ssidinfo.WifiWepKey4));
    if (key == WIFIBASICENCRYPMODE_NONE)
    {
        $('#ssid_network_key').hide();
        if (($('#ssid_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE &&
            $('#ssid_authentication').val() == WIFIAUTHMODE_OPEN))
        {
            $('#checkbox_password').hide();
        }
    }
    else if (key == WIFIBASICENCRYPMODE_WEP)
    {
        $('#ssid_network_key').show();
        $('#ssid_current_network_key').val(ssidinfo.WifiWepKeyIndex);
        $('#checkbox_password').show();
    }
}

/*---------------------------------set Authmode and change mode-------------------------------------------*/
function changeAndGetMode(mode,g_wlan_basicSettingData) {
    if(WIFIAUTHMODE_OPEN == mode  ||
       WIFIAUTHMODE_SHARE == mode ) 
    {
       $('#div_ssid_encrypt_way1').show();
       $('#div_ssid_encrypt_way2').hide();
       $('#ssid_authentication').val(mode);
       if (WIFIAUTHMODE_SHARE == mode)
       {
            $('#ssid_encryption_mode_basic option[value='+ WIFIBASICENCRYPMODE_NONE +']').remove();
            if($("#ssid_encryption_mode_basic option[value= "+WIFIBASICENCRYPMODE_WEP +"]").length == 0) {
                $("#ssid_encryption_mode_basic").prepend("<option value="+ WIFIBASICENCRYPMODE_WEP +">" + wlan_label_wep + '</option>');
            }
       }
       else
       {
            if ($('#ssid_encryption_mode_basic option[value='+WIFIBASICENCRYPMODE_NONE+']').length == 0)
            {
                $('#ssid_encryption_mode_basic').prepend("<option value="+ WIFIBASICENCRYPMODE_NONE +">" + wlan_label_none + '</option>');
            }
            if($("#ssid_encryption_mode_basic option[value= "+WIFIBASICENCRYPMODE_WEP +"]").length == 0) {
                $("#ssid_encryption_mode_basic").prepend("<option value="+ WIFIBASICENCRYPMODE_WEP +">" + wlan_label_wep + '</option>');
            }
            setTimeout(function() {
                 $('#ssid_encryption_mode_basic').val(g_wlan_basicSettingData.WifiBasicencryptionmodes);
            },1);            
       }
       if(g_wlan_basicSettingData.WifiMode== "n")
       {
            if($("#ssid_encryption_mode_basic option[value= "+WIFIBASICENCRYPMODE_WEP +"]").length != 0)
            {
                $('#ssid_encryption_mode_basic option[value='+ WIFIBASICENCRYPMODE_WEP +']').remove();
            }       
       }
       setTimeout(function(){
           wlanbasicsettings_networkKey($('#ssid_encryption_mode_basic').val(), g_wlan_basicSettingData);
       }, 1);
       $('#ssid_caution').show();
    }
    else {
        $('#checkbox_password').show();
        $('#div_ssid_encrypt_way2').show();
        $('#div_ssid_encrypt_way1').hide();
        $("#ssid_wpa_key").val(g_wlan_basicSettingData.WifiWpapsk == '' ?  '' : decrypt(g_wlan_basicSettingData.WifiWpapsk));
        $('#ssid_authentication').val(mode);
        if(WIFIAUTHMODE_WPA_PSK == mode){
                $("#ssid_encryption_mode_wpa").val(g_wlan_basicSettingData.WifiWpaencryptionmodes);
        }
        else if(WIFIAUTHMODE_WPA2_PSK == mode){
                $("#ssid_encryption_mode_wpa").val(g_wlan_basicSettingData.IEEE11iEncryptionModes);
        }
        else if(WIFIAUTHMODE_WPA_WPA2_PSK == mode){
                $("#ssid_encryption_mode_wpa").val(g_wlan_basicSettingData.X_MixedEncryptionModes);
        }
    }
}

/*--------------------------set 11n or rate show--------------------------------*/
function showRateOr11N(mode) {
   
    if(mode == "n" || mode == "b/g/n") {
        if(mode == "n") {
            $("#ssid_authentication option[value="+ WIFIAUTHMODE_SHARE +"]").remove();
            if(WIFIAUTHMODE_OPEN == $('#ssid_authentication').val()){
                if($("#ssid_encryption_mode_basic option[value= "+WIFIBASICENCRYPMODE_WEP +"]").length != 0)
                {
                    $("#ssid_encryption_mode_basic option[value="+ WIFIBASICENCRYPMODE_WEP +"]").remove();
                }
                if(0 == $('#ssid_encryption_mode_basic option[value='+WIFIBASICENCRYPMODE_NONE+']').length){
                    $('#ssid_encryption_mode_basic').prepend("<option value="+ WIFIBASICENCRYPMODE_NONE +">" + wlan_label_none + '</option>');
                }
                $('#ssid_network_key').hide();
            }
        }
        else {
            if($("#ssid_authentication option[value="+ WIFIAUTHMODE_SHARE +"]").length == 0) {
                $("#ssid_authentication").prepend("<option value="+ WIFIAUTHMODE_SHARE +">" + wlan_label_share + '</option>');
            }
        
            if($("#ssid_encryption_mode_basic option[value= "+WIFIBASICENCRYPMODE_WEP +"]").length == 0) {
                $("#ssid_encryption_mode_basic").prepend("<option value="+ WIFIBASICENCRYPMODE_WEP +">" + wlan_label_wep + '</option>');
            }
        }
      
    }
    else {
        
        if($("#ssid_authentication option[value="+ WIFIAUTHMODE_SHARE +"]").length == 0) {
            $("#ssid_authentication").prepend("<option value="+ WIFIAUTHMODE_SHARE +">" + wlan_label_share + '</option>');
        }
        
        if($("#ssid_encryption_mode_basic option[value="+ WIFIBASICENCRYPMODE_WEP +"]").length == 0) {
            $("#ssid_encryption_mode_basic").prepend("<option value="+ WIFIBASICENCRYPMODE_WEP +">" + wlan_label_wep + '</option>');
        }
    }
    showEncryptionMode(mode);
}

/*---------------- 802.11 mode is 'n',show Encryption Mode-----------------------------*/
function showEncryptionMode(mode){

    if('none' == $("#div_ssid_encrypt_way2").css("display"))
    {
        return; 
    }
    if('n' != mode){
        if(0 == $('#ssid_encryption_mode_wpa option[value=' + WIFIENCRYPTIONMODE_TKIP + ']').length){
            $('#ssid_encryption_mode_wpa').append('<option value = ' + WIFIENCRYPTIONMODE_TKIP + '>' + wlan_label_tkip + '</option>');
        } 
        if(0 == $('#ssid_encryption_mode_wpa option[value=' + WIFIENCRYPTIONMODE_AES_TKIP + ']').length){
            $('#ssid_encryption_mode_wpa').append('<option value = ' + WIFIENCRYPTIONMODE_AES_TKIP + '>' + wlan_label_aes_tkip+ '</option>');
        }
    }else{
        if((WIFIAUTHMODE_WPA_PSK == $('#ssid_authentication').val()) ||
            (WIFIAUTHMODE_WPA2_PSK == $('#ssid_authentication').val()) ||
            (WIFIAUTHMODE_WPA_WPA2_PSK == $('#ssid_authentication').val())){
                $('#ssid_encryption_mode_wpa option[value=' + WIFIENCRYPTIONMODE_TKIP + ']').remove();
                $('#ssid_encryption_mode_wpa option[value=' + WIFIENCRYPTIONMODE_AES_TKIP + ']').remove();
        }
    }
}

/*------------------------------set info-------------------------------*/
function setData (showObject) {  
    changeAndGetMode(showObject.WifiAuthmode,showObject);
    showRateOr11N(showObject.WifiMode);
    setTimeout(function() {
        $('#ssid_encryption_mode_basic').val(showObject.WifiBasicencryptionmodes);
    },1);    
    $('input[name= ssid_wifiBroadcast][value=' + showObject.WifiHide + ']').attr('checked', true);
    $('#ssid_wifiName').val(showObject.WifiSsid);
    $("#input_show_max_limit").val(showObject.WifiMaxAssoc);
    $("#ssid_current_network_key").val(showObject.WifiWepKeyIndex);
    $('#check_wpa_psk').get(0).checked = false;
    $('#check_wifi_enable').attr('checked', (showObject.SSIDEnable==1? true:false))
}
function get_guestssid_index(g_wlan_basicSetting)
{
    var i=0;
    for (i=0; i<g_wlan_basicSetting.length; i++)
    {
        if (g_guest_ssid==g_wlan_basicSetting.WifiIndex)
        {
            return i;
        }
    }
    return g_wlan_basicSetting.length-1;
    
}
/*----------------------------------init page-----------------------------------*/
function wifibasicsettings_initpage() {
    getAjaxData('api/wlan/basic-settings',function($xml){
        var ret = xml2object($xml);
        if('response' == ret.type){
            g_wlan_basicSetting = ret.response.Ssids.Ssid;
            if(!$.isArray(g_wlan_basicSetting)) {
                setData(g_wlan_basicSetting);
            }
            else {
                var guest_ssid_index = get_guestssid_index(g_wlan_basicSetting);
                setData(g_wlan_basicSetting[guest_ssid_index]);
            }
        }
        else{
                log.error('Get api/wlan/basic-settings error.');
        }
   },{
        sync : true
   });
}

/*--------------------------check netpwd function--------------------------*/
function wlanbasicsettings_checkNetworkKeyPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length)
    {
        errMsg = dialup_hint_password_empty;
    }
    else if (hasSpaceOrTabAtHead(pwdVal))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (10 == pwdVal.length || 26 == pwdVal.length)
    {
        if (!isHexString(pwdVal))
        {
            errMsg = wlan_hint_64_or_128_bit_key;
        }
        else
        {
            ret = true;
        }
    }
    else if (5 == pwdVal.length || 13 == pwdVal.length)
    {
        if (!checkInputChar(pwdVal))
        {
            errMsg = wlan_hint_wep_key_valid_type;
        }
        else
        {
            ret = true;
        }
    }
    else
    {
        errMsg = wlan_hint_64_or_128_bit_key;
    }

    if (!ret)
    {
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}
/*-------------------------checkName function---------------------------*/
function wlanbasicsettings_checkName() {
    var name = $.trim($('#ssid_wifiName').val());
    var errMsg = common_ok;
    var i = 0;

    if (0 == name.length)
    {
        errMsg = wlan_hint_ssid_empty;
    }
    else if (hasSpaceOrTabAtHead(name))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (32 < name.length)
    {
        errMsg = wizard_help_name_ssid;
    }
    else
    {
        for (i = 0; i < name.length; i++)
        {
            var c = name.charCodeAt(i);
            if (!((c >= CHARCODE_0 && c <= CHARCODE_9) ||
            (c >= CHARCODE_A && c <= CHARCODE_Z) ||
            (c >= CHARCODE_a && c <= CHARCODE_z) ||
            c == CHARCODE_DASH ||
            c == CHARCODE_UNDERLINE ||
            c == CHARCODE_DOT ||
            c == CHARCODE_SPACE
            ))
            {
                errMsg = wlan_hint_ssid_valid_char;
                break;
            }
        }
    }

    if (common_ok != errMsg)
    {
        showErrorUnderTextbox('ssid_wifiName', errMsg);
        $('#ssid_wifiName').focus();
        $('#ssid_wifiName').select();
        return false;
    }
    else
    {
        return true;
    }
}

/*---------------------------check wap pwd function-----------------------------*/
function wlanbasicsettings_checkWapPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length)
    {
        errMsg = dialup_hint_password_empty;
    }
    else if (hasSpaceOrTabAtHead(pwdVal))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (64 == pwdVal.length)
    {
        if (!isHexString(pwdVal))
        {
            errMsg = wlan_hint_wps_psk_valid_type;
        }
        else
        {
            ret = true;
        }
    }
    else if (pwdVal.length >= 8 && pwdVal.length <= 63)
    {
        if (!checkInputChar(pwdVal))
        {
            errMsg = wlan_hint_wps_psk_valid_char;
        }
        else
        {
            ret = true;
        }
    }
    else
    {
        errMsg = wlan_hint_wps_psk_valid_type;
    }

    if (!ret)
    {
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

/*---------------------------check wifi security function-----------------------------*/
function wlanbasicsettings_checkWifiSecurity() {
    var strNetworkKey = $('#ssid_current_network_key').val();
    var authMethod = $('#ssid_authentication').val();
    var bscEncptMode = $('#ssid_encryption_mode_basic').val();

    if (authMethod == WIFIAUTHMODE_WPA_PSK ||
    authMethod == WIFIAUTHMODE_WPA2_PSK ||
    authMethod == WIFIAUTHMODE_WPA_WPA2_PSK)
    {
        return wlanbasicsettings_checkWapPwd('ssid_wpa_key');
    }
    else
    {
        if (WIFIBASICENCRYPMODE_NONE != bscEncptMode)
        {
            if ((!wlanbasicsettings_checkNetworkKeyPwd("ssid_neworkKey1"))
                ||(!wlanbasicsettings_checkNetworkKeyPwd("ssid_neworkKey2"))
                ||(!wlanbasicsettings_checkNetworkKeyPwd("ssid_neworkKey3"))
                || (!wlanbasicsettings_checkNetworkKeyPwd("ssid_neworkKey4")))
            {
                return false;
            }
        }
    }

    return true;
}
function parseInt_ex(value,n)
{
    if(isNaN(parseInt(value, n)))
    {
        return 0;
    }
    else
    {
        return parseInt(value, n);    
    }
}

/*---------------------------check wifi Max Associations Limit-----------------------------*/

function wlanbasicsettings_checkmaxassociationslimit()
{
    var current_WifiMaxAssoc = parseInt_ex($("#input_show_max_limit").val());
	var isusedwifi = 0;
    if($.trim($("#input_show_max_limit").val())==''||isNaN($("#input_show_max_limit").val()))
    {
        showErrorUnderTextbox('input_show_max_limit', wlanbasicsettings_guest_ssid_max_association_value_invalid);
        $('#input_show_max_limit').focus();
        return false;
    }
	
	getAjaxData('api/wlan/basic-settings',function($xml){
        var ret = xml2object($xml);
        if('response' == ret.type){
            var wlan_basicSetting = ret.response.Ssids.Ssid;         
            if(!$.isArray(wlan_basicSetting)) 
            {
                isusedwifi = 0;                          
            }
            else 
            {
                for (i=0; i<wlan_basicSetting.length; i++)
                {
                    if ( (g_guest_ssid!=wlan_basicSetting[i].WifiIndex) && (wlan_basicSetting[i].SSIDEnable=='1' || wlan_basicSetting[i].WifiIndex=='1') )
                    {
                        isusedwifi = isusedwifi + parseInt_ex(wlan_basicSetting[i].WifiMaxAssoc,10);
                    }    
                }    
            }
        }
        else
        {
            log.error('Get api/wlan/basic-settings error.');
        }
   },{
        sync : true
   });
    
	if(current_WifiMaxAssoc==0 || current_WifiMaxAssoc + isusedwifi > 32)
    {
        showErrorUnderTextbox('input_show_max_limit', wlanbasicsettings_max_association_limit_except_guest_ssid.replace('%d', (32-isusedwifi)));
        $('#input_show_max_limit').focus();
        return false;
    }
    if(current_WifiMaxAssoc==0 || current_WifiMaxAssoc > g_WifiMaxAssoc)
    {
        showErrorUnderTextbox('input_show_max_limit', wlanbasicsettings_guest_ssid_max_association_value_invalid);
        $('#input_show_max_limit').focus();
        return false;
    }
    return true;
}

/*------------------------------get data what user set--------------------------------*/
function getDataSet(newBasicSetting) {

    newBasicSetting.WifiSsid = $.trim($("#ssid_wifiName").val());    
    newBasicSetting.SSIDEnable = $("#check_wifi_enable").get(0).checked ? 1 : 0;
    newBasicSetting.WifiHide = $("[name='ssid_wifiBroadcast']:checked").val();
    newBasicSetting.WifiMaxAssoc = $("#input_show_max_limit").val();
    newBasicSetting.WifiAuthmode = $("#ssid_authentication").val();

    switch($("#ssid_authentication").val()){
        case WIFIAUTHMODE_OPEN:
            newBasicSetting.WifiBasicencryptionmodes = $("#ssid_encryption_mode_basic").val();
            newBasicSetting.BasicAuthenticationMode = WIFIBASICENCRYPMODE_NONE;
            if(WIFIBASICENCRYPMODE_WEP == $("#ssid_encryption_mode_basic").val()){
                newBasicSetting.WifiWepKey1 = encrypt($('#ssid_neworkKey1').val());
                newBasicSetting.WifiWepKey2 = encrypt($('#ssid_neworkKey2').val());
                newBasicSetting.WifiWepKey3 = encrypt($('#ssid_neworkKey3').val());
                newBasicSetting.WifiWepKey4 = encrypt($('#ssid_neworkKey4').val());
                newBasicSetting.WifiWepKeyIndex = $('#ssid_current_network_key').val();
            }
            break;
        case WIFIAUTHMODE_SHARE:
            newBasicSetting.WifiBasicencryptionmodes = $("#ssid_encryption_mode_basic").val();
            newBasicSetting.BasicAuthenticationMode = WIFIBASICENCRYPMODE_SHARE;
            if(WIFIBASICENCRYPMODE_WEP == $("#ssid_encryption_mode_basic").val()){
                newBasicSetting.WifiWepKey1 = encrypt($('#ssid_neworkKey1').val());
                newBasicSetting.WifiWepKey2 = encrypt($('#ssid_neworkKey2').val());
                newBasicSetting.WifiWepKey3 = encrypt($('#ssid_neworkKey3').val());
                newBasicSetting.WifiWepKey4 = encrypt($('#ssid_neworkKey4').val());
                newBasicSetting.WifiWepKeyIndex = $('#ssid_current_network_key').val();
            }
            break;
         case WIFIAUTHMODE_WPA_PSK:
            newBasicSetting.WifiWpaencryptionmodes = $("#ssid_encryption_mode_wpa").val();
            newBasicSetting.WifiWpapsk = encrypt($("#ssid_wpa_key").val());
            break;
         case WIFIAUTHMODE_WPA2_PSK:
            newBasicSetting.IEEE11iEncryptionModes = $("#ssid_encryption_mode_wpa").val();
            newBasicSetting.WifiWpapsk = encrypt($("#ssid_wpa_key").val());
            break;
         case WIFIAUTHMODE_WPA_WPA2_PSK:
            newBasicSetting.X_MixedEncryptionModes = $("#ssid_encryption_mode_wpa").val();
            newBasicSetting.WifiWpapsk = encrypt($("#ssid_wpa_key").val());
            break;
    }
    return newBasicSetting;
}

/*---------------------post wlan setting data-------------------------------*/
function postWlanSettingData() {
    var wlan_set = g_wlan_basicSetting[get_guestssid_index(g_wlan_basicSetting)];
    var data = {};
    var wlan_basic = getDataSet(wlan_set);
        data = {
                Ssid : wlan_basic
                 };
    var req = object2xml("request",data);
    saveAjaxData("api/wlan/basic-settings",req,function($xml) {
        var ret = xml2object($xml);
        if(isAjaxReturnOK(ret)) {
            parent.showInfoDialog(common_success);
            setTimeout(function() {
                window.location.reload();
                return false;
            }, g_feature.dialogdisapear);
        }
        else {
            parent.showInfoDialog(common_failed);
        }
    });
}

/*--------------------------show password when checked-----------------------------------*/
function wlanbasicsettings_showPassword() {
    var cbValue = $('#check_wpa_psk').attr('checked');
    var strType = cbValue ? 'text' : 'password';
    $.each($('input[name=ssid_key_name]'), function(i) {
        $("<input id='" + $(this).attr('id') + "' name='ssid_key_name' type='" + strType + "' class='input_style' maxlength='"+$(this).attr('maxlength')+"' value='" + $(this).val() + "' />")
            .replaceAll($('#' + $(this).attr('id')));
    });
}

function showWlanOrBtn(){
    getAjaxData('api/wlan/wifienable', function($xml) {
        var ret = xml2object($xml);
        g_show_wlan_set = ret;
    },{
        sync: true
    });
    if(g_show_wlan_set.response.Wifienable == 1) {
        //init page
        wifibasicsettings_initpage();
        $("#show_turn_on_wlan").hide();
        $("#show_wlan_settings_info").show();
    }
    else {
        $("#show_turn_on_wlan").show();
        $("#show_wlan_settings_info").hide();
    }
}


/*------------------------------ready----------------------------------*/
$(document).ready(function() {
    showWlanOrBtn();
    button_enable('apply_button', 0);
    $('#check_wpa_psk').get(0).checked = false;
    wifibasicsettings_initpage();  
    $('input,select').die().live('keydown click change', function() {
        button_enable('apply_button', '1');
    });
    //show pwd or not
    $("#check_wpa_psk").click(wlanbasicsettings_showPassword);
    //change authentication
    $("#ssid_authentication").die().live("change",function() {
        var basicsetting = g_wlan_basicSetting[get_guestssid_index(g_wlan_basicSetting)];
        changeAndGetMode(this.value,basicsetting);
        showEncryptionMode(basicsetting.WifiMode);
    }); 
    
    $("#ssid_encryption_mode_basic").die().live("change",function() {
        var basicsetting = g_wlan_basicSetting[get_guestssid_index(g_wlan_basicSetting)];
        wlanbasicsettings_networkKey(this.value,basicsetting) ;
    });     

    //click apply nad post data
    $("#apply_button").click(function() {
        clearAllErrorLabel();
        if (!isButtonEnable('apply_button')){
            return;
        }
        if(wlanbasicsettings_checkName() && wlanbasicsettings_checkWifiSecurity() && wlanbasicsettings_checkmaxassociationslimit()) 
        {
            parent.showConfirmDialog(wlan_hint_disconnect_wlan,postWlanSettingData,function(){}); 
        }
    });
    //click turn on btn
    $("#wlan_turn_on").click(function() {
        g_show_wlan_set.response.Wifienable = 1;
        var req = object2xml("request",g_show_wlan_set.response);
        saveAjaxData("api/wlan/wifienable",req,function($xml) {
            var ret = xml2object($xml);
            if(isAjaxReturnOK(ret)) {
                //init page
                $("#show_turn_on_wlan").hide();
                $("#show_wlan_settings_info").show();
                wifibasicsettings_initpage();             
            }
            else {
                return;
            }
        });
    }); 
});
