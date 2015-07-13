class WelcomeController < ApplicationController
  
  
	def index
		#@txtob = { txt: 'uuuiii' } #new TextTxt

	end


	def txt

		# first
		@tob = Texttxt.new
		@tob.name = params[:name]
		@tob.text = params[:text]

		# link
		@tbot = Texttxt.new
		@tbot.name = 'bot'
		@tbot.text = 'yeahh'

	end


	def test
		msg = params[:msg]
		txt = Texttxt.new
		txt.name = msg
		txt.text = 'simple text'
		respond_to do |format|
			format.json { render json: { msg: txt.get_full, tob: txt } }
		end
	end

	# использваоние Json протокола и Api скриптов для обработки ответа (zerura.js метод 'zerura.SendTest')
	def testjson
		# модель для ответа
		model = Texttxt.new
		model.name = 'namaaaa'
		model.text = 'simple text'
		# ответ
		repsonse = JsonResponse.new
		repsonse.Success = true
		repsonse.Model = model #{ name: "mmmm", text: "tttt" }
		send_json repsonse
	end




	def ss
		# используемые скрипты на этой странице
		add_js("zerura")

		# db 1
		@records = [];

		# db 2 - приминение клиента с прямыми запросами в PG
		@zeh = Zeho.new
		#@zeh.insert(31, "CRAB @num CHECK!!!");
		@records2 = @zeh.get_all

	end
  
  
  
  
  
end
