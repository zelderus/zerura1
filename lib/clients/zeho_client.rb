require "datalayer/baseclient"

module Clients


	class ZehoClient < DataLayer::BaseClient



		def get_all(onError=nil)
			sql = 'SELECT z.* from "Zeho" z ORDER BY z."Text" asc'
			dts = raw_sql('some_raw_data', sql, onError)
			dts = dts.map {|r| { 'Id' => r['Id'], 'Text' => r['Text'] } }
			dts
		end


	end



end
