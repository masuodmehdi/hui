[settings]
functionname=hi_kernel_eth0_drv_regdump;
attributenum=0;
attributeflag = 0;   //0:close 1:open

[parameter]

[help]
usage: 


ne += "<option value='" + i + "'>" + g_username[i] + "</option>";
    });
    $('#login_username').append(newline);
    $('#login_username').val(0);
}
function isVaildValue(){
    clearAllErrorLabel();
    if(checkText('login_password')){
        return true;
    } else {
        return false;
    }
}
function checkText(id){
    var input = $('#'+id).val();
    if(''==input){
        showErrorUnderTextbox(id, samba_input_empty);
        $('#'+id).focus();
        return false;
    } else if(!checkInputChar(input)) {
        showErrorUnderTextbox(id, samba_input_invalid);
        $("#"+id).val("");
        $('#'+id).focus();
        return false;
    } else if (true == hasSpaceOrTabAtHead(input)) {
        showErrorUnderTextbox(id, samba_input_invalid);
        $("#"+id).val("");
        $('#'+id).focus();
        return false;
    }
    return true;
}
function postData(){
    get_token();
    var submitObject = null;
    var username = '';
    var pwd= '';
    if(0 == g_user){
        username = $('#login_username').val();
    } else {
        username = $('#login_username option:selected').text();
    }
    pwd = stringToSHA256(username + stringToSHA256($('#login_password').val()) + g_pram1_value + g_pram2_value);
    submitObject = {
        Username:username,
        Password:pwd
    };
     var newXmlString = object2xml('request', submitObject);
     saveAjaxData('api/user/login', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret)) {
            if (ret.type == 'error'){
                    if(typeof(ret.error.code)!='undefined' && ret.error.code == ERROR_LOGIN_PASSWORD_WRONG){
                        showInfoDialog(system_hint_wrong_password);
                    }else if(typeof(ret.error.code)!='undefined' && ret.error.code == ERROR_LOGIN_ALREADY_LOGIN){
                        showInfoDialog(common_user_login_repeat);
                    }else if(typeof(ret.error.code)!='undefined' && ret.error.code == ERROR_LOGIN_USERNAME_WRONG){
                        showInfoDialog(settings_hint_user_name_not_exist);
                    }else{
                        showInfoDialog(common_failed);
                    }
                }else{
                    showInfoDialog(common_failed);
                }
        } else {
            gotoPageWithoutHistory(HOME_PAGE_URL);
        }
    });
}
function checkUser(){
    getConfigData('config/user/config.xml', function($xml) {
        var ret = _xml2feature($xml);
        g_user = ret.user_enabled;
        if(0 == g_user){
            $('#login_username').remove();
            $('#login_username_td').append('<input type="text" id="login_username" class="input_style" value="admin" disabled/>');
        } else {
            setSelect();
        }
    },{
        sync:true
    });
}
$(document).ready(function() {
    checkUser();
    $('#login_username').change(function(){
        button_enable('login', '1');
    });
    $('#login_password').bind('change input paste cut keydown',function(){
        button_enable('login', '1');
    });
    $('#login').click(function(){
        if(isButtonEnable('login')&&isVaildValue()){
            postData();
        }
    });
    setLangList();
    showCurrentLanguage();
    g_is_login_opened = true;
    getUserManualUrl();
    setTimeout(function(){
        $('#login_password').focus();
    },300);
});
