class Zeho #< ActiveRecord::Base
  #self.abstract_class = true
  #self.table_name = "Zeho"
  
  #establish_connection "some_raw_data".to_s
  
  
  def self.get_all
    # all postgresql queries will be normalized to lower case, so to quote Table and Column names
    # http://stackoverflow.com/questions/10628917/rails-reports-cant-find-a-column-that-is-there
    sql = 'SELECT * from "Zeho"'
    dts = []
    conn = nil
    
    begin
      connHash = ActiveRecord::Base.configurations['some_raw_data']
      # Connection
      conn = PG::Connection.new(
            connHash['host'], 
            connHash['port'], 
            nil, 
            nil, 
            connHash['database'], 
            connHash['username'], 
            connHash['password'])

      
      # Request
      #sql = 'SELECT 1 as "Id", 'uiiiiyyyy' as "Text"'
      res  = conn.exec(sql)
      
      # PG response (http://www.rubydoc.info/gems/pg/PG/Result#values-instance_method)
      dts = res#.values
    rescue
      # Handle error
      
    ensure
      # Close
      conn.finish unless conn == nil || conn.finished?
    end
    
    # to model
    dts = dts.map {|r| { 'Id' => r['Id'], 'Text' => r['Text'] } }
    dts
  end
  
  
  private
  
    def self.raw (sql)
      set_connection
      results = @conn.execute(sql)
      drop_connection
      results
    end
  
    def self.set_connection
      #@conn = ActiveRecord::Base.establish_connection("some_raw_data")
      #cui = Class::new(ActiveRecord::Base)
      #@conn = cui.establish_connection("some_raw_data").connection
      
      @conn = self.connection
      
      @conn
    end
    
    
    def self.drop_connection
      #ActiveRecord::Base.establish_connection(Rails.env) # reset connection
    end
  
end

