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
  
  
end
