[settings]
commandtype=0xF800581D;
attributenum=2;
displayattribute = 1 ;

[parameter]
attribute=alias<us_enable>        type<uint>   range<0x0,0x1>               default<0>;
attribute=alias<em_port>          type<uint>   range<0x0,0x7>                default<0>;


[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uchar8     uc_enable;
}hi_lsw_port_status_s;

/*端口号定义*/
typedef enum
{
    HI_LSW_PORT_GE0_E = 0,
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




owErrorUnderTextbox(id, samba_input_invalid);
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
        if (!isAjaxReturnOK(ret)) {
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
	    addImeiIntoKey();
            var ack={
                    userAckNewVersion:0
                    };
            if(download_send_info(ack))
            {
                setcookie();
            }
        }
    });
}
function checkLoginLock(){
    clearAllErrorLabel();
    showErrorUnderTextbox('login_password', login_is_locked);
    $('#login_password').attr('disabled',true);
    button_enable('download', '0');
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
                button_enable('download', '1');
                $('#login_password').val('');
                $('#login_password').focus();
            }
        }
        }, {
        sync: true
    });
}

function setcookie()
{
    $.cookies.set('cookie', 'maintenance,null,update', { expiresAt: new Date().getTime()+5*60*1000 });
    setTimeout(function(){
            gotoPageWithoutHistory("maintenance.html");
    },1);
}
function download_send_info(ack)
{   
    var req = object2xml("request", ack);
    var bret = false;
    saveAjaxData("api/online-update/ack-newversion",req,function($xml){
        var ret = xml2object($xml);
        if(ret.type=='response')
        {
            if(isAjaxReturnOK(ret))
            {
                log.debug("download start"); 
                bret = true;
            }else
            {
                log.debug("download terminate");
                showInfoDialog(common_failed);
            }
        }
        },{
           sync:true
        });
    return bret;
}
function CancelRedirect()
{
    var ack={
            status:0
            };
    var req = object2xml("request", ack);
    var bret = false;
    saveAjaxData("api/online-update/CancelRedirect",req,function($xml){
        var ret = xml2object($xml);
        if(ret.type=='response')
        {
            if(isAjaxReturnOK(ret))
            {
                bret = true;  
            }else
            {
                showInfoDialog(common_failed);
            }
        }
        },{
           sync:true
        });
        
    return bret;
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
function closewindow()
{
    window.opener = null; 
    window.open('', '_self'); 
    window.close();
}
function show_new_version_feature()
{   
    // get current changelog
    var new_version_feature = "";
    var current_changelog = "";
    getAjaxData('api/online-update/changelog', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type 
            && typeof(ret.response.changelogs) != "undefined"
            && typeof(ret.response.changelogs.changelog) != "undefined") 
            {
                    new_version_feature = ret.response.changelogs.changelog;
            }
           }, {
               sync: true
           }
    );
    if(""!=new_version_feature)
    {
        if($.isArray(new_version_feature)) 
        {
            $.each(new_version_feature, function(i) {
                current_changelog += "<br>" + new_version_feature[i];
            });
        }
        else
        {
            current_changelog="<br>"+new_version_feature;
        }
    }
    if(""!=current_changelog)
    {
        var newinfomsg =
            "<table cellpadding='0' align='center' cellspacing='0'>" +
                "<tr height='32'>" +
                "<td width='400' colspan='1'>" + update_label_newersion + '</td>' +
                '</tr>' +
                '<tr>' +
                "<td colspan='1'><hr/></td>" +
                '</tr>' +
                '<tr>' +
                "<td width='400' class = 'wps_forbidden_message'>" + current_changelog+'</td>' +
                '</tr>' +
            '</table>';
        showPswInfoDialog(newinfomsg,"");
    }    
}
$(document).ready(function() {
    checkUser();
    setLangList();
    showCurrentLanguage();
    getUserManualUrl();
    $('#login_username').change(function(){
        button_enable('download', '1');
    });
   
    button_enable('download', '1');
   
    $('#download').click(function(){
        if(isButtonEnable('download')&&isVaildValue()){
            postData();
        }
    });
    $('#cancel').click(function(){
        CancelRedirect();      
        closewindow();
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
    g_is_login_opened = true; 
    show_new_version_feature();
});
