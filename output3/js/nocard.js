// JavaScript Document
function initPage() {

    getAjaxData('api/pin/status', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type)
        {
            if (MACRO_NO_SIM_CARD != ret.response.SimState)
            {
                if (MACRO_PUK_REQUIRED == ret.response.SimState)
                {
                    gotoPageWithoutHistory('pukrequired.html');
                }
                else if (MACRO_PIN_REQUIRED == ret.response.SimState)
                {
                    gotoPageWithoutHistory('pincoderequired.html');
                }
                else if (MACRO_CARD_LOCK_PIN_RIGNT == ret.response.SimState) 
                {
                    gotoPageWithoutHistory('cardlock.html');
                }
                else if (MACRO_CARD_LOCK_PIN_WRONG == ret.response.SimState) 
                {
                    gotoPageWithoutHistory('carderror.html');
                }
                else
                {
                    gotoPageWithoutHistory(LOGIN_PAGE_URL);
                }
            }
        }
    });
}

$(document).ready(function() {
    if (1 == g_feature.continue_button) {
        $('#link_login_nocard').show();
    }
    else
    {
        $('#link_login_nocard').hide();
    }

    initPage();
    setLangList();
    showCurrentLanguage();
    g_is_login_opened = true;
    $('#link_login_nocard').click(function() {
        window.location = LOGIN_PAGE_URL + URL_PAGE_TAIL;
    });
});
