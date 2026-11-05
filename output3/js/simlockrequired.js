[settings]
functionname=hi_kernel_misc_util_dump_stack;  
attributenum=0;
attributeflag = 0 ;   //0:close 1:open

[parameter]

[help]
dump linux kernel stackIM_STATUS_UNLOCK = '0';
var SIM_STATUS_LOCKED = '1';
var SIM_STATUS_SUCCESS = '2';
var SIM_STATUS_FAILED = '3';

var g_username = ["admin","user"];
var g_user = 0;
var g_login_PasswordRemainTimes = 3;
var LOGINLOCK = 0;
var LOOP_TIME = 6000;

function main_beforeready() {
    if (g_postfix != null) {
        if(URL_PAGE_TAIL == g_postfix){
            g_postfix = '.html';
        }
        else{
            var start = g_postfix.indexOf('?');
            var end = g_postfix.indexOf('&');
            g_postfix = g_postfix.substring(start + 1, end) + '.html';
        }        
    }else {
        g_postfix = '';
    }
}

main_beforeready();

function initPage() {
    var retsult; 
    button_enable('simlock_button_apply', '0');
    simPageVar = {
        actMode: '2',
        simlockpwd: ''
    };
    var wps_xml = object2xml('request', simPageVar);
    saveAjaxData('api/pin/simlock',wps_xml, function($xml) {
       retsult = xml2object($xml);
    },{sync: true});
    
    getAjaxData('api/monitoring/status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (SIM_STATUS_LOCKED == ret.response.simlockStatus) {
                $('#label_SimlockTimes').text(retsult.response.SimLockRemainTimes);
                if (parseInt(retsult.response.SimLockRemainTimes, 10) < 1) {
                    $('#input_simunlock').attr('disabled', true);
                }else {
                    $('#input_simunlock').removeAttr('disabled');
                    $('#input_simunlock').val('');
                    $('#input_simunlock').focus();
                }
            }else {
                gotoPageWithoutHistory(HOME_PAGE_URL + window.location.search);
            }
        }
    });
}
function do_reboot() {
    var request = {
        Control: 1
    };
    var DEFAULT_GATEWAY_IP = '';
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            DEFAULT_GATEWAY_IP = ret.response.DhcpIPAddress;
        }
    }, {
        sync: true
    }
    );
    var xmlstr = object2xml('request', request);
    saveAjaxData('api/device/control', xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            ping_setPingAddress(DEFAULT_GATEWAY_IP);
            setTimeout(startPing, 60000);
        }
        else
        {
            closeWaitingDialog();
            showInfoDialog(system_label_reboot + " " + common_failed);
            return false;
        }
    });
}

function validateInput() {
    var pin_val = $('#input_simunlock').val();
    var patrn = /^[0-9]{8}$/;
    if (pin_val == '' || pin_val == ' ' || pin_val == null) {
        $('#simunlock_error').html(dialup_hint_password_empty).attr('class', 'error_message');
        $('#input_simunlock').focus();
        $('#input_simunlock').val('');
        button_enable('simlock_button_apply', '0');
        return false;
    }else if (!patrn.exec(pin_val)) {
        $('#simunlock_error').html(dialup_hint_simlock_code_valid_type).attr('class', 'error_message');
        $('#input_simunlock').focus();
        $('#input_simunlock').val('');
        button_enable('simlock_button_apply', '0');
        return false;
    }else {
        $('#simunlock_error').html('');
        return true;
    }
}

function onApply() {
    $.each($('input'), function() {
        $(this).blur();
    });
    if (!isButtonEnable('simlock_button_apply')) {
        return;
    }

    if (validateInput()) {
        var sim_pin = encrypt($('#input_simunlock').val());
        simPageVar = {
            actMode: '0',
            simlockpwd: sim_pin
        };

        var wps_xml = object2xml('request', simPageVar);

        button_enable('simlock_button_apply', '0');
        saveAjaxData('api/pin/simlock', wps_xml, function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (SIM_STATUS_SUCCESS == ret.response.Simlockstate) {
                    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
                    do_reboot();
                }else {
                    showInfoDialog(sim_lock_validate_failed);
                    $('#input_simunlock').val('');
                    $('#label_SimlockTimes').text(ret.response.SimLockRemainTimes);
                    if (parseInt(ret.response.SimLockRemainTimes, 10) < 1) {
                        $('#input_simunlock').attr('disabled', true);
                    }else {
                        $('#input_simunlock').focus();
		    }
                    button_enable('simlock_button_apply', '0');
                }
            }else {
                showInfoDialog(sim_lock_validate_failed);
                setTimeout(function() {
                    initPage();
                    return false;
                }, 1500);
            }
        });
    }
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
    var pwd = '';
    if(0 == g_user){
        username = $('#login_username').val();
    } else {
        username = $('#login_username option:selected').text();
    }
    pwd = stringToSHA256(username + stringToSHA256($('#login_password').val()) +  g_pram1_value +  g_pram2_value);
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
                button_enable('login', '0');
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
            clearDialog();
            $('#pinrequired_input_pin').focus();
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
                $('#login_password').val('');
                $('#login_password').focus();
            }
        }
        }, {
        sync: true
    });
}
main_beforeready();

$(document).ready(function() {

    $('#input_simunlock').focus();

    $('#input_simunlock').bind('keyup change input paste cut keydown', function() {
        if (($(this).val()).length >= 8) {
            button_enable('simlock_button_apply', '1');
        }else {
            button_enable('simlock_button_apply', '0');
        }
    });
    $('#simlock_button_apply').bind('click', onApply);

    if (1 == g_feature.continue_button)
    {
        $('#link_login').show();
    }
    else
    {
        $('#link_login').hide();
    }

    initPage();
    setLangList();
    showCurrentLanguage();
    $('#link_login').click(function() {
         //window.location = LOGIN_PAGE_URL;
         gotoPageWithoutHistory(HOME_PAGE_URL);
    });
    
    var g_need_login = false;
    getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if ((typeof(ret.response.State) != 'undefined') && (ret.response.State != 0))
            {
                g_need_login = true;
            }
        }, {
            sync: true
        });

    if(true==g_need_login)
    {
        showloginDialog();
        $('#login_username').attr('disabled',true);
        button_enable('login', '0');
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
            },200);
        }
    }

});
