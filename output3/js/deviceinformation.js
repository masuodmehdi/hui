[settings]
functionname = hi_adapter_cli_lsw_port_set_loopback;
attributenum = 2;
attributeflag= 1;

[parameter]
attribute=alias<port>       type<uint>    range<0x0,0x7>              default<0>;
attribute=alias<mode>       type<uint>    range<0x0,0x2>              default<0>;

[help]
typedef struct
{
    hi_lsw_port_e               em_port;
    hi_lsw_port_eth_loopback_e  em_mode;
}hi_lsw_port_loopback_s;

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

/* 以太端口环回模式 */
typedef enum
{
    HI_LSW_PORT_ETH_NO_LOOP_E  = 0,   /* 正常模式 */
    HI_LSW_PORT_ETH_IN_LOOP_E,        /* 内环回模式 */
    HI_LSW_PORT_ETH_OUT_LOOP_E,       /* 外环回模式 */  
}hi_lsw_port_eth_loopback_e;


== 'response') {
            g_device_info = device_ret.response;
            g_device_info.WanIPAddress = GATEWAY_ExternalIPAddress;
            g_device_info.WanIPAddress_ipv6 = GATEWAY_ExternalIPv6Address;
        } else {
            log.error('Error, no data');
        }
    }, {
        sync: true
    });
}

function getDeviceConfig() {
    getConfigData('config/deviceinformation/config.xml', function($xml) {
        var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret)
        {
            g_device_config = config_ret;
        }
    }, {
        sync: true
    });
}

function createListForDevice(_name, _value) {
    var tdName = '';
    var values = common_unknown;
    var row = '';
    switch (_name) {
        case 'DeviceName':
            tdName = system_label_device_name;
            break;

        case 'SerialNumber':
            tdName = system_label_serial_number;
            break;

        case 'Imei':
            tdName = system_label_imei;
            break;

        case 'Imsi':
            tdName = device_information_imsi;
            break;

        case 'HardwareVersion':
            tdName = system_label_hardware_version;
            break;

        case 'SoftwareVersion':
            tdName = system_label_software_version;
            break;

        case 'WebUIVersion':
            tdName = system_label_webui_version;
            break;
        case 'MacAddress1':
        if (g_device_info.MacAddress2 == '') {
            tdName = wlan_label_mac_address;

           } else {
                  tdName = IDS_common_mac_address_x.replace('%d', 1);
          }
            break;
        case 'MacAddress2':
        if (g_device_info.MacAddress2 != '') {
                tdName = IDS_common_mac_address_x.replace('%d', 2);

            } else {
                   return row;
            }
            break;
        case 'Iccid':
            tdName = system_label_iccid;
            break;
        case 'Msisdn':
            tdName = system_label_my_number;
            break;
        case 'ProductFamily':
            tdName = system_label_product_family;
            break;
        case 'Classify':
            tdName = system_label_classify;
            break;
        case 'WanIPAddress':
            tdName = system_label_wanip_address_ipv4;
            break;
         case 'WanIPAddress_ipv6':
            tdName = system_label_wanip_address_ipv6;
            break;
        case 'RouterHWVersion':
            tdName = system_label_routerhardwareversion;
            break;
        case 'RouterSWVersion':
            tdName = system_label_routersoftwareversion;
            break;
        default:
            break;
    }
    row = '<tr><td>' + tdName + common_colon + "</td><td class='info_value' id ='device_" + _name  + "'>" + (_value == '' ? values : _value) + '</td></tr>';
    return row;
}
//Switch device info to display refrence device configuration xml
function setDeviceDisplay(_device_config, _device_info) {
    var list_content = '';
    var p = '';
    for (p in _device_info) {
        if (_device_config[p.toLowerCase()]) {
            if (typeof(_device_info[p]) != 'undefinded') {
                list_content += createListForDevice(p, _device_info[p]);
            }
            else {
                log.error("device dosen't exsited");
            }
        }
    }
    $('.diviceInfo_table').html(list_content);
}

getDeviceConfig();

$(document).ready(function() {
    getDeviceInfo(); 
    setDeviceDisplay(g_device_config, g_device_info);
});