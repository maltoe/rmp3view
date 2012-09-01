# Crawler configuration.
Rmp3view::Application.config.crawler = {
	# Base directory.
	:basedir => "/media/data/MP3/",

	# How many top tags should be stored for each album.
	:lastfm_toptags => 12,

	# Side length of a thumbnail.
	:thumbnail_size => 150
}
