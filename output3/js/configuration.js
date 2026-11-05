[settings]
functionname = hi_adapter_cli_lsw_port_get_pause;
attributenum = 4;
attributeflag= 1;

[parameter]
attribute=alias<port>     type<uint>     range<0x0,0x7>       default<0>;
attribute=alias<enable>   type<uchar>    range<0x0,0x1>       default<0>;
attribute=alias<res>      type<uchar>    range<0x0,0x0>       default<0>;
attribute=alias<res1>     type<ushort>   range<0x0,0x0>       default<0>;

[help]
typedef struct
{
    hi_lsw_port_e  em_port;
    hi_uchar8      uc_enable;
    hi_uchar8      uc_res;
    hi_ushort16    us_res1;
}hi_lsw_port_status_s;

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

/* 用于某功能属性的使能 */
typedef enum
{
    HI_FALSE_E  = 0   , 
    HI_TRUE_E     
}HI_BOOL_E;


        }
        }
    });
}
function gotoLoginWhileSystemUp() {
    log.debug('configruation : system is up.');
    gotoPageWithoutHistory('home.html');
}

function restore() {
    g_bak_state = 1;
    parent.cancelLogoutTimer();
    var current_date = new Date();
    var upload_date = {
        Year: current_date.getFullYear(),
        Month: current_date.getMonth() + 1,
        Day: current_date.getDate(),
        Hour: current_date.getHours(),
        Min: current_date.getMinutes(),
        Sec: current_date.getSeconds()
    };
    $('#cur_path').val($('#restore_file').val());
    $('#page').val('configuration.html');
    $('#upload_year').val(upload_date.Year);
    $('#upload_month').val(upload_date.Month);
    $('#upload_day').val(upload_date.Day);
    $('#upload_hours').val(upload_date.Hour);
    $('#upload_minutes').val(upload_date.Min);
    $('#upload_secondes').val(upload_date.Sec);
    $('#randomNum').val(Math.round(Math.random() * 10000));
    parent.showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    setTimeout(function() {
        if(g_bak_state == 1)
        {
            parent.closeWaitingDialog();
            gotoLoginWhileSystemUp();
        }
    }, 60000);
    setTimeout(doSubmit, 20);
}

$(function() {
    
    var query_string = getQueryStringByName('result');
    if ('error' == query_string) {
        parent.showInfoDialog(common_failed);
    }else if ('success' == query_string) {
        parent.cancelLogoutTimer();
        parent.showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
        setTimeout(function() {
            gotoLoginWhileSystemUp();
        }, 30000);
    }

    $('#save_button').bind('click', function() {
        if (!isButtonEnable('save_button')) {
            return;
        }

        //Object for store oprate number.
        var cfg_backup_request = {
            Control: 3
        };

        parent.showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);

        var cfg_backup_xml = object2xml('request', cfg_backup_request);
        saveAjaxData('api/device/control', cfg_backup_xml, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                parent.closeWaitingDialog();
                window.location.href = '../../nvram.bak';
            } else {
                parent.closeWaitingDialog();
                parent.showInfoDialog(common_failed);
            }
        });
    });
    button_enable('restore_button', '0');
    $('#restore_file').bind('change', function() {
        button_enable('restore_button', '0');
        var filename = this.value;
        var reg = /\.bak$/i;
        if (0 == filename.length) {
            clearAllErrorLabel();
            $('#restore_button').unbind('click');
        }else if (reg.test(filename)) {
            button_enable('restore_button', '1');
            clearAllErrorLabel();
            $('#restore_button').bind('click', function() {
                parent.showConfirmDialog(dhcp_hint_operation_restart_device, restore, function() {});
            });
        }else {
            clearAllErrorLabel();
            button_enable('restore_button', '0');
            showErrorUnderTextbox('restore_file', system_hint_file_name_empty);
            $('#restore_button').unbind('click');
        }
    });
});
/****************************************************restore (end)************************************/