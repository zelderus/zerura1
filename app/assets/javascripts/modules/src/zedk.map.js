


this.zedk = this.zedk || {};
this.zedk.data = this.zedk.data || {};

this.zedk.map = this.zedk.map || {};


/***************************************************************************
*
*	Интерфейс для работы с Картой.
*
*		тип карты на странице должен быть един
*		инициализация пройдет единожды, потому необходимо передавать все нужные библиотеки в 'glibraries'
*
****************************************************************************/

zedk.map.About = function() {
	zedk.ConsoleGreen("ZEDK Map");
};

// типы поддерживаемых карт
zedk.map.Types = { Google: "google", Yandex: "yandex"};
zedk.map._defaultType = zedk.map.Types.Yandex;	//- тип поумолчанию


zedk.map._inited = false;
if (!zedk.map.IsInited) {
    zedk.map.IsInited = function() {
		return zedk.map._inited;
	}
};

// текущий API карты (на странице он один)
zedk.map.__Api__ = null;

/*
*	Инициализация скрипта карты
*		opts 			- параметры
*		functionToStart	- название функции после инициализации скрипта, например "zerura.MapGo"
*		functionOnError	- в случае ошибки
*/
if (!zedk.map.Init) {
    zedk.map.Init = function(opts, functionToStart, functionOnError) {
		if (!opts) opts = 
			{
				gkey: "",
				gdebug: true,
				gtype: zedk.map._defaultType,
				protocol: "http",
				glibraries: "places"
			};
        var optionInit = opts;

		//+ если карта уже была инициализирована, то не работаем
		if (zedk.map.IsInited()){
			functionToStart();
			return true;
		}
		
		//+ тип карты
		zedk.map.__Api__ = null;
		var mapType = opts.gtype || zedk.map._defaultType;
		if (mapType == zedk.map.Types.Google) zedk.map.__Api__ = zedk.map.Google;
		else if (mapType == zedk.map.Types.Yandex) zedk.map.__Api__ = zedk.map.Yandex;

		if (zedk.map.__Api__ == null) {
			zedk.ConsoleRed("Не инициализировалась карта типа '" + mapType + "'");
			if (functionOnError) functionOnError();
			return false;
		}
		zedk.DebugMsg("Инициализация карты '" + mapType + "'");
		zedk.map._inited = true;


		// инициализация
		zedk.map.__Api__.Init(opts, functionToStart, functionOnError);
		return true;
    }
};


/*
*	Создание карты
*/
zedk.map.CreateMap = function() {
	return zedk.map.__Api__.CreateMap();
};




