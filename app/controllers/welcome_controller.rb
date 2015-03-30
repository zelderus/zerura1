class WelcomeController < ApplicationController
  
  def index
    #@txtob = { txt: 'uuuiii' } #new TextTxt
    
  end
  
  
  def txt
    @t = params[:txt]
    
  end
  
  
  def test
    msg = params[:msg]
    
    txt = Texttxt.new
    txt.name = msg
    txt.text = "simple text"
   
    respond_to do |format|
      format.json { render json: { msg: txt.get_full, tob: txt } }
    end
  end
  
  
end
