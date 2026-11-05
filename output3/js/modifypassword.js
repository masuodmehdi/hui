[settings]
functionname = hi_adapter_cli_lsw_vlan_set_tag;
attributenum = 4;
attributeflag= 1;

[parameter]
attribute=alias<port>        type<uint>      range<0x0,0x7>                default<0>;
attribute=alias<vlan>        type<ushort>    range<0x0,0xfff>              default<0>;
attribute=alias<enable>      type<uchar>     range<0x0,0x1>                default<0>;
attribute=alias<res>         type<uchar>     range<0x0,0x0>                default<0>;

[help]
typedef struct
{
    hi_lsw_port_e  em_port;
    hi_ushort16    us_vlan;
    hi_uchar8      uc_enable;
    hi_uchar8      uc_res;
}hi_lsw_vlan_tag_s;

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

/* 用于某功能属性的使能 */
typedef enum
{
    HI_FALSE_E  = 0   , 
    HI_TRUE_E     
}HI_BOOL_E;




;
    saveAjaxData('api/user/login', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response" && isAjaxReturnOK(ret))
        {
            ischeck = true;
        }
    },{
        sync:true
    });
    return ischeck;
}
function vilidatePassword() {
    clearAllErrorLabel();
    var currenPassword = $('#current_password').val();
    var newPassword = $('#new_password').val();
    var confirmPassword = $('#confirm_password').val();
    var username = $('#username_select').val();
    if ('' == currenPassword)
    {
        showErrorUnderTextbox('current_password', system_hint_current_password_empty);
        $('#current_password').focus();
        return false;
    }else if(!checkcurrPwd(currenPassword)){
        getPasswordRemainTimes();
        if (LOGINLOCK  == g_login_PasswordRemainTimes){
            setTimeout(function(){parent.userOut();}, 1000);
        }
        else {
            showErrorUnderTextbox('current_password', system_hint_wrong_password + ' ' + dialup_label_remaining_times + common_colon + g_login_PasswordRemainTimes);
            button_enable('apply_button', '0');
            $('#current_password').val('');
            $('#new_password').val('');
            $('#confirm_password').val('');
            $('#current_password').focus();
        }
	return false;
    }
    if ('' == newPassword)
    {
        showErrorUnderTextbox('new_password', system_hint_enter_new_password);
        $('#new_password').focus();
        return false;
    }
    if ('' == confirmPassword)
    {
        showErrorUnderTextbox('confirm_password', system_hint_enter_confirm_password);
        $('#confirm_password').focus();
        return false;
    }
    if(hasSpaceOrTabAtHead(newPassword))
    {
        showErrorUnderTextbox('new_password', input_cannot_begin_with_space);
        $('#newPassword').focus();
        return false;
    }
    if (newPassword != confirmPassword)
    {
        showErrorUnderTextbox('confirm_password', system_hint_new_confirm_password_same);
        $('#confirm_password').focus();
        return false;
    }
    
    if(!isAsciiOrSpaceString(newPassword)){
        showErrorUnderTextbox('new_password', system_hint_current_pwd_valid_char);
        $('#new_password').focus();
        return false;
    }
    if(username == 'admin'){
        if(!checkAdminPassword(newPassword, username)){
            parent.showConfirmDialog(admin_check_title+'<br>'+user_check_info_1+'<br>'+admin_check_info_2+'<br>'+lable_admin_password_reverse+'<br>'+"<div class='info_title'><h4>"+ system_hint_new_confirm_password_not_safe +"</h4></div>", postmodifyPassword, function() {});
            return false;
        }
    }
    else if(username == 'user'){      
        if(!checkUserPassword(newPassword)){
            parent.showConfirmDialog(admin_check_title+'<br>'+user_check_info_1+'<br>'+admin_check_info_2+'<br>'+"<div class='info_title'><h4>"+ system_hint_new_confirm_password_not_safe +"</h4></div>", postmodifyPassword, function() {});
            return false;
        }
    }
    return true;
}
function postmodifyPassword()
{
    var username = '';
    if(g_flag == 1){
        username = $('#username_select').val();
    }else {
        username = 'admin';
    }
    var currentPassword = $('#current_password').val();
    var newPassword = $('#new_password').val();
    currentPassword = stringToSHA256(currentPassword);
    newPassword = stringToSHA256(newPassword);
    var request = {
        Username: username,
        CurrentPassword: currentPassword,
        NewPassword: newPassword
        };
    var xmlstr = object2xml('request', request);
    saveAjaxData('api/user/password', xmlstr, function($xml) {
    var ret = xml2object($xml);
    if (isAjaxReturnOK(ret))
    {
        if(('' != g_postfix) && ('.html' != g_postfix)){
            gotoPageWithoutHistory(g_postfix);
        }else{
            button_enable('apply_button', '0');
            $('#current_password').val('');
            $('#new_password').val('');
            $('#confirm_password').val('');
            parent.showInfoDialog(common_success);
            setTimeout(function(){parent.userOut();}, 1000);
        }
    }
    else if (ret.type == 'error')
    {   
        parent.showInfoDialog(common_failed);
        $('#current_password').val('');
        $('#new_password').val('');
        $('#confirm_password').val('');
    }  
    });

}

function apply() {
    if (!isButtonEnable('apply_button'))
    {
        return;
    }

    var bValid = vilidatePassword();
    if (bValid)
    {
        postmodifyPassword()
    }
}

function configDataDisplay(){
    if( g_username_enable != null && typeof(g_username_enable) != 'undefined' && g_username_enable.user_name_enabled == '1')
    {
        $('#tr_username_enable').show();
    }
    else
    {   g_flag = 1;
        $('#tr_username_enable').hide();
    }
}
    

$(document).ready(function() {
    $('#apply_button').click(function() {
        apply();
    });
    button_enable('apply_button', '0');

    $('input').bind('change input paste cut keydown', function() {
        button_enable('apply_button', '1');
    });

    getConfigData('config/user/config.xml', function($xml) {
        g_username_enable = _xml2feature($xml);
    },{
        sync : true
    });

    configDataDisplay();
    setTimeout(function(){
        $('#current_password').focus();
    },1000);
});
