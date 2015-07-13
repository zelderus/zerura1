require "datalayer/baseclient"

module Clients


	class ZehoClient < DataLayer::BaseClient

		def initialize()
			init('some_raw_data');
		end


		def get_all(onError=nil)
			sql = 'SELECT z.* from "Zeho" z ORDER BY z."Text" asc'
			dts = raw_sql(sql, onError)
			dts = dts.map {|r| { 'Id' => r['Id'], 'Text' => r['Text'] } }
			dts
		end


		def insert(num, text, onError=nil)
			sql = 'INSERT INTO "Zeho"("Id", "Text") VALUES (@num, @text);'
			req = DataLayer::Request.new	# безопасная передача параметров
			req.set sql
			req.set_str("text", text)			
			req.set_int("num", num)

			dts = raw_sql(req, onError)
			dts = dts.map {|r| { 'Id' => r['Id'], 'Text' => r['Text'] } }
			dts
		end


	end



end
