class AlbumsController < ApplicationController
  # GET /albums
  # GET /albums.json
  def index
    @albums = Album.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @albums }
    end
  end

  # GET /albums/1
  # GET /albums/1.json
  def show
    @album = Album.find params[:id]
    @tracks = Track.where :albumid => params[:id]
  end

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

  def random
    @albums = Album.order("RANDOM()").limit(params[:limit])
    puts @albums
    render :albumlist, :layout => false
  end

=begin
  # GET /scummies/new
  # GET /scummies/new.json
  def new
    @scummy = Scummy.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @scummy }
    end
  end

  # GET /scummies/1/edit
  def edit
    @scummy = Scummy.find(params[:id])
  end

  # POST /scummies
  # POST /scummies.json
  def create
    @scummy = Scummy.new(params[:scummy])

    respond_to do |format|
      if @scummy.save
        format.html { redirect_to @scummy, notice: 'Scummy was successfully created.' }
        format.json { render json: @scummy, status: :created, location: @scummy }
      else
        format.html { render action: "new" }
        format.json { render json: @scummy.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /scummies/1
  # PUT /scummies/1.json
  def update
    @scummy = Scummy.find(params[:id])

    respond_to do |format|
      if @scummy.update_attributes(params[:scummy])
        format.html { redirect_to @scummy, notice: 'Scummy was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @scummy.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /scummies/1
  # DELETE /scummies/1.json
  def destroy
    @scummy = Scummy.find(params[:id])
    @scummy.destroy

    respond_to do |format|
      format.html { redirect_to scummies_url }
      format.json { head :no_content }
    end
  end
=end

end
