Blog2::Application.routes.draw do
    
	get     "welcome/index"
	root    'welcome#index'


	resources :users


	resources :articles
	patch  "articles/:id/update" => "articles#update"
	post   "articles/create" => "articles#create"
	
	
	# test
	match  "do/:name(/:text)", to: "welcome#txt", as: :bot, defaults: { name: 'bote', text: 'woop' }, via: [:get, :post]
	get    "test" => "welcome#test"
	get    "testjson" => "welcome#testjson"
	get    "ss" => "welcome#ss"
  
	# redirect
	get     "boton(/:name)", to: redirect("do/%{name}"), defaults: { name: 'boton' }
  

end
