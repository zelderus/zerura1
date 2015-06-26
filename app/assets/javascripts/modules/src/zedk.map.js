


this.zedk = this.zedk || {};
this.zedk.data = this.zedk.data || {};

this.zedk.map = this.zedk.map || {};


/*
*	Интерфейс для работы с Картой.
*/

zedk.map.About = function() {
	zedk.ConsoleGreen("ZEDK Map");
};


zedk.map._inited = false;
if (!zedk.map.IsInited) {
    zedk.map.IsInited = function() {
		return zedk.map._inited;
	}
};


/*
*	Инициализация скрипта карты
*		opts 			- параметры
*		functionToStart	- название функции после инициализации скрипта, например "zerura.MapGo"
*/
if (!zedk.map.Init) {
    zedk.map.Init = function(opts, functionToStart) {
		if (!opts) opts = 
			{
				gkey: "",
				gdebug: false,
				protocol: "http",
				glibraries: "places"
			};
        var optionInit = opts;


        var onlFn = function() {
			zedk.map._inited = true;
            zedk.DebugMsg("Скрипт Карты подключен, но еще не готов к работе.");
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
            functionToStart();
        }
    }
};


/*
*	Создание карты
*/
zedk.map.CreateMap = function() {
	// TODO: map create	
	zedk.ConsoleRed("Map not implemented yet !!!");
	

	return null;
};




