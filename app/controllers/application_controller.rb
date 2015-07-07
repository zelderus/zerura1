class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception


	def add_css(cssname, isExcplicitLink=false)
		@csss ||= []
		cssname = cssname.downcase
		if (!isExcplicitLink && !cssname.start_with?("widgets/")) then cssname = 'widgets/' + cssname end
		if (@csss.include?(cssname)) then return end
		@csss.push(cssname)
	end

	def add_js(jsname, isExcplicitLink=false)
		@jss ||= []
		jsname = jsname.downcase
		if (!isExcplicitLink && !jsname.start_with?("widgets/")) then jsname = 'widgets/' + jsname end
		if (@jss.include?(jsname)) then return end
		@jss.push(jsname)
	end


end
