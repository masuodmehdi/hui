[settings]
functionname=hi_kernel_gpio_cmdtype_read;  
attributenum=2;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<port>          type<uint>      range<0x0,0xFFFFFFFF> 	default<0>;
attribute=alias<data>          type<uint>     range<0x0,0xFFFFFFFF>        default<0>;
[help]
typedef struct{
    HI_GPIO_PORT_E em_port;
    hi_uint32   ui_data;
}hi_kernel_gpio_s;


/*GPIO组*/
/*
说明：
 在SD5115V100-MPW-ASIC中，只用到了HI_GPIO_PORT0_E -- HI_GPIO_PORT3_E共4组GPIO，
,第一组GPIO对应GPIO_0-GPIO_31，第二组GPIO对应GPIO_32-GPIO_63, 第三组GPIO对应GPIO64-GPIO_95,
 其中，从GPIO_64至GPIO_75这12个IO口目前不能作为普通输入输出口，第四组GPIO对应GPIO96-GPIO_106共11个IO口。
*/
typedef enum
{
    HI_GPIO_PORT0_E = 0,
    HI_GPIO_PORT1_E,
    HI_GPIO_PORT2_E,
    HI_GPIO_PORT3_E,
    HI_GPIO_PORT4_E,  //暂时没用
    HI_GPIO_PORT5_E,  //暂时没用
    HI_GPIO_PORT6_E,  //暂时没用
    HI_GPIO_PORT7_E,  //暂时没用
} HI_GPIO_PORT_E;

    if ($(this).siblings().size() > 0 && $(this).siblings().get(0).tagName == this.tagName) {
                if (_obj[this.tagName] == null) {
                    _obj[this.tagName] = [];
                }
                _obj[this.tagName].push(_childObj);
            }
            else {
                _obj[this.tagName] = _childObj;
            }
        });
        return _obj;
    }
    else {
        return _createFeatureNode($xml.text());
    }
}

function _xml2feature($xml) {
    var obj = null;
    if ($xml.find('config').size() > 0) {
        var _config = _recursiveXml2Feature($xml.find('config'));
        obj = _config;
    }
    return obj;
}

function getConfigData(urlstr, callback_func, options) {
    var myurl = '../' + urlstr + '';
    var isAsync = true;
    var nTimeout = AJAX_TIMEOUT;
    var errorCallback = null;

    if (options) {
        if (options.sync) {
            isAsync = (options.sync == true) ? false : true;
        }
        if (options.timeout) {
            nTimeout = parseInt(options.timeout, 10);
            if (isNaN(nTimeout)) {
                nTimeout = AJAX_TIMEOUT;
            }
        }
        errorCallback = options.errorCB;
    }

    $.ajax({
        async: isAsync,
        cache: false,
        type: 'GET',
        timeout: nTimeout,
        url: myurl,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            try {
                log.debug('MAIN : getConfigData(' + myurl + ') error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus ' + textStatus);
                if (jQuery.isFunction(errorCallback)) {
                    errorCallback(XMLHttpRequest, textStatus);
                }
            }
            catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            var xml;
            if (typeof data == 'string' || typeof data == 'number') {
                if (!window.ActiveXObject) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                }
                else {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            }
            else {
                xml = data;
            }
            if (typeof callback_func == 'function') {
                callback_func($(xml));
            }
        }
    });
}

function get_webversion_data()
{  
    getConfigData('config/global/config.xml', function($xml) {
        var ret = _xml2feature($xml);       
        if(typeof(ret.version) != 'undefined')
        {
            __version__ = ret.version;
            URL_PAGE_TAIL = "?ver=" + __version__;
            URL_PAGE_TAIL2  = "&ver=" + __version__;
        }   
    }, {
            sync: true
    });
}


function loadJs(path)
{
	if(path == null || path == 'undefined' || path == "")
	{
		return;
	}
	document.write('<script type="text/javascript" src="' + path + '?ver=' + __version__ + '"></script>\n');
}

function loadCss(path)
{
	if(path == null || path == 'undefined' || path == "")
	{
		return;
	}
	document.write('<link rel="stylesheet"  type="text/css" href="' + path + '?ver=' + __version__ + '" />\n');
}

function loadIcon(type,path)
{
    if(path == null || path == 'undefined' || path == "")
    {
        return;
    }
    document.write('<link rel="'+ type +'" href="' + path + '?ver=' + __version__ + '" />\n');
}

get_webversion_data();