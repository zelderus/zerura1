module DataLayer

	class BaseClient

		# текущая ошибка
		def get_errorno
			@deb
		end
		# установка отладочной информации
		def set_errorno txt
			@deb = txt
		end


		#
		# Прямой запрос в базу
		#
		#	connString	- название раздела из database.yml с настройками подключения к базе
		#	sql			- sql запрос (названия полей и таблиц обернуты в кавычки)
		#	onError		- ссылка на метод принимающий Exception (пример, method(:on_error))
		#
		def raw_sql (connString, sql, onError=nil)
			# all postgresql queries will be normalized to lower case, so to quote Table and Column names
			# http://stackoverflow.com/questions/10628917/rails-reports-cant-find-a-column-that-is-there
			# like 'SELECT * from "Zeho"' not 'SELECT * from Zeho'
			dts = []
			con = nil
			set_errorno ""
			begin
				conn = set_connection connString
				res  = exec_connection(conn, sql)
				dts = res#.values # PG response (http://www.rubydoc.info/gems/pg/PG/Result#values-instance_method)
			rescue Exception => e
				if (!onError.nil?) then onError.call(e) end
				on_error(e)
			ensure
				close_connection conn
			end
			dts
		end
	  

		#
		def test(onError=nil)
			sql = 'SELECT TOP 10 * from "Zeho"'
			dts = raw_sql('some_raw_data', sql, onError)
			dts = dts.map {|r| { 'Id' => r['Id'], 'Text' => r['Text'] } }
			dts
		end



	  private
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

		# ошибка по умолчанию
		def on_error (e)
			set_errorno(e.to_s)
		end
	end


end

