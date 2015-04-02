Blog2::Application.routes.draw do
    
  get     "welcome/index"
  root    'welcome#index'


  resources :users


	resources :articles
	patch  "articles/:id/update" => "articles#update"
	post   "articles/create" => "articles#create"
	
	
	# test
	match  "do/:name(/:text)" => "welcome#txt", as: :bot, defaults: { name: 'bot', text: 'woop' }, via: [:get, :post]
  get    "test" => "welcome#test"
  
  # redirect
  get     "boton(/:name)", to: redirect("do/%{name}"), defaults: { name: 'boton' }
  

end
