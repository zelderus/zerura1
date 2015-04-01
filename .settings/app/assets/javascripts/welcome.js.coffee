# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/



#
# Запуск при загрузке страницы
# учитываем Terbolinks. По старинке было бы "$(document).ready"
#
$(document).on "page:change", -> (

	$(".jsgo_btn").on("click", () ->  GoGo("wooo"));
	#console.log("coffee sucks");
)





GoGo = (txt) ->
	dataSend = { msg: txt }
	
	$.ajax
		url: "/test",
		data: dataSend
		error: (x,m,e) ->
  	  		console.log("error #{m}");
		success: (jo) ->
			Sucu(jo.tob);

	false



JopaLot = (txt) ->
	console.log("jopa #{txt}")
	console.log("Im");
	console.log("big body");
	console.log("fn..");

  	
Sucu = (tob) ->
 	console.log(tob.name);
