
/*
*  
*  Zelder's library
*  2012
*/
this.zelder = this.pac || {};
this.zelder.library = this.zelder.library || {};


/* 
*       about
*/
this.zelder.library.about = this.zelder.library.about || {
    title: "Library",
    version: "1.9.1",
    builder: "ZeLDER",
    references: []
};



/*
    Функции:

    zelder.library.DUMPING()            - дампинг свойств объекта
    zelder.library.GuidGenerator()      - уникальный идентификатор

    zelder.library.extendClass()        - расширение класса
    zelder.library.paramsFromDom()      - параметры из всех инпутов (input, select и тп) в один объект (для отправки на сервер)
    zelder.library.objectToDictionary() - преобразуеn объект в словарь (для отправки на сервер в виде Dictionary<String, String>)
                                          для преобразования массива объектов в IEnumerable<T> можно воспользоваться zelder.collections.Enumerable.ToIEnumerable(paramName, obj);
    zelder.library.getParamValue()      - параметр из строки запроса
    zelder.library.htmlEncode()         - кодирование строки
    zelder.library.htmlDecode()         - декодирование строки

    zelder.library.GetKirillCharByUniCode(uniCharCode)  - перекодировка символа
    zelder.library.GetKirillByUni(uniString)            - перекодировка строки.
*/



/** ---------------------------------------------------------------------------------------------------------------------------
* DUMPING
*/
this.zelder.library.DUMPING = function (/*Object*/obj, /*bool*/fullFn, /*string*/paramKeys, /*string*/prefix, /*bool*/isLogger, /*bool*/withFn) {
    ///	<summary>
    ///		Дампинг данных.
    ///	</summary>
    ///	<param name="obj"       type="Object">объект который дампим</param>
    /// <param name="fullFn"    type="bool">полный дампинг функций - включая тело функции</param>
    /// <param name="paramKeys" type="string">имя параметра, или парметры через зяпятую, или массив, если нужны конкретные данные объекта</param>
    /// <param name="prefix"    type="string">любой текст, будет вставлен в самом начале дампинга.</param>
    /// <param name="isLogger"  type="bool">дампинг в лог, иначе alert</param>
    /// <param name="withFn"    type="bool">(with Functions) если true, то функции смотрим</param>    

    var stringBuilder = "{ ";
    if (prefix != undefined) stringBuilder = prefix + " { ";
    withFn = (withFn == null || withFn == undefined) ? true : withFn;
    fullFn = (fullFn == null || fullFn == undefined) ? false : fullFn;

    var keyvalues = obj;
    for (keyname in keyvalues) {
        var isFn = $.isFunction(obj[keyname]);
        if (!withFn && isFn) continue;
        if (paramKeys != undefined) {
            if (typeof (paramKeys) == "string") paramKeys = paramKeys.split(",");
            if ($.isArray(paramKeys)) {
                var haveKey = false;
                $.each(paramKeys, function (i, v) { if (v === keyname) { haveKey = true; return false; } });
                if (!haveKey) continue;
            } else if (keyname != paramKeys) continue;
        }
        if (!isFn || (isFn && fullFn)) {
            stringBuilder += keyname;
            stringBuilder += ":'";
            stringBuilder += keyvalues[keyname];
            stringBuilder += "', "
        }
        else if (isFn && !fullFn) {
            stringBuilder += keyname;
            stringBuilder += "(); ";
        }
    }
    stringBuilder += " }";

    if ((isLogger != null || undefined) && isLogger == true) console.log(stringBuilder);
    else alert(stringBuilder);
}
/// ===========================================================================================================================




/** ---------------------------------------------------------------------------------------------------------------------------
* GuidGenerator
*/
this.zelder.library.GuidGenerator = function () {
    ///	<summary>
    ///		Генератор уникального числа.
    ///	</summary>
    ///	<returns type="String">уникальное число</returns>

    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};
/// ===========================================================================================================================





/** ---------------------------------------------------------------------------------------------------------------------------
* Расширение 'класса'.
*/
this.zelder.library.extendClass = function (Child, Parent) {
    ///	<summary>
    ///		Расширение класса.
    ///	</summary>
    ///	<param name="Child"     type="Object">объект, который расширяем</param>
    /// <param name="Parent"    type="Object">объект - родитель</param>
    /// <example>
    ///     this.zelder.zwos.types.Positionable = function (domId, x, y) {
    ///     this.posX = x;
    ///     this.posY = y;
    ///     // вызов конструктора базового класса
    ///     zelder.zwos.types.Positionable.superclass.constructor.call(this, domId);
    ///     // расширяем класс
    ///     zelder.zwos.extendClass(zelder.zwos.types.Positionable, zelder.zwos.types.UIControl);
    ///     // метод доступный классу и всем его потомкам
    ///     this.zelder.zwos.types.Positionable.prototype.setPosition = function (x, y) { this.posX = x; this.posY = y; return this; };
    ///     };
    /// </example>

    var F = function () { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
    //Child.superclass.constructor.call(this, arg0, arg1..) // вызов конструктора родителя - вызвать в конструкторе потомка
};
/// ===========================================================================================================================




/** ---------------------------------------------------------------------------------------------------------------------------
*       paramsFromDom - параметры из всего DOM в один объект
*/
if (!this.zelder.library.paramsFromDom) {
    this.zelder.library.paramsFromDom = function ($dom, inParam, inString) {
        ///	<summary>
        ///		Cобирает параметры для отправки.
        ///	</summary>
        /// <remarks>
        ///     если в параметрах checkbox, то можно использовать аттрибут data-multi='true',
        ///     тогда их значения будут собраны как со многих, даже если существует только один checkbox.
        /// </remarks>
        ///	<param name="$dom"      type="Object">элемент, из элементов которого собираем параметры</param>
        /// <param name="inParam"   type="bool">трамбовать в параметры ($.param) - по дефолту true</param>
        /// <param name="inString"  type="bool">параметры типа мультиселекс будут положены в одну строку разделенные запятой, иначе в IEnumerable</param>
        ///	<returns type="Object">объект с параметрами</returns>

        $dom = $($dom);
        inString = (inString && inString == true) ? true : false;
        var iterrates = { someName: 1 };    // имена полей, которые повторяются (будут трамбоваться в массив)
        var params = {};
        var InsertObjectToParam = function (name, obj, onlyNothing) {
            if (onlyNothing) {
                if (params[name] == null || params[name] == undefined) {
                    params[name] = obj;
                }
            } else {
                // если уже такое было поле, то кладем в массив (на сервере он придет как IEnumerable<T>)
                if (params[name] != null || undefined) {
                    var itter = (iterrates[name] == null || undefined) ? 1 : iterrates[name];
                    params[name + "[" + itter + "]"] = obj;
                    iterrates[name] = itter + 1;
                } else {
                    params[name] = obj;
                }
            }
            return;
        }
        // select
        var $selects = $dom.find("select");
        $selects.each(function (i, v) {
            var $item = $(v);
            InsertObjectToParam($item.attr("name"), $item.val());
        });
        // input
        var $inputs = $dom.find("input").not(":checkbox").not(":radio");
        $inputs.each(function (i, v) {
            var $item = $(v);
            InsertObjectToParam($item.attr("name"), $item.val());
        });
        // checkbox
        var $checkboxes = $dom.find("input:checkbox");
        $checkboxes.each(function (i, v) {
            var $item = $(v);
            var inputName = $item.attr("name");
            // если указано, что мульти, то всегда будем считаться как будто много чекбоксов, даже если он один
            // и, соответственно, в другом формате будут данные (1.7)
            var isMulti = $item.data("multi");
            if (typeof isMulti == 'undefined' || isMulti == false) isMulti = false;

            $allThisBoxes = $dom.find("input:checkbox[name='" + inputName + "']");
            var numItems = $allThisBoxes.length;
            if (numItems == 1 && isMulti == false) {    // если один, то значение 'true/false'
                InsertObjectToParam($item.attr("name"), $item.is(':checked'));
            }
            else if (numItems > 1 && $item.is(':checked') && inString == false) {
                //      если много с таким именем чекбоксов, то их 'value' кладем в параметр,
                //      там они лягут в массив и на сервере получим IEnumerable<T>
                InsertObjectToParam($item.attr("name"), $item.val());
            }
            else if (numItems > 1 && inString == true) {
                //      если много с таким именем чекбоксов, то их 'value' строкой через запятую (multi)
                var objs = $.map($allThisBoxes, function (v, i) { if ($(v).is(':checked')) { return $(v).val(); } });
                var lik = objs.join(",");
                InsertObjectToParam($item.attr("name"), lik, true);
            }
        });

        // radio
        var $radios = $dom.find("input:radio");
        $radios.each(function (i, v) {
            if ($(v).is(':checked')) {
                InsertObjectToParam($(v).attr("name"), $(v).val());
            }
        });
        // texarea
        var $texts = $dom.find("textarea");
        $texts.each(function (i, v) {
            var $item = $(v);
            InsertObjectToParam($item.attr("name"), $item.val());
        });

        // были поля, которые повторялись - их трамбовали в массив. Осталось и первый элемент положить в массив
        for (itterKey in iterrates) {
            for (paramKey in params) {
                if (itterKey == paramKey) {
                    params[paramKey + "[0]"] = params[paramKey];
                    delete params[paramKey];
                }
            }
        }

        // отдаем
        if (inParam != null && inParam != undefined && inParam == false)
            return params;
        else return $.param(params);
    }
} (jQuery);
/// ===========================================================================================================================




/** ---------------------------------------------------------------------------------------------------------------------------
*       objectToDictionary - Преобразует объект в словарь.
*/
if (!this.zelder.library.objectToDictionary) {
    this.zelder.library.objectToDictionary = function (params, paramName) {
        ///	<summary>
        ///		Преобразует объект в словарь.
        ///	</summary>
        /// <remarks>
        ///     для отправки на сервер в виде Dictionary<String, String>; если на сервере Dictionary<String, Object> - то Value будет как массив
        /// </remarks>
        ///	<param name="params"      type="Object">объект с параметрами (если изначально сериализованный словарь с сервера, то типа JSON.parse($("input#params").val());)</param>
        /// <param name="paramName"   type="string">имя параметра</param>
        ///	<returns type="Object">словарь с параметрами</returns>

        var newQuery = {};
        var keyvalues = params;
        var currentKeyNum = 0;
        for (keyname in keyvalues) {
            newQuery[paramName + "[" + currentKeyNum + "].Key"] = keyname;
            newQuery[paramName + "[" + currentKeyNum + "].Value"] = keyvalues[keyname];
            currentKeyNum++;
        }
        return newQuery;
    }
} (jQuery);
/// ===========================================================================================================================






/** ---------------------------------------------------------------------------------------------------------------------------
*   Получение параметра из строки запроса.
*/
if (!this.zelder.library.getParamValue) {
    this.zelder.library.getParamValue = function (paramName) {
        ///	<summary>
        ///		Получение параметра из строки запроса (querystring)
        ///	</summary>
        ///	<param name="paramName" type="String">ключ параметра в запросе</param>
        ///	<returns type="String">значение параметра</returns>

        var parName = paramName.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var pattern = '[\\?&]' + paramName + '=([^&#]*)';
        var regex = new RegExp(pattern);
        var matches = regex.exec(window.location.href);
        if (matches == null) return '';
        else return decodeURIComponent(matches[1].replace(/\+/g, ' '));
    }
}(jQuery);
/// ===========================================================================================================================






/** ---------------------------------------------------------------------------------------------------------------------------
*   htmlEncode(value)
*/
if (!this.zelder.library.htmlEncode) {
    this.zelder.library.htmlEncode = function (value) {
        ///	<summary>
        ///		Кодирование строки.
        ///	</summary>
        ///	<param name="value" type="String">строка</param>
        ///	<returns type="String">кодированная строка</returns>
        return $('<div/>').text(value).html();
    }
} (jQuery);
/// ===========================================================================================================================

/** ---------------------------------------------------------------------------------------------------------------------------
*   htmlDecode(value)
*/
if (!this.zelder.library.htmlDecode) {
    this.zelder.library.htmlDecode = function (value) {
        ///	<summary>
        ///		Декодирование строки.
        ///	</summary>
        ///	<param name="value" type="String">строка</param>
        ///	<returns type="String">декодированная строка</returns>
        return $('<div/>').html(value).text();
    }
} (jQuery);
/// ===========================================================================================================================


/** ---------------------------------------------------------------------------------------------------------------------------
*   GetKirillCharByUniCode(uniCharCode)		- перекодировка символа
*/
if (!this.zelder.library.GetKirillCharByUniCode) {
    this.zelder.library.GetKirillCharByUniCode = function (/*042F*/uniCharCode) {
        var kirillString = "";
        switch (uniCharCode) {
            case "0020": kirillString = ' '; break;
            case "0021": kirillString = '!'; break;
            case "0022": kirillString = '"'; break;
            case "0023": kirillString = '#'; break;
            case "0024": kirillString = '$'; break;
            case "0025": kirillString = '%'; break;
            case "0026": kirillString = '&'; break;
            case "0027": kirillString = '\\'; break;
            case "0028": kirillString = '('; break;
            case "0029": kirillString = ')'; break;
            case "002A": kirillString = '*'; break;
            case "002B": kirillString = '+'; break;
            case "002C": kirillString = ','; break;
            case "002D": kirillString = '-'; break;
            case "002E": kirillString = '.'; break;
            case "002F": kirillString = '/'; break;
            case "0030": kirillString = '0'; break;
            case "0031": kirillString = '1'; break;
            case "0032": kirillString = '2'; break;
            case "0033": kirillString = '3'; break;
            case "0034": kirillString = '4'; break;
            case "0035": kirillString = '5'; break;
            case "0036": kirillString = '6'; break;
            case "0037": kirillString = '7'; break;
            case "0038": kirillString = '8'; break;
            case "0039": kirillString = '9'; break;
            case "003A": kirillString = ':'; break;
            case "003B": kirillString = ';'; break;
            case "003C": kirillString = '<'; break;
            case "003D": kirillString = '='; break;
            case "003E": kirillString = '>'; break;
            case "003F": kirillString = '?'; break;
            case "0040": kirillString = '@'; break;
            case "0041": kirillString = 'A'; break;
            case "0042": kirillString = 'B'; break;
            case "0043": kirillString = 'C'; break;
            case "0044": kirillString = 'D'; break;
            case "0045": kirillString = 'E'; break;
            case "0046": kirillString = 'F'; break;
            case "0047": kirillString = 'G'; break;
            case "0048": kirillString = 'H'; break;
            case "0049": kirillString = 'I'; break;
            case "004A": kirillString = 'J'; break;
            case "004B": kirillString = 'K'; break;
            case "004C": kirillString = 'L'; break;
            case "004D": kirillString = 'M'; break;
            case "004E": kirillString = 'N'; break;
            case "004F": kirillString = 'O'; break;
            case "0050": kirillString = 'P'; break;
            case "0051": kirillString = 'Q'; break;
            case "0052": kirillString = 'R'; break;
            case "0053": kirillString = 'S'; break;
            case "0054": kirillString = 'T'; break;
            case "0055": kirillString = 'U'; break;
            case "0056": kirillString = 'V'; break;
            case "0057": kirillString = 'W'; break;
            case "0058": kirillString = 'X'; break;
            case "0059": kirillString = 'Y'; break;
            case "005A": kirillString = 'Z'; break;
            case "005B": kirillString = '['; break;
            case "005C": kirillString = '\\'; break;
            case "005D": kirillString = ']'; break;
            case "005E": kirillString = '^'; break;
            case "005F": kirillString = '_'; break;
            case "0060": kirillString = '`'; break;
            case "0061": kirillString = 'a'; break;
            case "0062": kirillString = 'b'; break;
            case "0063": kirillString = 'c'; break;
            case "0064": kirillString = 'd'; break;
            case "0065": kirillString = 'e'; break;
            case "0066": kirillString = 'f'; break;
            case "0067": kirillString = 'g'; break;
            case "0068": kirillString = 'h'; break;
            case "0069": kirillString = 'i'; break;
            case "006A": kirillString = 'j'; break;
            case "006B": kirillString = 'k'; break;
            case "006C": kirillString = 'l'; break;
            case "006D": kirillString = 'm'; break;
            case "006E": kirillString = 'n'; break;
            case "006F": kirillString = 'o'; break;
            case "0070": kirillString = 'p'; break;
            case "0071": kirillString = 'q'; break;
            case "0072": kirillString = 'r'; break;
            case "0073": kirillString = 's'; break;
            case "0074": kirillString = 't'; break;
            case "0075": kirillString = 'u'; break;
            case "0076": kirillString = 'v'; break;
            case "0077": kirillString = 'w'; break;
            case "0078": kirillString = 'x'; break;
            case "0079": kirillString = 'y'; break;
            case "007A": kirillString = 'z'; break;
            case "007B": kirillString = '{'; break;
            case "007C": kirillString = '|'; break;
            case "007D": kirillString = '}'; break;
            case "007E": kirillString = '~'; break;

            case "0410": kirillString = 'А'; break;
            case "0430": kirillString = 'а'; break;
            case "0411": kirillString = 'Б'; break;
            case "0431": kirillString = 'б'; break;
            case "0412": kirillString = 'В'; break;
            case "0432": kirillString = 'в'; break;
            case "0413": kirillString = 'Г'; break;
            case "0433": kirillString = 'г'; break;
            case "0414": kirillString = 'Д'; break;
            case "0434": kirillString = 'д'; break;
            case "0415": kirillString = 'Е'; break;
            case "0435": kirillString = 'е'; break;
            case "0401": kirillString = 'Ё'; break;
            case "0451": kirillString = 'ё'; break;
            case "0416": kirillString = 'Ж'; break;
            case "0436": kirillString = 'ж'; break;
            case "0417": kirillString = 'З'; break;
            case "0437": kirillString = 'з'; break;
            case "0418": kirillString = 'И'; break;
            case "0438": kirillString = 'и'; break;
            case "0419": kirillString = 'Й'; break;
            case "0439": kirillString = 'й'; break;
            case "041A": kirillString = 'К'; break;
            case "043A": kirillString = 'к'; break;
            case "041B": kirillString = 'Л'; break;
            case "043B": kirillString = 'л'; break;
            case "041C": kirillString = 'М'; break;
            case "043C": kirillString = 'м'; break;
            case "041D": kirillString = 'Н'; break;
            case "043D": kirillString = 'н'; break;
            case "041E": kirillString = 'О'; break;
            case "043E": kirillString = 'о'; break;
            case "041F": kirillString = 'П'; break;
            case "043F": kirillString = 'п'; break;
            case "0420": kirillString = 'Р'; break;
            case "0440": kirillString = 'р'; break;
            case "0421": kirillString = 'С'; break;
            case "0441": kirillString = 'с'; break;
            case "0422": kirillString = 'Т'; break;
            case "0442": kirillString = 'т'; break;
            case "0423": kirillString = 'У'; break;
            case "0443": kirillString = 'у'; break;
            case "0424": kirillString = 'Ф'; break;
            case "0444": kirillString = 'ф'; break;
            case "0425": kirillString = 'Х'; break;
            case "0445": kirillString = 'х'; break;
            case "0426": kirillString = 'Ц'; break;
            case "0446": kirillString = 'ц'; break;
            case "0427": kirillString = 'Ч'; break;
            case "0447": kirillString = 'ч'; break;
            case "0428": kirillString = 'Ш'; break;
            case "0448": kirillString = 'ш'; break;
            case "0429": kirillString = 'Щ'; break;
            case "0449": kirillString = 'щ'; break;
            case "042A": kirillString = 'Ъ'; break;
            case "044A": kirillString = 'ъ'; break;
            case "042B": kirillString = 'Ы'; break;
            case "044B": kirillString = 'ы'; break;
            case "042C": kirillString = 'Ь'; break;
            case "044C": kirillString = 'ь'; break;
            case "042D": kirillString = 'Э'; break;
            case "044D": kirillString = 'э'; break;
            case "042E": kirillString = 'Ю'; break;
            case "044E": kirillString = 'ю'; break;
            case "042F": kirillString = 'Я'; break;
            case "044F": kirillString = 'я'; break;
        }
        return kirillString;
    }
} (jQuery);
/** ---------------------------------------------------------------------------------------------------------------------------
*   GetKirillByUni(uniString)	- перекодировка строки.
*/
if (!this.zelder.library.GetKirillByUni) {
    this.zelder.library.GetKirillByUni = function (/*\u041F\u0440\u0438\u0432\u0435\u0442*/uniString) {
        if (uniString.toLowerCase().indexOf("\\u") < 0) return uniString;

        var chars = uniString.split("\\u");
        var kirillString = "";
        $.each(chars, function (i, uniChar) {
            var uniCharCode = uniChar.replace("\\u", "");
            kirillString += zelder.library.GetKirillCharByUniCode(uniCharCode);
        });
        return kirillString;
    }
} (jQuery);
/// ===========================================================================================================================
