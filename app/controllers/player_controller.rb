class PlayerController < ApplicationController
	def recreate
		if Crawler::crawl! params[:path]
			head :ok
		else
			head :bad_request
		end
	end
end
