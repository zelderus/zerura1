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
    # db 1
    sql = "Select * from testo"
    #conn = ActiveRecord::Base.establish_connection(Rails.env)
    @records = ActiveRecord::Base.connection.execute(sql)
    
    # db 2
    #zeho = Zeho.new
    #@records2 = zeho.get_all
    @records2 = Zeho.get_all
    

  end
  
  
  
  
  
end
