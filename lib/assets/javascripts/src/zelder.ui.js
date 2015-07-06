/// <reference path="zelder.library.js" />
/// <reference path="zelder.collections.js" />



/*
*  
*  zelder's UI
*  
*/
this.zelder = this.zelder || {};
this.zelder.ui = this.zelder.ui || {};

/* 
*       about
*/
this.zelder.ui.about = this.zelder.ui.about || {
    title: "UI",
    version: "1.0.0",
    builder: "ZeLDER",
    references: []
};


this.DUMPING = zelder.library.DUMPING;
this.extendClass = zelder.library.extendClass;


/*******************************
*   Functions
*   
*/
/// GetCenterPoint(blockSize, isFixed) - координаты центра
/// возвращает {x,y}
this.zelder.ui.GetCenterPoint = function (/*{width, height}*/blockSize, /*bool*/isFixed) {
    var $w = $(window);
    var ww = $w.width();
    var wh = $w.height();
    var scrollLeft = isFixed == true ? 0 : $w.scrollLeft();
    var scrollTop = isFixed == true ? 0 : $w.scrollTop();
    var minLeft = (blockSize.width >= ww) ? 0 : ((ww / 2) - (blockSize.width / 2)) + scrollLeft;
    var minTop = (blockSize.height >= wh) ? 0 : ((wh / 2) - (blockSize.height / 2)) + scrollTop;
    return { x: minLeft, y: minTop };
};

/********************************************
*               UIObjects                  *
********************************************/
/**
*   UIObject
*   отображающийся элемент.
*       domId - полный идентификатор DOM элемента.
*/
this.zelder.ui.UIObject = function (domId) { this.domId = domId; };
this.zelder.ui.UIObject.prototype.GetDomId = function () { return this.domId; };



/********************************************
*   UIControl : UIObject
*   Объекты рисующие себя сами.
*   Наследующие классы обязуются добавить в this.$_domView объект JQ со свей разметкой.
*   Так как наследует UIObject - есть функция GetDomId() отдающая ID элемента (пример: $(this.GetDomId()).hide();)
*       GetDomHtml()    - возвращает свою отрисовку как html-разметку
*       GetDomObject()  - возвращает свою отрисовку как объект JQ
*       AppendTo(jqObject)      - вставляет созданный объект в разметку JQ-объекта и привязывает события
*       PrependTo(jqObject)     - вставляет созданный объект в разметку JQ-объекта и привязывает события
*       UpdateDomView(domView)  - обновление $_domView. Используют наследующие классы, после того, как нарисуют себя!!!
*       AddClass(className)     - добавление класса стилей
*       SetStyle(styleName, styleValue) - установка стилей
*
*   для встраивания объекта в DOM и привязки событий:                      
*       myUIC.AppendTo($("div#place"));
*
********************************************/
this.zelder.ui.UIControl = function (domId) {
    zelder.ui.UIControl.superclass.constructor.call(this, domId);
    this.$_domView = ""; // JQ объект
};
extendClass(zelder.ui.UIControl, zelder.ui.UIObject);
/// GetDomObject() - возвращаем свою отрисовку как объект JQ
this.zelder.ui.UIControl.prototype.GetDomObject = function () {
    return this.$_domView;
};
/// GetDomHtml() - возвращаем свою отрисовку как html-разметку
this.zelder.ui.UIControl.prototype.GetDomHtml = function () {
    return $('<div>').append($(this.$_domView).clone()).html();
};
/// AppendTo(jqObject) - вставка нас самих в JQ-объект
this.zelder.ui.UIControl.prototype.AppendTo = function (jqObject) {
    this.GetDomObject().appendTo(jqObject);
    this.HangEvents();
    return this;
};
/// PrependTo(jqObject) - вставка нас самих в JQ-объект
this.zelder.ui.UIControl.prototype.PrependTo = function (jqObject) {
    this.GetDomObject().prependTo(jqObject);
    this.HangEvents();
    return this;
};
/// HangEvents() - объект добавлен в разметку, прицепляем обработчики событий
this.zelder.ui.UIControl.prototype.HangEvents = function () {
    // Тут он ничего не делает. Этот метод должен быть переопределен в наследующих классах.
};
/// UpdateDomView(domView) - обновляем html-разметку объекта
this.zelder.ui.UIControl.prototype.UpdateDomView = function (domView) {
    this.$_domView = domView;
};
/// AddClass(className) - добавление класса стилей
this.zelder.ui.UIControl.prototype.AddClass = function (className) {
    this.$_domView.addClass(className);
    return this;
};
/// SetStyle(styleName, styleValue) - установка стилей
this.zelder.ui.UIControl.prototype.SetStyle = function (styleName, styleValue) {
    this.$_domView.css(styleName, styleValue);
    return this;
};

/********************************************
*   Button : UIControl
*   Кнопка. принимает функцию обратного вызова.
*       style - "Normal" | "Success" | "Alert"
*       Click(), Disable(), Enable(), Show(), Hide()
*
********************************************/
this.zelder.ui.Button = function (title, style, callback) {
    var newDomId = "flr-btn_" + zelder.library.GuidGenerator();
    zelder.ui.Button.superclass.constructor.call(this, newDomId);
    this._disabled = false;
    this._title = title;
    this._style = style;
    this._callBack = callback;
    this._CreateDomView();
    // Events
    this.HangEvents = function () {
        var self = this;
        $(this.domId).on("click", function (e) { self.Clicked(); return false; });
    };
};
extendClass(zelder.ui.Button, zelder.ui.UIControl);
/// Clicked() - нажали на кнопку
this.zelder.ui.Button.prototype.Clicked = function () {
    if (this._disabled == true) return false;
    var self = this;
    this._callBack(self);
};
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.Button.prototype._CreateDomView = function () {
    var self = this;
    var $title = $("<span>").html(self._title);
    var $view = $("<div>").attr("id", self.domId).addClass("AdminControl_Button " + self._style);
    $title.appendTo($view);
    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};
/// Click() - нажали на кнопку
this.zelder.ui.Button.prototype.Click = function () {
    this.Clicked();
};
/// Disable() - откючение кнопки
this.zelder.ui.Button.prototype.Disable = function () {
    this._disabled = true;
    $(this.domId).addClass("disabled");
};
/// Enable() - включение кнопки
this.zelder.ui.Button.prototype.Enable = function () {
    this._disabled = false;
    $(this.domId).removeClass("disabled");
};
/// Hide() - прячем
this.zelder.ui.Button.prototype.Hide = function () {
    $(this.domId).hide();
};
/// Show() - показываем
this.zelder.ui.Button.prototype.Show = function () {
    $(this.domId).show();
};


/********************************************
*   Window : UIControl
*   Окно. 
*   Все типы производные от этого появляются автоматически, прикрепленные к body
*       title           - заголовок
*       content         - html разметка содержимого
*       width, height   - размеры окна
*       placer          - ID DOM'а для вставки туда окна, иначе в body
*       buttons         - массив кнопок zelder.ui.Button
*       zindex          - по умолчанию 999
*       isFixed         - плавующее
*       parentWindow    - родительское окно
*   Functions:
*       GetParent()     - родительское окно или null
*       ToTop()         - наверх всех окон
*       Modaled()       - окно модалят
*       FromModal()     - больше не модалят
*       GlobalModal()   - модалим всю страницу
*       Close()         - закрыть
*       ToTop()         - поверх остальных окон
*   Events:
*       OnDestroy       - при удалении окна
********************************************/
this.zelder.ui.Window = function (title, content, width, height, placer, buttons, zindex, isFixed, parentWindow) {
    var newDomId = "flr-wnd_" + zelder.library.GuidGenerator();
    zelder.ui.Window.superclass.constructor.call(this, newDomId);

    this._title = title;
    this._content = content;
    this._placeObj = placer;
    this._buttons = buttons;
    this._zindex = (zindex == null || undefined) ? this._GetNextZ() : zindex;
    this._isFixed = (isFixed == null || undefined) ? false : isFixed;
    this._parentWindow = parentWindow;

    this._windowSize = { width: (width != null || undefined) ? width : 640, height: (height != 0 || undefined) ? height : 480 };

    // Events
    this.HangEvents = function () {
        var self = this;
        // обработчик клика по окну (ToTop)
        $(this.domId).on("mousedown", function () { self.ToTop(); });
        // окно родительское
        if (self._parentWindow != null) {
            $(self._parentWindow).on("OnDestroy", function () { self.Close(); });
        }
    };

    this._CreateDomView();
};
extendClass(zelder.ui.Window, zelder.ui.UIControl);
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.Window.prototype._CreateDomView = function () {
    var self = this;
    var centerPos = zelder.ui.GetCenterPoint(self._windowSize, self._isFixed);

    var hasButtons = (self._buttons != null || undefined);

    var $view = $("<div>").attr("id", self.domId).addClass("AdminControl_Window")
                            .css("z-index", self._zindex)
                            .css("position", self._isFixed ? "fixed" : "absolute")
                            .css("width", self._windowSize.width).css("height", hasButtons ? self._windowSize.height + 56 : self._windowSize.height)
                            .css("top", centerPos.y).css("left", centerPos.x);

    var $title = $("<div>").addClass("Window_Title");
    var $titletitle = $("<span>").addClass("Window_Title_Title").html(self._title); $titletitle.appendTo($title);
    var $close = $("<a>").attr("href", "#").addClass("Window_Title_Close")
                                .on("click", function () { self.Close(); return false; })
                                .appendTo($title);
    $title.appendTo($view);
    var $contentWrapper = $("<div>").addClass("Window_ContentWrapper");
    var $content = $("<div>").addClass("Window_Content")
                .css("width", self._windowSize.width - 14).css("height", self._windowSize.height - 40)
                .html(self._content)
                .appendTo($contentWrapper);

    if (hasButtons) {
        var $controls = $("<div>").addClass("Window_Controls").css("width", self._windowSize.width - 14 - 16).css("top", 0);
        $.each(self._buttons, function (i, btn) { if (btn != null) btn.AppendTo($controls); });
        $controls.appendTo($contentWrapper);
    }

    $contentWrapper.appendTo($view);

    // events
    $view.draggable({ handle: "div.Window_Title" });    // перемещаемо
    $view.on("click", function () { self.ToTop(); });   // выше на уровень
    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект

    $((self._placeObj != null || undefined) ? self._placeObj : "body").append($view);

    if (hasButtons) {
        $.each(self._buttons, function (i, btn) {
            if (btn != null) btn.HangEvents();
            // на первую кнопку вешаем обработчик Enter
            if (i == 0) {
                $(self.domId).find("input").on("keyup", function (e) {
                    code = (e.keyCode ? e.keyCode : e.which);
                    if (code == 13) btn.Click();
                });
            }
        });
    }
    // вешаем события
    self.HangEvents();
    // поверх всех
    self.ToTop();
};
/// Close()
this.zelder.ui.Window.prototype.Close = function () {
    var self = this;
    $("div#zwosmodalwrapper_" + self.windowId).remove();
    $(self.domId).remove();
    if (self.__onDeleting == true) return false;    // от рекурсивного закрытия
    self.__onDeleting = true;
    $(this).trigger("OnDestroy", [self]);
};
/// GetParent()
this.zelder.ui.Window.prototype.GetParent = function () {
    var self = this;
    return self._parentWindow;
};
/// Modaled()
this.zelder.ui.Window.prototype.Modaled = function () {
    var self = this;
    var $parent = $(self.domId);
    var parentPos = $parent.offset();
    if (self._isFixed) parentPos = { left: parentPos.left - $(window).scrollLeft(), top: parentPos.top - $(window).scrollTop() };
    var $wrapper = $("<div>").attr("id", "zwosmodalwrapper_" + self.windowId)
                            .addClass("AdminControl_Window_Modal")
                            .css("z-index", parseInt($parent.css("z-index")) + 1)   // чуть сверху родителя
                            .css({ position: self._isFixed ? "fixed" : "absolute", top: parentPos.top + "px", left: parentPos.left + "px" }) // .offset(parentPos) в IE не пашет как надо
                            .width($parent.outerWidth()).height($parent.outerHeight());
    $wrapper.appendTo($parent.parent());
};
/// FromModal()
this.zelder.ui.Window.prototype.FromModal = function () {
    var self = this;
    $("div#zwosmodalwrapper_" + self.windowId).remove();
};
/// GlobalModal()
this.zelder.ui.Window.prototype.GlobalModal = function () {
    var self = this;
    var $wrapper = $("<div>").attr("id", "zwosmodalwrapper_" + self.windowId)
                            .addClass("AdminControl_Window_Modal")
                            .css("z-index", parseInt(self.GetDomObject().css("z-index") - 1))   // чуть ниже
                            .css({ position: "absolute", top: "0px", left: "0px" }) // .offset(parentPos) в IE не пашет как надо
                            .width($(document).width()).height($(document).height());
    $wrapper.appendTo("body");
};
/// статический zIndex
this.zelder.ui.Window.staticZIndex = 999;
/// _GetNextZ() - возвращает самый высокий уровень индекса
this.zelder.ui.Window.prototype._GetNextZ = function (zIndex) {
    if ((zIndex != null || undefined) && zIndex > zelder.ui.Window.staticZIndex) {
        zelder.ui.Window.staticZIndex = zIndex;
    }
    zelder.ui.Window.staticZIndex = zelder.ui.Window.staticZIndex + 1;
    return zelder.ui.Window.staticZIndex;
};
/// ToTop()
this.zelder.ui.Window.prototype.ToTop = function () {
    var self = this;
    // если итак выше всех, то сидим молча
    if (self.GetDomObject().css("z-index") >= zelder.ui.Window.staticZIndex) return false;
    self.GetDomObject().css("z-index", self._GetNextZ());
};

/********************************************
*   QuestionDialog : Window
*   Окно запроса. 
*       parentWindow    - родительское окно (станет модальным) 
*       question        - текст вопроса
*       callbackOk      - функция обратного вызова, в случае Ok
*
********************************************/
this.zelder.ui.QuestionDialog = function (parentWindow, question, callbackOk) {
    this._question = question;
    this._callbackOk = callbackOk;
    this._parentWindow = parentWindow;
    var self = this;

    this._placer = (self._parentWindow != null || undefined) ? $(self._parentWindow.GetDomId()).parent() : "body";

    this._OkBtn = new zelder.ui.Button("OK", "Success", function () { self.Close(); self._callbackOk(); });
    this._CancelBtn = new zelder.ui.Button("Cancel", "Alert", function () { self.Close(); });

    if (self._parentWindow != null || undefined) self._parentWindow.Modaled();
    //this._CreateDomView();
    zelder.ui.QuestionDialog.superclass.constructor.call(this, "Запрос", self._GetContent(), 370, 100, self._placer, [self._OkBtn, self._CancelBtn], (parentWindow != null?parentWindow._zindex + 3:null), false);

    //
    this.Close = function () {
        var self = this;
        if (self._parentWindow != null || undefined) self._parentWindow.FromModal();
        $(self.domId).remove();
    }
};
extendClass(zelder.ui.QuestionDialog, zelder.ui.Window);
/// _GetContent()
this.zelder.ui.QuestionDialog.prototype._GetContent = function () {
    var self = this;
    var $content = $("<div style='padding:10px; text-align:center;'>");
    $content.append($("<div>").html(self._question));
    return $content;
};


/********************************************
*   LoadingDialog : Window
*   Модальное окно. 
*       title           - 
*       content         - 
*       width           - 
*       height          - 
*
********************************************/
this.zelder.ui.LoadingDialog = function (title, content, width, height) {
    var self = this;
    this._title = title;
    this._content = content;
    this._width = width;
    this._height = height;

    //this._CreateDomView();
    zelder.ui.LoadingDialog.superclass.constructor.call(this, self._title, self._content, self._width, self._height, null, null, 9999, true);
    this.GlobalModal();
};
extendClass(zelder.ui.LoadingDialog, zelder.ui.Window);
/// _CreateDomView() - своя отрисовка
this.zelder.ui.LoadingDialog.prototype._CreateDomView = function () {
    var self = this;
    var centerPos = zelder.ui.GetCenterPoint(self._windowSize, self._isFixed);

    var $view = $("<div>").attr("id", self.domId).addClass("Control_LoadingDialog")
                            .css("z-index", self._zindex)
                            .css("position", self._isFixed ? "fixed" : "absolute")
                            .css("width", self._windowSize.width).css("height", self._windowSize.height)
                            .css("top", centerPos.y).css("left", centerPos.x);

    var $title = $("<div>").addClass("Window_Title").html(self._title).appendTo($view);

    var $content = $("<div>").addClass("Window_Content")
                .html(self._content)
                .appendTo($view);

    $("body").append($view);

    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};



/********************************************
*   Tabs : UIControl
*   Табз.
*       domObject - DOM у которго дочерние DIV обернутся табзами и контентом.
*   Functions:
*       SetFunction(tabTitle, callback) - вешает функцию на табз с названием tabTitle. callback(wrapper, tab)
*       OneHeight()                     - делает все вкладки по одной высоте и ширине!
*   Требования к дочерним DIV в domObject:
*       data-title  - станет названием табза
*       
*
********************************************/
this.zelder.ui.Tabs = function (domObject) {
    var newDomId = "eda-tab_" + zelder.library.GuidGenerator();
    zelder.ui.Tabs.superclass.constructor.call(this, newDomId);

    this._domObject = domObject;
    this._tabs = new zelder.collections.List();

    this._disabled = false;
    this._tabsGroup = "eda-tabg_" + zelder.library.GuidGenerator();


    this._CreateDomView();
    // Events
    this.HangEvents = function () {
        var self = this;
        $(this.domId).on("click", ".AdminControl_Tabs_Tab", function (e) { self.Clicked(this); return false; });
    };
    this.HangEvents();
};
extendClass(zelder.ui.Tabs, zelder.ui.UIControl);
/// Clicked() - нажали
this.zelder.ui.Tabs.prototype.Clicked = function (tab) {
    if (this._disabled == true) return false;
    var self = this;
    // красим табзы
    $(this.domId).find(".AdminControl_Tabs_Tab").removeClass("Current");
    $(tab).addClass("Current");
    // работаем с контентом
    $.each($(this.domId).find(".AdminControl_Tabs_TabContent"), function (i, tabContent) {
        if ($(tabContent).data("tabs-id") != $(tab).data("tabs-id")) $(tabContent).hide();
        else {
            $(tabContent).show();
        }
    });
};
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.Tabs.prototype._CreateDomView = function () {
    var self = this;
    var $view = self._domObject.attr("id", self.domId).addClass("AdminControl_Tabs");
    // tab controls
    var $tabControls = $("<div>").addClass("AdminControl_Tabs_Controls");
    // делаем детей табзами
    $.each($view.children("div"), function (i, child) {
        var $newTab = $("<div>").addClass("AdminControl_Tabs_Tab").addClass(i == 0 ? "Current" : "")
            .data("tabs-group", self._tabsGroup)
            .data("tabs-id", i)
            .data("title", $(child).data("title"))
            .html($(child).data("title"));

        $(child).addClass("AdminControl_Tabs_TabContent")
            .data("tabs-group", self._tabsGroup)
            .data("tabs-id", i)
            .css("display", i == 0 ? "block" : "none");

        $newTab.appendTo($tabControls);
    });
    $tabControls.prependTo($view);

    self.domId = "#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};
/// SetFunction(tabTitle, callback) - вешаем обработчик при клике на табз
this.zelder.ui.Tabs.prototype.SetFunction = function (tabTitle, callback) {
    var self = this;
    $.each($(this.domId).find(".AdminControl_Tabs_Tab"), function (i, tab) {
        if ($(tab).data("title") === tabTitle) {
            var tabContent = null;
            $.each($(self.domId).find(".AdminControl_Tabs_TabContent"), function (i, tContent) {
                if ($(tContent).data("tabs-id") == $(tab).data("tabs-id")) { tabContent = tContent; return false; }
            });
            $(tab).on("click", function () { callback($(this).parent().parent(".AdminControl_Tabs"), $(tabContent)); });
        }
    });
};
/// OneHeight() - делает все вкладки по одной высоте и ширине!
this.zelder.ui.Tabs.prototype.OneHeight = function () {
    var self = this;
    var minHeight = 5, minWidth = 20;
    var $tabContents = self.GetDomObject().children(".AdminControl_Tabs_TabContent");
    $tabContents.each(function (i, t) {
        if ($(t).outerHeight(true) > minHeight) minHeight = $(t).outerHeight(true);
        if ($(t).outerWidth(true) > minWidth) minWidth = $(t).outerWidth(true);
    });
    $tabContents.height(minHeight);
    $tabContents.width(minWidth);
};



/********************************************
*   LoadingSpin : UIControl
*   Шкала загрузки. 
*   Functions:
*       Next(step)      - увеличение спина ДО 'step' процентов
*       NextBy(step)    - увеличение спина НА 'step' процентов
*       GetCurrent()    - текущее значение в %
*       Reset()         - сброс
*   Events:
*       OnComplete      - когда достигнет 100% (и анимация в том числе)
*
********************************************/
this.zelder.ui.LoadingSpin = function () {
    var newDomId = "eda-lds_" + zelder.library.GuidGenerator();
    zelder.ui.LoadingSpin.superclass.constructor.call(this, newDomId);

    this._step = 0;
    this._onePercentPix = 3.55;
    this._firstStep = true;

    this._CreateDomView();
    // Events
    this.HangEvents = function () {
        var self = this;
        self._AnimeLoop();
    };
};
extendClass(zelder.ui.LoadingSpin, zelder.ui.UIControl);
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.LoadingSpin.prototype._CreateDomView = function () {
    var self = this;
    var $view = $("<div>").attr("id", self.domId).addClass("Control_LoadingSpin");
    var $spin = $("<div>").addClass("LoadingSpin_Spin").appendTo($view);
    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};
/// _AnimeLoop() - крутимся
this.zelder.ui.LoadingSpin.prototype._AnimeLoop = function () {
    var self = this;
    var $spin = self.GetDomObject().find(".LoadingSpin_Spin");
    $spin.animate({
        'background-position-y': "-=10px"
    }, 500, 'linear', function () { self._AnimeLoop(); });
};
/// Next(step) - увеличение спина ДО 'step' процентов
this.zelder.ui.LoadingSpin.prototype.Next = function (step) {
    var self = this;
    var odds = self._firstStep == true ? 7 : 0;    // -7 погрешность начального сдвига бара
    
    self._firstStep = false;
    step = step < 0 ? 0 : step > 100 ? 100 : step;
    var dixStep = step - self._step;    // разница
    if (dixStep == 0) return false;
    self._step = step;
    // анимация
    var $spin = self.GetDomObject().find(".LoadingSpin_Spin");
    $spin.animate({
        'background-position-x': "+=" + (dixStep * self._onePercentPix - odds)
    }, 1000 / dixStep * dixStep, 'linear', function () { if (self._step >= 100) $(self).trigger("OnComplete", [self]); return false; });
};
/// NextBy(step) - увеличение спина НА 'step' процентов
this.zelder.ui.LoadingSpin.prototype.NextBy = function (step) {
    var self = this;
    step = step < 0 ? 0 : step > 100 ? 100 : step;
    self.Next(step + self._step);
};
/// GetCurrent() - текущее значение
this.zelder.ui.LoadingSpin.prototype.GetCurrent = function () {
    return this._step;
};
/// Reset() - сброс
this.zelder.ui.LoadingSpin.prototype.Reset = function () {
    var self = this;
    self._firstStep = true;
    self._step = 0;
    self.GetDomObject().find(".LoadingSpin_Spin").css("background-position-x", "-348px");
};



/********************************************
*   DropDownList : UIControl
*   Список
*       controlName         - имя контрола (select name=)
*       objects             - массив объектов { Value, Text, Selected, Tag(optional) }
*       callback            - при выборе элемента Func(val)
*       emptyText           - текст при пустом списке
*       selectText          - текст перед выборкой (удалится после выбора реального)
*       parentDDL           - список другого списка, при выборе в котором в етом будут фильтроваться по Tag == parentDDL.GetCurrent()
*   Functions:
*       Update(objects)     - обновлние списка из массива объектов типа { Value, Text, Selected }
*       UpdateBy(objects, value, text, selected) - обновление списка 
*       AddElement(element, updateOldFn)        - добавляет новый элемент в список. updateOldFn - функция для обновления каждого старого элемента (например, выключение Selected)
*       GetCurrent()        - текущее значение
*       GetCurrentText()    - текущее текстовое значение
*       Select(val)         - выбираем програмно
*       SelectByText(text)  - выбираем по названию
*       Disable()           - выключаем
*       Enable()            - включаем
*       Count()             - количество элементов
*       Clear()             - чистка
*       MustSelect()        - пользователь должен заново выбрать
*       FilterByTag(val)    - фильтрация значений по Tag
*       SetError()          - помечаем как с ошибкой
*       SetNormal()         - помечаем как нормальный
*   Callbacks:
*       OnUpdate(e, this)   - при обновлении списка
*
********************************************/
this.zelder.ui.DropDownList = function (controlName, /*Array*/objects, /*function*/callback, /*String*/emptyText, /*String*/selectText, /*this*/parentDDL) {
    this._controlName = controlName;
    this._objects = new zelder.collections.List(objects);
    this._onChange = callback;
    this._emptyText = emptyText;
    this._selectText = selectText;
    this._parentDDL = (parentDDL == null || parentDDL == undefined) ? null : parentDDL;
    this._disabled = false;

    var newDomId = "zwosui-ddl_" + zelder.library.GuidGenerator();
    zelder.ui.DropDownList.superclass.constructor.call(this, newDomId);

    this._CreateDomView();
    // Events
    this.HangEvents = function () {
        var self = this;
        self.GetDomObject().on("change", function (e) { self.Change($(this).val()); return false; });
        if (self._parentDDL != null) {
            self._parentDDL.GetDomObject().on("change", function (e) { self.FilterByTag($(this).val()); return false; });
            self.Disable();
        }
        // если выбранный сразу
        if (self._objects.Contains(true, "Selected") == true) self.Select(self._objects.First(function (v) { if (v.Selected == true) return true; }).Value);
    };
};
extendClass(zelder.ui.DropDownList, zelder.ui.UIControl);
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.DropDownList.prototype._CreateDomView = function () {
    var self = this;
    var $view = $("<select>").attr("id", self.domId).attr("name", self._controlName).addClass("AdminControl_DDL");
    self.domId = "select#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект

    self._Render();
};
/// _RenderByObjects(objectList) - отрисовка
this.zelder.ui.DropDownList.prototype._RenderByObjects = function (/*zelder.collections.List*/objectList) {
    var self = this;
    var $view = self.GetDomObject();
    $view.find("option").remove();
    if (objectList.Count() == 0) {
        var $option = ("<option value='-2'>" + self._emptyText + "</option>");
        $view.append($option);
        self.Disable();
    }
    else {
        if ((objectList.Contains(true, "Selected") == false) && (self._selectText != null || self._selectText != undefined || self._selectText != "")) {
            $defaultOption = ("<option value='-1'>" + self._selectText + "</option>");
            $view.append($defaultOption);
        }
        $.each(objectList.Get(), function (i, v) {
            var selected = v.Selected;
            var $option = ("<option class='" + (selected ? "selected" : "") + "' value='" + v.Value + "'" + (selected ? " selected" : "") + (v.Tag != null || v.Tag != undefined ? (" data-tag='" + v.Tag + "'") : "") + ">" + v.Text + "</option>");
            $view.append($option);
        });
        self.Enable();
    }
    $(self).trigger("OnUpdate", self);
};
/// _Render() - отрисовка
this.zelder.ui.DropDownList.prototype._Render = function () {
    var self = this;
    self._RenderByObjects(self._objects);
};
/// MustSelect() - пользователь должен заново выбрать
this.zelder.ui.DropDownList.prototype.MustSelect = function () {
    var self = this;
    self.GetDomObject().find("option").removeClass("selected");
    var hasSelectableOption = false;
    self.GetDomObject().find("option").each(function () { if ($(this).val() > 0 || (!$.isNumeric($(this).val()) && $(this).val() != "")) { hasSelectableOption = true; return false; } });
    if (hasSelectableOption == true) {
        var hasDefault = false;
        self.GetDomObject().find("option").filter(function (i) { if ($(this).val() == -1) { hasDefault = true; return false; } });
        if (!hasDefault) {
            var $defaultOption = ("<option value='-1'>" + self._selectText + "</option>");
            self.GetDomObject().prepend($defaultOption);
        }
        self.GetDomObject().val(-1);
    }
    self.Enable();
};
/// Change(val) - выбрали.
this.zelder.ui.DropDownList.prototype.Change = function (val) {
    var self = this;
    if (self._disabled) return false;
    self.GetDomObject().find("option").removeClass("selected").end().find("option:selected").addClass("selected");
    self.GetDomObject().find("option[value='-1']").remove();
    self.SetNormal();
    if (self._onChange != null || self._onChange != undefined) self._onChange(val);
};
/// Select(val) - выбираем програмно.
this.zelder.ui.DropDownList.prototype.Select = function (val) {
    var self = this;
    self.GetDomObject().val(val);
    self.Change(val);
};
/// SelectByText(text) - выбираем програмно по названию.
this.zelder.ui.DropDownList.prototype.SelectByText = function (text) {
    var self = this;
    var searchVal = -1;
    self.GetDomObject().children("option").filter(function () {
        if ($(this).text() == text) { searchVal = $(this).val(); return false; }
    });
    self.GetDomObject().val(searchVal);
    self.Change(searchVal);
};
/// Disable() - выключаем
this.zelder.ui.DropDownList.prototype.Disable = function () {
    this.GetDomObject().attr("disabled", "disabled");
    this._disabled = true;
};
/// Enable() - выключаем
this.zelder.ui.DropDownList.prototype.Enable = function () {
    if (this.Count() == 0) return false;
    this.GetDomObject().removeAttr('disabled');
    this._disabled = false;
};
/// Update(objects) - обновление списка
this.zelder.ui.DropDownList.prototype.Update = function (/*Array*/objects) {
    var self = this;
    self._objects.Set(objects);
    self._Render();
};
/// UpdateBy(objects, value, text, selected) - обновление списка
this.zelder.ui.DropDownList.prototype.UpdateBy = function (/*Array*/objects, value, text, selected) {
    var self = this;
    self._objects.Clear();
    var convertedList = [];
    $.each(objects, function (i, v) { convertedList.push({ Value: v[value], Text: v[text], Selected: (selected == null || undefined ? false : v[selected]) }); });
    self._objects.Set(convertedList);
    self._Render();
};
/// Добавляет новый элемент
this.zelder.ui.DropDownList.prototype.AddElement = function (element, updateOldFn) {
    var self = this;
    var newList = new zelder.collections.List(self._objects.Get());
    // если есть функция, то обновляем все старые элементы
    if (updateOldFn) {
        $.each(newList.Get(), function(i, ov) {
            updateOldFn(ov);
        });
    }
    newList.Add(element);
    self.Update(newList.Get());
};
/// GetCurrent() - текущей выбранный элемент
this.zelder.ui.DropDownList.prototype.GetCurrent = function () {
    return this.GetDomObject().val();
};
/// GetCurrentText()
this.zelder.ui.DropDownList.prototype.GetCurrentText = function () {
    return this.GetDomObject().children("option:selected").text();
};
/// Count() - количество элементов
this.zelder.ui.DropDownList.prototype.Count = function () {
    return this._objects.Count();
};
/// Clear() - чистка
this.zelder.ui.DropDownList.prototype.Clear = function () {
    this.Update(null);
};
/// FilterByTag(val) - фильтрация значений по Tag
this.zelder.ui.DropDownList.prototype.FilterByTag = function (val) {
    var self = this;
    // кроссбраузерно скрыть option невозможно,
    // создаем список нужных option и отображаем их
    var objectList = new zelder.collections.List();
    objectList.AddRange(self._objects.Where(function (v) { if (v.Tag == val) return true; }));
    self._RenderByObjects(objectList);

    self.MustSelect();
};
/// SetError()
this.zelder.ui.DropDownList.prototype.SetError = function () {
    return this.GetDomObject().addClass("Error");
};
/// SetNormal()
this.zelder.ui.DropDownList.prototype.SetNormal = function () {
    return this.GetDomObject().removeClass("Error");
};


/********************************************
*   FloatingHint : UIControl
*   Плавающее окошко.
*       placer          - 
*       content         - 
*       position        - {top,left}
*       style           - 
*   Functions:
*       SetContent(content) - замена контента
*       Hide()              - скрываем
*       Show(position)      - показываем
*
********************************************/
this.zelder.ui.FloatingHint = function (placer, content, position, style) {
    var newDomId = "eda-fh_" + zelder.library.GuidGenerator();
    zelder.ui.FloatingHint.superclass.constructor.call(this, newDomId);

    this._placeObj = placer;
    this._style = style == null || undefined ? "DefaultStyle" : style;
    this._position = position;
    this._content = content;

    this._CreateDomView();
    // Events
    this.HangEvents = function () {
        var self = this;
        self.GetDomObject().on("mouseenter", function () { return false; });
        //$(this.domId).on("click", ".AdminControl_Tabs_Tab", function (e) { self.Clicked(this); return false; });
    };
    this.HangEvents();
};
extendClass(zelder.ui.FloatingHint, zelder.ui.UIControl);
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.FloatingHint.prototype._CreateDomView = function () {
    var self = this;
    var $view = $("<div>").addClass("AdminControl_FloatingHint").addClass(self._style).hide();
    var $content = $("<div>").addClass("AdminControl_FloatingHint_Content").html(self._content);
    $content.appendTo($view);
    $((self._placeObj != null || undefined) ? self._placeObj : "body").append($view);

    self.domId = "#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};
/// SetContent(content) - замена контента
this.zelder.ui.FloatingHint.prototype.SetContent = function (content) {
    var self = this;
    self._content = content;
    self.GetDomObject().children(".AdminControl_FloatingHint_Content").html(content);
    return self;
};
/// Hide() - скрываем
this.zelder.ui.FloatingHint.prototype.Hide = function () {
    var self = this;
    self.GetDomObject().hide();
    return self;
};
/// Show(position) - показываем
this.zelder.ui.FloatingHint.prototype.Show = function (/*{top,left}*/position) {
    var self = this;
    position = { top: position.top, left: position.left };
    self.GetDomObject()
            .css("z-index", 99999)
            .css({ position: "absolute", top: position.top + "px", left: position.left + "px" })
            .show();
    return self;
};


/********************************************
*   CheckBox : UIControl (НА ИСПЫТАНИЕ)
*   Просто красивая кнопка.
*       controlName - название контрола (input name=)
*       value       - значение
*       label       - название
*       width       - ширина (null - 100%)
*       placer      - куда помещаем, либо null
*
********************************************/
this.zelder.ui.CheckBox = function (controlName, value, label, width, placer) {
    var newDomId = "eda-chbx_" + zelder.library.GuidGenerator();
    zelder.ui.CheckBox.superclass.constructor.call(this, newDomId);

    this._controlName = controlName;
    this._label = label;
    this._value = value;
    this._width = ((width == null || width == undefined) ? null : width);
    this._placer = ((placer == null || placer == undefined) ? null : placer);

    this._CreateDomView();
    // Events
    this.HangEvents = function () {
        var self = this;
        var $countryCatItems = self.GetDomObject();
        $countryCatItems.children("label").on("click", function () { $(this).parent("div").children("input[type='checkbox']").attr('checked', !$(this).parent("div").children("input[type='checkbox']").attr('checked')); self._ItemSelect($(this).parent("div"), $(this).parent("div").children("input[type='checkbox']").attr('checked')); return false; });
        $countryCatItems.children("input").on("mouseenter", function () { $(this).parent("div").addClass("Hovered"); });
        $countryCatItems.children("input").on("mouseleave", function () { $(this).parent("div").removeClass("Hovered"); });
        $countryCatItems.children("input").on("change", function () { self._ItemSelect($(this).parent("div"), $(this).attr('checked')); });
    };
    this.HangEvents();
};
extendClass(zelder.ui.CheckBox, zelder.ui.UIControl);
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.CheckBox.prototype._CreateDomView = function () {
    var self = this;
    var $view = $("<div>").addClass("AdminControl_CheckBox");
    $view.append("<input name='" + self._controlName + "' type='checkbox' value='" + self._value + "' />");
    $view.append("<label>" + self._label + "</label>");
    if (self._width != null) $view.css("width", self._width);

    self.domId = "#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект

    if (self._placer != null) self.AppendTo(self._placer);
};
/// _ItemSelect($dom, isSelected)
this.zelder.ui.CheckBox.prototype._ItemSelect = function ($dom, isSelected) {
    var self = this;
    if (isSelected) $dom.addClass("Selected"); else $dom.removeClass("Selected");
};

/********************************************
*   MediaFileWorker : UIControl
*   Файло-выбиралка. 
*       controlName - название контрола (input name=)
*       url         - путь
*       placer      - куда помещаем
*   Functions:
*       GetControlId()  - возврат ID контрола
*       HasFile()       - выбран ли файл
*       GetFormData()   - возврат FormData, если есть HTML5
*       GetForm()       - возврат $(формы), если нету HTML5
*       GetForma()      - возврат для HTML5 (FormData), иначе отдаем саму $(форму).
*       IsHtml5()       - есть ли поддержка HTML5
*
********************************************/
this.zelder.ui.MediaFileWorker = function (controlName, url, placer) {
    var newDomId = "eda-medf_" + zelder.library.GuidGenerator();

    this._controlId = newDomId;
    this._controlName = controlName;
    this._url = url;
    this._placer = placer;
    this._haveHtml5 = false;

    zelder.ui.MediaFileWorker.superclass.constructor.call(this, newDomId);

    // работаем с HTML5 или как
    if (!window.FormData || !window.FileList || !window.FileReader) { this._CreateDomView_NotHtml5(); }
    else { this._haveHtml5 = true;  this._CreateDomView5(); }

};
extendClass(zelder.ui.MediaFileWorker, zelder.ui.UIControl);
/// _CreateDomView5() - своя HTML5 отрисовка
this.zelder.ui.MediaFileWorker.prototype._CreateDomView5 = function () {
    var self = this;
    var $view = $("<div>").attr("id", self.domId).addClass("Control_MediaFileWorker5");
    var $input = $("<input>").attr("type", "file").attr("name", self._controlName).attr("multiple", "").addClass("Control_MediaFileWorker_Input").appendTo($view);
    var $context = $("<div>").addClass("Control_MediaFileWorker_Context").appendTo($view);

    // TODO:
    var ImagePreview = function () {
        $("div#igredientImagePreviewPlace").html("файл не выбран");
        $.each($input[0].files, function (i, file) {
            if (!file.type.match('image.*')) {
                return false;
            }
            // preview
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render
                    var $span = $("<span>").append("<img src='" + e.target.result + "' title='" + escape(theFile.name) + "' style='width:60px; height:60px;' />");
                    $("div#igredientImagePreviewPlace").html("").append($span);
                };
            })(file);
            reader.readAsDataURL(file);
        });
    }

    $(self._placer).append($view);
    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};
/// _CreateDomView_NotHtml5() - своя отрисовка
this.zelder.ui.MediaFileWorker.prototype._CreateDomView_NotHtml5 = function () {
    var self = this;
    var $view = $("<div>").attr("id", self.domId).addClass("Control_MediaFileWorker");
    var $form = $("<form>").attr("action", self._url).attr("method", "POST").attr("enctype", "multipart/form-data").addClass("Control_MediaFileWorker_Form");
    var $input = $("<input>").attr("type", "file").attr("name", self._controlName).attr("multiple", "").addClass("Control_MediaFileWorker_Input").appendTo($form);
    var $context = $("<div>").addClass("Control_MediaFileWorker_Context").appendTo($form);

    var ImagePreview = function () {
        $context.html("файл не выбран");
        if ($input.val()) $context.html($input.val());
    }

    $form.appendTo($view);
    $(self._placer).append($view);
    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект

    // Events
    $input.on("change", ImagePreview);
};
/// GetControlId() - возврат ID контрола
this.zelder.ui.MediaFileWorker.prototype.GetControlId = function () {
    return this._controlId;
};
/// IsHtml5() - есть ли поддержка HTML5
this.zelder.ui.MediaFileWorker.prototype.IsHtml5 = function () {
    return this._haveHtml5;
};
/// HasFile() - выбран ли файл
this.zelder.ui.MediaFileWorker.prototype.HasFile = function () {
    var self = this;
    if (self.GetDomObject().find("input[name='" + self._controlName + "']").val()) return true;
    return false;
};
/// GetFormData() - возврат файла, если есть HTML5
this.zelder.ui.MediaFileWorker.prototype.GetFormData = function () {
    var self = this;
    var hasImage = false;
    var badImage = true;
    var dataSend = new FormData();
    $.each(self.GetDomObject().find("input[name='" + self._controlName + "']")[0].files, function (i, file) {
        hasImage = true;
        // Only process image files.
        if (!file.type.match('image.*')) {
            return null;
        }
        badImage = false;
        dataSend.append(self._controlName, file);
    });
    if (hasImage && badImage) {
        return null;
    }
    return dataSend;
};
/// GetForm() - возврат формы, если нету HTML5
this.zelder.ui.MediaFileWorker.prototype.GetForm = function () {
    var self = this;
    return $(self.GetDomObject().find("form.Control_MediaFileWorker_Form"));
};
/// GetForma() - возврат формы для HTML5 или по старинке.
this.zelder.ui.MediaFileWorker.prototype.GetForma = function () {
    var self = this;
    if (self._haveHtml5 == true) return self.GetFormData();
    else return self.GetForm();
};

/********************************************
*   StatusPanel : UIControl
*   Панель с сообщениями текущих действий. 
*   Functions:
*       CurrentStatus(msg)              - текущий статус действий
*       CurrentStatusEnd(success, msg)  - текущий статус завершился
*
********************************************/
this.zelder.ui.StatusPanel = function () {
    var newDomId = "eda-ssp_" + zelder.library.GuidGenerator();
    zelder.ui.StatusPanel.superclass.constructor.call(this, newDomId);



    this._CreateDomView();
};
extendClass(zelder.ui.StatusPanel, zelder.ui.UIControl);
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.StatusPanel.prototype._CreateDomView = function () {
    var self = this;
    var $view = $("<div>").attr("id", self.domId).addClass("Control_StatusPanel");



    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};
/// CurrentStatus(msg) - текущий статус действий
this.zelder.ui.StatusPanel.prototype.CurrentStatus = function (msg) {
    var self = this;
    self.GetDomObject().append($("<div>").addClass("StatusPanel_Status").html(msg));
};
/// CurrentStatusEnd(success, msg) - текущий статус завершился
this.zelder.ui.StatusPanel.prototype.CurrentStatusEnd = function (success, msg) {
    var self = this;
    var $panel = self.GetDomObject();
    $panel.find(".StatusPanel_Status").last().html(msg).addClass(success == true ? "Success" : "Error");
    $panel.stop().animate({ scrollTop: $panel[0].scrollHeight }, 1000);
};


/********************************************
*   WizardPanel : UIControl
*   Панель с пошаговыми действиями. Работает только с уже готовой разметкой.
*       contentDom  - DOM в котором вся разметка
*       
*   Functions:
*       AddCallBack(tabNumber, callBack)            - добавляет функцию обратного вызова на табз. callBack = Function(tabNumber)
*       AddTabControl(tabNumber, title, callBack)   - добавляет кнопку действия на табз
*       SetTab(tabNumber)                           - установка таба
*       PrevTab()                                   - предыдущий таб
*       NextTab()                                   - следующий таб
*
********************************************/
this.zelder.ui.WizardPanel = function (contentDom) {
    var newDomId = "eda-wizp_" + zelder.library.GuidGenerator();
    zelder.ui.WizardPanel.superclass.constructor.call(this, newDomId);

    this._currentTab = 1;
    this._totalTabCount = 1;
    this.$_contentDom = $(contentDom);
    this.$_tabPanel = null;
    this.$_prevBtn = null;
    this.$_nextBtn = null;
    this.$_tabControls = null;

    this._callBacks = new zelder.collections.Dictionary(); // словарь функций обратного вызова

    this._CreateDomView();
};
extendClass(zelder.ui.WizardPanel, zelder.ui.UIControl);
/// _CreateDomView() - работаем с разметкой
this.zelder.ui.WizardPanel.prototype._CreateDomView = function () {
    var self = this;
    var $view = self.$_contentDom.find(".Control_WizardPanel").attr("id", self.domId);
    // всего табзов
    this._totalTabCount = $view.find(".TabContent").length;
    // tab panel
    self.$_tabPanel = $view.find(".TabPanel");
    // prevBtn
    self.$_prevBtn = $view.find(".PrevButton");
    self.$_prevBtn.on("click", function () { if ($(this).hasClass("Disabled")) return false; self.PrevTab(); return false; });
    // nextBtn
    self.$_nextBtn = $view.find(".NextButton");
    self.$_nextBtn.on("click", function () { if ($(this).hasClass("Disabled")) return false; self.NextTab(); return false; });
    // tab controls
    self.$_tabControls = $view.find(".TabControls");
    // TODO:


    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект
};
/// AddCallBack(tabNumber, callBack) - добавляет функцию обратного вызова на табз
this.zelder.ui.WizardPanel.prototype.AddCallBack = function (tabNumber, callBack) {
    var self = this;
    self._callBacks.Add(new zelder.collections.KeyValueDictionary(tabNumber, callBack));
};
/// AddTabControl(tabNumber, title, callBack) - добавляет кнопку действия на табз
this.zelder.ui.WizardPanel.prototype.AddTabControl = function (tabNumber, title, callBack) {
    var self = this;
    var $newButton = $("<div>").addClass("TabControlButton").html(title);
    $(self.$_tabControls.children(".TabControls_Buttons")[tabNumber - 1]).append($newButton);
    $newButton.on("click", function () { callBack(tabNumber); return false; });
};
/// _GetTabWrapper(tabNumber) - возвращает DOM-табза
this.zelder.ui.WizardPanel.prototype._GetTabWrapper = function (tabNumber) {
    var self = this;
    var $currentTabContent = self.GetDomObject().find(".TabContent").filter(function () { if ($(this).data("tabnum") == tabNumber) return true; });
    return $currentTabContent;
};
/// _GetCurrentTabWrapper() - возвращает DOM-текущего табза
this.zelder.ui.WizardPanel.prototype._GetCurrentTabWrapper = function () {
    var self = this;
    return self._GetTabWrapper(self._currentTab);
};
/// _CheckSlideButtons() - вкл/выкл кнопок листалок и остальных
this.zelder.ui.WizardPanel.prototype._CheckSlideButtons = function () {
    var self = this;
    if (self._currentTab > 1) self.$_prevBtn.removeClass("Disabled");
    if (self._currentTab == 1) self.$_prevBtn.addClass("Disabled");
    if (self._currentTab < self._totalTabCount) self.$_nextBtn.removeClass("Disabled");
    if (self._currentTab == self._totalTabCount) self.$_nextBtn.addClass("Disabled");
    self.$_tabControls.children(".TabControls_Buttons").hide();
    $(self.$_tabControls.children(".TabControls_Buttons")[self._currentTab - 1]).show();
};
/// SetTab(tabNumber) - установка таба
this.zelder.ui.WizardPanel.prototype.SetTab = function (tabNumber) {
    var self = this;
    // прячем текущий
    self._HideTabContent(self._currentTab);
    // следующий
    self._currentTab = tabNumber;
    self._ShowTabContent(self._currentTab);
    self._CheckSlideButtons();
};
/// PrevTab() - предыдущий таб
this.zelder.ui.WizardPanel.prototype.PrevTab = function () {
    var self = this;
    self.SetTab(self._currentTab - 1);
};
/// NextTab() - следующий таб
this.zelder.ui.WizardPanel.prototype.NextTab = function () {
    var self = this;
    self.SetTab(self._currentTab + 1);
};
/// _HideTabContent(tabNumber) - прячем табз
this.zelder.ui.WizardPanel.prototype._HideTabContent = function (tabNumber) {
    var self = this;
    var $currentTabContent = self._GetTabWrapper(tabNumber);
    $(self.$_tabPanel.children(".TabPanel_Tab")[tabNumber - 1]).removeClass("Current").css("z-index", 10);
    // TODO: анимируем

    $currentTabContent.hide();
};
/// _ShowTabContent(tabNumber) - показываем табз
this.zelder.ui.WizardPanel.prototype._ShowTabContent = function (tabNumber) {
    var self = this;
    // крутим вкладку
    var $currentTabContent = self._GetTabWrapper(tabNumber);
    $(self.$_tabPanel.children(".TabPanel_Tab")[tabNumber - 1]).addClass("Current").css("z-index", 9999);
    // TODO: анимируем

    $currentTabContent.show().css("visibility", "visible");
    // оповещаем
    var callBack = self._callBacks.GetByKey(tabNumber);
    if (callBack != null) callBack(tabNumber);
};




/********************************************
*   ImageViewer : UIControl
*   Просматривалка картинок.
*   Functions:
*       Show(imageSrc)  - отображаем изображение
*       Hide()          - закрываем изображение
*
********************************************/
this.zelder.ui.ImageViewer = function () {
    var newDomId = "eda-imv_" + zelder.library.GuidGenerator();
    zelder.ui.ImageViewer.superclass.constructor.call(this, newDomId);



    this._CreateDomView();
};
extendClass(zelder.ui.ImageViewer, zelder.ui.UIControl);
/// _CreateDomView() - создаем свою отрисовку
this.zelder.ui.ImageViewer.prototype._CreateDomView = function () {
    var self = this;
    var $view = $("<div>").attr("id", self.domId).addClass("Control_ImageViewer");
    var $image = $("<img>").addClass("Control_ImageViewer_Image");

    $image.appendTo($view);
    self.domId = "div#" + self.domId;
    self.UpdateDomView($view); // помещаем JQ-объект

    $("body").append($view);
    $(self.GetDomObject()).on("click", function () { self.Hide(); return false; });
};
/// Show(imageSrc) - отображаем изображение
this.zelder.ui.ImageViewer.prototype.Show = function (imageSrc) {
    var self = this;
    var centerPos = zelder.ui.GetCenterPoint({ width: 1024, height: 768 }, false);
    var $self = $(self.GetDomObject());
    $self.find("img.Control_ImageViewer_Image").attr("src", imageSrc);
    $self.css({ position: "absolute", top: centerPos.y + "px", left: centerPos.x + "px" }).show();
};
/// Hide() - закрываем изображение
this.zelder.ui.ImageViewer.prototype.Hide = function () {
    var self = this;
    self.GetDomObject().hide();
};



