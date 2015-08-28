

this.zedk = this.zedk || {};
this.zedk.data = this.zedk.data || {};
this.zedk.api = this.zedk.api || {};



zedk.api.About = function() {
    zedk.ConsoleGreen("ZEDK API");
};



/*
*    SendAjax
*
*    отправка JSON запроса
*    в случае успеха, возвращает модель объекта с сервера, иначе сообщение об ошибки
*/
zedk.api.SendAjax = function(method, /*GET|POST*/type, dataSend, onSuccess, onError) {
    $.ajax({
   	 url: method,
   	 type: type,
   	 dataType: 'json',
   	 data: dataSend,
   	 cache: false,
   	 success: function(jo){
   		 if (!jo || !jo.JsonZedk) {
   			 var errs = "Result is not a Json in '"+method+"' request";
   			 zedk.DebugError(errs);
   			 if (onError) onError(errs, null);
   			 return false;
   		 }
   		 if (jo.Success) onSuccess(jo.Model);
   		 else if (onError) onError(jo.Message, jo.Model);
   	 },
     	 error: function(x,m,e){
     		 zedk.DebugError("SendAjax error: " + e);
   		 if (onError) onError(m, null);
     	 }
    });

};
/*
*    Send - Ajax GET
*/
zedk.api.Send = function(method, dataSend, onSuccess, onError) {
    zedk.api.SendAjax(method, "GET", dataSend, onSuccess, onError);
};
/*
*    Post - Ajax POST
*/
zedk.api.Post = function(method, dataSend, onSuccess, onError) {
    // для проверки подлинности
    var csrf = $("head").find("meta[name='csrf-token']").attr("content");
    dataSend['authenticity_token'] = csrf;

    zedk.api.SendAjax(method, "POST", dataSend, onSuccess, onError);
};



/*
*    Execute - вызов функции по имени
*
*   	 zedk.api.Execute('zedk.controls.Test', window, this)
*   	 zedk.api.Execute('controls.Test', zedk, this)
*/
zedk.api.Execute = function (functionName, context /*, args */) {
    if (!context) context = window;
    var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
   	 context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
};


