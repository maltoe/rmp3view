# Crawler configuration.
Rmp3view::Application.config.crawler = {
	# Base directory.
	:basedir => "/media/data/MP3/",

	# How many top tags should be stored for each album.
	:lastfm_toptags => 12,

	# Side length of a thumbnail.
	:thumbnail_size => 150,

	# File name of the cover image (contained in the album directory).
	:cover_file => "folder.jpg",

	# 
	# Rules for file based album discovery.
	#
	# For example, my albums are usually stored like this:
	# /P/Pornophonique - 2007 - 8-Bit Lagerfeuer/01 - pornophonique - sad robot.mp3
	# Yet sometimes, there is a /CD1/ or /CD2/ in between the album and the track.
	# The following rules will recognize these things and associate names to the
	# embedded captures.
	#
	# Be sure to place most probable regular expressions first.
	#

	:album_rules => [
		{ :pattern => /(?:[A-Z]|(?:123))\/([^\/]*?) - (\d\d\d\d) - ([^\/]*)$/, :vars => [:artist, :year, :title] },
		{ :pattern => /(?:[A-Z]|(?:123))\/([^\/]*?) - (\d\d\d\d)$/, :vars => [:title, :year] }
	],

	:track_rules => [
		{ :pattern => /\/(\d\d) - ([^\/]*?) - ([^\/]*)\.(?:ogg|mp3)$/, :vars => [:number, :artist, :title] },
		{ :pattern => /\/CD ?(\d)\/([^\/]*?) - (\d\d) - ([^\/]*)\.(?:ogg|mp3)$/, :vars => [:cd, :artist, :number, :title] },
		{ :pattern => /\/CD ?(\d)\/(\d\d) - ([^\/]*?) - ([^\/]*)\.(?:ogg|mp3)$/, :vars => [:cd, :number, :artist, :title] },
		{ :pattern => /\/([^\/]*?) - (\d\d) - ([^\/]*)\.(?:ogg|mp3)$/, :vars => [:artist, :number, :title] }
	]
}
