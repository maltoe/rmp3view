class TracksController < ApplicationController
	# GET /tracks/:id
	def show
		path = Track.find(params[:id])[:path]
		send_data open(path, "rb").read, :type => "audio/mpeg", :disposition => "inline"
	end
end
