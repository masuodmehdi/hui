[settings]
functionname = hi_adapter_cli_lsw_port_set_pause;
attributenum = 4;
attributeflag= 1;


[parameter]
attribute=alias<port>       type<uint>     range<0x0,0x7>       default<0>;
attribute=alias<enable>     type<uchar>    range<0x0,0x1>       default<0>;
attribute=alias<res>        type<uchar>    range<0x0,0x0>       default<0>;
attribute=alias<res1>       type<ushort>   range<0x0,0x0>       default<0>;

[help]
typedef struct
{
    hi_lsw_port_e  em_port;
    hi_uchar8      uc_enable;
    hi_uchar8      uc_res;
    hi_ushort16    us_res1;
}hi_lsw_port_status_s;

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



se;
    }

    if(!IsIpInRange($('#StaticIPAddress').val(),listDhcp.DhcpStartIPAddress,listDhcp.DhcpEndIPAddress)){
        showQtip('StaticIPAddress', dhcp_staticaddress_invalid);
        return false;
    }
    
    if($.isArray(listHosts)){
        for(var i=0;i < listHosts.length;i++){
            if(listHosts[i].IPAddress==$('#StaticIPAddress').val()){   
                showQtip('StaticIPAddress', static_address_Used);
                return false;
            }  
        }
    } 
    else {
        if(listHosts.IPAddress==$('#StaticIPAddress').val()){         
            showQtip('StaticIPAddress', static_address_Used);
            return false;
        }                    
    }
    return true;
}

function isSameRule(){
    $.each($('.qtip-defaults'), function() {
        $(this).remove();
    });
    var isSR_Status = false;
    $('.user_add_line').each(function(i) {
        var MacAddr = $(this).children().eq(0).text();
        var IpAddr = $(this).children().eq(1).text();
        if(MacAddr == $('#MACAddress').val()){
            isSR_Status = true;
            showQtip('MACAddress', same_mac_address);
        }else if(IpAddr==  $('#StaticIPAddress').val()){
            isSR_Status = true;
            showQtip('StaticIPAddress', static_address_reiteration);
        }
    });
    return isSR_Status;
}
function initPage(){
    button_enable('apply', '0');
    $('.user_add_line').remove();

    getAjaxData('api/dhcp/settings',function($xml){
        var ret_dhcp = xml2object($xml);
        listDhcp = ret_dhcp.response;
     });

    getAjaxData('api/dhcp/static-addr-info', function($xml){
            var ret = xml2object($xml);
            var staticaddr_status;
            if(('response' == ret.type) && (typeof(ret.response.Hosts) != 'undefined') && (ret.response.Hosts.Host)){
                HostList = ret.response.Hosts.Host;
                if(HostList){
                    if($.isArray(HostList)){
                        $(HostList).each(function(i){
                                staticaddr_status =  getDArrayElement(StatusArray,HostList[i].HostEnabled,'value');
                                addFilter(
                                    $('#service_list tr'),
                                    HostList[i].HostHw,
                                    HostList[i].HostIp,
                                    staticaddr_status
                                );
                            });
                        }else{
                            staticaddr_status =  getDArrayElement(StatusArray,HostList.HostEnabled,'value');
                            addFilter(
                                $('#service_list tr'),
                                HostList.HostHw,
                                HostList.HostIp,
                                staticaddr_status
                            );
                        }
                    }
                }
        if ($('.user_add_line').length >= STATICADDRESS_RULES_MAX)
        {
            button_enable('add_item', '0');
        }
    });
    //get lan status
    getAjaxData("api/connection/lanstatus", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response"){
            if(ret.response.Hosts.Host){
                listHosts = ret.response.Hosts.Host;
            }  
        } else {
            log.error("Load LAN Status data failed");
        }
    });
}

function postData(){
    var submitObject = {};
    var StaticAddrArray = [];
    $('.user_add_line').each(function(i) {
        var MacAddress = $(this).children().eq(0).text();
        var IpAddress = $(this).children().eq(1).text();
        var Status = getDArrayElement(StatusArray, $(this).children().eq(2).text(), 'key');

        var SAddrs ={
            HostHw : MacAddress,
            HostIp : IpAddress,
            HostEnabled : Status
        };

        StaticAddrArray.push(SAddrs);
    });

    submitObject = {
        Hosts: {
            Host: StaticAddrArray
        }
    };
    var submitData = object2xml('request', submitObject);

    saveAjaxData('api/dhcp/static-addr-info', submitData, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            parent.showInfoDialog(common_success);
            button_enable('apply', '0');
        }
        else {
            parent.showInfoDialog(common_failed);
            initPage();
        }
    });
}

$(document).ready( function() {
    initPage();
    var currentAllVal = null;
    var editStatus = null;
    $('.button_edit_list').live('click', function() {
        if (($(".add_item_control:hidden").size() > 0) && ($('#edit_item_ok').size() < 1)) {
            editIndex = $('.button_edit_list').index(this);
            currentAllVal = $('.user_add_line').eq(editIndex).html();
            var editStaticAddr = $(this).parent().siblings();
            var editMACAddr = editStaticAddr.eq(0);
            var editIPAddr = editStaticAddr.eq(1);
            editStatus = editStaticAddr.eq(2);
            var htmlStatus = editStatus.html();

            editMACAddr.html('<input type="text" value="' + editMACAddr.html() + '" id="MACAddress" maxlength="17" /></td>');
            editIPAddr.html('<input type="text" value="' + editIPAddr.html() + '" id="StaticIPAddress" maxlength="15" /></td>');
            createSelect(editStatus,'StaticStatus',StatusArray);
            $('#StaticStatus').val(getDArrayElement(StatusArray, htmlStatus, 'key'));

            $(this).parent().html('<a id="edit_item_ok" href="javascript:void(0);">' + common_ok +
            '</a>&nbsp;&nbsp;<a id="edit_item_cancel" href="javascript:void(0);">' + common_cancel + '</a>');

            hideAddItemControl();
            button_enable('apply', '0');
            button_enable('add_item', '0');
        }  
    });

    $('#edit_item_ok').live('click', function(){
        if(isVaildValue() && !isSameRule()){
            var edit_macaddr = $.trim($('#MACAddress').val());
            var edit_ipaddr = $.trim($('#StaticIPAddress').val());
            var edit_status = $('#StaticStatus option:selected').text();

            hideAddItemControl();
            var editStaticAddr = $(this).parent().siblings();
            editStaticAddr.eq(0).html(edit_macaddr);
            editStaticAddr.eq(1).html(edit_ipaddr);
            editStaticAddr.eq(2).html(edit_status);

            $(this).parent().html('<span class=\"button_edit_list\">' + common_edit +
            '</span>&nbsp;&nbsp;<span class=\"button_delete_list\">' + common_delete + '</span>');
            currentAllVal = $('.user_add_line').eq(editIndex).html();
            button_enable('apply', '1');
            button_enable('add_item', '1');
            ok_flag = 1;
            if ($('.user_add_line').length >= STATICADDRESS_RULES_MAX){
                button_enable('add_item', '0');
            }
        }
    });

    $('#edit_item_cancel').live('click', function() {
        $('.user_add_line').eq(editIndex).html(currentAllVal);
        $('.qtip').qtip('destroy');
        if (!isButtonEnable('add_item'))
        {
            button_enable('add_item', '1');
            if(1 == ok_flag)
            {
                button_enable('apply', '1');
                ok_flag = 0;
            }
        }
    });

    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
        return false;
    });

    $('#add_item_ok').live('click', function() {
        if (isVaildValue() && !isSameRule())
        {
            var add_macaddr = $.trim($('#MACAddress').val());
            var add_ipaddr = $.trim($('#StaticIPAddress').val());
            var add_status = $('#StaticStatus option:selected').text();

            hideAddItemControl();

            addFilter(
                $('#service_list tr'), 
                add_macaddr, 
                add_ipaddr, 
                add_status
            );

            button_enable('apply', '1');

            if (STATICADDRESS_RULES_MAX <= $('.user_add_line').length)
            {
                button_enable('add_item', '0');
            }
        }
        return false;
    });

    $('#add_item').click(function() {
        if (isButtonEnable('add_item'))
        {
            showAddItemControl();
            $('.add_item_control input').eq(0).focus();
            button_enable('apply', '0');
        }
    });

    $('#apply').click(function() {
        if (isButtonEnable('apply')) {
            parent.showConfirmDialog(firewall_hint_submit_list_item, postData);
        }        
    });

    initSelectOption('StaticStatus', StatusArray);
 });