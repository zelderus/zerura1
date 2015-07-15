


this.zerura = this.zerura || {};



$(function () {

});



zerura.Init = function(opts) {
 	
	// TODO: get DIV objects and etc

	// start init map and go
	zedk.map.Init(opts, "zerura.MapGo", "zerura.MapError");

	//+ library test
	//- window
	var wnd = null;
	var createWndTestFn = function(){
		if (wnd) { wnd.Close(); wnd = null; }
		var $content = $("<div>").css("padding", "10px").html("window content..");
		wnd = new zelder.ui.Window("Test window", $content, 400, 300, null, []);
	};
	var btnWnd = new zelder.ui.Button("Test window", "Success", createWndTestFn);
	btnWnd.SetStyle("width", "150px");
	btnWnd.AppendTo($(".TestoBlock"));
	//- btn
	var btnOk = new zelder.ui.Button("Test alert", "Success", zerura.SendTest);
	btnOk.SetStyle("width", "150px");
	btnOk.AppendTo($(".TestoBlock"));
	

};


/*
*	Запрос на сервер Json, с использованием Api скриптов	
*/
zerura.SendTest = function() {
	// api request
	zedk.api.Send(
		"testjson", 
		{}, 
		function(m) { alert("succ: " + m.name); }, 
		function(e) { alert("err: " + e); 
	});
};




// Error map - after map inited
zerura.MapError = function() {
 	// нет карты, и нечего делать
	return false;
};



// Start map - after map inited
zerura.MapGo = function(msg) {
 	zedk.ConsoleGreen("Map go");

	// TODO: work
	var map = zedk.map.CreateMap();


};






