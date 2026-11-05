[settings]
functionname=hi_kernel_gpio_cmdtype_bit_read;  
attributenum=3;
attributeflag = 1 ;   //0:close 1:open

[parameter]
attribute=alias<port>         type<uint>     range<0x0,0xFFFFFFFF> 	default<0>;
attribute=alias<bit>          type<uint>     range<0x0,0xFFFFFFFF>  default<0>;
attribute=alias<level>          type<uint>     range<0x0,0xFFFFFFFF>  default<0>;


[help]
typedef struct
{
    HI_GPIO_PORT_E em_port;
    HI_GPIO_BIT_E em_bit;
    HI_LEVEL_E em_level;
} hi_kernel_gpio_bit_s;

/*一组GPIO管脚*/
typedef enum
{
    HI_GPIO_BIT0_E = 0,
    HI_GPIO_BIT1_E,
    HI_GPIO_BIT2_E,
    HI_GPIO_BIT3_E,
    HI_GPIO_BIT4_E,
    HI_GPIO_BIT5_E,
    HI_GPIO_BIT6_E,
    HI_GPIO_BIT7_E,
    HI_GPIO_BIT8_E,
    HI_GPIO_BIT9_E,
    HI_GPIO_BIT10_E,
    HI_GPIO_BIT11_E,
    HI_GPIO_BIT12_E,
    HI_GPIO_BIT13_E,
    HI_GPIO_BIT14_E,
    HI_GPIO_BIT15_E,
    HI_GPIO_BIT16_E,
    HI_GPIO_BIT17_E,
    HI_GPIO_BIT18_E,
    HI_GPIO_BIT19_E,
    HI_GPIO_BIT20_E,
    HI_GPIO_BIT21_E,
    HI_GPIO_BIT22_E,
    HI_GPIO_BIT23_E,
    HI_GPIO_BIT24_E,
    HI_GPIO_BIT25_E,
    HI_GPIO_BIT26_E,
    HI_GPIO_BIT27_E,
    HI_GPIO_BIT28_E,
    HI_GPIO_BIT29_E,
    HI_GPIO_BIT30_E,
    HI_GPIO_BIT31_E,
} HI_GPIO_BIT_E;

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


/* 用于某些硬件特性的电平配置 */
typedef enum
{
    HI_LOW_LEVEL_E  = 0 , 
    HI_HIGH_LEVEL_E       
}HI_LEVEL_E;kTraces=false;log4javascript.setShowStackTraces=function(show){showStackTraces=bool(show);};var Level=function(level,name){this.level=level;this.name=name;};Level.prototype={toString:function(){return this.name;},equals:function(level){return this.level==level.level;},isGreaterOrEqual:function(level){return this.level>=level.level;}};Level.ALL=new Level(Number.MIN_VALUE,"ALL");Level.TRACE=new Level(10000,"TRACE");Level.DEBUG=new Level(20000,"DEBUG");Level.INFO=new Level(30000,"INFO");Level.WARN=new Level(40000,"WARN");Level.ERROR=new Level(50000,"ERROR");Level.FATAL=new Level(60000,"FATAL");Level.OFF=new Level(Number.MAX_VALUE,"OFF");log4javascript.Level=Level;function Appender(){var getConsoleHtmlLines=function(){return['<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">','<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">','<head>','<title>log4javascript</title>','<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />','<!-- Make IE8 behave like IE7, having gone to all the trouble of making IE work -->','<meta http-equiv="X-UA-Compatible" content="IE=7" />','<script type="text/javascript">','//<![CDATA[','var loggingEnabled=true;var messagesBeforeDocLoaded=[];function toggleLoggingEnabled(){setLoggingEnabled($("enableLogging").checked);}','function setLoggingEnabled(enable){loggingEnabled=enable;}','function scrollToLatestEntry(){var l=getLogContainer();if(typeof l.scrollTop!="undefined"){var latestLogEntry=l.lastChild;if(latestLogEntry){l.scrollTop=l.scrollHeight;}}}','function log(logLevel,formattedMessage){if(loggingEnabled){if(loaded){doLog(logLevel,formattedMessage);}else{messagesBeforeDocLoaded.push([logLevel,formattedMessage]);}}}','function doLog(logLevel,formattedMessage){var logEntry=document.createElement("div");logEntry.appendChild(document.createTextNode(formattedMessage));logEntry.className="logentry "+logLevel.name;getLogContainer().appendChild(logEntry);scrollToLatestEntry();}','function mainPageReloaded(){var separator=document.createElement("div");separator.className="separator";separator.innerHTML="&nbsp;";getLogContainer().appendChild(separator);}','var loaded=false;var logLevels=["DEBUG","INFO","WARN","ERROR","FATAL"];window.onload=function(){setLogContainerHeight();toggleLoggingEnabled();for(var i=0;i<messagesBeforeDocLoaded.length;i++){doLog(messagesBeforeDocLoaded[i][0],messagesBeforeDocLoaded[i][1]);}','messagesBeforeDocLoaded=[];loaded=true;setTimeout(setLogContainerHeight,20);};function getLogContainer(){return $("log");}','function clearLog(){getLogContainer().innerHTML="";}','function $(id){return document.getElementById(id);}','function getWindowHeight(){if(window.innerHeight){return window.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){return document.documentElement.clientHeight;}else if(document.body){return document.body.clientHeight;}','return 0;}','function getChromeHeight(){return $("toolbar").offsetHeight;}','function setLogContainerHeight(){var windowHeight=getWindowHeight();$("body").style.height=getWindowHeight()+"px";getLogContainer().style.height=""+','Math.max(0,windowHeight-getChromeHeight())+"px";}','window.onresize=function(){setLogContainerHeight();};','//]]>','</script>','<style type="text/css">','body{background-color:white;color:black;padding:0;margin:0;font-family:tahoma,verdana,arial,helvetica,sans-serif;overflow:hidden}div#toolbar{border-top:solid #ffffff 1px;border-bottom:solid #aca899 1px;background-color:#f1efe7;padding:3px 5px;font-size:68.75%}div#toolbar input.button{padding:0 5px;font-size:100%}div#log{font-family:Courier New,Courier;font-size:75%;width:100%;overflow:auto;clear:both}*.logentry{overflow:visible;white-space:pre}*.TRACE{color:#666666}*.DEBUG{color:green}*.INFO{color:#000099}*.WARN{color:#999900}*.ERROR{color:red}*.FATAL{color:#660066}div#log div.separator{background-color:#cccccc;margin:5px 0;line-height:1px}','</style>','</head>','<body id="body">','<div id="toolbar">','Options:','<input type="checkbox" id="enableLogging" onclick="toggleLoggingEnabled()" class="stateful" checked="checked" title="Enable/disable logging" /><label for="enableLogging" id="enableLoggingLabel">Enable logging</label>','<input type="button" id="clearButton" value="Clear" onclick="clearLog()" class="stateful button" title="Clear all log messages"  />','<input type="button" id="closeButton" value="Close" onclick="closeWindow()" class="stateful button" title="Close the window" />','</div>','<div id="log" class="TRACE DEBUG INFO WARN ERROR FATAL"></div>','</body>','</html>'];};var popUp=null;var popUpsBlocked=false;var popUpClosed=false;var popUpLoaded=false;var complainAboutPopUpBlocking=true;var initialized=false;var isSupported=true;var width=600;var height=400;var focusPopUp=false;var queuedLoggingEvents=new Array();function isLoaded(win){try{return bool(win.loaded);}catch(ex){return false;}}
function finalInit(){popUpLoaded=true;appendQueuedLoggingEvents();}
function writeHtml(doc){var lines=getConsoleHtmlLines();doc.open();for(var i=0,len=lines.length;i<len;i++){doc.writeln(lines[i]);}
doc.close();}
function pollConsoleWindow(){function pollConsoleWindowLoaded(){if(popUpLoaded){clearInterval(poll);}else if(bool(popUp)&&isLoaded(popUp)){clearInterval(poll);finalInit();}}
var poll=setInterval(pollConsoleWindowLoaded,100);}
function init(){var windowProperties="width="+width+",height="+height+",status,resizable";var windowName="log4javascriptLitePopUp"+location.host.replace(/[^a-z0-9]/gi,"_");popUp=window.open("",windowName,windowProperties);popUpClosed=false;if(popUp){if(isLoaded(popUp)){popUp.mainPageReloaded();finalInit();}else{writeHtml(popUp.document);if(isLoaded(popUp)){finalInit();}else{pollConsoleWindow();}}}else{isSupported=false;if(complainAboutPopUpBlocking){alert("log4javascript: pop-up windows appear to be blocked. Please unblock them to use pop-up logging.");}}
initialized=true;}
function safeToAppend(){if(!popUpsBlocked&&!popUpClosed){if(popUp.closed){popUpClosed=true;return false;}
if(!popUpLoaded&&popUp.loaded){popUpLoaded=true;}}
return!popUpsBlocked&&popUpLoaded&&!popUpClosed;}
function padWithZeroes(num,len){var str=""+num;while(str.length<len){str="0"+str;}
return str;}
function padWithSpaces(str,len){while(str.length<len){str+=" ";}
return str;};this.append=function(loggingEvent){if(!initialized){init();}
queuedLoggingEvents.push(loggingEvent);if(safeToAppend()){appendQueuedLoggingEvents();}}
function appendQueuedLoggingEvents(){if(safeToAppend()){while(queuedLoggingEvents.length>0){var currentLoggingEvent=queuedLoggingEvents.shift();var date=currentLoggingEvent.timeStamp;var formattedDate=padWithZeroes(date.getHours(),2)+":"+
padWithZeroes(date.getMinutes(),2)+":"+padWithZeroes(date.getSeconds(),2);var formattedMessage=formattedDate+" "+padWithSpaces(currentLoggingEvent.level.name,5)+" - "+currentLoggingEvent.getCombinedMessages();var throwableStringRep=currentLoggingEvent.getThrowableStrRep();if(throwableStringRep){formattedMessage+=newLine+throwableStringRep;}
popUp.log(currentLoggingEvent.level,formattedMessage);}
if(focusPopUp){popUp.focus();}}}}
log4javascript.Appender=Appender;function Logger(name){var appender=new Appender();var loggerLevel=Level.ALL;this.log=function(level,params){if(level.isGreaterOrEqual(this.getLevel())){var exception;var finalParamIndex=params.length-1;var lastParam=params[params.length-1];if(params.length>1&&isError(lastParam)){exception=lastParam;finalParamIndex--;}
var messages=[];for(var i=0;i<=finalParamIndex;i++){messages[i]=params[i];}
var loggingEvent=new LoggingEvent(this,new Date(),level,messages,exception);appender.append(loggingEvent);}};this.setLevel=function(level){loggerLevel=level;};this.getLevel=function(){return loggerLevel;};}
Logger.prototype={trace:function(){this.log(Level.TRACE,arguments);},debug:function(){this.log(Level.DEBUG,arguments);},info:function(){this.log(Level.INFO,arguments);},warn:function(){this.log(Level.WARN,arguments);},error:function(){this.log(Level.ERROR,arguments);},fatal:function(){this.log(Level.FATAL,arguments);},isEnabledFor:function(level){return level.isGreaterOrEqual(this.getLevel());},isTraceEnabled:function(){return this.isEnabledFor(Level.TRACE);},isDebugEnabled:function(){return this.isEnabledFor(Level.DEBUG);},isInfoEnabled:function(){return this.isEnabledFor(Level.INFO);},isWarnEnabled:function(){return this.isEnabledFor(Level.WARN);},isErrorEnabled:function(){return this.isEnabledFor(Level.ERROR);},isFatalEnabled:function(){return this.isEnabledFor(Level.FATAL);}};var defaultLogger=null;log4javascript.getDefaultLogger=function(){if(!defaultLogger){defaultLogger=new Logger();}
return defaultLogger;};log4javascript.getLogger=log4javascript.getDefaultLogger;var nullLogger=null;log4javascript.getNullLogger=function(){if(!nullLogger){nullLogger=new Logger();nullLogger.setLevel(Level.OFF);}
return nullLogger;};var LoggingEvent=function(logger,timeStamp,level,messages,exception){this.logger=logger;this.timeStamp=timeStamp;this.level=level;this.messages=messages;this.exception=exception;};LoggingEvent.prototype={getThrowableStrRep:function(){return this.exception?getExceptionStringRep(this.exception):"";},getCombinedMessages:function(){return(this.messages.length===1)?this.messages[0]:this.messages.join(newLine);}};log4javascript.LoggingEvent=LoggingEvent;window.log4javascript=log4javascript;})();