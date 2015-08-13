
class BaseController < ActionController::Base


	# в модель для отладки
	def to_d model
		@debug_text = ""
		@debug_model = nil;
		if (model.nil?) then @debug_text = 'NULL OBJECT' end
		hash = "" 
		hash += to_d_object(hash, model, 0)
		@debug_model = hash.html_safe
	end
	



	private

		def to_d_object builder, model, depth
			depth = depth + 1
			bld = ''
			bld += "<div class='debug-line d-line-#{depth}'>"
			if model.is_a? Hash
				model.sort.each {|key, value|
					bld += "<p><span class='d-line-title'>" +key.to_s+ '</span><span> = </span>';
					vlhasob = value.is_a? Hash
					bld += (if (vlhasob) then to_d_object(bld, value, depth) else value.to_s end);
					bld += '</p>';
				}
			else
				model.instance_variables.sort!.each {|var| 
					vl = model.instance_variable_get(var)
					vlhasob = vl.is_a? Hash
					bld += '<p>(' +vl.class.to_s+ ') (' +vl.object_id.to_s+ ") <span class='d-line-title'>" +var.to_s.delete("@")+ '</span><span> = </span>';
					bld += (if (vlhasob) then to_d_object(bld, vl, depth) else vl.to_s end);
					bld += '</p>';
				}
			end
			bld += "</div>"
			bld
		end

end