[settings]
functionname=hi_kernel_codec_hlp_port_set_active;  
attributenum=6;
attributeflagflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<kcmdtype>     type<uint>   range<0x0,0xFFFFFFFF>  default<0xF200320a>;
attribute=alias<ui_port_id>     type<uint>   range<0x0,0xFFFFFFFF>  default<0>;
attribute=alias<ui_dsp_board_index>       type<uint>   range<0x0,0xFFFFFFFF>  default<0x0>; /*全局模块*/
attribute=alias<ui_dsp_sub_board_index>          type<uint>   range<0x0,0xFFFFFFFF>  default<0x0>;/*bit0:7,每个比特对应hi_dbglevel_e枚举*/
attribute=alias<ui_dsp_ship_index>          type<uint>  range<0x0,0xFFFFFFFF> 	      default<0>;/* 0x0: 关闭不输出; 0x1: 输出所有信息; 0x2: 只输出失败信息; 0x3: 只输出成功信息*/
attribute=alias<ui_dsp_channel_index>        type<uint>  range<0x0,0xFFFFFFFF> 	      default<0>;/* 0x0: 关闭不输出; 0x1: 输出所有信息; */


[help]
usage: codec_port_act -v ui_port_id 0 ui_dsp_channel_index 0
	connection/wlanstatus", function($xml) {
        var ret = xml2object($xml);
        var new_line = '';
        if(ret.type == "response") {
            if(typeof(ret.response.Hosts) != 'undefined'){
                if(ret.response.Hosts.Host) {
                    var listHosts = ret.response.Hosts.Host;
                    $("#table_wlanlist > tbody > tr:gt(0)").remove();
                    if($.isArray(listHosts)){
                        $.each(listHosts, function(i) {
                        if( typeof(listHosts[i].SSIDIND) != 'undefined' && 4==listHosts[i].SSIDIND)
                        {
                            new_line += "<tr><td>" + listHosts[i].SSID +"("+label_wlan_basic_guest_ssid_label+")"+ "</td>";
                        }
                        else
                        {
                            new_line += "<tr><td>" + listHosts[i].SSID + "</td>";
                        }                        
                        new_line += "<td>" + listHosts[i].AssociatedDeviceMACAddress + "</td>";
                        new_line += "<td>" + listHosts[i].X_AssociatedDeviceLeaseTime + "</td></tr>";
                        });
                    } else {
                        if(typeof(listHosts.SSIDIND) != 'undefined' && 4==listHosts.SSIDIND)
                        {
                            new_line += "<tr><td>" + listHosts.SSID +"("+label_wlan_basic_guest_ssid_label+")"+ "</td>";
                        }
                        else
                        {
                            new_line += "<tr><td>" + listHosts.SSID + "</td>";
                        }                        
                        new_line += "<td>" + listHosts.AssociatedDeviceMACAddress + "</td>";
                        new_line += "<td>" + listHosts.X_AssociatedDeviceLeaseTime + "</td></tr>";                    
                    }
                    $("#table_wlanlist").append(new_line);
                }else{
                    log.error("Load WLAN Status data failed");
                }
            }else{
                log.error("Load WLAN Status data failed");
            }
        } else {
            log.error("Load WLAN Status data failed");
        }
    });
}

$(document).ready( function() {
    getAllInfo();
    $("#button_refresh").click( function() {
        getAllInfo();
    });
    
    $("#button_turn").live("click",function(){ 
        var btn_text = $(this).find(".button_center").html(); 
        var wifi_enable = TURN_OFF; 
        if(btn_text == common_turn_off) { 
            wifi_enable = TURN_OFF; 
        } 
        else { 
            wifi_enable = TURN_ON; 
        } 
        var status_set = { 
            Wifienable : wifi_enable 
        }; 
        var req = object2xml("request",status_set); 
        saveAjaxData("api/wlan/wifienable",req,function($xml){ 
            var ret = xml2object($xml); 
            if(isAjaxReturnOK(ret)){ 
                if( wifi_enable == 1) {
                    $('#wlan_status').text(common_on);
                    $('#wlan_currentwifiuser').html(parent.G_MonitoringStatus.response.CurrentWifiUser + '/' + parent.G_MonitoringStatus.response.TotalWifiUser);
                    $("#show_wlan_list").show();
                    $("#button_turn .button_center").html(common_turn_off);
                } else {
                    $('#wlan_status').text(common_off); 
                    $('#wlan_currentwifiuser').html(wlan_label_no_users);
                    $("#show_wlan_list").hide();
                    $("#button_turn .button_center").html(common_turn_on);
                }				 
            } 
            else { 
                log.error("Save basic request failed"); 
            } 
        }); 
    });   
});