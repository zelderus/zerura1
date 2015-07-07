require "clients/zeho_client"

class Zeho

	def initialize()
		@deb = ""
		@client = Clients::ZehoClient.new

	end

	# отладочная информация
	def get_deb
		#@client.get_errorno		
		@deb
	end


	def get_all
		@client.get_all(method(:on_error))	# передача метода, как аргумент
	end
  


  
  private

  	# метод при ошибке запросов
	def on_error e
		@deb = e.to_s
	end


  
end

