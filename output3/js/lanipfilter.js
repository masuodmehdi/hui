[settings]
commandtype       = 0xF80058B1 ;
attributenum      = 2 ;
displayattribute  = 1 ;

[parameter]
attribute=alias<port>            type<uint>    range<0x0,0x7>                default<0>;
attribute=alias<mode>            type<uint>    range<0x0,0x4>                default<0>;


[help]
typedef struct
{
    hi_lsw_port_e           em_port;
    hi_lsw_port_blackmode_e em_mode;
}hi_lsw_sec_blackmode_s;

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

/* 端口源MAC过滤模式 */
typedef enum
{
    HI_LSW_PORT_SMAC_IGNORE_E = 0,                   /* 不关心源MAC */
    HI_LSW_PORT_SMAC_ALLOW_E,                        /* 源MAC满足则允许通过 ,即白名单*/
    HI_LSW_PORT_SMAC_DROP_E,                         /* 源MAC满足则丢弃,即黑名单*/
    HI_LSW_PORT_SMAC_THRU_E,                           /* 源MAC满足则透传到上行口*/
    HI_LSW_PORT_SMAC_MAX_E,
}hi_lsw_port_blackmode_e;










L_TCP+"'>"+SAVE_PROTOCOL_TCP+"</option>"+
                                    "<option value='"+SAVE_PROTOCOL_UDP+"'>"+SAVE_PROTOCOL_UDP+"</option>"+
                                    "<option value='"+SAVE_PROTOCOL_TCPUDP+"'>"+SAVE_PROTOCOL_TCPUDP+"</option>"+
                                    "<option value='"+SAVE_PROTOCAL_ICMP+"'>"+SAVE_PROTOCAL_ICMP+"</option>"+
                                    "<option value='"+SAVE_PROTOCAL_ALL+"'>"+SAVE_PROTOCAL_ALL+"</option>"+
                                "</select>"+
                            "</td>"+
                            "<td height='42' valign='top'>"+firewall_label_status+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<select id='show_status_select' class='input_select'>"+
                                    "<option value='1'>"+common_on+"</option>"+
                                    "<option value='0'>"+common_off+"</option>"+
                                "</select>"+
                            "</td>"+
                        "</tr>"+
                        "<tr>"+
                            "<td height='42' valign='top'>"+lan_filter_lan_ip_start+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_start_ip' class='input_style' maxlength='39'/>"+
                            "</td>"+
                            "<td height='42' valign='top'>"+lan_filter_lan_ip_end+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_end_ip' class='input_style' maxlength='39'/>"+
                            "</td>"+
                        "</tr>"+
                        "<tr>"+
                            "<td height='42' valign='top'>"+lan_filter_lan_port_start+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_start_port' class='input_style' maxlength='5'/>"+
                            "</td>"+
                            "<td height='42' valign='top'>"+lan_filter_lan_port_end+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_end_port' class='input_style' maxlength='5'/>"+
                            "</td>"+
                        "</tr>"+
                        "<tr class='wanth'>"+
                            "<td height='42' valign='top'>"+lan_filter_wan_ip_start+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_wan_start_ip' class='input_style' maxlength='39'/>"+
                            "</td>"+
                            "<td height='42' valign='top'>"+lan_filter_wan_ip_end+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_wan_end_ip' class='input_style' maxlength='39'/>"+
                            "</td>"+
                        "</tr>"+
                        "<tr class='wanth'>"+
                            "<td height='42' valign='top'>"+lan_filter_wan_port_start+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_wan_start_port' class='input_style' maxlength='5'/>"+
                            "</td>"+
                            "<td height='42' valign='top'>"+lan_filter_wan_port_end+common_colon+"</td>"+
                            "<td height='42' valign='top'>"+
                                "<input type='text' id='show_wan_end_port' class='input_style' maxlength='5'/>"+
                            "</td>"+
                        "</tr>"+
                        "<tr class='wanth'>"+
                            "<td height='20'id='lan_filter_same_rule' style='font-size:16px;color:red' valign='top' colspan='2'></td>"+
                        "</tr>"+
                   "</table>"+
              "</div>";

/*----------------------------------------------------------------------*/
function ipTranApply(ipaddr)
{
    var ipout = [];
    var ipoutstring = '';
    var idx = 0;
    if (ipaddr == null || ipaddr == undefined || ipaddr == '')
    {
        return '';
    }

    ipout = ipaddr.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (idx = 3; idx >= 0; idx--)
        {
            if (ipout[idx] == '*')
            {
                ipout[idx] = '0';
            }
            else
            {
                break;
            }
        }
    }
    ipoutstring = ipoutstring.concat(ipout[0], '.', ipout[1], '.', ipout[2], '.', ipout[3]);
    return ipoutstring;
}

function ipTranGet(ipAddress, num)
{
    var ipout = [];
    var ipoutstring = '';
    var i = 0;
    if (null == ipAddress || undefined == ipAddress || '' == ipAddress)
    {
        return '';
    }

    ipout = ipAddress.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (i = 3; i > -1; i--)
        {
            if ('0' == ipout[i])
            {
                if (num > 0)
                {
                    ipout[i] = '*';
                    num--;
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }
    }
    ipoutstring = ipoutstring.concat(ipout[0], '.', ipout[1], '.', ipout[2], '.', ipout[3]);
    return ipoutstring;
}


function ipGetMaskNum(ipAddress)
{
    var ipout = [];
    var ipoutstring = '';
    var i = 0;
    var ipaddNum = 0;
    if (null == ipAddress || undefined == ipAddress || '' == ipAddress)
    {
        return '';
    }

    ipout = ipAddress.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (i = 3; i > -1; i--)
        {
            if (ipout[i] == '*')
            {
                ipaddNum++;
            }
            else
            {
                break;
            }
        }
    }
    return ipaddNum;
}

function sourceIpTranApplyValid(ipaddr)
{
    var ipout = [];
    var ipoutstring = '';
    var i = 0;
    if (ipaddr == null || ipaddr == undefined || ipaddr == '')
    {
        return '';
    }

    ipout = ipaddr.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (i = 3; i > -1; i--)
        {
        if (ipout[i] == '*')
        {
                    ipout[i] = '0';
        }
        else
        {
            break;
        }
        }
    }
    ipoutstring = ipoutstring.concat(ipout[0], '.', ipout[1], '.', ipout[2], '.', ipout[3]);
    return ipoutstring;
}

function isValidIpAddressForIPFilter(address) 
{
    var addrParts = address.split('.');
    if (addrParts.length != 4)
    {
        return false;
    }

    for (i = 0; i < 4; i++)
    {
        if ((addrParts[i] == '*') && (i != 3))
        {
        if (addrParts[i + 1] != '*')
        {
            return false;
        }
        }
        if (true == (isNaN(addrParts[i])) && (addrParts[i] != '*'))
        {
            return false;
        }

        if ('' == addrParts[i])
        {
            return false;
        }

        if (addrParts[i].indexOf(' ') != -1)
        {
            return false;
        }

        if ((0 == addrParts[i].indexOf('0')) && (1 != addrParts[i].length))
        {
            return false;
        }
    }

    if ((addrParts[0] <= 0 || addrParts[0] == 127 || addrParts[0] > 223) ||
    (addrParts[1] < 0 || addrParts[1] > 255) ||
    (addrParts[2] < 0 || addrParts[2] > 255) ||
    (addrParts[3] < 0 || addrParts[3] >= 255))
    {
        return false;
    }

    return true;
}

/*-----------------------------get set info from config.xml----------------------------------------*/
function lanIPFilter_getConfig() {
    getConfigData('config/firewall/config.xml', function($xml) {
        g_config_firewall = _xml2feature($xml);
        if ('0' == g_config_firewall.lanipfilter.wan)
            {
                $('.wanth').hide();
                parent.$('.wanth').hide();
            }
            else
            {
                $('.wanth').show();
                parent.$('.wanth').show();
            }
        },
    {
        sync: true
    });
}

/*-------------------------first enter this page------------------------------------*/
function initPage() {
    g_save_all_data = [];
    $('.user_add_line').remove();
    button_enable('apply', '0');
    getAjaxData('api/security/firewall-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            firewall_status = ret.response;
        }
        else {
            return;
        }
    }, {
        sync: true
    });
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            parent.dhcpPageVar = ret.response;
            parent.initDhcp();
        }
        else {
            return;
        }
    });
    getAjaxData('api/security/lan-ip-filter', function($xml) {
        var ret = xml2object($xml);
        var black_filter = null;
        var white_filter = null;
        if(typeof(ret.response) == "undefined") {
            return;
        }
        if (typeof(ret.response.BlackIPFilters) != 'undefined' && typeof(ret.response.WhiteIPFilters) != 'undefined') {
            black_filter = ret.response.BlackIPFilters.IPFilter;
            white_filter = ret.response.WhiteIPFilters.IPFilter;
            $("#select_ip_allow_deny").val(ret.response.LanIPFilterPolicy);
            
            if(typeof(white_filter) != "undefined") {
                if(white_filter.length >= LAN_IP_FILTER_NUM && ret.response.LanIPFilterPolicy == 1) {
                    button_enable('add_item', '0');
                }
                if(white_filter!='') {
                    if ($.isArray(white_filter)) {
                        $(white_filter).each(function(i){
                            setNewLineInitPage(white_filter[i],i,WHITE_FILTER_WORD);
                        });
                    }
                    else {
                        setNewLineInitPage(white_filter,0,WHITE_FILTER_WORD);
                    }
                }
            }
            if(typeof(black_filter) != "undefined") {
                var wflength = 0;
                if(typeof(white_filter) != "undefined") {
                    wflength = white_filter.length;
                }
                if (black_filter.length >= LAN_IP_FILTER_NUM && ret.response.LanIPFilterPolicy == 2)
                {
                    button_enable('add_item', '0');
                }
                if(black_filter!='') {
                    if ($.isArray(black_filter)) {
                        $(black_filter).each(function(i){
                            setNewLineInitPage(black_filter[i],wflength + i,BLACK_FILTER_WORD);
                        });
                    }
                    else {
                        setNewLineInitPage(black_filter,wflength,BLACK_FILTER_WORD);
                    }
                }
            }
        } else {
            return;
        }
        
        if(ret.response.LanIPFilterPolicy == 1) {
            $(".show_ip_filter_white").show();
            $(".show_ip_filter_black").hide();
        }
        else {
            $(".show_ip_filter_white").hide();
            $(".show_ip_filter_black").show();
        }
        
        if (firewall_status != null && firewall_status.FirewallMainSwitch == 0) {
            button_enable('add_item', '0');
            $("#select_ip_allow_deny").attr("disabled",true);
            $(".button_edit_list").css("color","#666666").css("cursor","default");
            $(".button_delete_list").css("color","#666666").css("cursor","default");
            parent.showInfoDialog(IDS_security_message_firewall_disabled);
            return false;
        }
        if (firewall_status != null && firewall_status.FirewallIPFilterSwitch == 0) {
            button_enable('add_item', '0');
            $("#select_ip_allow_deny").attr("disabled",true);
            $(".button_edit_list").css("color","#666666").css("cursor","default");
            $(".button_delete_list").css("color","#666666").css("cursor","default");
            parent.showInfoDialog(IDS_security_message_ip_address_disabled);
        }
    });
}

/*------------------------function set newline-----------------------------*/
function setNewLineInitPage(lanIPFilterData,key,word) {
    var getStatus  = lanIPFilterData.LanIPFilterStatus==1?common_on:common_off;
    var newline = "";
    var oneinfo = null;
   
   if("0" == g_config_firewall.lanipfilter.wan) {
       newline = "<tr class='user_add_line show_ip_filter_"+word+"'>";
       if (lanIPFilterData.LanIPFilterLanStartAddress == lanIPFilterData.LanIPFilterLanEndAddress){
           newline += "<td id='lan_ip_start_"+key+"' class='td_ltr'>" + lanIPFilterData.LanIPFilterLanStartAddress + "</td>";
       }
       else {
           newline += "<td id='lan_ip_start_"+key+"' class='td_ltr'>" +lanIPFilterData.LanIPFilterLanStartAddress + "-<br/>" + lanIPFilterData.LanIPFilterLanEndAddress + "</td>";
       }
       if (lanIPFilterData.LanIPFilterLanStartPort == lanIPFilterData.LanIPFilterLanEndPort){
           newline += "<td id='lan_ip_port_"+key+"' class='td_ltr'>"+lanIPFilterData.LanIPFilterLanStartPort+"</td>";
       }
       else {
           newline += "<td id='lan_ip_port_"+key+"' class='td_ltr'>"+lanIPFilterData.LanIPFilterLanStartPort+"-"+lanIPFilterData.LanIPFilterLanEndPort+"</td>";
       }
       newline += "<td id='protocol_"+key+"'>"+lanIPFilterData.LanIPFilterProtocol+"</td>"+
                      "<td id='status_"+key+"'>"+getStatus+"</td>"+
                      "<td id='ip_start_"+key+"' class='user_options'>"+
                           "<a href='javascript:void(0);' id='button_edit"+ key +"' class='button_edit_list"+" "+word+"'>"+common_edit+"</a><br>"+
                           "<a href='javascript:void(0);' id='button_delete"+ key +"' class='button_delete_list'>"+common_delete+"</a>"+
                      "</td>"+
                "</tr>";
      oneinfo = {
          start_ip : lanIPFilterData.LanIPFilterLanStartAddress,
          end_ip : lanIPFilterData.LanIPFilterLanEndAddress,
          start_port : lanIPFilterData.LanIPFilterLanStartPort,
          end_port : lanIPFilterData.LanIPFilterLanEndPort,
          protocol : lanIPFilterData.LanIPFilterProtocol,
          status : lanIPFilterData.LanIPFilterStatus
      };
   } 
   else {
       newline = "<tr class='user_add_line show_ip_filter_"+word+"'>";
       if (lanIPFilterData.LanIPFilterLanStartAddress == lanIPFilterData.LanIPFilterLanEndAddress){
           newline += "<td id='lan_ip_start_"+key+"' class='td_ltr'>"+ lanIPFilterData.LanIPFilterLanStartAddress + "</td>";
       }
       else {
           newline += "<td id='lan_ip_start_"+key+"' class='td_ltr'>"+ lanIPFilterData.LanIPFilterLanStartAddress +"-<br/>"+ lanIPFilterData.LanIPFilterLanEndAddress +"</td>";
       }
       if (lanIPFilterData.LanIPFilterLanStartPort == lanIPFilterData.LanIPFilterLanEndPort){
           newline += "<td id='lan_ip_port_"+key+"' class='td_ltr'>"+lanIPFilterData.LanIPFilterLanStartPort+"</td>";
       }
       else {
           newline += "<td id='lan_ip_port_"+key+"' class='td_ltr'>"+lanIPFilterData.LanIPFilterLanStartPort+"-"+lanIPFilterData.LanIPFilterLanEndPort+"</td>";
       }
       if (lanIPFilterData.LanIPFilterWanStartAddress == lanIPFilterData.LanIPFilterWanEndAddress){
           newline += "<td id='wan_ip_start_"+key+"' class='td_ltr'>"+ lanIPFilterData.LanIPFilterWanStartAddress +"</td>";
       }
       else {
           newline += "<td id='wan_ip_start_"+key+"' class='td_ltr'>"+ lanIPFilterData.LanIPFilterWanStartAddress +"-<br/>"+ lanIPFilterData.LanIPFilterWanEndAddress +"</td>";
       }
       if (lanIPFilterData.LanIPFilterWanStartPort == lanIPFilterData.LanIPFilterWanEndPort) {
           newline += "<td id='wan_port_"+key+"' class='td_ltr'>"+lanIPFilterData.LanIPFilterWanStartPort+"</td>";
       }
       else {
           newline += "<td id='wan_port_"+key+"' class='td_ltr'>"+lanIPFilterData.LanIPFilterWanStartPort+"-"+lanIPFilterData.LanIPFilterWanEndPort+"</td>";
       }
       newline += "<td id='protocol_"+key+"'>"+lanIPFilterData.LanIPFilterProtocol+"</td>"+
                      "<td id='status_"+key+"'>"+getStatus+"</td>"+
                      "<td id='ip_start_"+key+"' class='user_options'>"+
                           "<a href='javascript:void(0);' id='button_edit"+ key +"' class='button_edit_list"+" "+word+"'>"+common_edit+"</a><br>"+
                           "<a href='javascript:void(0);' id='button_delete"+ key +"' class='button_delete_list'>"+common_delete+"</a>"+
                      "</td>"+
                "</tr>";
      oneinfo = {
          start_ip : lanIPFilterData.LanIPFilterLanStartAddress,
          end_ip : lanIPFilterData.LanIPFilterLanEndAddress,
          wan_start_ip : lanIPFilterData.LanIPFilterWanStartAddress,
          wan_end_ip : lanIPFilterData.LanIPFilterWanEndAddress,
          start_port : lanIPFilterData.LanIPFilterLanStartPort,
          end_port : lanIPFilterData.LanIPFilterLanEndPort,
          wan_start_port : lanIPFilterData.LanIPFilterWanStartPort,
          wan_end_port : lanIPFilterData.LanIPFilterWanEndPort,
          protocol : lanIPFilterData.LanIPFilterProtocol,
          status : lanIPFilterData.LanIPFilterStatus
     };
   }
   $("#service_list").append(newline);
   g_save_all_data.push([key,oneinfo]);
}

function IpAddress2DecNum(address)
{
	var addrParts = address.split('.');
	var num = 0;
	for (i = 0; i < 4; i++)
	{
		num += parseInt(addrParts[i], 10) * Math.pow(256, 3 - i);
	}
	return num;
} 

function formatIpv6address(ipaddress)
{
	if(ipaddress.indexOf("::") > -1 )
	{
		if(ipaddress.indexOf("::") == 0)
		{
			if("::" == ipaddress)
			{
				ipaddress = "0:0:0:0:0:0:0:0";
				return ipaddress;
			}
			else
			{
				var i = 0;
				var count_colon = 0;
				var length_ip = ipaddress.length;
				for(i = 0; i < length_ip; i++)
				{
					if(":" == ipaddress.charAt(i))
					{
						count_colon ++;
					}
				}
				var new_colon_str = "";
				if(7 == count_colon)
				{
					new_colon_str = "0:0:";
				}
				else if(6 == count_colon)
				{
					new_colon_str = "0:0:0:";
				}
				else if(5 == count_colon)
				{
					new_colon_str = "0:0:0:0:";
				}
				else if(4 == count_colon)
				{
					new_colon_str = "0:0:0:0:0:";
				}
				else if(3 == count_colon)
				{
					new_colon_str = "0:0:0:0:0:0:";
				}
				else if(2 == count_colon)
				{
					new_colon_str = "0:0:0:0:0:0:0:";
				}
				return ipaddress.replace("::", new_colon_str);
			}
		}
		else
		{
			var i = 0;
			var count_colon = 0;
			var length_ip = ipaddress.length;
			for(i = 0; i < length_ip; i++)
			{
				if(":" == ipaddress.charAt(i))
				{
					count_colon ++;
				}
			}
			var new_colon_str = "";
			if(7 == count_colon)
			{
				new_colon_str = ":0:";
			}
			else if(6 == count_colon)
			{
				new_colon_str = ":0:0:";
			}
			else if(5 == count_colon)
			{
				new_colon_str = ":0:0:0:";
			}
			else if(4 == count_colon)
			{
				new_colon_str = ":0:0:0:0:";
			}
			else if(3 == count_colon)
			{
				new_colon_str = ":0:0:0:0:0:";
			}
			else if(2 == count_colon)
			{
				new_colon_str = ":0:0:0:0:0:0:";
			}
			return ipaddress.replace("::", new_colon_str);
		}
	}
	else
	{
		return ipaddress;
	}
}
function Ipv6Compare(start, end)
{
	var i = 0;
	var format_start_ip = formatIpv6address(start);
	var format_end_ip = formatIpv6address(end);
	var start_ip_array = format_start_ip.split(":");
	var end_ip_array = format_end_ip.split(":");
	var start_value = 0;
	var end_value = 0;
	
	for(i = 0; i < 8; i++)
	{
		start_value = parseInt(start_ip_array[i], 16);
		end_value = parseInt(end_ip_array[i], 16);
		if(start_value == end_value)
		{
			continue;
		}
		else if(start_value > end_value)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	return true;
}

function checkMutiIp(id){
    var val= $.trim(parent.$('#'+id).val()).toLowerCase();
    if((0 == val.indexOf("ff"))||(0 == val.indexOf("::")))
    {
        showErrorUnderTextbox_Parent(id,lan_filter_errorinfo);
        parent.$('#'+id).focus();
        return false;
    }
    return true;
}
/*---------------------------------validate ip and port-------------------------------------*/
function checkIPAndPort(){
    parent.clearAllErrorLabel();
    if($.trim(parent.$("#show_start_ip").val()) == "" && $.trim(parent.$("#show_end_ip").val()) == "" 
        && $.trim(parent.$("#show_start_port").val()) == "" && $.trim(parent.$("#show_end_port").val()) == "" && $.trim(parent.$("#show_wan_start_ip").val()) == "" 
        && $.trim(parent.$("#show_wan_end_ip").val()) == "" && $.trim(parent.$("#show_wan_start_port").val()) == "" && $.trim(parent.$("#show_wan_end_port").val()) == "") 
    {
        showErrorUnderTextbox_Parent("show_start_ip",lan_filter_errorinfo);
        parent.$('#show_start_ip').focus();
        return false;
    }
    //sourse ip can not be Multicast address
    if(false == checkMutiIp("show_start_ip")){
            return false;
    }
    if(!isValidIpv6Address(parent.$("#show_start_ip").val()) && $.trim(parent.$("#show_start_ip").val()) != "") {
        if(!isValidIpAddressForIPFilter(parent.$("#show_start_ip").val()) 
            || parent.$("#show_start_ip").val() == parent.dhcpLanIPAddress 
            || !isSameSubnetAddrs(sourceIpTranApplyValid(parent.$("#show_start_ip").val()), parent.dhcpLanIPAddress, parent.dhcpLanNetmask))
        {
            showErrorUnderTextbox_Parent("show_start_ip",lan_filter_errorinfo);
            parent.$('#show_start_ip').focus();
            return false;
        }
    }
    //sourse ip can not be Multicast address
    if(false == checkMutiIp("show_end_ip")){
            return false;
    }
    if ($.trim(parent.$("#show_end_ip").val()) != "") {
        if(isValidIpv6Address(parent.$("#show_start_ip").val())) {
            if(!isValidIpv6Address(parent.$("#show_end_ip").val())) {
                showErrorUnderTextbox_Parent("show_end_ip",lan_filter_errorinfo);
                parent.$('#show_end_ip').focus();
                return false;
            }
        }
        else {
            if((!isValidIpAddressForIPFilter(parent.$("#show_end_ip").val())
                || parent.$("#show_end_ip").val() == parent.dhcpLanIPAddress || !isSameSubnetAddrs(sourceIpTranApplyValid(parent.$("#show_end_ip").val()), parent.dhcpLanIPAddress, parent.dhcpLanNetmask)))
            {
                showErrorUnderTextbox_Parent("show_end_ip",lan_filter_errorinfo);
                parent.$('#show_end_ip').focus();
                return false;
            }
        }
    } 
    
    if($.trim(parent.$("#show_start_ip").val()) != "" && $.trim(parent.$("#show_end_ip").val()) != "")
    {
    	var start_ip = $.trim(parent.$("#show_start_ip").val());
    	var end_ip = $.trim(parent.$("#show_end_ip").val());
    	if(isValidIpAddressForIPFilter(start_ip) && isValidIpAddressForIPFilter(end_ip))
    	{
    		if(IpAddress2DecNum(start_ip) > IpAddress2DecNum(end_ip))
    		{
	            showErrorUnderTextbox_Parent("show_end_ip",lan_ip_reverse);
	            parent.$('#show_end_ip').focus();
	            return false;
    		}
    	}
    	else if(isValidIpv6Address(start_ip) && isValidIpv6Address(end_ip))
    	{
    		if(!Ipv6Compare(start_ip, end_ip))
    		{
	            showErrorUnderTextbox_Parent("show_end_ip",lan_ip_reverse);
	            parent.$('#show_end_ip').focus();
	            return false;
    		}
    	}
    	else
    	{
            showErrorUnderTextbox_Parent("show_end_ip",lan_filter_errorinfo);
            parent.$('#show_end_ip').focus();
            return false;
    	}
    }
    
    if (!isVaildPortForIPFilter(parent.$("#show_start_port").val()) && $.trim(parent.$("#show_start_port").val()) != "")
    {        
        showErrorUnderTextbox_Parent("show_start_port",lan_filter_errorinfo); 
        parent.$('#show_start_port').focus();   
        return false;  
    }
    if($.trim(parent.$("#show_end_port").val()) != "") {
        if (!isVaildPortForIPFilter(parent.$("#show_end_port").val()) || parseInt(parent.$("#show_end_port").val(),10)<parseInt(parent.$("#show_start_port").val(),10))
        {       
            showErrorUnderTextbox_Parent("show_end_port",lan_filter_errorinfo); 
            parent.$('#show_end_port').focus();       
            return false;  
        }
        if($.trim(parent.$("#show_start_port").val()) == "") {
            showErrorUnderTextbox_Parent("show_start_port",lan_filter_errorinfo); 
            parent.$('#show_start_port').focus();   
            return false;  
        }
    }
    if("0" != g_config_firewall.lanipfilter.wan) {
        if(!isValidIpv6Address(parent.$("#show_wan_start_ip").val()) && $.trim(parent.$("#show_wan_start_ip").val()) != "") {
            if (!isValidIpAddress(parent.$("#show_wan_start_ip").val())
            || parent.$("#show_wan_start_ip").val() == parent.dhcpLanIPAddress ){
            showErrorUnderTextbox_Parent("show_wan_start_ip",lan_filter_errorinfo);
            parent.$('#show_wan_start_ip').focus();      
            return false;  
            }
        }
        if(false == checkMutiIp("show_wan_end_ip")){
            return false;
        }
        if($.trim(parent.$("#show_wan_end_ip").val()) != "") {
            if(isValidIpv6Address(parent.$("#show_wan_start_ip").val())) {
                if(!isValidIpv6Address(parent.$("#show_wan_end_ip").val())) {
                    showErrorUnderTextbox_Parent("show_wan_end_ip",lan_filter_errorinfo);
                    parent.$('#show_wan_end_ip').focus();     
                    return false; 
                }
            }
            else {
                if (!isValidIpAddress(parent.$("#show_wan_end_ip").val())
                    || parent.$("#show_wan_end_ip").val() == parent.dhcpLanIPAddress) 
                {      
                    showErrorUnderTextbox_Parent("show_wan_end_ip",lan_filter_errorinfo);
                    parent.$('#show_wan_end_ip').focus();     
                    return false;  
                }
            }
        }
        if(false == checkMutiIp("show_wan_start_ip")){
            return false;
        }
        
	    if($.trim(parent.$("#show_wan_start_ip").val()) != "" && $.trim(parent.$("#show_wan_end_ip").val()) != "")
	    {
	    	var start_wan_ip = $.trim(parent.$("#show_wan_start_ip").val());
	    	var end_wan_ip = $.trim(parent.$("#show_wan_end_ip").val());
	    	if(isValidIpAddressForIPFilter(start_wan_ip) && isValidIpAddressForIPFilter(end_wan_ip))
	    	{
	    		if(IpAddress2DecNum(start_wan_ip) > IpAddress2DecNum(end_wan_ip))
	    		{
		            showErrorUnderTextbox_Parent("show_wan_end_ip",lan_ip_reverse);
		            parent.$('#show_wan_end_ip').focus();
		            return false;
	    		}
	    	}
	    	else if(isValidIpv6Address(start_wan_ip) && isValidIpv6Address(end_wan_ip))
	    	{
	    		if(!Ipv6Compare(start_wan_ip, end_wan_ip))
	    		{
		            showErrorUnderTextbox_Parent("show_wan_end_ip",lan_ip_reverse);
		            parent.$('#show_wan_end_ip').focus();
		            return false;
	    		}
	    	}
	    	else
	    	{
	            showErrorUnderTextbox_Parent("show_wan_end_ip",lan_filter_errorinfo);
	            parent.$('#show_wan_end_ip').focus();
	            return false;
	    	}
	    }
	    
        if (!isVaildPortForIPFilter(parent.$("#show_wan_start_port").val()) && $.trim(parent.$("#show_wan_start_port").val()) != "")
        {        
            showErrorUnderTextbox_Parent("show_wan_start_port",lan_filter_errorinfo); 
            parent.$('#show_wan_start_port').focus();    
            return false;  
        }
        if($.trim(parent.$("#show_wan_end_port").val()) != "") {
             if (!isVaildPortForIPFilter(parent.$("#show_wan_end_port").val()) || parseInt(parent.$("#show_wan_end_port").val(),10)<parseInt(parent.$("#show_wan_start_port").val(),10))
            {       
                showErrorUnderTextbox_Parent("show_wan_end_port",lan_filter_errorinfo);
                parent.$('#show_wan_end_port').focus();       
                return false;
            }
            if($.trim(parent.$("#show_wan_start_port").val()) == "") {
                showErrorUnderTextbox_Parent("show_wan_start_port",lan_filter_errorinfo); 
                parent.$('#show_wan_start_port').focus();    
                return false;  
            }
        }
        
        var start_ip_lan = $.trim(parent.$("#show_start_ip").val());
    	var end_ip_lan = $.trim(parent.$("#show_end_ip").val());
    	var start_ip_wan = $.trim(parent.$("#show_wan_start_ip").val());
    	var end_ip_wan = $.trim(parent.$("#show_wan_end_ip").val());
    	if(((isValidIpAddressForIPFilter(start_ip_lan) || isValidIpAddressForIPFilter(end_ip_lan)) && (isValidIpv6Address(start_ip_wan) || isValidIpv6Address(end_ip_wan)))
    		|| ((isValidIpv6Address(start_ip_lan) || isValidIpv6Address(end_ip_lan)) && (isValidIpAddressForIPFilter(start_ip_wan) || isValidIpAddressForIPFilter(end_ip_wan))))
    	{
            showErrorUnderTextbox_Parent("show_wan_start_ip", lan_wan_ip_same_format);
            parent.$('#show_wan_start_ip').focus();
            return false;
    	}
    }
    return true;
}
function check_allicmp_protocol_port()
{   
    parent.clearAllErrorLabel();
    if(parent.$("#show_protocol_select").val()==SAVE_PROTOCAL_ALL || parent.$("#show_protocol_select").val()==SAVE_PROTOCAL_ICMP)
    {
        if($.trim(parent.$("#show_start_port").val()) != "")
        {
            showErrorUnderTextbox_Parent("show_start_port",lan_filter_conf_port_errorinfo); 
            parent.$('#show_start_port').focus();    
            return false; 
        }
        if($.trim(parent.$("#show_end_port").val()) != "")
        {
            showErrorUnderTextbox_Parent("show_end_port",lan_filter_conf_port_errorinfo); 
            parent.$('#show_end_port').focus();    
            return false; 
        }
        if($.trim(parent.$("#show_wan_start_port").val()) != "")
        {
            showErrorUnderTextbox_Parent("show_wan_start_port",lan_filter_conf_port_errorinfo); 
            parent.$('#show_wan_start_port').focus();    
            return false; 
        }
        if($.trim(parent.$("#show_wan_end_port").val()) != "")
        {
            showErrorUnderTextbox_Parent("show_wan_end_port",lan_filter_conf_port_errorinfo); 
            parent.$('#show_wan_end_port').focus();    
            return false; 
        }      
    }
    return true;
}
function isSameRule()
{
    var issameRule = false;
    var editinfo;
    var addinfo;
    var apparray = [];
    
    if('0' == g_config_firewall.lanipfilter.wan) {
        if($("#select_ip_allow_deny").val() == "1") {
            $(".show_ip_filter_"+WHITE_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),0);
                apparray.push(ipinfo);
            });
        }
        else {
            $(".show_ip_filter_"+BLACK_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),0);
                apparray.push(ipinfo);
            });
        }
        if (parent.$(".dialog_header_left").text() == common_edit)
        {
           var editinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                    };  

                for (var i in apparray)
                {
                    if (i != g_edit_filter_Index 
                        && apparray[i].LanIPFilterLanStartAddress == editinfo.start_ip
                        && apparray[i].LanIPFilterLanEndAddress == editinfo.end_ip
                        && apparray[i].LanIPFilterLanStartPort == editinfo.start_port
                        && apparray[i].LanIPFilterLanEndPort == editinfo.end_port
                        && apparray[i].LanIPFilterProtocol == editinfo.protocol
                        )
                    {
                        parent.$("#lan_filter_same_rule").text(label_same_rule_exist);
                        return true;
                    }
                }   
        }
        else
        {
            addinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                    };

                for (var i in apparray)
                {
                    if (   apparray[i].LanIPFilterLanStartAddress == addinfo.start_ip
                        && apparray[i].LanIPFilterLanEndAddress == addinfo.end_ip
                        && apparray[i].LanIPFilterLanStartPort == addinfo.start_port
                        && apparray[i].LanIPFilterLanEndPort == addinfo.end_port
                        && apparray[i].LanIPFilterProtocol == addinfo.protocol
                        )
                    {
                        parent.$("#lan_filter_same_rule").text(label_same_rule_exist);
                        return true;
                    }
                }
        }
        
    }
    else {
        if($("#select_ip_allow_deny").val() == "1") {
            $(".show_ip_filter_"+WHITE_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),1);
                apparray.push(ipinfo);
            });
        }
        else {
            $(".show_ip_filter_"+BLACK_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),1);
                apparray.push(ipinfo);
            });
        }
        if (parent.$(".dialog_header_left").text() == common_edit)
        {
            editinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    wan_start_ip : parent.$("#show_wan_start_ip").val(),
                    wan_end_ip : $.trim(parent.$("#show_wan_end_ip").val()) == "" ? parent.$("#show_wan_start_ip").val() : parent.$("#show_wan_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    wan_start_port : parent.$("#show_wan_start_port").val(),
                    wan_end_port : $.trim(parent.$("#show_wan_end_port").val()) == "" ? parent.$("#show_wan_start_port").val() : parent.$("#show_wan_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                    }; 

                for (var i in apparray)
                {
                    if (i != g_edit_filter_Index 
                        && apparray[i].LanIPFilterLanStartAddress == editinfo.start_ip
                        && apparray[i].LanIPFilterLanEndAddress == editinfo.end_ip
                        && apparray[i].LanIPFilterLanStartPort == editinfo.start_port
                        && apparray[i].LanIPFilterLanEndPort == editinfo.end_port
                        && apparray[i].LanIPFilterProtocol == editinfo.protocol                     
                        && apparray[i].LanIPFilterWanStartAddress == editinfo.wan_start_ip
                        && apparray[i].LanIPFilterWanEndAddress == editinfo.wan_end_ip                        
                        && apparray[i].LanIPFilterWanStartPort == editinfo.wan_start_port
                        && apparray[i].LanIPFilterWanEndPort == editinfo.wan_end_port                    
                        )
                    {
                        parent.$("#lan_filter_same_rule").text(label_same_rule_exist);
                        return true;
                    }
                }   
        }
        else
        {
            addinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    wan_start_ip : parent.$("#show_wan_start_ip").val(),
                    wan_end_ip : $.trim(parent.$("#show_wan_end_ip").val()) == "" ? parent.$("#show_wan_start_ip").val() : parent.$("#show_wan_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    wan_start_port : parent.$("#show_wan_start_port").val(),
                    wan_end_port : $.trim(parent.$("#show_wan_end_port").val()) == "" ? parent.$("#show_wan_start_port").val() : parent.$("#show_wan_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                    };
                for (var i in apparray)
                {
                    if (   apparray[i].LanIPFilterLanStartAddress == addinfo.start_ip
                        && apparray[i].LanIPFilterLanEndAddress == addinfo.end_ip
                        && apparray[i].LanIPFilterLanStartPort == addinfo.start_port
                        && apparray[i].LanIPFilterLanEndPort == addinfo.end_port
                        && apparray[i].LanIPFilterProtocol == addinfo.protocol                     
                        && apparray[i].LanIPFilterWanStartAddress == addinfo.wan_start_ip
                        && apparray[i].LanIPFilterWanEndAddress == addinfo.wan_end_ip                        
                        && apparray[i].LanIPFilterWanStartPort == addinfo.wan_start_port
                        && apparray[i].LanIPFilterWanEndPort == addinfo.wan_end_port  
                        )
                    {
                        parent.$("#lan_filter_same_rule").text(label_same_rule_exist);
                        return true;
                    }
                }
        }
    }
    return issameRule;
}

/*--------------------------add btn click--------------------------------------*/
function clickAdd(){
  if(isButtonEnable("add_item")){
    if(($(".show_ip_filter_white").length < LAN_IP_FILTER_NUM && $("#select_ip_allow_deny").val() == "1") || ($(".show_ip_filter_black").length < LAN_IP_FILTER_NUM && $("#select_ip_allow_deny").val() == "2")){
          if('0' == g_config_firewall.lanipfilter.wan) {
            parent.call_dialog(common_add,addhtml,common_save,"show_edit_ok",common_cancel,"show_edit_cancel",save_pop_ok,clickCancel);
            parent.$('.wanth').hide();
            parent.$("#show_dialog_table").css("height","150px"); 
          }
          else {
            parent.call_dialog(common_add,addhtml,common_save,"show_edit_ok",common_cancel,"show_edit_cancel",save_pop_ok,clickCancel);
            $('.wanth').show();
            parent.$('.wanth').show();
          }       
      }
      else {
        return;
      } 
  }
    else{
      return;
    }
}

/*---------------------------------apply btn --------------------------------------*/
function clickApply(){
    var submitObject = {};
    var apparray = [];
    
    if('0' == g_config_firewall.lanipfilter.wan) {
        if($("#select_ip_allow_deny").val() == "1") {
            $(".show_ip_filter_"+WHITE_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),0);
                apparray.push(ipinfo);
            });
        }
        else {
            $(".show_ip_filter_"+BLACK_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),0);
                apparray.push(ipinfo);
            });
        }
    }
    else {
        if($("#select_ip_allow_deny").val() == "1") {
            $(".show_ip_filter_"+WHITE_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),1);
                apparray.push(ipinfo);
            });
        }
        else {
            $(".show_ip_filter_"+BLACK_FILTER_WORD).each(function(i) {
                var ipinfo = setApplyData($(this).children(),1);
                apparray.push(ipinfo);
            });
        }
    }
    submitObject = {
        LanIPFilterPolicy : $("#select_ip_allow_deny").val(),
        IPFilters : {
            IPFilter : apparray
        }
    };
    var sub = object2xml("request",submitObject);
    saveAjaxData("api/security/lan-ip-filter",sub,function($xml){
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            parent.showInfoDialog(common_success);
            button_enable('apply', '0');
            initPage();
        }else{
            parent.showInfoDialog(common_failed);
        }
    });
}

function setApplyData(data,wanEnable) {
    var returnInfo = null;
    if(wanEnable == 0) {
        returnInfo = {
            LanIPFilterProtocol: data.eq(4).text(),
            LanIPFilterStatus: data.eq(5).text() == common_on?1:0,
            LanIPFilterLanStartAddress: isValidIpv6Address(data.eq(0).text().split("-")[0]) ? data.eq(0).text().split("-")[0] : ipTranApply(data.eq(0).text().split("-")[0]),
            LanIPFilterLanEndAddress: isValidIpv6Address(data.eq(0).text().split("-")[1] == null ? data.eq(0).text().split("-")[0] : data.eq(0).text().split("-")[1]) ? data.eq(0).text().split("-")[1] == null ? data.eq(0).text().split("-")[0] : data.eq(0).text().split("-")[1] : ipTranApply(data.eq(0).text().split("-")[1] == null ? data.eq(0).text().split("-")[0] : data.eq(0).text().split("-")[1]),
            LanIPFilterLanStartPort: data.eq(1).text().split("-")[0],
            LanIPFilterLanEndPort: data.eq(1).text().split("-")[1] == null?data.eq(1).text().split("-")[0]:data.eq(1).text().split("-")[1],
            LanIPFilterSrcStartIPMask: ipGetMaskNum(data.eq(0).text())
        };
    }
    else if(wanEnable == 1) {
        returnInfo = {
            LanIPFilterProtocol: data.eq(4).text(),
            LanIPFilterStatus: data.eq(5).text() == common_on?1:0,
            LanIPFilterLanStartAddress: isValidIpv6Address(data.eq(0).text().split("-")[0]) ? data.eq(0).text().split("-")[0] : ipTranApply(data.eq(0).text().split("-")[0]),
            LanIPFilterLanEndAddress: isValidIpv6Address(data.eq(0).text().split("-")[1] == null ? data.eq(0).text().split("-")[0] : data.eq(0).text().split("-")[1]) ? data.eq(0).text().split("-")[1] == null ? data.eq(0).text().split("-")[0] : data.eq(0).text().split("-")[1] : ipTranApply(data.eq(0).text().split("-")[1] == null ? data.eq(0).text().split("-")[0] : data.eq(0).text().split("-")[1]),
            LanIPFilterLanStartPort: data.eq(1).text().split("-")[0],
            LanIPFilterLanEndPort: data.eq(1).text().split("-")[1] == null?data.eq(1).text().split("-")[0]:data.eq(1).text().split("-")[1],
            LanIPFilterWanStartAddress: isValidIpv6Address(data.eq(2).text().split("-")[0]) ? data.eq(2).text().split("-")[0] : ipTranApply(data.eq(2).text().split("-")[0]),
            LanIPFilterWanEndAddress: isValidIpv6Address(data.eq(2).text().split("-")[1] == null ? data.eq(2).text().split("-")[0] : data.eq(2).text().split("-")[1]) ? data.eq(2).text().split("-")[1] == null ? data.eq(2).text().split("-")[0] : data.eq(2).text().split("-")[1] : ipTranApply(data.eq(2).text().split("-")[1] == null ? data.eq(2).text().split("-")[0] : data.eq(2).text().split("-")[1]),
            LanIPFilterWanStartPort: data.eq(3).text().split("-")[0],
            LanIPFilterWanEndPort: data.eq(3).text().split("-")[1] == null?data.eq(3).text().split("-")[0]:data.eq(3).text().split("-")[1],
            LanIPFilterSrcStartIPMask: ipGetMaskNum(data.eq(0).text()),
            LanIPFilterDestStartIPMask: ipGetMaskNum(data.eq(2).text())
        };
    }
    return returnInfo;
}


/*---------------------------------delete btn click------------------------------------------------*/
function clickDel(){
    if (firewall_status != null && firewall_status.FirewallIPFilterSwitch == 0) {
        return;
    }
    if (firewall_status != null && firewall_status.FirewallMainSwitch == 0){
        return;
    }
    g_deleteIndex = $(".button_delete_list").index(this);
    parent.showConfirmDialog(firewall_hint_delete_list_item, delete_pop_ok,clickCancel);
    $(".button_delete_list").blur();
}

/*--------------------delete pop ok function------------------------------*/
function delete_pop_ok() {
    $(".user_add_line").eq(g_deleteIndex).remove();
    parent.clearDialog();
    button_enable("apply", "1");
    g_save_all_data.splice(g_deleteIndex,1);
    if(($(".show_ip_filter_white").length < LAN_IP_FILTER_NUM && $("#select_ip_allow_deny").val() == "1") || ($(".show_ip_filter_black").length < LAN_IP_FILTER_NUM && $("#select_ip_allow_deny").val() == "2")) {
       button_enable("add_item",1);
    }
}

/*------------------------click cancel btn--------------------------------*/
function clickCancel(){
    parent.clearDialog();
}

/*---------------------------save pop ok function--------------------------*/
function save_pop_ok() {
    if(check_allicmp_protocol_port()&&checkIPAndPort() && !isSameRule()){
        if (parent.$(".dialog_header_left").text() == common_edit) {
            var editinfo = null;
            $('#protocol_'+g_editID.split("_")[2]).text(parent.$("#show_protocol_select option:selected").text());
            if (parent.$("#show_start_ip").val() == parent.$("#show_end_ip").val() || $.trim(parent.$("#show_end_ip").val()) == ""){
                $("#lan_ip_start_"+g_editID.split("_")[2]).html(parent.$("#show_start_ip").val());
            }
            else {
                $("#lan_ip_start_"+g_editID.split("_")[2]).html(parent.$("#show_start_ip").val()+"-<br/>"+parent.$("#show_end_ip").val());
            }
            if (parent.$("#show_start_port").val() == parent.$("#show_end_port").val() || $.trim(parent.$("#show_end_port").val()) == "") {
                $("#lan_ip_port_"+g_editID.split("_")[2]).text(parent.$("#show_start_port").val());
            }
            else {
                $("#lan_ip_port_"+g_editID.split("_")[2]).text(parent.$("#show_start_port").val()+"-"+parent.$("#show_end_port").val());
            }
            $("#status_"+g_editID.split("_")[2]).text(parent.$("#show_status_select").val()=="1"?common_on:common_off);
            if('0' == g_config_firewall.lanipfilter.wan) {
                editinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                };                    
            }
            else {
                if (parent.$("#show_wan_start_ip").val() == parent.$("#show_wan_end_ip").val() || $.trim(parent.$("#show_wan_end_ip").val()) == ""){
                    $("#wan_ip_start_"+g_editID.split("_")[2]).html(parent.$("#show_wan_start_ip").val());
                }
                else {
                    $("#wan_ip_start_"+g_editID.split("_")[2]).html(parent.$("#show_wan_start_ip").val()+"-<br/>"+parent.$("#show_wan_end_ip").val());
                }
                if (parent.$("#show_wan_start_port").val() == parent.$("#show_wan_end_port").val() || $.trim(parent.$("#show_wan_end_port").val()) == "") {
                    $("#wan_port_"+g_editID.split("_")[2]).text(parent.$("#show_wan_start_port").val());
                }
                else {
                    $("#wan_port_"+g_editID.split("_")[2]).text(parent.$("#show_wan_start_port").val()+"-"+parent.$("#show_wan_end_port").val());
                }
                editinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    wan_start_ip : parent.$("#show_wan_start_ip").val(),
                    wan_end_ip : $.trim(parent.$("#show_wan_end_ip").val()) == "" ? parent.$("#show_wan_start_ip").val() : parent.$("#show_wan_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    wan_start_port : parent.$("#show_wan_start_port").val(),
                    wan_end_port : $.trim(parent.$("#show_wan_end_port").val()) == "" ? parent.$("#show_wan_start_port").val() : parent.$("#show_wan_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                };
            }
            g_save_all_data[g_editIndex].splice(1,1,editinfo);
        } 
        else {
            var number = 0;
            if(g_save_all_data.length == 0) {
                number = 0;
            }
            else {
                number = g_save_all_data[g_save_all_data.length-1][0] + 1;
            }
            var addinfo = null;
            var addline = "";
            var word = $("#select_ip_allow_deny").val() == "1" ? WHITE_FILTER_WORD : BLACK_FILTER_WORD;
            if('0' == g_config_firewall.lanipfilter.wan) {
                addline = "<tr class='user_add_line show_ip_filter_"+word+"'>";
                if (parent.$("#show_start_ip").val() == parent.$("#show_end_ip").val() || $.trim(parent.$("#show_end_ip").val()) == "") {
                    addline += "<td id='lan_ip_start_"+number+"' class='td_ltr'>"+parent.$("#show_start_ip").val()+"</td>";
                }
                else {
                    addline += "<td id='lan_ip_start_"+number+"' class='td_ltr'>"+parent.$("#show_start_ip").val()+"-<br/>"+parent.$("#show_end_ip").val()+"</td>";
                }
                if (parent.$("#show_start_port").val() == parent.$("#show_end_port").val() || $.trim(parent.$("#show_end_port").val()) == "") {
                    addline += "<td id='lan_ip_port_"+number+"' class='td_ltr'>"+parent.$("#show_start_port").val()+"</td>";
                }
                else {
                    addline += "<td id='lan_ip_port_"+number+"' class='td_ltr'>"+parent.$("#show_start_port").val()+"-"+parent.$("#show_end_port").val()+"</td>";
                }
                addline += "<td id='protocol_"+number+"'>"+parent.$("#show_protocol_select option:selected").text()+"</td>"+
                                 "<td id='status_"+number+"'>"+parent.$("#show_status_select option:selected").text()+"</td>"+
                                 "<td class='user_options' id='ip_start_"+number+"'>"+
                                    "<a href='javascript:void(0);' id='button_edit"+ number +"' class='button_edit_list"+" "+word+"'>"+common_edit+"</a>"+
                                    "<a href='javascript:void(0);' id='button_delete"+ number +"' class='button_delete_list'>"+common_delete+"</a>"+
                                 "</td>"+
                            "</tr>";
                addinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                };
            }
            else {
                addline = "<tr class='user_add_line show_ip_filter_"+word+"'>";
                if (parent.$("#show_start_ip").val() == parent.$("#show_end_ip").val() || $.trim(parent.$("#show_end_ip").val()) == "") {
                    addline += "<td id='lan_ip_start_"+number+"' class='td_ltr'>"+parent.$("#show_start_ip").val()+"</td>";
                }
                else {
                    addline += "<td id='lan_ip_start_"+number+"' class='td_ltr'>"+parent.$("#show_start_ip").val()+"-<br/>"+parent.$("#show_end_ip").val()+"</td>";
                }
                if (parent.$("#show_start_port").val() == parent.$("#show_end_port").val() || $.trim(parent.$("#show_end_port").val()) == "") {
                    addline += "<td id='lan_ip_port_"+number+"' class='td_ltr'>"+parent.$("#show_start_port").val()+"</td>";
                }
                else {
                    addline += "<td id='lan_ip_port_"+number+"' class='td_ltr'>"+parent.$("#show_start_port").val()+"-"+parent.$("#show_end_port").val()+"</td>";
                }
                if (parent.$("#show_wan_start_ip").val() == parent.$("#show_wan_end_ip").val() || $.trim(parent.$("#show_wan_end_ip").val()) == "") {
                    addline += "<td id='wan_ip_start_"+number+"' class='td_ltr'>"+parent.$("#show_wan_start_ip").val()+"</td>";
                }
                else {
                    addline += "<td id='wan_ip_start_"+number+"' class='td_ltr'>"+parent.$("#show_wan_start_ip").val()+"-<br/>"+parent.$("#show_wan_end_ip").val()+"</td>";
                }
                if (parent.$("#show_wan_start_port").val() == parent.$("#show_wan_end_port").val() || $.trim(parent.$("#show_wan_end_port").val()) == "") {
                    addline += "<td id='wan_port_"+number+"' class='td_ltr'>"+parent.$("#show_wan_start_port").val()+"</td>";
                }
                else {
                    addline += "<td id='wan_port_"+number+"' class='td_ltr'>"+parent.$("#show_wan_start_port").val()+"-"+parent.$("#show_wan_end_port").val()+"</td>";
                }
                addline += "<td id='protocol_"+number+"'>"+parent.$("#show_protocol_select option:selected").text()+"</td>"+
                                 "<td id='status_"+number+"'>"+parent.$("#show_status_select option:selected").text()+"</td>"+
                                 "<td class='user_options' id='ip_start_"+number+"'>"+
                                    "<a href='javascript:void(0);' id='button_edit"+ number +"' class='button_edit_list"+" "+word+"'>"+common_edit+"</a><br>"+
                                    "<a href='javascript:void(0);' id='button_delete"+ number +"' class='button_delete_list'>"+common_delete+"</a>"+
                                 "</td>"+
                            "</tr>";
                addinfo = {
                    start_ip : parent.$("#show_start_ip").val(),
                    end_ip : $.trim(parent.$("#show_end_ip").val()) == "" ? parent.$("#show_start_ip").val() : parent.$("#show_end_ip").val(),
                    wan_start_ip : parent.$("#show_wan_start_ip").val(),
                    wan_end_ip : $.trim(parent.$("#show_wan_end_ip").val()) == "" ? parent.$("#show_wan_start_ip").val() : parent.$("#show_wan_end_ip").val(),
                    start_port : parent.$("#show_start_port").val(),
                    end_port : $.trim(parent.$("#show_end_port").val()) == "" ? parent.$("#show_start_port").val() : parent.$("#show_end_port").val(),
                    wan_start_port : parent.$("#show_wan_start_port").val(),
                    wan_end_port : $.trim(parent.$("#show_wan_end_port").val()) == "" ? parent.$("#show_wan_start_port").val() : parent.$("#show_wan_end_port").val(),
                    protocol : parent.$("#show_protocol_select").val(),
                    status : parent.$("#show_status_select").val()
                };
                
            }
            $("#service_list").append(addline);
            g_save_all_data.push([number,addinfo]);
            if($(".show_ip_filter_" + word).length >= LAN_IP_FILTER_NUM) {
                button_enable("add_item",0);
            }
        }     
        button_enable("apply",1);
        parent.clearDialog();
        return true;
    }
    else {
        return false;
    }
}


/*----------------------------ready----------------------------------------*/
$(document).ready(function() {
    lanIPFilter_getConfig();
    initPage();
    $("#add_item").live("click",clickAdd);
    $(".button_delete_list").live("click",clickDel);
    $('#apply').click(function() {
        if (!isButtonEnable('apply')) {
            return;
        }
        parent.showConfirmDialog(firewall_hint_submit_list_item, clickApply);
    });   

    $('.button_edit_list').live('click', function() {
        if (firewall_status != null && firewall_status.FirewallIPFilterSwitch == 0) {
            return;
        }
        if (firewall_status != null && firewall_status.FirewallMainSwitch == 0){
            return;
        }
        
        g_editIndex = $('.button_edit_list').index(this);
        var word = $("#select_ip_allow_deny").val() == "1" ? WHITE_FILTER_WORD : BLACK_FILTER_WORD;
        g_edit_filter_Index = $('.'+word).index(this);
        g_editID = $(this).parent().attr("id");  
        if ('0' == g_config_firewall.lanipfilter.wan)
        {
            parent.call_dialog(common_edit,addhtml,common_save,"show_edit_ok",common_cancel,"show_edit_cancel",save_pop_ok,clickCancel,"show_start_ip");
            $('.wanth').hide();
            parent.$('.wanth').hide();
            parent.$("#show_dialog_table").css("height","150px");         
        }
        else
        {
            parent.call_dialog(common_edit,addhtml,common_save,"show_edit_ok",common_cancel,"show_edit_cancel",save_pop_ok,clickCancel,"show_start_ip"); 
            $('.wanth').show();
            parent.$('.wanth').show();
            parent.$("#show_wan_start_ip").attr("value",g_save_all_data[g_editIndex][1].wan_start_ip);
            parent.$("#show_wan_end_ip").attr("value",g_save_all_data[g_editIndex][1].wan_end_ip);
            parent.$("#show_wan_start_port").attr("value",g_save_all_data[g_editIndex][1].wan_start_port);
            parent.$("#show_wan_end_port").attr("value",g_save_all_data[g_editIndex][1].wan_end_port); 
        }
        parent.$("#show_protocol_select").attr("value",g_save_all_data[g_editIndex][1].protocol);
        parent.$("#show_status_select").attr("value",g_save_all_data[g_editIndex][1].status);
        parent.$("#show_start_ip").attr("value",g_save_all_data[g_editIndex][1].start_ip);
        parent.$("#show_end_ip").attr("value",g_save_all_data[g_editIndex][1].end_ip);
        parent.$("#show_start_port").attr("value",g_save_all_data[g_editIndex][1].start_port);
        parent.$("#show_end_port").attr("value",g_save_all_data[g_editIndex][1].end_port);      
    });
    $("#select_ip_allow_deny").change(function() {
        button_enable('apply',1);
        if($("#select_ip_allow_deny").val() == "1") {
            $(".show_ip_filter_white").show();
            $(".show_ip_filter_black").hide();
            if($(".show_ip_filter_white").length >= LAN_IP_FILTER_NUM) {
                button_enable("add_item",0);
            }
            else {
                button_enable("add_item",1);
            }
        }
        else {
            $(".show_ip_filter_white").hide();
            $(".show_ip_filter_black").show();
            if($(".show_ip_filter_black").length >= LAN_IP_FILTER_NUM) {
                button_enable("add_item",0);
            }
            else {
                button_enable("add_item",1);
            }
        }
    });
});


