class Zeho #< ActiveRecord::Base
  
	# установка отладочной информации (будет выведена в разметке)
	def set_deb txt
		@deb = txt
	end
	def get_deb
		@deb
	end


	def get_all
		sql = 'SELECT * from "Zeho"'
		dts = raw_sql('some_raw_data', sql, :on_error )
		# to model
		dts = dts.map {|r| { 'Id' => r['Id'], 'Text' => r['Text'] } }
		dts
	end
  

	def on_error e
		set_deb(e.to_s)
	end
  
  private
  
	# raw sql request
	def raw_sql (connString, sql, onErrorFn)
		# all postgresql queries will be normalized to lower case, so to quote Table and Column names
		# http://stackoverflow.com/questions/10628917/rails-reports-cant-find-a-column-that-is-there
		# like 'SELECT * from "Zeho"' not 'SELECT * from Zeho'
		dts = []
		con = nil
		begin
			conn = set_connection connString
			res  = exec_connection(conn, sql)
			dts = res#.values # PG response (http://www.rubydoc.info/gems/pg/PG/Result#values-instance_method)
		rescue Exception => e
			# Handle error
			if (!onErrorFn.nil?) then send(onErrorFn, e) end
		ensure
			close_connection conn
		end
		dts
	end
  
	# set connection
	def set_connection (connectionName)
		connHash = ActiveRecord::Base.configurations[connectionName]
		conn = PG::Connection.new(
			connHash['host'], 
			connHash['port'], 
			nil, 
			nil, 
			connHash['database'], 
			connHash['username'], 
			connHash['password']);
		conn
	end

	#close connection
	def close_connection (conn)
		conn.finish unless conn == nil || conn.finished?
	end

	# sql
	def exec_connection (conn, sql)
		res = conn.exec(sql)
		res
	end


   
  
end

