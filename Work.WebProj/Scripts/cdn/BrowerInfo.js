﻿var browserInfo = function () { var r, o = navigator.userAgent, e = o.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || []; if (/trident/i.test(e[1])) { r = /\brv[ :]+(\d+(\.\d+)?)/g.exec(o) || []; var n = { browser: "IE", version: r[1] || "" }; return n } return e = e[2] ? [e[1], e[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (r = o.match(/version\/([\.\d]+)/i)) && (e[2] = r[1]), { browser: e[0], version: e[1] } }(); ("IE" == browserInfo.browser || "MSIE" == browserInfo.browser) && ("9.0" == browserInfo.version || "8.0" == browserInfo.version || "7.0" == browserInfo.version || "6.0" == browserInfo.version) && (alert(browserInfo.browser + browserInfo.version + "本網站不支援此瀏覽器版本，請使用IE 10.0以上之版本、Google Chrome或FireFox等瀏覽器!"), window.location.href = "/Content/images/noIE/noIE.html");