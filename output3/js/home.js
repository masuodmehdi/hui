[settings]
commandtype      = 0xF80058A1 ;
attributenum     = 2 ;
displayattribute = 1 ;

[parameter]
attribute=alias<egr>          type<uint>    range<0x0,0x0D>       default<0>;
attribute=alias<schmode>      type<uint>    range<0x0,0x1>        default<0>;

[help]
typedef struct
{
    hi_lsw_qos_egr_e           em_egr;
    hi_lsw_qos_sch_mode_e  em_schmode;
}hi_lsw_port_schmode_s;

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

/* 队列调度模式 */
typedef enum {
    HI_LSW_QOS_SCH_SP_MODE_E = 0,        /* SP调度模式 */
    HI_LSW_QOS_SCH_WRR_MODE_E,           /* WRR调度模式 */
}hi_lsw_qos_sch_mode_e;
ectionStatus_S2: present connection status.
 */
var g_connectionStatus_S1 = null;
var g_connectionStatus_S2 = null;

/*
 when the user clicks connect/disconnect button, UI should stop updating
 connection
 status for just one cycle interval(default 3s).
 */
var g_freezeConnectionUpdate = false;

//Button connection or disconnection click effect
function index_clickDisconnectBtn() {
    g_is_connect_clicked = false;
    $('#disconnect_btn').removeClass('mouse_on');
    button_enable('disconnect_btn', '0');
    setConnectionLink(dialup_label_disconnecting);
    g_dialup_action.Action = '0';
    index_sendConnectionAction();
}

function index_clickConnectBtn() {
    g_is_disconnect_clicked = false;
    setConnectionLink(dialup_label_connecting);
    $('#connect_btn').removeClass('mouse_on');
    button_enable('connect_btn', '0');
    g_dialup_action.Action = '1';
    index_sendConnectionAction();
}

function index_clickCancelBtn() {
    g_dialup_action.Action = '0';
    index_sendConnectionAction();
}

function index_sendConnectionAction() {

    var dialup_xml = object2xml('request', g_dialup_action);
    g_freezeConnectionUpdate = true;
    saveAjaxData('api/dialup/dial', dialup_xml, function($xml) {
        var dialup_ret = xml2object($xml);
        if (isAjaxReturnOK(dialup_ret)) {
            log.debug('api/dialup/dial ok');
        }
        else {
            log.debug('api/dialup/dial error');
        }
    });
}

function setHtml(){
    $.cookies.set('cookie', 'connectionstatus,null,connections', { expiresAt: new Date().getTime()+5*60*1000 });
}

function SetHotlinks() {
    var hotlinksHtml = '';
    var hasItem = false;

    var hotlinksurl = [];
    hotlinksurl = g_feature.hotlinks.items.item;

    if (typeof(hotlinksurl) == 'undefined') {
        return;
    }

    hotlinksHtml = '<table>';
    hotlinksHtml += " <tr  id = 'hotlink_hide'>";

    if (jQuery.isArray(hotlinksurl)) {
        $.each(hotlinksurl, function(n, value) {
            if (hotlinksurl[n] != "") {
                hotlinksHtml += '<td>';
                hotlinksHtml += '<span>';
                hotlinksHtml += "   <a id='hotlinks_" + n + "' href='" + value + "'>";
                hotlinksHtml += '   </a>';
                hotlinksHtml += '</span>';
                hotlinksHtml += '</td>';
                hasItem = true;
            }
        });
    }
    else {
        hotlinksHtml += '<td>';
        hotlinksHtml += '<span>';
        hotlinksHtml += "   <a id='hotlinks_0' href='" + hotlinksurl + "'></a>";
        hotlinksHtml += '</span>';
        hotlinksHtml += '</td>';
    }

    if(!hasItem)
    {
        $('.hot_links').attr('style', 'border-top:0px;');
    }
    
    hotlinksHtml += '  </tr>';
    hotlinksHtml += '</table>';

    $('.hotlinks').html(hotlinksHtml);

    /*
     * show hotlinks icon
     */
    if (jQuery.isArray(hotlinksurl)) {
        $.each(hotlinksurl, function(n, value) {
            var temp = '#hotlinks_' + n;
            $(temp).css({
                background: 'url(../res/hotlinks_' + n + '.gif) center 0 no-repeat'
            });
        });
    }
    else {
        $('#hotlinks_0').css({
            background: 'url(../res/hotlinks_0.gif) center 0 no-repeat'
        });
    }

}

/*function enable_connection_button(button_id, enable_status)
 {
 var parent = $("#" + button_id);
 if (enable_status == "1")
 {
 parent.removeClass("button_connecting");
 }
 else if(enable_status == "0")
 {
 parent.addClass("button_connecting");
 }
 }*/

/*
 update connection status, signal strength, connect button text ,etc
 */
function index_updateConnectionStatus() {
    /*
     when the user clicks connect/disconnect button, UI should stop updating
     connection
     status for just one cycle interval(default 3s).
     */
    if (g_freezeConnectionUpdate) {
        g_freezeConnectionUpdate = false;
        return;
    }
    var currentStatus = G_MonitoringStatus.response;
    var signal_strength = '';
    if (typeof(currentStatus.SignalIcon) != 'undefined' ||
    currentStatus.SignalIcon != null) {
        signal_strength = '0' + currentStatus.SignalIcon;
    }
    else {
        signal_strength = '0' + parseInt(currentStatus.SignalStrength / 20, 10).toString();
    }

    /*
     * singal strength
     */
    $('#status_img').css({
        background: 'url(../res/icon_signal_' + signal_strength + '.gif) 0 0 no-repeat'
    });
    log.debug('INDEX : index_updateConnectionStatus(' + currentStatus.ConnectionStatus + ')');
    switch (currentStatus.ConnectionStatus) {
        case '2':
        case '3':
        case '5':
        case '8':
        case '20':
        case '21':
        case '23':
        case '27':
        case '28':
        case '29':
        case '30':
        case '31':
        case '32':
        case '33':
            // Connection failed. The profile is invalid, please contact your
            // Service Provider.
            $('#index_connection_status').html(dialup_label_connection_fail_wrong_param + ' ' + "<div id='profile_settings'><a href='profilesmgr.html'>" + dialup_label_wireless_profile + '</a></div>');
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case '7':
        case '11':
        case '14':
        case '37':
            // Connection failed. Network access not allowed, please contact your
            // Service Provider.
            setConnectionLink(dialup_label_connection_fail_network_unvisitable);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case '12':
        case '13':
            // Connection failed. Roaming not allowed, please contact your
            // Service Provider.
            setConnectionLink(dialup_label_connection_fail_roaming_unallowable);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case MACRO_CONNECTION_CONNECTING:
            // connecting
            if ($('#connect_btn').size() == 0) {
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                
            }
            setConnectionLink(dialup_label_connecting);
            button_enable('connect_btn', '0');
            $('#connect_btn').removeClass('mouse_on');
           
            break;
        case MACRO_CONNECTION_DISCONNECTING:
            // disconnecting
            setConnectionLink(dialup_label_disconnecting);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            button_enable('disconnect_btn', '0');
            break;
        case MACRO_CONNECTION_CONNECTED:
            // connected
            setConnectionLink(dialup_label_connected);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            break;
        case MACRO_CONNECTION_DISCONNECTED:
            if (currentStatus.CurrentNetworkType == CURRENT_NETWORK_NO_SERVICE ||
            currentStatus.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
            currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE
            ) {
                if(currentStatus.SimStatus==0 && currentStatus.simlockStatus==1)
                {
                    // simlock active
                    $('#index_plmn_name').html(dialup_hint_simlock_active);
                }
                else
                {
                    // no coverage
                    $('#index_plmn_name').html(dialup_hint_no_network);
                }                
                setConnectionLink(hilink_label_connect_failed);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            else {
                // disconnected
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            break;
        case FORBID_AUTO_CONNECT_OPEN_DEVICE:
        case FORBID_RE_CONNECT_DROPLINE:
            // disconnected
            setConnectionLink(dialup_label_disconnected);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case FORBID_AUTO_CONNECT_OPEN_DEVICE_ROAMING:
        case FORBID_RE_CONNECT_DROPLINE_ROAMING:
            // Automation connect is disabled for roaming network.
            // You will have to manually connect the network.
            if (parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1) {
                $('#index_connection_status').html(hilink_label_roaming_auto_connection_forbid + "<div id='menu_connection_settings' style='display:none'><a href='connectionstatus.html' onclick='"+'setHtml()'+"'>" + hilink_label_auto_connection_link + '</a></div>');
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                if('admin' == g_login_usertype){
                    $('#menu_connection_settings').show();
                }
            }
            else {
                //roaming status is 0
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            break;
        default:
            // Connection failed. Please try again later. If the problem
            // persists, please contact your Service Provider.
            setConnectionLink(hilink_label_connect_failed_common_tip);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
    }

    // while ServiceStatus is not available, user can not click Connect Button
    if (currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE) {
        button_enable('connect_btn', '0');
    }
}

function createConnectionButton(button_dis, button_id) {
    if (!g_isAutoConnect) {
        if (1 == g_mouse_on_out_event) {
        $('#index_connection_button').html(create_button_html(button_dis, button_id, 'mouse_on'));
        }
        else {
            $('#index_connection_button').html(create_button_html(button_dis, button_id));
        }
    }
    
}

function index_checkConnectionStatusChange() {
    var currentStatus = G_MonitoringStatus.response;

    if (g_connectionStatus_S2 == null) {
        g_connectionStatus_S1 = currentStatus.ConnectionStatus;
        if (currentStatus.ConnectionStatus == MACRO_CONNECTION_CONNECTED) {
            main_getAdvertisement();
        }
    }
    else {
        g_connectionStatus_S1 = g_connectionStatus_S2;
    }
    g_connectionStatus_S2 = currentStatus.ConnectionStatus;

    if (g_connectionStatus_S1 != MACRO_CONNECTION_CONNECTED &&
    g_connectionStatus_S2 == MACRO_CONNECTION_CONNECTED) {
        index_gotoOperatorHomePage(true);
        main_getAdvertisement();
    }
}

/*
 show new update available while new version come.
 */
function index_checkUpdate() {
    if (typeof(G_NotificationsStatus) == 'undefined' || G_NotificationsStatus == null) {
        return;
    }
    if (typeof(G_NotificationsStatus.OnlineUpdateStatus) == 'undefined' ||
    G_NotificationsStatus.OnlineUpdateStatus == null) {
        return;
    }

    if (G_NotificationsStatus.OnlineUpdateStatus == '12' ||
    G_NotificationsStatus.OnlineUpdateStatus == '50') {
        $('#new_version_notice').html(common_new_version);
        return false;
    }
    else {
        $('#new_version_notice').html('');
    }
}

/*
 update message icon depends on sms unread count
 */
function index_updateUnreadMessages() {
    if (G_NotificationsStatus != null) {
        var localUnRead = G_NotificationsStatus.UnreadMessage;
        var smsStorageFull = G_NotificationsStatus.SmsStorageFull;
        if (0 < localUnRead) {
            $('#new_messages').html(localUnRead);
            $('#new_messages').show();
        }
        else {
            $('#new_messages').html('');
            $('#new_messages').hide();
        }
        if (smsStorageFull == '1') {
            $('#sms_store_full_tip').html(Label_sms_storage_full);
        }
        else {
            $('#sms_store_full_tip').html('');
        }
    }
}

function GetPLMN() {
    var plmn_name = '';
    getAjaxData('api/net/current-plmn', function($xml) {
        var plmn_ret = xml2object($xml);
        if ('response' == plmn_ret.type) {
            if (null == plmn_ret ||
            '' == plmn_ret.response.State ||
            ' ' == plmn_ret.response.State ||
            null == plmn_ret.response.State) {
                //$('#index_plmn_name').text('');
            }
            else {             
               if (typeof(plmn_ret.response.FullName) != 'undefined' &&
                    plmn_ret.response.FullName.length > 0) {
                    plmn_name = plmn_ret.response.FullName;

                    if (G_MonitoringStatus != null &&
                    typeof(G_MonitoringStatus.response) != 'undefined' &&
                    parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1 &&
                    parseInt(G_MonitoringStatus.response.ServiceStatus, 10) == SERVICE_STATUS_AVAIABLE) {
                        plmn_name += ' ';
                        plmn_name += IDS_dialup_label_roaming;
                    }

                    $('#index_plmn_name').text(plmn_name);
                }
                else if (typeof(plmn_ret.response.ShortName) != 'undefined' &&
                plmn_ret.response.ShortName.length > 0) {

                    plmn_name = plmn_ret.response.ShortName;

                    if (G_MonitoringStatus != null &&
                    typeof(G_MonitoringStatus.response) != 'undefined' &&
                    parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1 &&
                    parseInt(G_MonitoringStatus.response.ServiceStatus, 10) == SERVICE_STATUS_AVAIABLE) {
                        plmn_name += ' ';
                        plmn_name += IDS_dialup_label_roaming;
                    }
                    $('#index_plmn_name').text(plmn_name);
                }
                else if (typeof(plmn_ret.response.Numeric) != 'undefined' &&
                    plmn_ret.response.Numeric.length > 0) {
                    plmn_name = plmn_ret.response.Numeric;

                    if (G_MonitoringStatus != null &&
                    typeof(G_MonitoringStatus.response) != 'undefined' &&
                    parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1 &&
                    parseInt(G_MonitoringStatus.response.ServiceStatus, 10) == SERVICE_STATUS_AVAIABLE) {
                        plmn_name += ' ';
                        plmn_name += IDS_dialup_label_roaming;
                    }

                    $('#index_plmn_name').text(plmn_name);
                } 
            }
        }
    });
    
    var rat = '';
    if (g_plmn_rat != 'undefined' && g_plmn_rat != "") {
        //plmn Status
        switch (g_plmn_rat) {
            case MACRO_CURRENT_NETWOORK_2G:
                rat = plmn_label_2g;
                break;
            case MACRO_CURRENT_NETWOORK_3G:
                rat = plmn_label_3g;    
                break;
            case MACRO_CURRENT_NETWOORK_H:
                rat = plmn_label_h;
                break;
             case MACRO_CURRENT_NETWOORK_4G:
                rat = plmn_label_4g;
                break;
            default:
                rat = "";
                break;
        }
        
    }
    $('#status_img').html('<p>' + rat + '</p>');
}

/*
 update current operator name and generation
 */
function index_updatePLMN() {
    /*
     * if wireline, no need to get PLMN
     */
    if ("2"==g_conection_device)
    {
       return;
    }
    /*
     * if no signal, no need to get PLMN
     */

     GetPLMN();

}

function getWiFiStatusAndMyNumber() {
    var mynumber = common_unknown;
    getAjaxData('api/device/information', function($xml) {
        var ret = xml2object($xml);
        if (('response' == ret.type) && (ret.response.Msisdn != '')) {
            mynumber = ret.response.Msisdn;
        }
    }, {
        sync: true
    });

    $('#ConnectionStatus').text(mynumber);
    setHTMLByWlanBasicSetting();

}

/*
 update signal, new message icon, new update icon repeatly.
 */
function index_updatePageStatusListener() {
    index_updateUnreadMessages();
    linkStatusFork();
    //index_updateConnectionStatus();
    index_checkConnectionStatusChange();
    index_checkUpdate();
    initConnectionStatus();
    getWiFiStatusAndMyNumber();
    index_updatePLMN();
}

/*function getWlanBasicStatus() {
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var basic_ret = xml2object($xml);
        if (basic_ret.type == 'response') {
            g_index_wlan_basic_settings = basic_ret.response;
        }
        setHTMLByWlanBasicSetting();
    });
}*/

function setHTMLByWlanBasicSetting() {

    var monitoring_status = G_MonitoringStatus;
    if(null != monitoring_status) {
        if(monitoring_status.response.WifiStatus == 1){
            $('#CurrentWifiStatus').text(common_on);
            $('#CurrentWifiUser').html(monitoring_status.response.CurrentWifiUser + '/' + monitoring_status.response.TotalWifiUser);
        }
        else{
            $('#CurrentWifiStatus').text(common_off); 
            $('#CurrentWifiUser').html(wlan_label_no_users);
        }
    }
}

/*function getWlanBasicStatusMultiSSID() {
    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var basic_ret = xml2object($xml);
        if (basic_ret.type == 'response' && 'undefined' != typeof(basic_ret.response.Ssids.Ssid)) {
            g_index_wlan_basic_settings = basic_ret.response.Ssids.Ssid;
        }
        getWlanSecurityStatusMultiSSID();
    });
}

function getWlanSecurityStatusMultiSSID() {
    getAjaxData('api/wlan/multi-security-settings', function($xml) {
        var security_ret = xml2object($xml);
        if (security_ret.type == 'response') {
            g_wlan_security_settings = security_ret.response;
        }
        setHTMLByWlanSecuritySetting();
    });
}*/

function setHTMLByWlanSecuritySetting() {
    var settings = g_wlan_security_settings;

    //Wlan status
    if (settings && settings.WifiEnable == 1) {
        $('#CurrentWifiStatus').text(common_on);
        $('#CurrentWifiUser').hide();
        $("#wlan_status_single_or_multi > tbody > tr:gt(1)").remove();
        var ssid_list_index = '';
        $.each(g_index_wlan_basic_settings, function() {
            ssid_list_index += '<tr>';
            ssid_list_index += '<td>' + this.WifiSsid + '</td>';
            ssid_list_index += "<td><label class='list_right'>" + this.WifiAssociatedStationNum + '</label></td>';
            ssid_list_index += '</tr>';
        });
        $('#wlan_status_single_or_multi').append(ssid_list_index);
    }
    else {
        $('#CurrentWifiStatus').text(common_off);
        $('#CurrentWifiUser').html(wlan_label_no_users);
    }
}

function getLoginUitl(login_id, loginTrafficxml) {
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' TB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' GB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' MB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' KB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml), 2) + ' B');
    }
    }
function initConnectionStatus() {
    if (g_module.ap_station_enabled &&
    G_StationStatus != null &&
    WIFI_STATION_CONNECTED == G_StationStatus.response.ConnectStatus) {
        var totalTimesArray = getCurrentTime(G_StationStatus.response.CurrentTime);
        getLoginUitl('TotalDownload', G_StationStatus.response.RxFlux);
        getLoginUitl('TotalUpload', G_StationStatus.response.TxFlux);
        $('#TotalConnectTime').text(totalTimesArray);
    }
    else {
        getAjaxData('api/monitoring/traffic-statistics', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                var g_login_function = ret.response;
                if (G_MonitoringStatus == null ||
                    (parent.G_MonitoringStatus.response.ConnectionStatus != MACRO_CONNECTION_CONNECTED 
                    && parent.G_MonitoringStatus.response.X_IPv6ConnectionStatus != MACRO_CONNECTION_IPV6CONNECTED 
                    && parent.G_MonitoringStatus.response.X_IPv4WireLineConnectionStatus != MACRO_WIRELINE_CONNECTION_CONNECTED
                    && parent.G_MonitoringStatus.response.X_IPv6WireLineConnectionStatus != MACRO_WIRELINE_CONNECTION_IPV6CONNECTED )) {
                    g_login_function.CurrentConnectTime = 0;
                    g_login_function.CurrentDownload = 0;
                    g_login_function.CurrentUpload = 0;
                }
                var totalTimesArray = getCurrentTime(g_login_function.CurrentConnectTime);
                getLoginUitl('TotalDownload', g_login_function.CurrentDownload);
                getLoginUitl('TotalUpload', g_login_function.CurrentUpload);
                $('#TotalConnectTime').text(totalTimesArray);
            }
            else {
                log.error('Load traffic-statistics data failed');
            }
        });
    }
}

function main_executeBeforeDocumentReady() {
    index_redirectPage();
}

main_executeBeforeDocumentReady();
getConnectionStautes();
/*
 invoke while document is ready
 */
$(document).ready(function() {
    if (LANGUAGE_DATA.current_language == 'ar_sa') {
        $('#revicedsent').text(common_sent + '/' + dialup_label_received + common_colon);
    }
    else {
        $('#revicedsent').text(dialup_label_received + '/' + common_sent + common_colon);
    }
    
    if($.browser.msie) {
        if((parseInt($.browser.version.charAt(0), 10) === 6 || parseInt($.browser.version.charAt(0), 10) === 7) && G_MonitoringStatus != null && typeof(G_MonitoringStatus) != 'undefined') {
            setTimeout(index_updatePageStatusListener, 1);
        }
    }

    addStatusListener('index_updatePageStatusListener()');
	
    

    if (g_module.ussd_enabled) {
        $('.index_appicon_ussd').show();
    }

    if (!g_feature.connection.enable) {
        $('.login_box_info').css({
            display: 'none'
        });
    }

    if (!g_feature.connection.connectionstatus) {
        $('.connection').css({
            display: 'none'
        });
    }
    if (g_module.sdcard_enabled) {
        $('#login_sharing_div').show();
        $('#view_SDCard_btn').bind('click', function() {
            window.location.href = 'sdcardsharing.html';
        });
    }

    if (!g_module.wifi_enabled) {
        $('.wlan_status').css({
            display: 'none'
        });
    }
    setHTMLByWlanBasicSetting();
    if (typeof(g_feature.hotlinks.enable) != 'undefined') {
        if (g_feature.hotlinks.enable) {
            SetHotlinks();
        }
        else {
            $('.hot_links').hide();
        }
    }

    var login_status_items = $('.login_info > div:visible');
    if (login_status_items.size() > 2) {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '33.3%'
            });
        });
    }
    else {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '50%'
            });
        });
    }

    //Button effect when mouseover and out
    $('#connect_btn, #disconnect_btn').live('mouseover', function() {

        if (!isButtonEnable('connect_btn') || !isButtonEnable('disconnect_btn')) {
            return;
        }
        else {
            $(this).addClass('mouse_on');
        }
        g_mouse_on_out_event = 1;
    });
    $('#connect_btn, #disconnect_btn').live('mouseout', function() {
        $(this).removeClass('mouse_on');
        g_mouse_on_out_event = 2;
    });
    $('#notification_tray').click(function() {
        if (!isButtonEnable('notification_tray')) {
            return;
        }
        else {
            gotoPageWithHistory('installsoftware.html');
        }
    });
    $('#connect_btn').live('click', function() {
        if (!isButtonEnable('connect_btn')) {
            return;
        }
        if(1 == G_MonitoringStatus.response.RoamingStatus && 0 == g_conection_romaingswitch){
            showConfirmDialog(hint_roaming_closed_note,function(){});
            return;
        }
        g_is_connect_clicked = true;
        index_clickConnectBtn();
    });
    $('#cancel_btn').live('click', function() {
        if (!isButtonEnable('cancel_btn')) {
            return;
        }
        g_is_disconnect_clicked = false;
        g_is_connect_clicked = false;
        $('#cancel_btn').removeClass('mouse_on');
        button_enable('cancel_btn', '0');
        
        setConnectionLink(dialup_label_connecting);
        index_clickCancelBtn();
    });
    $('#disconnect_btn').live('click', function() {
        if (!isButtonEnable('disconnect_btn')) {
            return;
        }
        g_is_disconnect_clicked = true;
        index_clickDisconnectBtn();
    });
});
/*
 goto autorun download page when found new autorun version on device.
 goto operator homepage according to /api/redirection/homepage
 */

function index_redirectPage() {
    var deviceVersion = '';
    var pcVersion = '';

    // get pc autorun version
    pcVersion = getQueryStringByName('version');
    if (pcVersion == null || pcVersion.length <= 0) {
        return;
    }

    // get device autorun version
    getAjaxData('api/device/autorun-version', function($xml) {
        var autorun_ver = xml2object($xml);
        if ('response' == autorun_ver.type) {
            deviceVersion = autorun_ver.response.Version;
        }
    }, {
        sync: true
    });

    var string1list = pcVersion.split('.');
    var string2list = deviceVersion.split('.');
    var isNewVersionFound = false;
    if (parseInt(string1list[4], 10) != parseInt(string2list[4], 10)) {
        isNewVersionFound = true;
    }
    var i = 0;
    for (i; i < 4; i++) {
        if (string1list[i] < string2list[i]) {
            isNewVersionFound = true;
        }
        else if (string1list[i] > string2list[i]) {
            break;
        }
    }
    if (isNewVersionFound) {
        gotoPageWithoutHistory('update_autorun.html');
    }
    else {
        /*
         redirect to carrier homepage when connected to internet
         */
        getAjaxData('api/monitoring/status', function($xml) {
            var status = xml2object($xml);
            if ('response' == status.type) {
                g_connectionStatus_S2 = status.response.ConnectionStatus;
                if (status.response.ConnectionStatus == MACRO_CONNECTION_CONNECTED) {
                    index_gotoOperatorHomePage(false);
                }
            }
        }, {
            sync: true
        });
        if (null == g_connectionStatus_S2) {
            g_connectionStatus_S2 = MACRO_CONNECTION_DISCONNECTED;
        }
    }
}

/*
 goto operator homepage
 */
function index_gotoOperatorHomePage(bNewWindow) {
    getAjaxData('api/redirection/homepage', function($xml) {
        var homepage_ret = xml2object($xml);
        if ('response' == homepage_ret.type) {
            /*
             EnableRedirection -- whether need to do the redirection.
             1 : yes      0 : no
             */
            if ('1' == homepage_ret.response.EnableRedirection) {
                /*
                 if carrier homepage url is begin with "http", just redirect to
                 this url
                 otherwise UI should insert "http://" prefix to this url before
                 redirection
                 */
                var homepage_url = null;
                if (homepage_ret.response.Homepage.length > 4 &&
                homepage_ret.response.Homepage.toLowerCase().substring(0, 4) == 'http') {
                    homepage_url = homepage_ret.response.Homepage;
                }
                else {
                    homepage_url = 'http://' + homepage_ret.response.Homepage;
                }

                if (bNewWindow) {
                    gotoPageWithHistory(homepage_url);
                }
                else {
                    gotoPageWithoutHistory(homepage_url);
                }
            }
        }
    }, {
        sync: true
    });
}


function main_getAdvertisement() {
    if (g_feature.adcontent_enable) {
        $('#ad_div').show();
        $('#ad_iframe').get(0).src = 'adcontent.html';
    }
}

function setConnectionLink(connectType) {   
    $('#index_connection_status').html(connectType + "<div id='menu_connection_settings' style='display:none'><a href='connectionstatus.html' onclick='"+'setHtml()'+"'>" + hilink_label_auto_connection_link + '</a></div>');
    if('admin' == g_login_usertype){
        $('#menu_connection_settings').show();
    }
}


function getConnectionStautes() {
    getAjaxData('api/connection/connection', function($xml) {
        var conn_ret = xml2object($xml);
        if (conn_ret.type == 'response') {
            g_conection_device = conn_ret.response.ConnectionDevice;
            g_conection_romaingswitch = conn_ret.response.RoamAutoConnectEnable;
        } else {
            log.error('Error, no data');
        }
    }, {
        sync: true
    });
    var wirelineConnectMode;
    var wirelessConnectMode;
    getAjaxData('api/dialup/connection', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
            wirelessConnectMode = ret.response.ConnectMode;
            wirelineConnectMode = ret.response.Wireline_ConnectMode;
            (DIALUP_MODE_MANUAL == wirelessConnectMode) ? g_wirelessAutoConnect = false : g_wirelessAutoConnect = true;
            (DIALUP_MODE_MANUAL == wirelineConnectMode) ? g_wirelineAutoConnect = false : g_wirelineAutoConnect = true;                     
        }
    },{
       sync:true
    });
}

function index_updateWirelineConnectionStatus(){
    /*
     when the user clicks connect/disconnect button, UI should stop updating
     connection
     status for just one cycle interval(default 3s).
     */
    if (g_freezeConnectionUpdate) {
        g_freezeConnectionUpdate = false;
        return;
    }
    var currentStatus = G_MonitoringStatus.response;
    var signal_strength = '';
    if (typeof(currentStatus.SignalIcon) != 'undefined' || currentStatus.SignalIcon != null) {
        signal_strength = '0' + currentStatus.SignalIcon;
    }else {
        signal_strength = '0' + parseInt(currentStatus.SignalStrength / 20, 10).toString();
    }

    /*
     * singal strength
     */
     if((MACRO_PIN_REQUIRED == g_main_convergedStatus.SimState) || (MACRO_PUK_REQUIRED == g_main_convergedStatus.SimState)||
        (MACRO_SIM_STATUS_USIM_N == currentStatus.SimStatus) || (MACRO_SIM_STATUS_USIM_PS_CS_N == currentStatus.SimStatus)||
        (MACRO_SIM_STATUS_USIM_NE == currentStatus.SimStatus) || ("1"==currentStatus.simlockStatus)){
         $('#status_img').css({background: 'none'});
     }else{
        $('#status_img').css({background: 'url(../res/icon_signal_' + signal_strength + '.gif) 0 0 no-repeat'});
    }
    var totalStatus =currentStatus.X_IPv4WireLineConnectionStatus.concat(currentStatus.X_IPv6WireLineConnectionStatus);
    switch (totalStatus) {
        case "11"://connecting brown
        case "13"://connecting brown
        case "14"://connecting brown
        case "15"://connecting brown
        case "31"://connecting brown
        case "41"://connecting brown
        case "51"://connecting brown
         // connecting
            if ($('#connect_btn').size() == 0) {
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                
            }
            setConnectionLink(dialup_label_connecting);
            button_enable('connect_btn', '0');
            $('#connect_btn').removeClass('mouse_on');
            break;

        case "12"://connected light
        case "21"://connected light
        case "22"://connected light
        case "23"://connected light
        case "24"://connected light
        case "25"://connected light
        case "32"://connected light
        case "42"://connected light
        case "52"://connected light
            // connected
            setConnectionLink(dialup_label_connected);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            break;

        case "33"://disconnecting brown
        case "34"://disconnecting brown
        case "35"://disconnecting brown
        case "43"://disconnecting brown
        case "44"://disconnecting brown
        case "45"://disconnecting brown
        case "53"://disconnecting brown
        case "54"://disconnecting brown
            // disconnecting
            setConnectionLink(dialup_label_disconnecting);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            button_enable('disconnect_btn', '0');
            break;

        case "55":// disconnected
            if (currentStatus.x_WireLineLinkStatus != WIRELINESERVICE_STATUS_AVAIABLE){
                // no coverage
                $('#index_plmn_name').html(dialup_hint_no_network);
                setConnectionLink(hilink_label_wireline_connect_failed);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            else {
                // disconnected
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            break;
        default:
            // Connection failed. Please try again later. If the problem
            // persists, please contact your Service Provider.
            setConnectionLink(hilink_label_connect_failed_common_tip);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
    }

    // while ServiceStatus is not available, user can not click Connect Button
    if (currentStatus.x_WireLineLinkStatus != WIRELINESERVICE_STATUS_AVAIABLE) {
        button_enable('connect_btn', '0');
    }
}

function index_updateWirelessConnectionStatus(){
    /*
     when the user clicks connect/disconnect button, UI should stop updating
     connection
     status for just one cycle interval(default 3s).
     */
    if (g_freezeConnectionUpdate) {
        g_freezeConnectionUpdate = false;
        return;
    }
    var currentStatus = G_MonitoringStatus.response;
    var signal_strength = '';
    if (typeof(currentStatus.SignalIcon) != 'undefined' || currentStatus.SignalIcon != null) {
        signal_strength = '0' + currentStatus.SignalIcon;
    }else {
        signal_strength = '0' + parseInt(currentStatus.SignalStrength / 20, 10).toString();
    }

    /*
     * singal strength
     */
     if((MACRO_PIN_REQUIRED == g_main_convergedStatus.SimState) || (MACRO_PUK_REQUIRED == g_main_convergedStatus.SimState)||
        (MACRO_SIM_STATUS_USIM_N == currentStatus.SimStatus) || (MACRO_SIM_STATUS_USIM_PS_CS_N == currentStatus.SimStatus)||
        (MACRO_SIM_STATUS_USIM_NE == currentStatus.SimStatus) || ("1"==currentStatus.simlockStatus)){
         $('#status_img').css({background: 'none'});
     }else{
        $('#status_img').css({background: 'url(../res/icon_signal_' + signal_strength + '.gif) 0 0 no-repeat'});
    }

    var totalStatus =currentStatus.ConnectionStatus.concat(currentStatus.X_IPv6ConnectionStatus);
    switch (totalStatus) {
        case "9001"://connecting brown
        case "9003"://connecting brown
        case "9004"://connecting brown
        case "9005"://connecting brown
        case "9021"://connecting brown
        case "9031"://connecting brown
            // connecting
            if ($('#connect_btn').size() == 0) {
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                
            }
            setConnectionLink(dialup_label_connecting);
            button_enable('connect_btn', '0');
            $('#connect_btn').removeClass('mouse_on');
            break;
        case "9002"://connected light
        case "9011"://connected light
        case "9012"://connected light
        case "9013"://connected light
        case "9014"://connected light
        case "9015"://connected light
        case "9022"://connected light
        case "9032"://connected light
            // connected
            setConnectionLink(dialup_label_connected);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            break;
        case "9023":// disconnecting brown
        case "9024":// disconnecting brown
        case "9033":// disconnecting brown
        case "9034":// disconnecting brown
        case "9035":// disconnecting brown
            // disconnecting
            setConnectionLink(dialup_label_disconnecting);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            button_enable('disconnect_btn', '0');
            break;
        case "9025":// disconnected 
            if (currentStatus.CurrentNetworkType == CURRENT_NETWORK_NO_SERVICE ||
            currentStatus.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
            currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE
            ) {
                // no coverage
                if(currentStatus.SimStatus==0 && currentStatus.simlockStatus==1)
                {
                    // simlock active
                    $('#index_plmn_name').html(dialup_hint_simlock_active);
                }
                else
                {
                    // no coverage
                    $('#index_plmn_name').html(dialup_hint_no_network);
                }                

                setConnectionLink(hilink_label_connect_failed);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            else {
                // disconnected
                if((currentStatus.RoamingStatus == "1")
                    &&(g_conection_romaingswitch == "0")){
                    setConnectionLink(hilink_label_roaming_off);
                }else{
                    setConnectionLink(dialup_label_disconnected);
                }
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            } 
            if (MACRO_CARD_LOCK_PIN_WRONG == g_main_convergedStatus.SimState)
            {
                // pinlock active
                $('#index_plmn_name').html(label_hint_pinlock_active);
            }
            break;
        default:
            // Connection failed. Please try again later. If the problem
            // persists, please contact your Service Provider.
            setConnectionLink(hilink_label_connect_failed_common_tip);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
    }

    // while ServiceStatus is not available, user can not click Connect Button
    if (currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE) {
        button_enable('connect_btn', '0');
    }
}

function linkStatusFork()
{
    if(g_conection_device == "2")
    {
        g_isAutoConnect = g_wirelineAutoConnect;
        index_updateWirelineConnectionStatus();
    }else{
        g_isAutoConnect = g_wirelessAutoConnect;
        index_updateWirelessConnectionStatus();
    }
}

