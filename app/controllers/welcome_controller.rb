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
  
  
  
  def ss
	# используемые скрипты на этой странице
	add_js("zerura")

    # db 1
    #sql = "Select * from testo"
    ##conn = ActiveRecord::Base.establish_connection(Rails.env)
    #@records = ActiveRecord::Base.connection.execute(sql)
	@records = [];
    
    # db 2 - приминение клиента с прямыми запросами в PG
	@zeh = Zeho.new

	#@zeh.insert(28, "CRAB @num CHECK!!!");

    @records2 = @zeh.get_all
    

  end
  
  
  
  
  
end
