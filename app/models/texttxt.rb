class Texttxt
  
  
  attr_accessor :name, :text
  
  
  
  def get_test
    return "test"  
  end
  
  
  def get_full
    "Tob name is '#{@name}' and has text '#{@text}'"
  end
  
end