class WelcomeController < ApplicationController
  
  def index
    #@txtob = { txt: 'uuuiii' } #new TextTxt
    
  end
  
  
  def txt
    @t = params[:txt]
    
  end
  
  
end
