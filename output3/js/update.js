var UPDATE_STATUS_IDLE = 10;
var UPDATE_STATUS_QUERYING = 11;
var UPDATE_NEWVERSION_FOUND = 12;
var UPDATE_STATUS_QUERYING_FAILED = 13;
var UPDATE_UP_TO_DATE = 14;
var UPDATE_DOWNLOAD_FAILED = 20;
var UPDATE_DOWNLOAD_PROGRESSING = 30;
var UPDATE_DOWNLOAD_PENDING = 31;
var UPDATE_DOWNLOAD_COMPLETE = 40;
var UPDATE_READYTO_UPDATE = 50;
var UPDATE_PROGRESSING = 60;
var UPDATE_FAILED_HAVEDATA = 70;
var UPDATE_FAILED_NODATA = 80;
var UPDATE_SUCCESSFUL_HAVEDATA = 90;
var UPDATE_SUCCESSFUL_NODATA = 100;
var RELOAD_PAGE_DELAY = 600;
var UPDATE_STATUS_INTERVAL = 3000;
var DOWNLOAD_INTERVAL = 300;
var UPDATE_PERIOD_DISABLE = 0;
var UPDATE_PERIOD_MAX = 65535;
var FILE_END_NAME = "bin";

var g_status = null;
var g_update_value = null;
var g_updateComponent = null;
var g_need_checkNewVersion = true;
var g_download_percent = 10;
var g_update_percent = 10;
var g_dialog_hide_download = false;
var g_dialog_hide_update = false;
var g_dialog_hide_updatecomfirm = false;
var g_process_terminate = "";
var g_timerReboot = 1000;

var DEFAULT_GATEWAY_IP = '192.168.1.1';



function do_reboot() {
    var request = {
        Control: 1
    };
    
    var xmlstr = object2xml('request', request);
    log.debug('xmlstr = ' + xmlstr);
    saveAjaxData('api/device/control', xmlstr, function($xml) {
        log.debug('saveAjaxData successed!');
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            ping_setPingAddress(DEFAULT_GATEWAY_IP);
            setTimeout(startPing, 50000);
        }
        else
        {
            parent.closeWaitingDialog();
            parent.showInfoDialog(common_failed);
            return false;
        }
    });
}

function reboot() {
    parent.showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    /*After send "api/device/control" cmd, server will't response webui request.
     So delay 1 second.*/
    setTimeout(do_reboot, g_timerReboot);
}

function reloadPage()
{
    setTimeout(function() {window.location.reload();},RELOAD_PAGE_DELAY);
}

function update_displayNoNewVersionInfo()
{
    parent.clearDialog();
    parent.showInfoDialog(update_label_noversion);
    setTimeout(parent.clearDialog, UPDATE_STATUS_INTERVAL);
}
function update_displayQueryFailed()
{
    parent.clearDialog();
    parent.showInfoDialog(update_label_queryfailed);
    setTimeout(parent.clearDialog, UPDATE_STATUS_INTERVAL);
}

function update_displayNewVersionFoundInfo()
{
    parent.clearDialog();
    if(g_need_checkNewVersion)
    {
        button_enable("update_now", "1");
        g_need_checkNewVersion = false;
        g_download_percent = 10;
        download_comfirm_with_new_feature();
    }
    else
    {
        download_comfirm_with_new_feature();
    }
}

function update_send_info(ack)
{
    var req = object2xml("request", ack)
    saveAjaxData("api/online-update/comfirmupdate",req,function($xml){
        var ret = xml2object($xml);
        if(ret.type == 'response')
        {
            if(isAjaxReturnOK(ret.response))
            {
                log.debug("update start");
                parent.$('#DownloadProgressing_Cancel').hide();
                parent.$('#dialog_header_download_update').html(update_label_updating);
                update_showUpdating();
            }else{
                log.debug("update terminate");
            }
        }
        },{
        sysc :true,
        errorCB:function(){
            log.deug("update terminate");
            }
        });
}

function update_comfirm()
{
    parent.$('#update_download,#div_wrapper').hide();
    g_dialog_hide_download = true;
    g_update_percent = 10;
    g_dialog_hide_update = false;
    parent.showupdateConfirmDialog(update_label_comfirm, function(){
        var ack={
            AckUpdate:0
            };
        parent.g_is_login_opened = true;
        update_send_info(ack);
        }, function(){
        var ack={
            AckUpdate:2
            };
        update_send_info(ack);
        
        },function(){
        var ack={
            AckUpdate:1
            };
        update_send_info(ack);  
        });
}

function download_send_info(ack)
{
    var req = object2xml("request", ack);
    saveAjaxData("api/online-update/ack-newversion",req,function($xml){
        var ret = xml2object($xml);
        if(ret.type=='response')
        {
            if(isAjaxReturnOK(ret))
            {
                if(ack.userAckNewVersion==0)
                {
                    log.debug("download start");
                    parent.showWaitingDialog(update_label_waiting,dialup_label_connecting);
                    setTimeout(function(){
                            parent.closeWaitingDialog();
                        $("#wait_table").remove();
                        update_checkUpdateStatus();
                        },2000);
                }
            }else{
                log.debug("download terminate");
            }
        }
        },{
        errorCB:function(){
            log.deug("download terminate");
            }
        });
}
function download_comfirm_with_new_feature()
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
        current_changelog += "<br>";    
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

    parent.$('#update_download,#div_wrapper').hide();
    g_dialog_hide_download = false;
    g_dialog_hide_update = true;
    parent.showConfirmDialog(update_label_newersion+current_changelog, function(){
        var ack={
            userAckNewVersion:0
            };
        download_send_info(ack);
        }, function(){
        var ack={
            userAckNewVersion:1
            };
        download_send_info(ack);           
        });
}
function download_comfirm()
{
    parent.$('#update_download,#div_wrapper').hide();
    g_dialog_hide_download = false;
    g_dialog_hide_update = true;
    parent.showConfirmDialog(update_label_newersion, function(){
        var ack={
            userAckNewVersion:0
            };
        download_send_info(ack);
        }, function(){
        var ack={
            userAckNewVersion:1
            };
        download_send_info(ack);           
        });
}

function update_downloadSuccess()
{
    g_dialog_hide_update = true;
    parent.$('.update_dialog').hide();
    parent.reputPosition(parent.$('#upload_success'), parent.$('#div_wrapper'));
}

function updatefinish_timewait(){
    parent.$('.update_dialog').hide();
    parent.showWaitingDialog(common_waiting, update_label_finish_waiting);
    ping_setPingAddress(DEFAULT_GATEWAY_IP);
    setTimeout(startPing, 50000);
}
function update_clickSuccessCancel()
{
    var dialogLeft = $(window).width() / 2 - parent.$('.update_dialog').outerWidth() / 2;
    parent.$('#update_success_ok').bind('click', function() {
        parent.$('#upload_success,#div_wrapper').hide();
        reboot();
    });
}

function update_failed()
{
    g_dialog_hide_update = true;
    g_update_percent = 10;
    parent.$('.update_dialog').hide();
    parent.showConfirmDialog(update_label_failed, function(){
        reloadPage();
        });
}

function update_showUpdating()
{
    //show UpdateProgress
    if(true == g_dialog_hide_update)
    {
        g_dialog_hide_update = false;
        return;
    }
    var persent = parent.formatFloat(parseInt(g_update_percent, 10) / 100, 2);
    var update_width = parent.$('.graph').width() - 8;
    update_width = parseInt(update_width * persent, 10);
    parent.$('.press').css({'width': update_width + 'px'});
    if(100 == g_update_percent)
    {
        g_update_percent = 0;
        clearTimeout(g_process_terminate);
    }
    g_update_percent += 10;
    parent.cancelLogoutTimer();
    //show Update dialog
    if (parent.$('#div_wrapper').size() < 1) {
        parent.$('.body_bg').before("<div id='div_wrapper'></div>");
    }
    parent.$('#dialog_header_download_update').html(update_label_updating);
    parent.$('#DownloadProgressing_Cancel').hide();
    parent.reputPosition(parent.$('#update_download'), parent.$('#div_wrapper'));
    parent.disableTabKey();
    g_process_terminate = setTimeout(update_showUpdating, DOWNLOAD_INTERVAL);
}

function update_showDownloading(currentProgress) {
    //show DownloadProgress
    var persent = parent.formatFloat(parseInt(currentProgress, 10) / 100, 2);
    var update_width = parent.$('.graph').width() - 8;
    update_width = parseInt(update_width * persent, 10);
    parent.$('.press').css({'width': update_width + 'px'});
    parent.cancelLogoutTimer();
    //show Download dialog
    if (parent.$('#div_wrapper').size() < 1) {
        $('.body_bg').before("<div id='div_wrapper'></div>");
    }
    parent.$('#dialog_header_download_update').html(IDS_update_label_downloading);
    parent.$('#DownloadProgressing_Cancel').show();
    parent.reputPosition(parent.$('#update_download'), parent.$('#div_wrapper'));

    parent.disableTabKey();
}

function update_processStatus(CurrentComponentStatus)
{
    switch (CurrentComponentStatus)
    {
        //The content in log debug is just for test, it can be ignored.
        case UPDATE_STATUS_IDLE:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_IDLE)');
            return;
        case UPDATE_STATUS_QUERYING:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING)');
            return;
        case UPDATE_NEWVERSION_FOUND:
            log.debug('online-update : update_processStatus(UPDATE_NEWVERSION_FOUND)');
            update_displayNewVersionFoundInfo(); //show dialog new feature
            return;
        case UPDATE_STATUS_QUERYING_FAILED:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING_FAILED)');
            update_displayQueryFailed();
            return;
        case UPDATE_UP_TO_DATE:
            log.debug('online-update : update_processStatus(UPDATE_UP_TO_DATE)');
            update_displayNoNewVersionInfo();//Told user there hasn't new version.
            return;
        case UPDATE_DOWNLOAD_FAILED:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_FAILED)');
            update_failed();
            parent.startLogoutTimer();
            return;
        case UPDATE_DOWNLOAD_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PROGRESSING');
            update_showDownloading(g_status.DownloadProgress);
            parent.cancelLogoutTimer();
            break;
        case UPDATE_DOWNLOAD_PENDING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PENDING)');
            update_displayNewVersionFoundInfo();
            return;
        case UPDATE_DOWNLOAD_COMPLETE:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_COMPLETE)');
            if(!g_dialog_hide_updatecomfirm){
                update_comfirm();
                parent.cancelLogoutTimer();
                g_dialog_hide_updatecomfirm = true;
                }
            break;
        case UPDATE_READYTO_UPDATE:
            log.debug('online-update : update_processStatus(UPDATE_READYTO_UPDATE)');
            break;
        case UPDATE_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_PROGRESSING)');
            parent.cancelLogoutTimer();
            update_showUpdating();
            break;
        case UPDATE_FAILED_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_HAVEDATA)');
            update_failed();
            parent.startLogoutTimer();
            return;
        case UPDATE_FAILED_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_NODATA)');
            update_failed();
            parent.startLogoutTimer();
            return;
        case UPDATE_SUCCESSFUL_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_HAVEDATA)');
            update_downloadSuccess();
            parent.cancelLogoutTimer();
            updatefinish_timewait();
            return;
        case UPDATE_SUCCESSFUL_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_NODATA)');
            update_downloadSuccess();
            update_clickSuccessCancel();
            parent.startLogoutTimer();
            return;
        default:
            return;
    }
    setTimeout(update_checkUpdateStatus, UPDATE_STATUS_INTERVAL);
}

function update_check_newverison()
{
  saveAjaxData('api/online-update/check-new-version',"",
        function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response')
            {
               if(isAjaxReturnOK(ret))
               {
                 parent.showWaitingDialog(update_label_waiting,common_search+'...');
                 setTimeout(function(){
                     parent.closeWaitingDialog();
                     $("#wait_table").remove();
                     update_checkUpdateStatus();
                     },2000);
               }else{
                  log.debug("check failed");
                  setTimeout(update_check_newverison, UPDATE_STATUS_INTERVAL);
               }
            }
        },
        {
            errorCB: function() {
                setTimeout(update_check_newverison, UPDATE_STATUS_INTERVAL);
            }
        }
    );
}

function update_checkUpdateStatus() {
    getAjaxData('api/online-update/status',
        function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response')
            {
                g_status = update_ret.response;
                var updateStatus = parseInt(g_status.CurrentComponentStatus, 10);
                update_processStatus(updateStatus);
            }
        },
        {
            errorCB: function() {
                setTimeout(update_checkUpdateStatus, UPDATE_STATUS_INTERVAL);
            }
        }
    );
}

function update_onClickUpdateNow() {
    var updateStatus = parseInt(parent.G_NotificationsStatus.OnlineUpdateStatus, 10);
    if (updateStatus != UPDATE_DOWNLOAD_PROGRESSING && updateStatus != UPDATE_PROGRESSING)
    {
        clearAllErrorLabel();
        $('#update_now').unbind('click');
        var submitData = {
            userAckNewVersion: 0
        };
        var res = object2xml('request', submitData);
        saveAjaxData('api/online-update/ack-newversion', res, function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response')
            {
                log.debug('update data successfull');
                update_checkUpdateStatus();
            }
            $('#update_now').bind('click', update_onClickUpdateNow);
        });
    }
    else
    {
        clearAllErrorLabel();
        showErrorUnderTextbox('update_now', IDS_update_updateing_try_again);
    }
}

function update_cancelDownloading() {
    if (isButtonEnable_Parent('DownloadProgressing_Cancel'))
    {
        parent.$('#update_download,#div_wrapper').hide();
        g_dialog_hide_download = true;
        saveAjaxData('api/online-update/cancel-downloading', '', function($xml) {
            var return_ret = xml2object($xml);
            if (return_ret.type == 'response')
            {
                log.debug('update data successfull');
            }
        });
    }
}

function initPage()
{
    button_enable("url_auto_apply", 0);
   
    getAjaxData("api/online-update/configuration", function($xml){
        var ret = xml2object($xml);
        if(ret.type=="response")
        {
            if(ret.response.autoUpdateInterval == 0) 
            {
                $('input[name=auto_check_update][value=0]').attr('checked', true);
            }
            else 
            {
                $('input[name=auto_check_update][value=1]').attr('checked', true);
            }
            $("#up_url").val(ret.response.updateURL);
        }else{
            log.dubug("get statics wrong");
        }
    }, {
        sync: true
    });
     // get current settings gateway address
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            DEFAULT_GATEWAY_IP = ret.response.DhcpIPAddress;
        }
    }, {
        sync: true
    }
    );
}

function isValidUrlName(url)
{
    var i=0;
    var j=0;
    var invalidArray = new Array();
    invalidArray[i++] = "www";
    invalidArray[i++] = "com";
    invalidArray[i++] = "org";
    invalidArray[i++] = "net";
    invalidArray[i++] = "edu";
    invalidArray[i++] = "www.";
    invalidArray[i++] = ".com";
    invalidArray[i++] = ".org";
    invalidArray[i++] = ".net";
    invalidArray[i++] = ".edu";

    if (url=='')
    {
        return false;
    }
    
    if (isValidAscii(url) != '')
    {
        return false;
    }

    for (i = 0; i < url.length; i++)
    {
        if (url.charAt(i) == ' ')
        {
             return false;
        }
        if (url.charAt(i) == '\\')
        {
             return false;
        }
    }

    if ((url.length < 3 && url.length > 0) || url.length > 63 )
    {
        return false;
    }
    for(j=0; j< invalidArray.length; j++)
    {
        if (url == invalidArray[j])
        {
            return false;
        } 
    }
    return true;
}

function checkUrlandPeriod(){
    if(isValidUrlName($.trim($('#up_url').val()))==false)
    {
        showErrorUnderTextbox('up_url', samba_input_invalid);
        return false;
    }
    return true;
}

function postURLandPeriod(){
    var auto_update = "1";
    if($("#auto_check_update_enable").get(0).checked) 
    {
        auto_update = "1";
    }
    else
    {
        auto_update = "0";
    }
    var val_req ={
        autoUpdateInterval:auto_update,
        updateURL:$("#up_url").val()
    };
    req = object2xml("request",val_req);
    saveAjaxData("api/online-update/configuration",req,function($xml){
        ret = xml2object($xml);
        if(ret.type == "response")
        {
            if(isAjaxReturnOK(ret))
            {
                parent.showInfoDialog(common_success);
                button_enable("url_auto_apply", 0);
            }else{
                parent.showInfoDialog(common_failed);
                initPage();
                
            }
        }else{
           log.debug("statics is wrong");
        }
    });
}

function checkBtndisable()
{
    if("901" == parent.G_MonitoringStatus.response.ConnectionStatus 
     || '2' == parent.G_MonitoringStatus.response.X_IPv4WireLineConnectionStatus
     || '2'== parent.G_MonitoringStatus.response.X_IPv6ConnectionStatus
     || '2'== parent.G_MonitoringStatus.response.X_IPv6WireLineConnectionStatus 
     ){
        button_enable("check_for_update", 1);
    }else{
        button_enable("check_for_update", 0);
    }
    setTimeout(checkBtndisable,6000);
}
/**********************************After loaded (common)************/
$(document).ready(function() {
    button_enable("url_auto_apply", "0");
    button_enable("update_now", "0");
    initPage();
    update_checkUpdateStatus();
    $('input').bind('change input paste cut keydown', function(){
        button_enable('url_auto_apply', '1');
        clearAllErrorLabel();
    });

    $("#url_auto_apply").click(function(){
        clearAllErrorLabel();
        if(isButtonEnable("url_auto_apply")&&checkUrlandPeriod())
        {
            postURLandPeriod();
        }else{
            return ;
        }
    });

    $('#update_now').css("display","none");
    $('#update_now').bind('click', function(){
        g_download_percent = 10;
        update_onClickUpdateNow();
    });
    $('#check_for_update').bind('click', function(){
        if(isButtonEnable("check_for_update"))
        {
            g_need_checkNewVersion = true;
            g_dialog_hide_updatecomfirm = false;
            update_check_newverison();
        }
    });
    checkBtndisable();
    parent.$('#DownloadProgressing_Cancel').unbind().bind("click",update_cancelDownloading);
});
