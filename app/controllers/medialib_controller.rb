class MedialibController < ApplicationController
  # GET /medialib/searchByTag?tag=rock
  # GET /medialib/searchByTag?artist=Kid%20Rock
  def search
    if params.has_key? :tag
      @albums = Album.joins("JOIN tags ON tags.albumid = albums.id").where("tags.tag" => params[:tag]).order("albums.artist ASC")
      return
    end

    if params.has_key? :keyword
      k = "%" + params[:keyword].downcase + "%"
      @albums = Album.where("lower(artist) LIKE ? OR lower(title) LIKE ?", k, k)
      return
    end

    if params.has_key? :letter
      if params[:letter] == "123"
        @albums = Album.where("upper(artist) NOT GLOB '[A-Z]*'")
      else
        l = params[:letter] + "%"
        @albums = Album.where("upper(artist) LIKE ?", l)
      end
      return
    end

    redirect_to "/404.html"
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
