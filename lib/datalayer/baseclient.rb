require "datalayer/request"

module DataLayer

	#####################################################
	#													#
	#	Базовый класс, для прямых запросов в базу PG	#
	#		- 	как правило его наследуют				#
	#			для разделения бизнес логики			#
	#			со своими моделями						#
	#		- 	основной метод: raw_sql					#
	#		-	метод test() как пример реализации		#
	#													#
	#####################################################
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
		# Инициализация клиента
		# 	connString	- название раздела из database.yml с настройками подключения к базе
		# 
		def init (connString)
			@connData = init_connection connString

		end

		#
		# Прямой запрос в базу (с открытием и закрытием соединения)
		#
		#	sql			- sql запрос (названия полей и таблиц обернуты в кавычки)
		#	onError		- ссылка на метод принимающий Exception (пример, method(:on_error))
		#
		def raw_sql (sql, onError=nil)
			# all postgresql queries will be normalized to lower case, so to quote Table and Column names
			# http://stackoverflow.com/questions/10628917/rails-reports-cant-find-a-column-that-is-there
			# like 'SELECT * from "Zeho"' not 'SELECT * from Zeho'
			dts = []
			con = nil
			set_errorno ""
			begin
				conn = set_connection @connData
				res  = exec(conn, sql)
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
		#	get - создает соединение к базе
		#	
		def get
			set_connection @connData
		end
		#
		#	close - закрывает соединение к базе
		#	
		def close conn
			close_connection conn
		end
		#
		#	exec - выполнение запроса к базе
		#		необходимо обернуть в begin,rescue,ensure (открытие соединения, запрос, закрытие соединения)
		#	
		def exec (conn, sql)
			request = "";
			if (sql.is_a? DataLayer::Request) then request = sql.to_request else request = sql end
			res  = exec_connection(conn, request)
			return res
		end



	  

		#
		#	test
		#		пример метода из наследуемого класса,
		#		получение данных, обработка ошибки, привод к своей модели
		#
		def test()
			connstr = "some_raw_data"	# название раздела из конфига database.yml
			sql = 'SELECT TOP 10 * from "Zeho"'
			dts = raw_sql(connstr, sql, method(:on_error))
			# to model
			dts = dts.map {|r| { 'Id' => r['Id'], 'Text' => r['Text'] } }
			dts
		end



	  private
		# init connection
		def init_connection (connectionName)
			connHash = ActiveRecord::Base.configurations[connectionName]
			connData = Hash.new
			if (connHash.nil?) then raise "Error connection string '#{connectionName}'"; return connData; end
			
			connData['host'] 		= connHash['host']
			connData['port'] 		= connHash['port']
			connData['database'] 	= connHash['database']
			connData['username'] 	= connHash['username']
			connData['password'] 	= connHash['password']
			connData
		end
		# set connection
		def set_connection (connectionData)
			conn = PG::Connection.new(
				connectionData['host'], 
				connectionData['port'], 
				nil, 
				nil, 
				connectionData['database'], 
				connectionData['username'], 
				connectionData['password']);
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

