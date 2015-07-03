


this.zedk = this.zedk || {};
this.zedk.data = this.zedk.data || {};

this.zedk.map = this.zedk.map || {};
this.zedk.map.Google = this.zedk.map.Google || {};

/***************************************************************************
*
*	Реализация карты для Google.
*
*
****************************************************************************/




/*
*	Инициализация скрипта карты
*		opts 			- параметры
*		functionToStart	- название функции после инициализации скрипта, например "zerura.MapGo"
*/
if (!zedk.map.Google.Init) {
    zedk.map.Google.Init = function(opts, functionToStart, functionOnError) {
		if (!opts) opts = 
			{
				gkey: "",
				gdebug: true,
				protocol: "http",
				glibraries: "places"
			};
        var optionInit = opts;


        var onlFn = function() {
            zedk.DebugMsg("Подключение Google-карты скриптов.");
        };
        //+ загрузка скриптов Гугл
        try {
            var gkey = '&key=' + optionInit.gkey;
            if (optionInit.gdebug) gkey = '';
            var scrUrl = optionInit.protocol + '://maps.googleapis.com/maps/api/js?v=3.exp' + gkey + '&signed_in=true&sensor=true&libraries=' +optionInit.glibraries+ '&language=ru-RU&callback=' + functionToStart.toString();
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
zedk.map.Google.CreateMap = function() {
	// TODO: map create	
	zedk.ConsoleRed("Map not implemented yet !!!");
	

	return null;
};




