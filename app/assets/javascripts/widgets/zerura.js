


this.zerura = this.zerura || {};



$(function () {

});



zerura.Init = function(opts) {
 	
	// TODO: get DIV objects and etc

	// start init map and go
	zedk.map.Init(opts, "zerura.MapGo", "zerura.MapError");
	
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






