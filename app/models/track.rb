class Track < ActiveRecord::Base
  attr_accessible :albumid, :artist, :cd, :number, :path, :title
end
