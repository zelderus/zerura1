
/*
*
*   Collections типы
*       Enumerable, Dictionary, List
*
*   References:
*       zelder.library.js (version 1.1)
*/
this.zelder = this.zelder || {};
this.zelder.library = this.zelder.library || {};
this.zelder.collections = this.zelder.collections || {};

/* 
*       about
*/
this.zelder.collections.about = this.zelder.collections.about || {
    title: "Collections",
    version: "1.7",
    builder: "ZeLDER",
    references: ["zelder.library.js (1.1)"]
};

this.DUMPING = zelder.library.DUMPING;
this.extendClass = zelder.library.extendClass;


/**
*   KeyValueDictionary
*   Элемент словаря
*/
this.zelder.collections.KeyValueDictionary = function (key, value) { this.key = key, this.value = value; };


/**
*   Enumerable
*   набор элементов
*
*       Set(elements)               - установка новых элементов
*       Get()                       - возврат массива всех элементов
*       Contains(value, comparer)   - Определяет, содержит ли последовательность заданный элемент
*       Where(predicate)            - Возвращает массив элементов, соответствующие условию в функции predicate (Func<TSource, bool>)
*       First(predicate)            - Возвращает элемент, соответствующий условию в функции predicate (Func<TSource, bool>)
*       SortBy(key)                 - Сортирует элементы в списке по ключу (ключ - имя свойства объекта)
*       SortDescBy(key)             - Сортирует в обратном порядке элементы в списке по ключу
*       SortToggleBy(key)           - Попеременно сортирует элементы (то по порядку, то обратно)
*       Clear()                     - Удаляет все элементы
*       Count(predicate)            - Размер
*       GetBySearch(key, text, isTwo, predicate)   - поиск текста 'text' в свойстве 'key' у элементов, а также поиск текста из свойств элемента в тексте, если 'isTwo'
*                                                    predicate - функция коррекции значений, если указана, то в нее будет передано каждое значение для правки во внешке (например удалить все в скобках и тп)
*                                                    predicate передает в вызывающую функцию строку из параметра каждого элемента 'key' и ожидает возврат новой строки.
*       ToIEnumerable(paramName, obj)   - В массив (IEnumerable) для передачи на сервер. 
*                                             Если указан только 'paramName', то будет передан на сервер только список
*                                                   например, если на сервере ActionResult(IEnumerable<CustomObject> reqparams), тогда необходио передать в эту функцию параметры ("reqparams");
*                                             Если на сервере параметр действия - объект, в котором перечисление, то необходимо указать 'paramName' и передать в функцию объект obj к которому прицепится перечисление:
*                                                   например, если на сервере ActionResult(CustomObject reqparams), и class CustomObject { public IEnumerable<SomeOtherCustom> TallDatas {get; set;}}, тогда необходио передать в эту функцию параметры ("TallDatas", someObj).
*/
this.zelder.collections.Enumerable = function (/*Array*/elements) {
    this.Set(elements);
    this._sortedAbs = false; // флаг для попеременной сортировки (SortToggleBy)
};
/// Set(elements) - Устанавливает новые элементы - кому следует, стоит переопределить
this.zelder.collections.Enumerable.prototype.Set = function (/*Array*/elements) { this._elements = (elements == null || !elements) ? [] : elements; };
/// Get() - Возвращает все элементы
this.zelder.collections.Enumerable.prototype.Get = function () { return this._elements; };
/// GetBySearch(key, text, isTwo, predicate) - возврат по поиску текста в элементе
/// key - свойство элемента для поиска
/// text - текст для поиска
/// isTwo - если true, то поиск будет в двух направлениях, как в свойствах элемента, так и в строке поиска
/// predicate - функция коррекции значений, если указана функция, то в нее будет передано каждое значение для правки во внешке (например удалить все в скобках и тп)
this.zelder.collections.Enumerable.prototype.GetBySearch = function (/*string*/key, /*string*/text, /*bool*/isTwo, /*function(val)*/predicate) {
    var self = this;
    var withPred = (predicate != null && predicate != undefined);
    var returnArray = [];
    $.each(self._elements, function (i, v) {
        var objectValue = withPred ? predicate(v[key]) : v[key];
        // ищем в объекте
        var re = new RegExp(text, "i");
        if (re.test(objectValue)) { returnArray.push(v); return false; }
        // ищем в поиске
        if (isTwo) {
            var re2 = new RegExp(objectValue, "i");
            if (re2.test(text)) { returnArray.push(v); }
        }
    });
    return returnArray;
};
/// Contains(value, comparer) - Определяет, содержит ли последовательность заданный элемент
/// value - значение для сравнения
/// comparer - имя свойства типа в списке, которое будет сравниваться с value. если null - то простое сравнение на равенство
this.zelder.collections.Enumerable.prototype.Contains = function (/*object*/value, /*object*/comparer) {
    var self = this;
    var contains = false;
    if (comparer == null || undefined) {
        $.each(self._elements, function (i, v) { if (v == value) { contains = true; return false; } });
    } else {
        $.each(self._elements, function (i, v) { if (v[comparer] == value) { contains = true; return false; } });
    }
    return contains;
};
/// Where(predicate) - Возвращает массив элементов, соответствующие условию в функции predicate
/// predicate - Func<TSource, bool>
this.zelder.collections.Enumerable.prototype.Where = function (/*function*/predicate) {
    var self = this;
    var returnArray = [];
    $.each(self._elements, function (i, v) { if (predicate(v) == true) { returnArray.push(v); } });
    return returnArray;
};
/// First(predicate) - Возвращает элемент, соответствующий условию в функции predicate
/// predicate - Func<TSource, bool>
this.zelder.collections.Enumerable.prototype.First = function (/*function*/predicate) {
    var self = this;
    var returnObject = null;
    $.each(self._elements, function (i, v) { if (predicate(v) == true) { returnObject = v; return false; } });
    return returnObject;
};
/// SortBy(key) - Сортирует элементы в списке по ключу
this.zelder.collections.Enumerable.prototype.SortBy = function (/*string*/key) {
    var Compare = function (o1, o2) {
        var o1c = (typeof o1[key] == "string") ? o1[key].toLowerCase() : o1[key];
        var o2c = (typeof o2[key] == "string") ? o2[key].toLowerCase() : o2[key];
        return ((o1c < o2c) ? -1 : ((o1c > o2c) ? 1 : 0));
    }
    this._elements.sort(Compare);
    this._sortedAbs = true;
};
/// SortDescBy(key) - Сортирует в обратном порядке элементы в списке по ключу
this.zelder.collections.Enumerable.prototype.SortDescBy = function (/*string*/key) {
    var Compare = function (o1, o2) {
        var o1c = (typeof o1[key] == "string") ? o1[key].toLowerCase() : o1[key];
        var o2c = (typeof o2[key] == "string") ? o2[key].toLowerCase() : o2[key];
        return ((o1c < o2c) ? 1 : ((o1c > o2c) ? -1 : 0));
    }
    this._elements.sort(Compare);
    this._sortedAbs = false;
};
/// SortToggleBy(key) - Попеременно сортирует элементы (то по порядку, то обратно)
this.zelder.collections.Enumerable.prototype.SortToggleBy = function (/*string*/key) {
    var self = this;
    var Compare = self._sortedAbs == true ? self.SortDescBy(key) : self.SortBy(key);
    Compare;
};
/// Clear() - Удаляет все элементы
this.zelder.collections.Enumerable.prototype.Clear = function () {
    this._elements = [];
};
/// Count() - размер
this.zelder.collections.Enumerable.prototype.Count = function (predicate) {
    if (!predicate || predicate == undefined) return this._elements.length;
    var self = this;
    var total = 0;
    $.each(self._elements, function (i, v) { if (predicate(v) == true) { total++; } });
    return total;
};
/// ToIEnumerable(paramName, obj) - в массив для передачи на сервер
this.zelder.collections.Enumerable.prototype.ToIEnumerable = function (/*string*/paramName, /*Object?*/obj) {
    var self = this;
    var inObject = (obj != null && obj != undefined) ? true : false;
    var iEnumerable = inObject ? obj : {};  // работаем с новым объектом или с данным
    if (self.Count() == 0) return iEnumerable;
    // считаем сколько свойств у объекта
    var propCount = 0;
    var firstElement = self._elements[0];   // предположительно все объекты в массиве одного 'типа'
    for (var k in firstElement) { if (firstElement.hasOwnProperty(k)) { ++propCount; } }
    $.each(self.Get(), function (i, v) {
        // больше одного свойства, значит на сервере ловить будет перечисление объектов со свойствами такими же
        if (propCount > 1) {
            for (var keyname in v) {
                iEnumerable[paramName + "[" + i + "]." + keyname] = v[keyname];
            }
        } // если одно свойство, значит на сервере будет ловить перечисление 'простых' типов
        else {
            iEnumerable[paramName + "[" + i + "]"] = v;
        }
    });
    return iEnumerable;
};

/**
*   Dictionary : Enumerable
*   словарь
*   
*       Add(keyValueDictionary, value?) - добавляем элемент в словарь (если keyValueDictionary не тип KeyValueDictionary, то должно быть еще value)
*       GetByKey(key)                   - возвращает элемент из списка по ключу
*       Remove(key)                     - удаляет элемент из списка по ключу
*
*       FromArray(array, key, value)    - Создает словарь на основе массива. Переводя каждый элемент из массива в KeyValueDictionary;
*                                           Если key и value не указаны, то переведутся все свойства объекта. key - имя свойства, value - значение свойства;
*                                           Если указаны: key - имя свойства, которое будет как key, value - имя свойства, станет его значением.
*
*       FromObject(array, secondKey)     - Создает словарь на основе массива-объекта (такого как Dictionary с сервера), не имеющего названий у свойств.
*                                           Если secondKey = true, то в key помещается второе свойство, иначе первое.
*/
this.zelder.collections.Dictionary = function (/*zelder.collections.KeyValueDictionary[]*/elements) {
    zelder.collections.Dictionary.superclass.constructor.call(this, null);
    var self = this;
    // overrides
    this.Set = function (elements) {
        if (elements != null || undefined) {
            $.each(elements, function (i, v) {
                self.Add(v);
            });
        }
    }
    this.Set(elements);
};
extendClass(zelder.collections.Dictionary, zelder.collections.Enumerable);
/// FromArray(array, key, value) - Создает словарь на основе массива. Переводя каждый элемент из массива в KeyValueDictionary
this.zelder.collections.Dictionary.prototype.FromArray = function (/*Array*/array, /*string?*/key, /*string?*/value) {
    var self = this;
    self.Clear();
    $.each(array, function (i, v) {
        var insertingKey = false;
        var insertingValue = false;
        var kiki = {};
        for (_keyname in v) {
            if ((key == null || undefined) || (value == null || undefined)) { kiki.k = _keyname; kiki.v = v[_keyname]; insertingKey = insertingValue = true; }
            else if (_keyname == key) { kiki.k = v[_keyname]; insertingKey = true; }
            else if (_keyname == value) { kiki.v = v[_keyname]; insertingValue = true; }
        }
        if (insertingKey && insertingValue) self.Add(new zelder.collections.KeyValueDictionary(kiki.k, kiki.v));
    });
};
/// FromObject(array, secondKey) - Создает словарь на основе массива-объекта. Переводя каждый элемент из массива в KeyValueDictionary
this.zelder.collections.Dictionary.prototype.FromObject = function (/*Array*/array, /*bool*/secondKey) {
    var self = this;
    secondKey = (secondKey == null || secondKey == undefined || secondKey == "") ? true : false;
    self.Clear();
    for (_keyname in array) {
        var key = secondKey ? _keyname : array[_keyname];
        var value = secondKey ? array[_keyname] : _keyname;
        self.Add(new zelder.collections.KeyValueDictionary(key, value));
    }
};
/// Add(keyValueDictionary, value?) - добавляем элемент в словарь (если keyValueDictionary не тип KeyValueDictionary, то должно быть еще value)
this.zelder.collections.Dictionary.prototype.Add = function (/*zelder.collections.KeyValueDictionary|Object*/keyValueDictionary, /*Object*/value) {
    var self = this;
    if (keyValueDictionary instanceof zelder.collections.KeyValueDictionary) {
        if (self.Contains(keyValueDictionary.key, "key") == false) self._elements.push(keyValueDictionary);
    }
    else if (value != null && value != undefined) {
        var keyValue = new zelder.collections.KeyValueDictionary(keyValueDictionary, value);
        if (self.Contains(keyValue.key, "key") == false) self._elements.push(keyValue);
    }
};
/// Remove(key) - удаляет элемент из списка по ключу
this.zelder.collections.Dictionary.prototype.Remove = function (key) {
    var self = this;
    $.each(self._elements, function (i, v) { if (v.key == key) { self._elements.splice(i, 1); return false; } });
};
/// GetByKey(key) - возвращает элемент из списка по ключу
this.zelder.collections.Dictionary.prototype.GetByKey = function (key) {
    var self = this;
    var existItem = self.First(function (kvd) { if (kvd.key == key) return true; });
    if (existItem != null) return existItem.value;
    return null;
};

/**
*   List : Enumerable
*   список
*   
*       Add(element)            - добавляет элемент в список
*       AddRange(elements)      - добавляет элементы в список (Array||List||Enumerable)
*       RemoveAt(index)         - удаляет элемент из списка по позиции
*       Remove(element)         - удаляет элемент из списка
*       RemoveBy(value, key)    - удаляет элемент из списка по ключу (key - имя свойства объекта в списке)
*
*/
this.zelder.collections.List = function (/*Array*/elements) {
    zelder.collections.List.superclass.constructor.call(this, elements);
};
extendClass(zelder.collections.List, zelder.collections.Enumerable);
/// Add(element) - добавляет элемент в список
this.zelder.collections.List.prototype.Add = function (/*object*/element) {
    this._elements.push(element);
};
/// AddRange(elements) - добавляет элементы в список
this.zelder.collections.List.prototype.AddRange = function (/*Array||List||Enumerable*/elements) {
    var self = this;
    if (elements == null || undefined) return false;
    if (elements instanceof zelder.collections.List || elements instanceof zelder.collections.Enumerable) {
        $.each(elements.Get(), function (i, v) { self._elements.push(v); });
    }
    else {
        $.each(elements, function (i, v) { self._elements.push(v); });
    }
};
/// RemoveAt(index) - удаляет элемент из списка по позиции
this.zelder.collections.List.prototype.RemoveAt = function (/*int*/index) {
    this._elements.splice(index, 1);
};
/// Remove(element) - удаляет элемент из списка
this.zelder.collections.List.prototype.Remove = function (/*object*/element) {
    var self = this;
    $.each(self._elements, function (i, v) { if (v == element) { self._elements.splice(i, 1); return false; } });
};
/// RemoveBy(value, key) - удаляет элемент из списка по ключу
this.zelder.collections.List.prototype.RemoveBy = function (/*object*/value, /*string*/key) {
    var self = this;
    $.each(self._elements, function (i, v) { if (v[key] == value) { self._elements.splice(i, 1); return false; } });
};
