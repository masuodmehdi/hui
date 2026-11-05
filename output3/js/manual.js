[settings]
functionname = hi_adapter_cli_lsw_vlan_get_port;
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




"");
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
    var pwd = '';
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
        if (!isAjaxReturnOK(ret)) 
        {     
            if (ret.type == 'error') {
                clearAllErrorLabel();
                if (ret.error.code == ERROR_LOGIN_PASSWORD_WRONG) {
                    g_login_PasswordRemainTimes--;
                    if (LOGINLOCK  == g_login_PasswordRemainTimes){
                        checkLoginLock();
                    }
                    else {
                        showErrorUnderTextbox('login_password', system_hint_wrong_password + ' ' + dialup_label_remaining_times + common_colon + g_login_PasswordRemainTimes);
                        $('#login_password').val('');
                        $('#login_password').focus();
                    }
                }
                else if (ret.error.code == ERROR_LOGIN_ALREADY_LOGIN) {
                    showErrorUnderTextbox('login_password', common_user_login_repeat);
                    $('#login_password').focus();
                }
                else if (ret.error.code == ERROR_LOGIN_USERNAME_WRONG) {
                    showErrorUnderTextbox('login_password', settings_hint_user_name_not_exist);
                    $('#login_password').val('');
                    $('#login_password').focus();
                }
            }
            else
            {
                showErrorUnderTextbox('login_password', system_hint_wrong_password);
                $('#login_password').val('');
                $('#login_password').focus();
            }
        } else {
            gotoPageWithoutHistory(HOME_PAGE_URL);
        }
    });
}
function checkLoginLock(){
    clearAllErrorLabel();
    showErrorUnderTextbox('login_password', login_is_locked);
    $('#login_password').attr('disabled',true);
    button_enable('login', '0');
    setTimeout(cycCheckLoginLock, LOOP_TIME);
}

function cycCheckLoginLock(){
    var ret = '';
    getAjaxData('api/user/state-login', function($xml) {
        ret = xml2object($xml);
        if (ret.type == 'response') {
            g_login_PasswordRemainTimes = ret.response.PasswordRemainTimes;
            if (LOGINLOCK == g_login_PasswordRemainTimes) {
                setTimeout(cycCheckLoginLock, LOOP_TIME);
            }
            else {
                clearAllErrorLabel();
                $('#login_password').attr('disabled',false);
                button_enable('login', '1');
                $('#login_password').val('');
                $('#login_password').focus();
            }
        }
        }, {
        sync: true
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
   
    button_enable('login', '1');
   
    $('#login').click(function(){
        if(isButtonEnable('login')&&isVaildValue()){
            postData();
        }
    });
    var ret = '';
    getAjaxData('api/user/state-login', function($xml) {
        ret = xml2object($xml);
        if (ret.type == 'response') {
            g_login_PasswordRemainTimes = ret.response.PasswordRemainTimes;
        }
    }, 
    {
        sync: true
    });
    
    if (LOGINLOCK == g_login_PasswordRemainTimes)
    {
        checkLoginLock();
    }
    else
    {
        setTimeout(function(){
            $('#login_password').focus();
        },300);  
    }
    setLangList();
    showCurrentLanguage();
    g_is_login_opened = true;
    getUserManualUrl();  
});
