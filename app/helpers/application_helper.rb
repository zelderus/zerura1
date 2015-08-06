module ApplicationHelper
	
	# Returns the full title on a per-page basis.
	def full_title()
		base_title = "ZEDK"
		if (@maintitle.nil? || @maintitle.empty?)
			base_title
		else
			"#{base_title}. #{@maintitle}"
		end
	end
	# headers
	def get_headers
		html = "";
		if (!@keyword.nil? && !@keyword.empty?) then html += "<meta content='#{@keyword}' name='keywords' />" end
		if (!@desc.nil? && !@desc.empty?) then html += "<meta content='#{@desc}' name='description' />" end
		
		return html.html_safe
	end


	def get_csss
		if (@csss.nil?) then return end
		@csss.each do |css|
			yield css
		end
	end

	def get_jss
		if (@jss.nil?) then return end
		@jss.each do |js|
			#yield javascript_include_tag(js)
			yield js
		end
	end




  
end
