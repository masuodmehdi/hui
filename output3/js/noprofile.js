

$(document).ready(function() {
    setLangList();
    showCurrentLanguage();
    g_is_login_opened = true;
    getUserManualUrl();
    $('#link_login_noprofile').click(function() {
        window.location = LOGIN_PAGE_URL + URL_PAGE_TAIL;
    });
});
