[settings]
commandtype      = 0xF80058A4 ;
attributenum     = 4 ;
displayattribute = 1 ;

[parameter]
attribute=alias<egr>        type<uint>      range<0x0,0x0D>        default<0>;
attribute=alias<queue>      type<uchar>     range<0x0,0xff>        default<0>;
attribute=alias<wrr>        type<uchar>     range<0x0,0x1>         default<0>;
attribute=alias<res>        type<ushort>    range<0x0,0x0>         default<0>;

[help]
typedef struct
{
    hi_lsw_qos_egr_e em_egr;
    hi_uchar8        uc_queue;
    hi_uchar8        uc_wrr;
    hi_ushort16      us_res;
}hi_lsw_port_schattr_s;

/* 队列出口 */
typedef enum {
    HI_LSW_QOS_EGR_TCONT0_E  = 0,
    HI_LSW_QOS_EGR_TCONT1_E,
    HI_LSW_QOS_EGR_TCONT2_E,
    HI_LSW_QOS_EGR_TCONT3_E,
    HI_LSW_QOS_EGR_TCONT4_E,
    HI_LSW_QOS_EGR_TCONT5_E,
    HI_LSW_QOS_EGR_TCONT6_E,
    HI_LSW_QOS_EGR_TCONT7_E, 
    
    HI_LSW_QOS_EGR_GE0_E,
    HI_LSW_QOS_EGR_GE1_E,
    HI_LSW_QOS_EGR_FE2_E,
    HI_LSW_QOS_EGR_FE3_E,
    HI_LSW_QOS_EGR_FE4_E,    
    
    HI_LSW_QOS_EGR_CPU_E,        
}hi_lsw_qos_egr_e;
ction(){});
        }
    });
    initPage();
    initPage_attack();
});

function initPage() {
    getAjaxData('api/security/firewall-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            g_firewallSwitchData = ret.response;
            $('#checkbox_FirewallMainSwitch').get(0).checked = (g_firewallSwitchData.FirewallMainSwitch == 1);
            $('#checkbox_FirewallIPFilterSwitch').get(0).checked = (g_firewallSwitchData.FirewallIPFilterSwitch == 1);
            $('#checkbox_FirewallWanPortPingSwitch').get(0).checked = (g_firewallSwitchData.FirewallWanPortPingSwitch == 0);
            $('#checkbox_FirewallLanMacFilterSwitch').get(0).checked = (g_firewallSwitchData.FirewallLanMacFilterSwitch == 1);
            $('#checkbox_FirewallUrlFilterSwitch').get(0).checked = (g_firewallSwitchData.FirewallUrlFilterSwitch == 1);
            checked_ck();
        }
    });
}

function initPage_attack(){
    getAjaxData('api/security/AttackProtecting', function($xml){
        var ret = xml2object($xml);
        if (ret.type == 'response'){
            g_firewallAttackData = ret.response;
            $('#checkbox_FirewallICMP').get(0).checked = (g_firewallAttackData.IcmpFlooding == 1);
            $('#checkbox_FirewallSYN').get(0).checked = (g_firewallAttackData.SynFlooding == 1);
            $('#checkbox_FirewallARP').get(0).checked = (g_firewallAttackData.ArpAttack == 1);
        }
    });
}

function apply() {
    g_firewallSwitchData.FirewallMainSwitch = $('#checkbox_FirewallMainSwitch').get(0).checked ? 1 : 0;
    g_firewallSwitchData.FirewallIPFilterSwitch = $('#checkbox_FirewallIPFilterSwitch').get(0).checked ? 1 : 0;
    g_firewallSwitchData.FirewallWanPortPingSwitch = $('#checkbox_FirewallWanPortPingSwitch').get(0).checked ? 0 : 1;
    g_firewallSwitchData.FirewallLanMacFilterSwitch = $('#checkbox_FirewallLanMacFilterSwitch').get(0).checked ? 1 : 0;
    g_firewallSwitchData.FirewallUrlFilterSwitch = $('#checkbox_FirewallUrlFilterSwitch').get(0).checked ? 1 : 0;
    var xmlstr_security = object2xml('request', g_firewallSwitchData);
    saveAjaxData('api/security/firewall-switch', xmlstr_security, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            parent.showInfoDialog(common_success);
            initPage();
        }
        else
        {
            parent.showInfoDialog(common_failed);
        }
    });
}

function Apply_Attack(){
    g_firewallAttackData.IcmpFlooding = $('#checkbox_FirewallICMP').get(0).checked ? 1 : 0 ;
    g_firewallAttackData.SynFlooding = $('#checkbox_FirewallSYN').get(0).checked ? 1 : 0;
    g_firewallAttackData.ArpAttack = $('#checkbox_FirewallARP').get(0).checked ? 1 : 0;
    var attackdata_xml = object2xml('request', g_firewallAttackData);
    saveAjaxData('api/security/AttackProtecting', attackdata_xml, function($xml){
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)){
            button_enable('attack_button', '0');
            parent.showInfoDialog(common_success);
            initPage_attack();
        }else{
            parent.showInfoDialog(common_failed);
        }
    });
}

function checked_ck() {
    if ($('#checkbox_FirewallMainSwitch').attr('checked') == "checked")
    {
        $('#checkbox_FirewallIPFilterSwitch').removeAttr('disabled');
        $('#checkbox_FirewallWanPortPingSwitch').removeAttr('disabled');
        $('#checkbox_FirewallLanMacFilterSwitch').removeAttr('disabled');
        $('#checkbox_FirewallUrlFilterSwitch').removeAttr('disabled');
        $('#label_enable').css('color', '#000000');
        $('#label_disable').css('color', '#000000');
    }
    else
    {
        $('#checkbox_FirewallIPFilterSwitch').attr('disabled', 'disabled');
        $('#checkbox_FirewallWanPortPingSwitch').attr('disabled', 'disabled');
        $('#checkbox_FirewallLanMacFilterSwitch').attr('disabled', 'disabled');
        $('#checkbox_FirewallUrlFilterSwitch').attr('disabled','disabled');
        $('#label_enable').css('color', '#baaaaa');
        $('#label_disable').css('color', '#baaaaa');
    }
}
