class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception


	def add_css(cssname)
		@csss ||= []
		@csss.push(cssname)
	end

	def add_js(jsname)
		@jss ||= []
		@jss.push(jsname)
	end


end
