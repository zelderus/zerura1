module DataLayer

	#####################################################
	#													#
	#	Класс для создания запросов в базу PG			#
	#													#
	#		- шаблон запроса							#
	#			'INSERT INTO "Zeho"("Id", "Text") 		#
	#				VALUES (@num, @text);'				#
	#													#
	#		- безопасная передача параметров			#
	#			set_int ("num", 10)						#
	#			set_str ("text", "some text")			#
	#													#
	#													#
	#####################################################
	class Request

		def initialize(sql="")
			@templ = "";
			@builded = false;
			@prs = Hash.new
			set sql
		end

		#
		#	set - установка шаблона запроса
		#		'INSERT INTO "Zeho"("Id", "Text") VALUES (@num, '@text');'
		#
		def set sql
			@templ = sql;
		end

		#	
		#	set_int - передача числа в параметр
		#
		def set_int (key, num)
			if (!is_number? num) then raise "'#{num}' is not a Number"; return; end
			place_param(key, num);
		end
		#	
		#	set_str - передача строки в параметр
		#
		def set_str (key, str)
			str = str.to_s;
			str.gsub! "'", "''"
			str = "'#{str}'"
			place_param(key, str);
		end



		#
		#	to_request - непосредственно к запросу в базу
		#
		def to_request
			if (@builded) then return @templ end
			@prs.each do |key, value|
				@templ.gsub! key, value
			end
			@builded = true;
			return @templ
		end



		private
	
			# вставка нормализованного парамтера в шаблон
			def place_param (key, prm)
				if (!key.start_with?('@')) then key = "@#{key}" end
				prm = prm.to_s
				bigkey = "___!!_#{key}_!!___"	# вставка сложных ключей, на выходе будут заменены на реальные значения
				@prs[bigkey] = prm;
				@templ.gsub! key, bigkey
			end


			def is_number? str
				true if Float(str) rescue false
			end
		

	end



end
