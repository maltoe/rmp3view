class PlaylistController < ApplicationController
	# GET /playlist
	def index
		@playlist_items = Playlist.all
	end

	# GET /playlist/add?albumid=10
	def add
		@item = Playlist.new :albumid => params[:albumid]
		@item.save
	end

	# GET /playlist/delete
	def delete
		Playlist.delete_all
	end
end
