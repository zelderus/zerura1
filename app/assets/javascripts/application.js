// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
///////###  require jquery
///////###  require jquery_ujs
///////###  require turbolinks
///////### require_tree .

//= require_directory .



this.zerura = this.zerura || {};



$(function () {

    //console.log("started");
		//$(".jsgo_btn").on("click", function() { zerura.GoGo("wooo"); } );
		

});



zerura.GoGo = function(txt) {
	var dataSend = { msg: txt };
	
	$.ajax({
		url: "/test",
		data: dataSend,
		success: function(jo){ 
			zerura.Sucu(jo.tob);
		},
	  	error: function(x,m,e){ 
	  		console.log("error " + m);
	  	}
	});
	
	return false;
};




zerura.Sucu = function(tob) {
 	console.log(tob.name);
};


