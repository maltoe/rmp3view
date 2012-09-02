class MedialibController < ApplicationController
  # GET /medialib/searchByTag?tag=rock
  # GET /medialib/searchByTag?artist=Kid%20Rock
  def search
    if params.has_key? :tag
      @albums = Album.joins("JOIN tags ON tags.albumid = albums.id").where("tags.tag" => params[:tag])
    else
      if params.has_key? :keyword
        k = "%" + params[:keyword] + "%"
        @albums = Album.where("artist LIKE ? OR title LIKE ?", k, k)
      else
        redirect_to "/404.html"
      end
    end
  end

  # GET /medialib/random?limit=50
  def random
    @albums = Album.order("RANDOM()").limit(params[:limit])
  end

  # GET /medialib/toptags
  def toptags
    @toptags = Tag.all(:select => 'tag, sum(number) as number', 
      :having => 'sum(number) >= 1000', 
      :group => :tag, 
      :order => "sum(number) DESC")
    #render :json => toptags
  end
end
