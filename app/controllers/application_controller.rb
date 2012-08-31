class ApplicationController < ActionController::Base
  protect_from_forgery

  # GET /
  def index
  	render "index.html.erb"
  end

  # GET /recreate
	def recreate
		if Crawler::crawl! params[:path]
			head :ok
		else
			head :bad_request
		end
	end
end
