[settings]
functionname = hi_adapter_cli_lsw_vlan_add_vlanbcegr;
attributenum = 3;
attributeflag= 1;


[parameter]
attribute=alias<port>        type<uint>       range<0x0,0x7>                  default<0>;
attribute=alias<vlan>        type<ushort>     range<0x0,0xfff>                default<0>;
attribute=alias<res>         type<ushort>     range<0x0,0x0>                  default<0>;

[help]
typedef struct
{
    hi_lsw_port_e     em_port;
    hi_ushort16       us_vlan;
    hi_ushort16       us_res;
}hi_lsw_port_defvlan_s;

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
}hi_lsw_port_e;"#ipv4_start_ip_address").html(ret.response.DhcpStartIPAddress);
            $("#ipv4_end_ip_address").html(ret.response.DhcpEndIPAddress);

            var DHCP_MIN_LEASE_TIME = 60;
            var DHCP_MAX_LEASE_TIME = 604800;
            var DHCP_DEFAULT_LEASE_TIME = 86400;
            var DHCP_DEFAULT_HOUR = 3600;
            var DHCP_DEFAULT_MINUTE = 60;
            var day_value = parseInt(ret.response.DhcpLeaseTime/DHCP_DEFAULT_LEASE_TIME);
            var hour_value = parseInt((ret.response.DhcpLeaseTime % DHCP_DEFAULT_LEASE_TIME) / DHCP_DEFAULT_HOUR);
            var minute_value = parseInt((ret.response.DhcpLeaseTime % DHCP_DEFAULT_LEASE_TIME % DHCP_DEFAULT_HOUR) / DHCP_DEFAULT_MINUTE);
            var second_value = parseInt(ret.response.DhcpLeaseTime % DHCP_DEFAULT_LEASE_TIME % DHCP_DEFAULT_HOUR % DHCP_DEFAULT_MINUTE);			
            $("#ipv4_dhcp_lease_time").html(day_value+time_unit_day+' '+hour_value+time_unit_hour+' '+minute_value+time_unit_minute+' '+second_value+time_unit_second_all);
        }
        else {
            log.error("Load dhcp data failed");
        }
    });
    
    //get ipv6
    getAjaxData("api/settings/hostinfo",function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            $("#ipv6_ip_address").html(ret.response.HostIPv6Address);
        }
        else {
            log.error("Load ipv6 data failed");
        }
    });
    
    //get slaac
    getAjaxData("api/settings/slaac",function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            $("#Prefix").html(ret.response.Prefix);
            $("#PrefixLength").html(ret.response.PrefixLength);
            $("#Preferredlifetime").html(ret.response.PreferredLifeTime+' '+time_unit_second);
            $("#Validlifetime").html(ret.response.ValidLifeTime+' '+time_unit_second);
        }
        else {
            log.error("Load slaac data failed");
        }
    });

    //get lan status
    getAjaxData("api/connection/lanstatus", function($xml) {
        var ret = xml2object($xml);
        var new_line = '';
        if(ret.type == "response"){
            if(ret.response.Hosts.Host){
                var listHosts = ret.response.Hosts.Host;
                $("#table_lanlist > tbody > tr:gt(0)").remove();
                if($.isArray(listHosts)){
                    $.each(listHosts, function(i) {
                    new_line += "<tr><td>" + listHosts[i].HostName + "</td>";
                    new_line += "<td>" + listHosts[i].MACAddress + "</td>";
                    new_line += "<td>" + listHosts[i].IPAddress + '<br/>' + listHosts[i].X_IPv6Address + "</td>";
                    new_line += "<td>" +  (listHosts[i].LeaseTimeRemaining==0?dialup_label_static:getCurrentTime(listHosts[i].LeaseTimeRemaining)) + "</td></tr>";
                    });
                } else {
                    new_line += "<tr><td>" + listHosts.HostName + "</td>";
                    new_line += "<td>" + listHosts.MACAddress + "</td>";
                    new_line += "<td>" + listHosts.IPAddress + '<br/>' + listHosts.X_IPv6Address + "</td>";
                    new_line += "<td>" +  (listHosts.LeaseTimeRemaining==0?dialup_label_static:getCurrentTime(listHosts.LeaseTimeRemaining)) + "</td></tr>";
                }
                $("#table_lanlist").append(new_line);
            }  
        } else {
            log.error("Load LAN Status data failed");
        }
    });
}

$(document).ready( function() {
    if (!parent.g_feature_ipv6) {
        $("#lanstatus_ipv6_title").hide();
        $("#lanstatus_ipv6_table").hide();
    } else {
        $("#lanstatus_ipv6_title").show();
        $("#lanstatus_ipv6_table").show();
    }
    getAllInfo();
    $("#button_refresh").click( function(){
        getAllInfo();
    });
});