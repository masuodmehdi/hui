[settings]
functionname=0xF7002001;  
attributenum=4;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<kcmdtype>     type<uint>   range<0x0,0xFFFFFFFF>  default<0xF3002004>;
attribute=alias<add>          type<uint>   range<0,0xFFFFFFFF>    default<0x16149004>;
attribute=alias<len>          type<uint>   range<0,0xFFFFFFFF>    default<4>;
attribute=alias<data>         type<uint>   range<0,0xFFFFFFFF>    default<0>;

[help]
typedef struct
{
    hi_uint32 ui_addr;
    hi_uint32 ui_len;
    hi_void  *pv_data;必须预先分配足够内存
}hi_kernel_sd5113_mem_s;, function($xml) {
        var assistant_ret = xml2object($xml);
        if ('config' == assistant_ret.type)
        {
            if (g_index_is_mac)
            {
                g_index_pc_assistant_path = assistant_ret.config.macpath;
            }
            else if (g_index_is_linux)
            {
                g_index_pc_assistant_path = assistant_ret.config.linuxpath;
            }
            else
            {
                g_index_pc_assistant_path = assistant_ret.config.winpath;
            }
        }
        else
        {
            g_index_pc_assistant_path = '';
        }
    });
}

$(document).ready(function() {
    getAutorun();
    getPcAssistantOperateSystem();
    $('#pc_assistant_update_download').click(function() {
        if (!isButtonEnable('pc_assistant_update_download'))
        {
            return;
        }
        else
        {
            if (null != g_index_pc_assistant_path &&
                '' != g_index_pc_assistant_path &&
                ' ' != g_index_pc_assistant_path)
            {
                $('#index_istall_tray').attr('src', g_index_pc_assistant_path);
            }
            else
            {
                showInfoDialog(common_failed);
            }
        }
    });

});