require "clients/zeho_client"

class Zeho

	def initialize()
		@deb = ""
		@client = Clients::ZehoClient.new

	end

	# отладочной информации
	def get_deb
		#@client.get_errorno		
		@deb
	end


	def get_all
		@client.get_all(method(:on_error))
	end
  


  
  private
  
	def on_error e
		@deb = e.to_s
	end


  
end

