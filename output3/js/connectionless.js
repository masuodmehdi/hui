[settings]
functionname = hi_adapter_cli_lsw_port_get_stpstate;
attributenum = 2;
attributeflag= 1;


[parameter]
attribute=alias<port>       type<uint>    range<0x0,0x7>                            default<0>;
attribute=alias<stpstate>   type<uint>    range<0x0,0x4>                            default<0>;

[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uint32     ui_stpstate;
}hi_lsw_port_mtu_s;

/*¶Ë¿ÚºÅ¶¨Òå*/
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



lse;
    });

    $('#manual_connect').live('click', function() {
        getAjaxData('api/monitoring/status', function($xml) {
            var ret = xml2object($xml);
            G_MonitoringStatus = ret;
            if (2 == G_MonitoringStatus.response.ServiceStatus &&
                MACRO_EVDO_LEVEL_ONE == G_MonitoringStatus.response.RoamingStatus)
            {
                showConfirmDialog(connection_roaming_status_on, connect);
            }
            else
            {
                connect();
            }
        });
        return false;
    });
});

function getStatusFromUpdatingIcon()
{
    monitoring_status = G_MonitoringStatus.response;
    setHTML();
}

function setHTML() {
    var network_type_index = parseInt(monitoring_status.CurrentNetworkType, 10);
    $('#wan_network_type').html(network_type[network_type_index]);

    var manual_conected = '';
    var connection_status = '';

    var nConnectionStatus = parseInt(monitoring_status.ConnectionStatus, 10);
    var nServiceStatus = parseInt(monitoring_status.ServiceStatus, 10);

    //
    var roaming_status = monitoring_status.RoamingStatus;


    // no service
    if (nServiceStatus != 2)
    {
        $('#no_server_description h3').html(connection_service_no_coverage);
        $('#wan_network_type').html(dialup_label_no_service);
        connection_status = "<div class='manual_connection_status'>" + dialup_label_disconnected + '</div>';
        manual_conected = "<div id='manual_wrapper'><div class='manual_button'>" + create_button_html(common_continue, 'btn_continue') + '</div></div>';
        $('#connection_status').html(connection_status);
        $('#connected_disconnected').html(manual_conected);
        button_enable('manual_connect', '1');
    }
    // connected
    else if (nConnectionStatus == 901)
    {
        $('#no_server_description').hide();
        connection_status = "<div class='manual_connection_status'>" + dialup_label_connected + '</div>';
        manual_conected = "<div id='manual_wrapper'><div class='manual_button'>" + create_button_html(common_continue, 'btn_continue') + '</div></div>';
        $('#connection_status').html(connection_status);
        $('#connected_disconnected').html(manual_conected);
        button_enable('manual_connect', '1');
    }
    // disconnect
    else if (nConnectionStatus == 902)
    {
        if (NET_ROAMING_STATUS == roaming_status)
        {
            $('#no_server_description h3').html(connection_roaming_status_on);
        }
        else
        {
            $('#no_server_description h3').html(connection_device_connectionless);
        }
        connection_status = "<div class='manual_connection_status'>" + dialup_label_disconnected + '</div>';
        $('#connection_status').html(connection_status);
        getAjaxData('api/dialup/connection', function($xml) {
            var connection_ret = xml2object($xml);
            if (typeof connection_ret == 'undefined' || MANUAL_CONNECTION == connection_ret.response.ConnectMode || ('0' == connection_ret.response.RoamAutoConnectEnable && '1' == roaming_status))
            {
                manual_conected = "<div id='manual_wrapper'><div class='manual_button'>" + create_button_html(common_connect, 'manual_connect') + '</div></div>';
                $('#connected_disconnected').html(manual_conected);
                button_enable('manual_connect', '1');
            }
        });
    }
    // connecting
    else if (nConnectionStatus == 900)
    {
        $('#no_server_description').hide();
        connection_status = "<div class='manual_connection_status'>" + dialup_label_connecting + '</div>';
        $('#connection_status').html(connection_status);
        if ($('#manual_connect') != null && $('#manual_connect') != 'undefined')
        {
            button_enable('manual_connect', '0');
        }
    }
}


function connect() {
    var action = {
        Action: '1'
    };

    var action_xml = object2xml('request', action);
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {
        setTimeout(refresh, FEATURE_UI_WAITING.dialog_disapear);
    });
    saveAjaxData('api/dialup/dial', action_xml, function($xml) {
        var return_ret = xml2object($xml);
        if ('response' == return_ret.type && 'OK' == return_ret.response)
        {
            // history.go(0);
        }
        else
        {
            log.error('Connection failed');
        }
    });
}

function onContinue()
{
    gotoPageWithoutHistory('login.html');
}
