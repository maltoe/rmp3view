class ApplicationController < ActionController::Base
  protect_from_forgery

  # GET /
  def index
  end

  # GET /recreate
	def recreate
		Crawler::crawl!
		head :ok
	end
end
