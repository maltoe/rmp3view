class PlaylistController < ApplicationController
	# GET /playlist
	def index
		@playlist_items = Playlist.all
		render :add
	end

	# GET /playlist/add?albumid=10
	def add
		item = Playlist.new :albumid => params[:albumid]
		item.save
		@playlist_items = [item]
	end

	# GET /playlist/delete
	# GET /playlist/delete?position=1
	def delete
		if params[:position]
			item = Playlist.where(params[:position])[0] 
			item.remove_from_list
			item.delete
			@position = params[:position]
		else
			Playlist.delete_all
		end
	end
end
