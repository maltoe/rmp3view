class Playlist < ActiveRecord::Base
	self.table_name = 'playlist'
	acts_as_list
  attr_accessible :albumid, :position

  def album
  	Album.find self.albumid
  end
end
