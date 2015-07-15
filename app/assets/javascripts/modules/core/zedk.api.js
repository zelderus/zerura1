

this.zedk = this.zedk || {};
this.zedk.data = this.zedk.data || {};
this.zedk.api = this.zedk.api || {};



zedk.api.About = function() {
	zedk.ConsoleGreen("ZEDK API");
};



/*
*	SendAjax
*
*	отправка JSON запроса
*	в случае успеха, возвращает модель объекта с сервера, иначе сообщение об ошибки
*/
zedk.api.SendAjax = function(method, /*GET|POST*/type, dataSend, onSuccess, onError) {
	
	$.ajax({
		url: method,
		type: type,
		data: dataSend,
		cache: false,
		success: function(jo){ 
			if (!jo || !jo.JsonZedk) { 
				var errs = "Result is not a Json in '"+method+"' request"; 
				zedk.ConsoleRed(errs); 
				if (onError) onError(errs); 
				return false; 
			}
			if (jo.Success) onSuccess(jo.Model);
			else if (onError) onError(jo.Message); 
		},
	  	error: function(x,m,e){ 
	  		zedk.ConsoleRed("SendAjax error: " + e);
			if (onError) onError(m);
	  	}
	});

};
/*
*	Send - Ajax GET
*/
zedk.api.Send = function(method, dataSend, onSuccess, onError) {
	zedk.api.SendAjax(method, "GET", dataSend, onSuccess, onError);
};
/*
*	Post - Ajax POST
*/
zedk.api.Post = function(method, dataSend, onSuccess, onError) {
	zedk.api.SendAjax(method, "POST", dataSend, onSuccess, onError);
};





