class Playlist < ActiveRecord::Base
	self.table_name = 'playlist'
	acts_as_list
  attr_accessible :albumid, :position
end
