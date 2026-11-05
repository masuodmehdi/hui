[settings]
functionname=hi_kernel_misc_util_writemem;  
attributenum=3;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<addr>          type<uint>   range<0,0xFFFFFFFF>    default<0xBF000000>;
attribute=alias<len>          type<uint>   range<0,0xFFFFFFFF>    default<4>;
attribute=alias<data>         type<uint>   range<0,0xFFFFFFFF>    default<0>;

[help]
mr -v addr 0xBF000000 len 4 data 0
typedef struct
{
    hi_uint32 ui_addr;
    hi_uint32 ui_len;
    hi_void  *pv_data;必须预先分配足够内存
}hi_kernel_sd5113_mem_s;e {
        getPostValue();
    }
}

function getPostValue(){
    g_slaac_settings = {};
    g_slaac_settings.SlaacSwitch = $('#slaac_enable').get(0).checked ? 1 : 0;
    if('1' == g_slaac_settings.SlaacSwitch){
        g_slaac_settings.ConfigureMode = $('#slaac_select').val();
        if(DHCP_IPV6Slaac_MANUAL == g_slaac_settings.ConfigureMode){
            g_slaac_settings.Prefix = $('#input_prefix').val();
            g_slaac_settings.PrefixLength = $('#input_preLen').val();
            g_slaac_settings.PreferredLifeTime = $('#input_preTime').val();
            g_slaac_settings.ValidLifeTime = $('#input_validTime').val();
            }
    }
    var slaac_xml = object2xml('request', g_slaac_settings);
    saveAjaxData('api/settings/slaac',slaac_xml, function($xml){
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            parent.showInfoDialog(common_success);
            button_enable('apply_button', '0');
        }
        else {
            parent.showInfoDialog(common_failed);
            button_enable('apply_button', '1');
            slaac_get();
        }
    });
}

function checkOut(){
    clearAllErrorLabel();
    if(CheckPrefix($.trim($('#input_prefix').val()),0)){
        prefix = $('#input_prefix').val();
        if(parseInt($('#input_preLen').val(),10)>=16&&parseInt($('#input_preLen').val(),10)<=64){
            prefixLength = $('#input_preLen').val();
            if(validate_time($('#input_preTime').val())){
                preferredLifeTime = $('#input_preTime').val();
                if(validate_time($('#input_validTime').val())){
                    validLifeTime = $('#input_validTime').val();
                    return true;
                }else{
                    showErrorUnderTextbox('input_validTime', err_dhcp_preferred);
                    return false;
                }
            }else{
                showErrorUnderTextbox('input_preTime', err_dhcp_preferred);
                return false;
            }
        }else{
            showErrorUnderTextbox('input_preLen', err_validate_prefix_length);
            return false;
        }
    }else{
        showErrorUnderTextbox('input_prefix', err_prefix);
        return false;
    }
}

function validate_time(time){
    var time_var = parseInt(time, 10);
    if(time_var >= TIME_MIN && time_var <= TIME_MAX){
        return true;
    }else{
        return false;
    }
}

function modeSelectIsEnable(){
    if($('#slaac_enable').attr("checked")){
        $('#slaac_tr_select').show();
        menualcheck();
    } else {
        $('#slaac_tr_select').hide();
        $('.tr_ishow').hide();
    } 
}

function menualcheck(){
    if($('#slaac_select').val()==DHCP_IPV6Slaac_MANUAL){
          $('.tr_ishow').show();
    }else if($('#slaac_select').val()==DHCP_IPV6Slaac_SUBNET){
          $('.tr_ishow').hide();
         }
}

function slaac_get(){
    getAjaxData("api/settings/slaac",function($xml){
        var res = xml2object($xml);
        if('response' == res.type){
            var slaac_settings = res.response;
            $('#input_prefix').val(slaac_settings.Prefix);
            $('#input_preLen').val(slaac_settings.PrefixLength);
            $('#input_preTime').val(slaac_settings.PreferredLifeTime);
            $('#input_validTime').val(slaac_settings.ValidLifeTime);
            if( '1' ==slaac_settings.SlaacSwitch){
                $("#slaac_enable").attr("checked",true);
                $('.mode_ishow').show();
                if(DHCP_IPV6Slaac_MANUAL == slaac_settings.ConfigureMode){
                    $('#manual').attr("selected",1) ;
                    $('.tr_ishow').show();
                }else{
                    $('#slaac_select').attr("value",DHCP_IPV6Slaac_SUBNET) ;
                    $('.tr_ishow').hide();
                }
            }else{
                $("#slaac_enable").attr("checked",false);
                $('.mode_ishow').hide();
                $('.tr_ishow').hide();
            }
        }
    });
}

$(document).ready(function(){
    slaac_get();
    button_enable('apply_button', '0');
    $('#slaac_enable').bind("click",function(){
        modeSelectIsEnable();
        button_enable('apply_button', '1');
    });
    $('#slaac_select').change(function(){
        menualcheck();
        button_enable('apply_button', '1');
    }); 
    $('input').bind('change input paste cut keydown', function() {
        button_enable('apply_button', '1');
    });
    $('#apply_button').click(function(){
        if (isButtonEnable('apply_button')){
            if(!($('#slaac_enable').get(0).checked))
            {
                parent.showConfirmDialog(label_slaac_disable_hint, postSlaac, function(){});
            }
            else
            {
                postSlaac();
            }
        }
    });
});
