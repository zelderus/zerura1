module ApplicationHelper
	
	# Returns the full title on a per-page basis.
	def full_title(page_title)
		base_title = "ZEDK"
		if page_title.empty?
			base_title
		else
			"#{base_title} | #{page_title}"
		end
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
