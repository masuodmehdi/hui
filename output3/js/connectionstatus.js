[settings]
functionname = hi_adapter_cli_lsw_port_get_tag_act;
attributenum = 4;
attributeflag= 1;


[parameter]
attribute=alias<port>       type<uint>    range<0x0,0x7>                        default<0>;
attribute=alias<dir>        type<uint>    range<0x0,0x1>                        default<0>;
attribute=alias<tagtype>    type<uint>    range<0x0,0x2>                        default<0>;
attribute=alias<tagact>     type<uint>    range<0x0,0x11>                        default<0>;
[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uint32     ui_dir; /* 表示方向 */
    hi_uint32     ui_tagtype;
    hi_uint32     ui_tagact;
}hi_lsw_port_tag_act_s;

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

/* 方向定义 */
typedef enum 
{
    HI_LSW_IGR_TAG_ACT_E = 0,                                     /* 表示入口方向 */
    HI_LSW_EGR_TAG_ACT_E,                                     /* 表示出口方向*/
}hi_lsw_inout_e;

typedef enum 
{
    HI_LSW_TAG_ACT_E    = 0,                                     /* tag      动作 */
    HI_LSW_PRI_TAG_ACT_E,                                  /* pri tag 动作*/
    HI_LSW_UATAG_ACT_E,                                     /* untag  动作*/ 
}hi_lsw_tag_type_e;

typedef enum
{
    HI_LSW_TAG_NO_ACTION_E = 0,        
    HI_LSW_TAG_ADD_E,
    HI_LSW_TAG_DEL_E,    
    HI_LSW_TAG_DROP_E,
    HI_LSW_TAG_DEFAULT_DROP_E,
    HI_LSW_TAG_REP_OUTER_DEFAULT_E,     
    HI_LSW_TAG_REP_OUTER_TRANS_DROP_E, 
    HI_LSW_TAG_REP_OUTER_TRANS_TRUE_E,
    HI_LSW_TAG_CHECK_E,  
    HI_LSW_TAG_SWITCH_E, 
    HI_LSW_TAG_HYBRID_E,
    HI_LSW_TAG_ACT_NUM_E,
}hi_lsw_tag_act_e;


loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' MB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        return (parent.formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' KB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        return (parent.formatFloat(parseFloat(loginTrafficxml), 2) + ' B');
    }
}

function setcookie(id){
    $.cookies.set('cookie', "setting,dialup,"+id, { expiresAt: new Date().getTime()+5*60*1000 });
}
function initConnstatus()
{
    if(typeof g_timeout != "undefined"){
        clearTimeout(g_timeout);
    }
    linkStatusFork();
    g_timeout = setTimeout(initConnstatus,6000);
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

function createConnectionButton(button_dis, button_id) {
    $('#conn_btn').html("");
    if (!g_isAutoConnect) {
        $('#conn_btn').html(create_button_html(button_dis, button_id));
    }  
}

function getConnInfo() {
     getAjaxData('api/connection/connection', function($xml) {
        var conn_ret = xml2object($xml);
        if (conn_ret.type == 'response') {
            g_connection_info = conn_ret.response;
        } else {
            log.error('Error, no data');
        }
    }, {
        sync: true
    });    
    getAjaxData('api/dialup/profiles', function($xml) {
        var conn_profile = xml2object($xml);
        g_profile_list_html = '';
        if (conn_profile.type == 'response') {
            if(typeof(conn_profile.response.Profiles)!="undefined" && conn_profile.response.Profiles.Profile!='' && typeof(conn_profile.response.Profiles.Profile)!="undefined")
            {
                var temp = $(conn_profile.response.Profiles.Profile); 
                g_umts_profile = conn_profile.response.Profiles.Profile;
                default_umts_index = conn_profile.response.CurrentProfile;
                var i;
                for(i = 0;temp.length >0 && i< temp.length; i++)
               {
                    var defaultName = resolveXMLEntityReference(temp[i].Name);
                    while (defaultName.indexOf(' ') >= 0) {
                            defaultName = defaultName.replace(' ', '&nbsp;');
                    }
                    if(conn_profile.response.CurrentProfile == temp[i].Index)
                    {
                        g_profile_list_html += '<option selected="selected" value="'+temp[i].Index+'">'+defaultName+common_default+'</option>';
                        g_isUMTSAutoConnect = temp[i].ConnectMode == 'Manual' ? false:true;
                    }
                    else
                    {
                        g_profile_list_html += '<option value="'+temp[i].Index+'">'+defaultName+'</option>';
                    }
                }
            }
        }
        else 
        {
            log.error('Error, no data');
        }
        if(g_profile_list_html == ''){
            g_isUMTSAutoConnect = false;
        }
        $('#conn_profiles option').remove();
        $('#conn_profiles').append(g_profile_list_html);
    },
    {
        sync: true
    });

    getAjaxData('api/dialup/ETHs', function($xml) {
        var conn_profile = xml2object($xml);
        g_eth_profile_list_html = '';
        if (conn_profile.type == 'response') {
            if(typeof(conn_profile.response.ETHs)!="undefined" && conn_profile.response.ETHs.ETH!='' && typeof(conn_profile.response.ETHs.ETH)!="undefined")
            {
                var temp = $(conn_profile.response.ETHs.ETH);
                g_eth_profile = conn_profile.response.ETHs.ETH;
                default_eth_index = conn_profile.response.CurrentETH;
                var i;
                for(i = 0; temp.length > 0 && i < temp.length; i++)
                {
                    var ethName = resolveXMLEntityReference(temp[i].Name);
                    while (ethName.indexOf(' ') >= 0) {
                        ethName = ethName.replace(' ', '&nbsp;');
                    }
                    if(conn_profile.response.CurrentETH == temp[i].Index)
                    {
                        g_eth_profile_list_html += '<option selected="selected" value="'+temp[i].Index+'">'+ethName+common_default+'</option>';
                        g_isETHAutoConnect = (temp[i].ConnectionType == "0" && temp[i].ConnectMode == 'Manual') ? false :true;
                    }
                    else
                    {
                        g_eth_profile_list_html += '<option value="'+temp[i].Index+'">'+ethName+'</option>';
                    }
                }   
            }
        }
        else
        {
            log.error('Error, no data');
        }
        if(g_eth_profile_list_html == ''){
            g_isETHAutoConnect = false;
        }
        $('#conn_eth_profiles option').remove();
        $('#conn_eth_profiles').append(g_eth_profile_list_html);
    }, 
    {
        sync: true
    });
}


function setProDisplay(ConnectionDevice)
{
    $('.connectionstatus_table').css('display','');
    switch(ConnectionDevice)
    {    
        case SIGLE_WAN:
            $("#conn_device")[0].selectedIndex=1;
            $('#conn_eth').css('display','');
            $('#conn_radio').css('display','none');
            $('#conn_romaining').css('display','none');
            if(g_eth_profile_list_html=='')
            {
                parent.showConfirmDialog(connectiontatus_label_eth_noprofile, function(){
                    setcookie('wan');
                    gotoPageWithoutHistory(SETTING_PATH);
                }, function(){  button_enable('apply_button', '0');});
            }
            break;
        case RADIO_PRI:
            $("#conn_device")[0].selectedIndex=2;
            $('#conn_eth').css('display','');
            $('#conn_radio').css('display','');
            $('#conn_romaining').css('display','');
            if(g_eth_profile_list_html==''&&g_profile_list_html=='')
            {
                parent.showConfirmDialog(connectiontatus_label_eth_noprofile, function(){ 
                    setcookie('profilesmgr');
                    gotoPageWithoutHistory(SETTING_PATH); 
                }, function(){  button_enable('apply_button', '0');});
            }
            break;
        default:
            $("#conn_device")[0].selectedIndex=0;
            $('#conn_eth').css('display','none');
            $('#conn_radio').css('display','');
            $('#conn_romaining').css('display','');
            if(g_profile_list_html=='')
            {
                parent.showConfirmDialog(connectiontatus_label_eth_noprofile, function(){ 
                    setcookie('profilesmgr');
                    gotoPageWithoutHistory(SETTING_PATH);
                }, function(){  button_enable('apply_button', '0');});
            }
            break;        
    }
}

function get_WirelineDisplay_flag()
{  
    getConfigData('config/global/config.xml', function($xml) {
        var ret = _xml2feature($xml);       
        if(typeof(ret.wirelinewan_enable) != 'undefined')
        {
            g_WirelineDisplay = ret.wirelinewan_enable == 1? true:false;
        }   
    }, {
            sync: true
    });
}

function initPage()
{
    getConnInfo();
    setProDisplay(g_connection_info.ConnectionDevice);
    $('input[name= conn_romaingswitch][value=' + g_connection_info.RoamAutoConnectEnable + ']').attr('checked', true);
    initConnstatus();
    displayUserInfo();
    button_enable('apply_button', '0');
}

function postdata()
{
    var requestdata ={
       ConnectionDevice:$("#conn_device").val(),
       setDefaultProfile: $("#conn_device").val() != SIGLE_WAN ? $("#conn_profiles").val() : 0,
       setDefaultETH:$("#conn_device").val() != SIGLE_RADIO ? $("#conn_eth_profiles").val():0,
       RoamAutoConnectEnable:$("[name='conn_romaingswitch']:checked").val()
    };
    parent.showWaitingDialog(common_waiting,common_waiting);
   var req =object2xml('request', requestdata);
   saveAjaxData('api/connection/connection', req, function($xml){
        parent.closeWaitingDialog();
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            parent.showInfoDialog(common_success);
        }else{
            parent.showInfoDialog(common_failed);
        }
        initPage();
       });
}

function romaing_on_confirm1()
{
    parent.showConfirmDialog(system_hint_romaing_confirm1, function() {
        $('input[name= conn_romaingswitch][value=' + 1 + ']').attr('checked', true);
        button_enable('apply_button', '1');
        },function(){});

    $('input[name= conn_romaingswitch][value=' + 0 + ']').attr('checked', true);
}
function romaing_on_confirm2()
{
    parent.showConfirmDialog(system_hint_romaing_confirm2, function() {
        $('input[name= conn_romaingswitch][value=' + 0 + ']').attr('checked', true);
        button_enable('apply_button', '1');
        },function(){});

    $('input[name= conn_romaingswitch][value=' + 1 + ']').attr('checked', true);
}
function displayWirelessStatus()
{
   switch(parent.G_MonitoringStatus.response.ConnectionStatus){
        case MACRO_CONNECTION_CONNECTED:
            $('#connection_status').text(dialup_label_connected);
            break;
        case MACRO_CONNECTION_CONNECTING:
            $('#connection_status').text(dialup_label_connecting);
            break;
        default:
            $('#connection_status').text(dialup_label_disconnected);
            break;
    }

    switch(parent.G_MonitoringStatus.response.X_IPv6ConnectionStatus){
        case MACRO_CONNECTION_IPV6CONNECTED:
            $('#connection_ipv6_status').text(dialup_label_connected);
            break;
        case MACRO_CONNECTION_IPV6CONNECTING:
            $('#connection_ipv6_status').text(dialup_label_connecting);
            break;
        default:
            $('#connection_ipv6_status').text(dialup_label_disconnected);
            break;
    }
}

function displayWirelineStatus()
{
   switch(parent.G_MonitoringStatus.response.X_IPv4WireLineConnectionStatus){
        case MACRO_WIRELINE_CONNECTION_CONNECTED:
            $('#connection_status').text(dialup_label_connected);
            break;
        case MACRO_WIRELINE_CONNECTION_CONNECTING:
            $('#connection_status').text(dialup_label_connecting);
            break;
        default:
            $('#connection_status').text(dialup_label_disconnected);
            break;
    }

    switch(parent.G_MonitoringStatus.response.X_IPv6WireLineConnectionStatus){
        case MACRO_WIRELINE_CONNECTION_IPV6CONNECTED:
            $('#connection_ipv6_status').text(dialup_label_connected);
            break;
        case MACRO_WIRELINE_CONNECTION_IPV6CONNECTING:
            $('#connection_ipv6_status').text(dialup_label_connecting);
            break;
        default:
            $('#connection_ipv6_status').text(dialup_label_disconnected);
            break;
    }
}

function displayFlow()
{
    if (g_module.ap_station_enabled &&
    parent.G_StationStatus != null &&
    WIFI_STATION_CONNECTED == parent.G_StationStatus.response.ConnectStatus) {
        $('#TotalDownload').text(parseflow(parent.G_StationStatus.response.RxFlux));
        $('#TotalUpload').text(parseflow(parent.G_StationStatus.response.TxFlux));
        $('#TotalConnectTime').text(getCurrentTime(parent.G_StationStatus.response.CurrentTime));
    }
    else {
        getAjaxData('api/monitoring/traffic-statistics', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                var res = ret.response;
                if (parent.G_MonitoringStatus == null || 
                    (parent.G_MonitoringStatus.response.ConnectionStatus != MACRO_CONNECTION_CONNECTED 
                    && parent.G_MonitoringStatus.response.X_IPv6ConnectionStatus != MACRO_CONNECTION_IPV6CONNECTED 
                    && parent.G_MonitoringStatus.response.X_IPv4WireLineConnectionStatus != MACRO_WIRELINE_CONNECTION_CONNECTED
                    && parent.G_MonitoringStatus.response.X_IPv6WireLineConnectionStatus != MACRO_WIRELINE_CONNECTION_IPV6CONNECTED )) {
                    res.CurrentConnectTime = 0;
                    res.CurrentDownload = 0;
                    res.CurrentUpload = 0;
                }
                $('#TotalDownload').text(parseflow(res.CurrentDownload));
                $('#TotalUpload').text(parseflow(res.CurrentUpload));
                $('#TotalConnectTime').text(getCurrentTime(res.CurrentConnectTime));
            }
            else {
                log.error('Load traffic-statistics data failed');
            }
        });
    }
}

function displayUserInfo(){
    if(g_login_usertype == 'admin')
    {
        $('.connstatus_admin_table').css('display','');
    }
    if (!g_feature_ipv6) {
        $('#conn_ipv6_status').hide();
        $('#conn_ipv6_tr').hide();
    } else {
        $('#conn_ipv6_status').show();
    }

    $('#X_IPv6ConnectionStatus').css('display','');
    $('#ConnectionStatus').css('display','');
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
    var currentStatus = parent.G_MonitoringStatus.response;
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
                createConnectionButton(common_connect, 'connect_btn');     
            }
            button_enable('connect_btn', '0');
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
            createConnectionButton(common_disconnect, 'disconnect_btn');
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
            createConnectionButton(common_disconnect, 'disconnect_btn');
            button_enable('disconnect_btn', '0');
            break;

        case "55":// disconnected
            createConnectionButton(common_connect, 'connect_btn');
            break;
        default:
            // Connection failed. Please try again later. If the problem
            // persists, please contact your Service Provider.
            createConnectionButton(common_connect, 'connect_btn');
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
    var currentStatus = parent.G_MonitoringStatus.response;
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
                createConnectionButton(common_connect, 'connect_btn');     
            }
            button_enable('connect_btn', '0');
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
            createConnectionButton(common_disconnect, 'disconnect_btn');
            break;
        case "9023":// disconnecting brown
        case "9024":// disconnecting brown
        case "9033":// disconnecting brown
        case "9034":// disconnecting brown
        case "9035":// disconnecting brown
            // disconnecting
            createConnectionButton(common_disconnect, 'disconnect_btn');
            button_enable('disconnect_btn', '0');
            break;
        case "9025":// disconnected 
            createConnectionButton(common_connect, 'connect_btn');
            break;
        default:
            // Connection failed. Please try again later. If the problem
            // persists, please contact your Service Provider.
            createConnectionButton(common_connect, 'connect_btn');
            break;
    }

    // while ServiceStatus is not available, user can not click Connect Button
    if (currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE) {
        button_enable('connect_btn', '0');
    }
}

function linkStatusFork()
{
    displayFlow();
    if(g_connection_info.ConnectionDevice == SIGLE_WAN)
    {
        g_isAutoConnect = g_isETHAutoConnect;
        displayWirelineStatus();
        index_updateWirelineConnectionStatus();    
    }else{
        g_isAutoConnect = g_isUMTSAutoConnect;
        displayWirelessStatus();
        index_updateWirelessConnectionStatus();
    }
    
}


$(document).ready(function() {
    var time_delay = 1000;
    if(parseInt($.browser.version.charAt(0), 10) === 9)
    {
        time_delay = 1500;
    }
    setTimeout(initPage,time_delay);

    $('select').bind('change',function(){
        button_enable('apply_button', '1');
    });
    $("#conn_device").bind('change', function(){
        setProDisplay($("#conn_device").val());
    });
    $('#app_btn').html(create_button_html(common_apply, "apply_button"));
    button_enable('apply_button', '0');
    $('#apply_button').click(function(){
        if(!isButtonEnable('apply_button'))
        {
            return;
        }
        if(($("#conn_profiles").val()==''&&($('#conn_device').val() == SIGLE_RADIO ||$('#conn_device').val() == SIGLE_WAN))||
            ($("#conn_profiles").val()==''&&$("#conn_eth_profiles").val()&&$('#conn_device').val()==RADIO_PRI))
        {
            parent.showInfoDialog(connectiontatus_label_noprofile);
            return;
        }

        if((MACRO_CONNECTION_CONNECTED == parent.G_MonitoringStatus.response.ConnectionStatus) ||
            (MACRO_CONNECTION_IPV6CONNECTED == parent.G_MonitoringStatus.response.X_IPv6ConnectionStatus) ||
            (MACRO_WIRELINE_CONNECTION_CONNECTED == parent.G_MonitoringStatus.response.X_IPv4WireLineConnectionStatus) ||
            (MACRO_WIRELINE_CONNECTION_IPV6CONNECTED == parent.G_MonitoringStatus.response.X_IPv6WireLineConnectionStatus)){
                  parent.showConfirmDialog(connectionsatus_label_apply_defaultprofile, postdata,function(){ return; });
            }else{
                postdata();
            }
        });
    $("#connect_btn").live("click",function(){
        if(isButtonEnable("connect_btn"))
        {
            if(1 == parent.G_MonitoringStatus.response.RoamingStatus && 0 == g_connection_info.RoamAutoConnectEnable){
                parent.showConfirmDialog(hint_roaming_closed_note,function(){});
                return;
            }
             g_dialup_action.Action = "1";
            if(!g_freezeConnectionUpdate)
            {
                index_sendConnectionAction();
                button_enable(this.id, "0");
            }
        }
        });
    $("#disconnect_btn").live("click",function(){
        if(isButtonEnable("disconnect_btn"))
        {
             g_dialup_action.Action = "0";
            if(!g_freezeConnectionUpdate)
            {
                index_sendConnectionAction();
                button_enable(this.id, "0");
            }
        }
        });
    get_WirelineDisplay_flag();
    if(false==g_WirelineDisplay)
    {
        $('#connectiondevice').hide();
        $("#conn_device").val(1);
    }
});