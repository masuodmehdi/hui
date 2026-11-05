[settings]
functionname=hi_kernel_ploam_sn_set;  
attributenum=1;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<sn>           type<binary> range<0,8>             default<0x68 0x77 0x68 0x77 0x01 0x02 0x01 0x02>;

[help]
usage: setsn								                   ; 设置缺省SN
	   setsn -v sn "0x68 0x77 0x68 0x77 0x00 0x00 0x00 0x01"   ; 设置配置SN

tem_label_circuit_switched_capable;
            return;
        case '2':
            service_status_value = system_label_packet_switch_capable;
            return;
        case '3':
            service_status_value = system_label_circuit_packet_switched_capable;
            return;
        case '4':
            service_status_value = common_searching;
            return;
        default:
            service_status_value = common_unknown;
            return;
    }
}

function getNetworkStatusValue(network_status)
{
    switch(network_status){
        case MACRO_NET_WORK_TYPE_WCDMA:
            network_type_value = dialup_label_wcdma;
            band_with_value = "384 Kbps DL / 384 Kbps UL";
            return;
        case MACRO_NET_WORK_TYPE_HSDPA:
            network_type_value = dialup_label_hsdpa;
            band_with_value = "14.4 Mbps DL";
            return;
        case MACRO_NET_WORK_TYPE_HSUPA:
            network_type_value = dialup_label_hsupa;
            band_with_value = "5.76 Mbps UL";
            return;
        case MACRO_NET_WORK_TYPE_HSPA:
            network_type_value = dialup_label_hspa;
            band_with_value = "14.4 Mbps DL / 5.76 Mbps UL";
            return;
        case MACRO_NET_WORK_TYPE_HSPA_PLUS:
            network_type_value = dialup_label_hspa_plus;
            band_with_value = "28.8 Mbps DL / 5.76 Mbps UL";
            return;
        case MACRO_NET_WORK_TYPE_DC_HSPA:
            network_type_value = dialup_label_DC_HSPA;
            band_with_value = "42 Mbps DL / 5.76 Mbps UL";
            return;
        case MACRO_NET_WORK_TYPE_LTE:
            network_type_value = dialup_label_lte;
            band_with_value = "100 Mbps DL / 50 Mbps UL";
            return;
        /* TDS子模式 */
        case DSAT_SYS_SUBMODE_TDS:
            network_type_value = "TD-SCDMA";
            band_with_value = "384k/384k";
            return;
        case DSAT_SYS_SUBMODE_TDS_HSDPA:
            network_type_value = "TDS-HSDPA";
            band_with_value = "2.8M/384k";
            return;
        case DSAT_SYS_SUBMODE_TDS_HSUPA:
            network_type_value = "TDS-HSUPA";
            band_with_value = "384k/1.6M";
            return;
        case DSAT_SYS_SUBMODE_TDS_HSPA:
            network_type_value = "TDS-HSPA";
            band_with_value = "2.8M/1.6M";
            return;
        default:
            network_type_value = dialup_label_no_service;
            band_with_value = common_unknown;
            return;
        }
}
function getAllInfo() {
    getAjaxData("api/connection/wanstatus", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response"){
            $("#wan_ipv4_ipaddress").html(ret.response.ExternalIPAddress);
            $("#wan_ipv4_primarydnsserver").html(ret.response.DNSServers.split(",")[0]);
            $("#wan_ipv4_secondarydnsserver").html(ret.response.DNSServers.split(",")[1]);
	    if(hasSpecifiedStrAtHead(ret.response.X_IPv6Address,"fc00")){
		ret.response.X_IPv6Address = "";
	    }
            $("#wan_ipv6_ipaddress").html(ret.response.X_IPv6Address);
            $("#wan_defaultgateway").html(ret.response.X_IPv6DefaultGateway);
            $("#wan_ipv6_primarydnsserver").html(ret.response.X_IPv6DNSServers.split(",")[0]);
            $("#wan_ipv6_secondarydnsserver").html(ret.response.X_IPv6DNSServers.split(",")[1]);
        } else {
            log.error("Load WAN Status data failed");
        }
    });
     getAjaxData('api/connection/connection', function($xml) {
        var conn_ret = xml2object($xml);
        if (conn_ret.type == 'response') {
            g_connection_info = conn_ret.response;
        } else {
            log.error('Error, no data');
        }
        if(typeof g_connection_info !="undefined" && g_connection_info.ConnectionDevice == "2")
        {
            $("#wireless_status").hide();
        }else{
            $("#wireless_status").show();
        }
    }, {
        sync: true
    });    
}

function getWanStatusInfo()
{
    monitor_status = parent.G_MonitoringStatus;
    if(monitor_status)
        {
          if(service_status_valid==monitor_status.response.ServiceStatus){
                getServicestatusvalue(monitor_status.response.CurrentServiceDomain);
                getNetworkStatusValue(monitor_status.response.CurrentNetworkType);
                $("#wan_networktype").html(network_type_value);
                $("#wan_bandwidth").html(band_with_value);
                $("#wan_servicestatus").html(service_status_value);
            }
          else{
                $("#wan_networktype").html(dialup_label_no_service);
                $("#wan_bandwidth").html(common_unknown);
                $("#wan_servicestatus").html(common_unknown);
            }
        }
    else
        {
            log.error("Load Monitoring Status data failed");
        }
}

$(document).ready( function() {
    if (!parent.g_feature_ipv6) {
        $("#wanstatus_ipv6_title").hide();
        $("#wanstatus_ipv6_table").hide();
    } else {
        $("#wanstatus_ipv6_title").show();
        $("#wanstatus_ipv6_table").show();
    }
    getAllInfo();
    setTimeout("getWanStatusInfo()",1000);
});