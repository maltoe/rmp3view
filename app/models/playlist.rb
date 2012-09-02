class Playlist < ActiveRecord::Base
	set_table_name 'playlist'
	acts_as_list
  attr_accessible :albumid, :position
end
