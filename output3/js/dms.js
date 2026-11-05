[settings]
functionname = hi_adapter_cli_lsw_port_set_status;
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
                         );
}

function initPage(){
    var i = 0;
    var k = 0;
    var dms_status = '';
    var choice_old = [];
    getAjaxData('api/settings/dms', function($xml) {
        var dms_ret = xml2object($xml);
        if (dms_ret.type == 'response') {
            dms_status = dms_ret.response;
            $('#enable_dms').get(0).checked = (dms_status.DMS_enable == 1);
            $('#auto_infomation').get(0).checked = (dms_status.AutoDetectUT == 1);
            if(typeof(dms_status.Directorys)!='undefined' && typeof(dms_status.Directorys.Directory)!='undefined'){
                if($.isArray(dms_status.Directorys.Directory)){
                    for(i=0;i<dms_status.Directorys.Directory.length;i++){
                        choice_old.push(dms_status.Directorys.Directory[i]);
                    }
                } else {
                    choice_old.push(dms_status.Directorys.Directory);
                }
            } else {
                return;
            }
        }else{
            log.error("Load dms Status data failed");
        }
    },{
        sync: true
    });
    addFilter($('#share_directory_list tr'), choice_old);
    button_enable('apply', '0');
}

function checkEnableDms(){
    var i = 0;
    if($('#enable_dms').attr('checked')){
        for(i=0;i<choice.length;i++){
            $('#share_directory'+choice[i]).attr('disabled',false);
            $('#share_directory_input'+choice[i]).attr('disabled',false);
            button_enable('button_browse'+choice[i], '1');
            button_enable('button_delete'+choice[i], '1');
            button_enable('button_add'+choice[i], '1');
        }
        if(1 == choice.length && $('#share_directory_input'+choice[0]).val() == "/"){
            button_enable('button_delete'+choice[0], '0');
        }
        if(choice.length == ADD_NUM){
            button_enable('button_add'+choice[ADD_NUM-1], '0');
        }
    } else {
        for(i=0;i<choice.length;i++){
            $('#share_directory'+choice[i]).attr('disabled',true);
            $('#share_directory_input'+choice[i]).attr('disabled',true);
            button_enable('button_browse'+choice[i], '0');
            button_enable('button_delete'+choice[i], '0');
            button_enable('button_add'+choice[i], '0');
        }
    }
}

function checkDirectory()
{
    clearAllErrorLabel();
    for(var i=0;i<choice.length;i++){
        if($('#share_directory_input'+choice[i]).val() != ""){
            if(isInvalidSabmaPathName($('#share_directory_input'+choice[i]).val())){
                showSpeErrorUnderTextbox("share_directory_input"+choice[i], samba_label_invalid_pathname);
                return false;
            }
            var directory_i = $('#share_directory_input'+choice[i]).val().indexOf('/mnt/')==0?$('#share_directory_input'+choice[i]).val():"/mnt"+$('#share_directory_input'+choice[i]).val();
            for(var j=0;j<choice.length;j++){
                if( i != j ){
                    if($('#share_directory_input'+choice[j]).val() != ""){
                        var directory_j = $('#share_directory_input'+choice[j]).val().indexOf('/mnt/')==0?$('#share_directory_input'+choice[j]).val():"/mnt"+$('#share_directory_input'+choice[j]).val();
                        if(directory_i == directory_j){
                            showErrorUnderTextbox('share_directory_input'+choice[j],err_dms_directory);
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function getData(){
    var DMSArray = [];
    var i = 0;
    var j = 0;
    var submitObject = null;
    var dms_enable = 0;
    var dms_auto = 0;
    if($('#enable_dms').attr('checked')){
        dms_enable = 1;
    } else {
        dms_enable = 0;
    }
    if($('#auto_infomation').attr('checked')){
        dms_auto = 1;
    } else {
        dms_auto = 0;
    }
    for(i=0;i<choice.length;i++){
        var dms_active = 0;
        var filter = null;
        if($('#share_directory'+choice[i]).attr('checked')){
            dms_active = 1;
        } else {
            dms_active = 0;
        }
        if(choice.length == 1 && $('#share_directory_input'+choice[0]).val()=='/'){
            filter = {
                Active :dms_active,
                InstanceID: 1,
                ContentDirectory:'',
                ContentDirectoryUTF:''
            };
            DMSArray.push(filter);
        }
        if($('#share_directory_input'+choice[i]).val()!='/'){
            if(dms_auto == 0){
                filter = {
                    Active :dms_active,
                    InstanceID: i+1-j,
                    ContentDirectory:$('#share_directory_input'+choice[i]).val(),
                    ContentDirectoryUTF:''
                };
            } else {
                filter = {
                    Active :dms_active,
                    InstanceID: i+1-j,
                    ContentDirectory:'',
                    ContentDirectoryUTF:$('#share_directory_input'+choice[i]).val()
                };
            }
            j = 0;
            DMSArray.push(filter);
        } else {
            j++;
        }
    }
    submitObject = {
        DMS_enable:dms_enable,
        AutoDetectUT:dms_auto,
        Directorys: {
            Directory:DMSArray
        }
    };
    return submitObject;
}

function postData(){
    if(checkDirectory()){
        var newXmlString = object2xml('request', getData());
        saveAjaxData('api/settings/dms', newXmlString, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                var i = 0;
                for(i=0;i<choice.length;){
                    deleteFilter(0, $(".user_dms_add_line"));
                    choice.splice(0,1);
                }
                parent.showInfoDialog(common_success);
                initPage();
                checkEnableDms();
                button_enable('apply', '0');
            }else{
                parent.showInfoDialog(common_failed);
                button_enable('apply', '1');
            }
        });
    }
    else
    {
        checkEnableDms();
    }
}

$(document).ready(function() {
    initPage();
    $('#enable_dms').click(function() {
        checkEnableDms();
        button_enable('apply', '1');
    });
    $('#apply').click(function() {
        if (!isButtonEnable('apply')) {
            return;
        }
        button_enable('apply', '0');
        for(i=0;i<choice.length;i++){
            $('#share_directory'+choice[i]).attr('disabled',true);
            $('#share_directory_input'+choice[i]).attr('disabled',true);
            button_enable('button_browse'+choice[i], '0');
            button_enable('button_delete'+choice[i], '0');
            button_enable('button_add'+choice[i], '0');
        }
        postData();
    });
    $('#auto_infomation').bind('click', function() {
        button_enable('apply', '1');
    });
    checkEnableDms();
});