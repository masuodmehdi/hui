[settings]
functionname = hi_adapter_cli_lsw_port_set_pausetime;
attributenum = 2;
attributeflag= 1;

[parameter]
attribute=alias<port>       type<uint>    range<0x0,0x7>              default<0>;
attribute=alias<time>       type<uint>    range<0x0,0xffff>           default<0>;

[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uint32     ui_time;
}hi_lsw_port_pausetime_s;

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



s_info = ret.response;
            switch (diagnosis_info.ClipMode) {
                case '0':
                    diagnosis_info.ClipMode = clip_mode_dtmf;
                    break;
                case '10':
                    diagnosis_info.ClipMode = clip_mode_itu;
                    break;
                case '11':
                    diagnosis_info.ClipMode = clip_mode_bell;
                    break;
                case '12':
                    diagnosis_info.ClipMode = clip_mode_rpas;
                    break;
                default:
                    diagnosis_info.ClipMode = common_unknown;
                    break;
            }
            
            if(typeof(diagnosis_info.rssi) != 'undefined' && diagnosis_info.rssi!="")
            {
                diagnosis_info.rssi = diagnosis_info.rssi + MACRO_EVDO_SIGNAL_DBM;
            }
            
            switch (diagnosis_info.wirelessStatus) {
                case '2':
                    diagnosis_info.wirelessStatus = "CDMA";
                    break;
                case '3':
                    diagnosis_info.wirelessStatus = "GSM";
                    break;
                case '5':
                    diagnosis_info.wirelessStatus = "WCDMA";
                    break;
                case '9':
                    diagnosis_info.wirelessStatus = "LTE";
                    break;
                case '11':
                    diagnosis_info.wirelessStatus = "TDSCDMA";
                    break;
                default:
                    break;
            }
            
            g_device_config.rscp = 0;
            g_device_config.rsrp = 0;
            g_device_config.rsrq = 0;            
            g_device_config.tac  = 0;
            g_device_config.lac  = 0;
            g_device_config.rac  = 0; 
            g_device_config.rssi = 0;

            diagnosis_info.rsrp = common_unknown;
            diagnosis_info.rsrq = common_unknown;
            diagnosis_info.tac  = common_unknown;
            
            if(diagnosis_info.wirelessStatus == "WCDMA" || diagnosis_info.wirelessStatus == "TDSCDMA")
            {
                g_device_config.rscp = 1;
                g_device_config.lac  = 1;
                g_device_config.rac  = 1;
                if(typeof(diagnosis_info.rssi) != 'undefined' && diagnosis_info.rssi!="")
                {
                    diagnosis_info.rscp = diagnosis_info.rssi;
                }      
            }
            else if(diagnosis_info.wirelessStatus == "LTE")
            {
                
                g_device_config.rsrp = 1;
                g_device_config.rsrq = 1;  
                g_device_config.ecio = 0;
                g_device_config.tac  = 1;
                if(typeof(diagnosis_info.rssi) != 'undefined' && diagnosis_info.rssi!="")
                {
                    diagnosis_info.rsrp = diagnosis_info.rssi;
                }
                if(typeof(diagnosis_info.ecio) != 'undefined' && diagnosis_info.ecio!="")
                {
                    diagnosis_info.rsrq = diagnosis_info.ecio;
                }
                if(typeof(diagnosis_info.lac) != 'undefined' && diagnosis_info.lac!="")
                {
                    diagnosis_info.tac = diagnosis_info.lac;
                }
            }
            else
            {
                g_device_config.rssi = 1;
            }
            
            switch (diagnosis_info.antennamode) {
                case '0':
                    diagnosis_info.antennamode = antenna_label_antenna_mode_outer;
                    break;
                case '1':
                    diagnosis_info.antennamode = antenna_label_antenna_mode_inner;
                    break;
                default:
                    break;
            }
            
            switch (diagnosis_info.SimStatus) {
                case '0':              
                    diagnosis_info.wirelessStatus = dialup_label_no_service;
                    diagnosis_info.SimStatus = dialup_label_sim_invalid;
                    break;
                case '1':
                    diagnosis_info.SimStatus = dialup_label_sim_valid;
                    break;
                case '2':
                    diagnosis_info.SimStatus = dialup_label_sim_invalid+"(CS)";
                    break;
                case '3':
                    diagnosis_info.SimStatus = dialup_label_sim_invalid+"(PS)";
                    break;
                case '4':
                    diagnosis_info.wirelessStatus = dialup_label_no_service;
                    diagnosis_info.SimStatus = dialup_label_sim_invalid+"(CS,PS)";
                    break;
                case '255':
                    diagnosis_info.wirelessStatus = dialup_label_no_service;
                    diagnosis_info.SimStatus = dialup_label_sim_invalid;
                    break;
                default:
                    break;
            }
            
        }
    },{
        sync: true
    });
    setDeviceDisplay();
    setTimeout(getDeviceInfo, 6000);
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
        case 'SoftwareBuildTime':
            tdName = system_label_software_buildtime;
            break;
        case 'WebUIVersion':
            tdName = system_label_webui_version;
            break;
        case 'MacAddress1':
        if (diagnosis_info.MacAddress2 == '') {
            tdName = wlan_label_mac_address;

           } else {
                  tdName = IDS_common_mac_address_x.replace('%d', 1);
          }
            break;
        case 'MacAddress2':
        if (diagnosis_info.MacAddress2 != '') {
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
            tdName = system_label_wanip_address;
            break;
        case 'RouterHWVersion':
            tdName = system_label_routerhardwareversion;
            break;
        case 'RouterSWVersion':
            tdName = system_label_routersoftwareversion;
            break;
        case 'DhcpIPAddress':
            tdName = dialup_label_ip_address;
            break;
        case 'DhcpLanNetmask':
            tdName = dhcp_label_subnet_mask;
            break;
        case 'dbandwidth':
            tdName = system_label_bandwidth;
            break;
        case 'dservice_status':
            tdName = system_label_service_status;
            break;
        case 'antennamode':
            tdName = antenna_label_antenna_mode;
            break;
        case 'ClipMode':
            tdName = clip_select_mode;
            break;
        case 'SimStatus':
            tdName = dialup_label_sim_card_status;
            break;
        case 'SimPinStatus':
            tdName = dialup_label_sim_card_status;
            break;
        case 'NetworkBand':
            tdName = label_diagnosis_band_class;
            break;
        case 'CurrentNetworkType':
            tdName = label_network_mode;
            break;
        case 'wirelessStatus':
            tdName = label_wireless_mode;
            break;
        case 'ServiceStatus':
            tdName = system_label_service_status;
            break;
        case 'rssi':
            tdName = label_diagnosis_rssi;
            break;
        case 'cell_id':
            tdName = label_diagnosis_cellid;
            break;
        case 'lac':
            tdName = label_diagnosis_lacid;
            break;
        case 'rac':
            tdName = label_diagnosis_racid;
            break;
        case 'mm_state':
            tdName = label_diagnosis_mmstate;
            break;
        case 'mm_idle_substate':
            tdName = label_diagnosis_mmsubstate;
            break;
        case 'gmm_state':
            tdName = label_diagnosis_gmstate;
            break;
        case 'gmm_substate':
            tdName = label_diagnosis_gmsubstate;
            break;
        case 'rscp':
            tdName = label_diagnosis_rscp;
            break;
        case 'rsrp':
            tdName = "RSRP";
            break;
        case 'rsrq':
            tdName = "RSRQ";
            break;
        case 'tac':
            tdName = "TAC ID";
            break;
        case 'ecio':
            tdName = label_diagnosis_ecio;
            break;

        default:
            break;
    }
    row = '<tr><td>' + tdName + common_colon + "</td><td class='info_value' id ='device_diagnosis_" + _name  + "'>" + (_value == '' ? values : _value) + '</td></tr>';
    return row;
}
//Switch device info to display refrence device configuration xml
function setDeviceDisplay() {
    var _device_config = g_device_config;
    var _device_info = diagnosis_info;
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



getDeviceInfo();

$(document).ready(function() {
    setDeviceDisplay();
});