class PlaylistController < ApplicationController
	# GET /playlist
	def index
		@playlist_items = Playlist.all
		puts "HIIIER"
	end

	# GET /playlist/add?albumid=10
	def add
		puts "Adding #{params[:albumid]}"
		puts Playlist.methods
		pi = Playlist.new :albumid => params[:albumid]
		unless pi.save
			puts "ERRRRORR"
		end
	end
end
