


this.zedk = this.zedk || {};
this.zedk.data = this.zedk.data || {};

this.zedk.map = this.zedk.map || {};
this.zedk.map.Yandex = this.zedk.map.Yandex || {};

/***************************************************************************
*
*	Реализация карты для Yandex.
*
*
****************************************************************************/




/*
*	Инициализация скрипта карты
*		opts 			- параметры
*		functionToStart	- название функции после инициализации скрипта, например "zerura.MapGo"
*/
if (!zedk.map.Yandex.Init) {
    zedk.map.Yandex.Init = function(opts, functionToStart, functionOnError) {
		if (!opts) opts = 
			{
				gkey: "",
				gdebug: true,
				protocol: "http",
				glibraries: "places"
			};
        var optionInit = opts;


        var onlFn = function() {
            zedk.DebugMsg("Подключение Yandex-карты скриптов.");
        };
        //+ загрузка скриптов Yandex
		// https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/load-docpage/
        try {
            var gkey = '&apikey=' + optionInit.gkey;
            if (optionInit.gdebug) gkey = '';
			var yurl = "api-maps.yandex.ru/";
			if (!optionInit.gdebug && gkey != '') yurl = 'enterprise.' + yurl;
			var yver = "2.1";
			//optionInit.protocol = "https";
            var scrUrl = optionInit.protocol + '://' + yurl + yver + '/?st=true';
			scrUrl += gkey;
			scrUrl += '&signed_in=true&sensor=true&load=' +optionInit.glibraries; 
			scrUrl += '&lang=ru-RU&onload=' + functionToStart.toString() + '&onerror=' + functionOnError.toString();
            //- js
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = scrUrl;
            script.onload = onlFn;
            document.getElementsByTagName("head")[0].appendChild(script);
        } catch (err) {
            zedk.ConsoleRed("Ошибка подключения скриптов Карты:  " + err);
            if (functionOnError) functionOnError();
        }
		return true;
    }
};


/*
*	Создание карты
*/
zedk.map.Yandex.CreateMap = function() {
	// TODO: map create	
	zedk.ConsoleRed("Map not implemented yet !!!");
	

	return null;
};




