class Album < ActiveRecord::Base
  attr_accessible :artist, :title, :year, :path, :cover

  def tracks
  	Track.where({:albumid => self.id}).order("cd DESC, number ASC")
  end
end
