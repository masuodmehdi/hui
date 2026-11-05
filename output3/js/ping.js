[settings]
functionname=hi_cli_get_glb;
attributenum=1;
attributeflag = 1;   //0:close 1:open

[parameter]
attribute=alias<rootpath> type<string> range<0,256>                 default<hi_cli home/cli/>;

[help]


Timeout = true;
    var strEnd = ping_objIMG.src.lastIndexOf("/");
    ping_objIMG.src = ping_objIMG.src.substring(0, strEnd);
    ping();
}

function ping()
{
    /*
    * 发送请求
    */
    ping_intStartTime = +new Date();

    ping_objIMG.src = ping_objIMG.src + ping_intStartTime;
    ping_bolIsTimeout = false;

    /*
    * 超时计时
    */
    ping_intTimerID = setTimeout(ping_timeout, PING_TIMEOUT);
}

function startPing()
{
    ping_objIMG.src = "http://" + ping_ipAddress + "/";
    ping_objIMG.onload = 
    ping_objIMG.onerror =
    function()
    {
        /*
        * 有回应,取消超时计时
        */
        clearTimeout(ping_intTimerID);

        if(ping_bolIsTimeout)
        {
            return;
        }
        gotoIndexPageWithoutHistory("http://" +  ping_ipAddress + "/index.html");
    }
    ping();
}

function ping_setPingAddress(ipAddress)
{
    ping_ipAddress = ipAddress;
}
