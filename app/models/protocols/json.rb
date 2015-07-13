

#
#	JsonResponse
#
class JsonResponse

	attr_accessor :JsonZedk, :Success, :Model, :Message

	def initialize()
		@JsonZedk = true
		@Success = false
		@Model = {}
		@Message = "json error"
	end

end
