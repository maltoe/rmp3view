class AlbumsController < ApplicationController
  # GET /albums/searchByTag?tag=rock
  def search_by_tag
    @albums = Album.joins("JOIN tags ON tags.albumid = albums.id").where("tags.tag" => params[:tag])
    render :albumlist, :layout => false
  end

  # GET /albums/searchByTag?artist=Kid%20Rock
  def search_by_artist
    @albums = Album.where "artist LIKE '%#{params[:artist]}%'"
    render :albumlist, :layout => false
  end

  # GET /albums/random?limit=50
  def random
    @albums = Album.order("RANDOM()").limit(params[:limit])
    puts @albums
    render :albumlist, :layout => false
  end
end
