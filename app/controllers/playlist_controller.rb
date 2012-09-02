class PlaylistController < ApplicationController
	# GET /playlist
	def index
		@playlist_items = Playlist.all
	end

	# GET /playlist/add?albumid=10
	def add
		pi = Playlist.new :albumid => params[:albumid]
		unless pi.save
			puts "ERRRRORR"
		end
	end
end
