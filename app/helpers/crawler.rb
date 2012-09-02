require 'RMagick'
require 'base64'

module Crawler

	#
	# This shiny little method lists the contents
	# of a given path, try to match some regexps and
	# recurse into directories ONLY if the regexps did
	# not match. In case of a match, created captures
	# will be stored in a hash and enumerated to the 
	# caller.
	#
	def self.recursive_match path, rules
		path = /(.*?)\/?$/.match(path).captures[0]

		stack = [path]
		while d = stack.shift do

			Dir.foreach(d) do |e|
				next if /^\.\.?$/ =~ e
				c = d + '/' + e

				# Try to match regexps with path in the given order.
				matched = false
				rules.each do |r|
					if m = r[:pattern].match(c)

						# Read captures into hash using the given keys.
						y = {}
						(0...m.captures.length).each do |i|
							y[r[:vars][i]] = m.captures[i]
						end
						y[:path] = c
						yield y

						matched = true
						next
					end
				end

				# Recurse into path if not matched.
				stack << c if ! matched && File.directory?(c)
			end

		end
	end

	def self.crawl!
		basedir = Rmp3view::Application.config.crawler[:basedir]
		album_rules = Rmp3view::Application.config.crawler[:album_rules]
		track_rules = Rmp3view::Application.config.crawler[:track_rules]
		cover_file = Rmp3view::Application.config.crawler[:cover_file]
		tbsize = Rmp3view::Application.config.crawler[:thumbnail_size]
		lastfm_toptags = Rmp3view::Application.config.crawler[:lastfm_toptags]

		raise "Crawler basedir is not a directory." unless File.directory? basedir

		puts "Clearing old database..."
		Album.delete_all
		Thumbnail.delete_all
		Track.delete_all
		Tag.delete_all

		# Turn off database logging.
		oldlogger = ActiveRecord::Base.logger
		ActiveRecord::Base.logger = nil

		puts "Crawling... #{basedir}"

		# Find albums.
		Crawler.recursive_match basedir, album_rules do |album|

			puts "Processing #{album[:path]}..."

			# Append cover to attribute list.
			cover = album[:path] + '/' + cover_file
			album[:cover] = cover if File.exist? cover

			# Create database record.
			album = Album.new album
			unless album.save
				puts "Error: #{album.error}"
				next
			end

			# Create thumbnail for cover.
			if album.cover
				image = Magick::Image.read(album.cover).first
				image.thumbnail! tbsize, tbsize
				data = Base64.encode64 image.to_blob
				tn = Thumbnail.new :albumid => album.id, :data => data
				unless tn.save
					puts "Error: #{tn.error}"
				end
			end

			# Load tags from last.fm
			toptags = Lastfm.album_toptags album.artist, album.title, lastfm_toptags
			toptags.each do |tag|
				t = Tag.new :albumid => album.id, :tag => tag[:tag], :number => tag[:number]
				unless t.save
					puts "Error: #{t.error}"
				end
			end

			# List tracks.
			Crawler.recursive_match album.path, track_rules do |track|

				# CD number default.
				track[:cd] = 1 unless track.has_key? :cd

				# Set albumid attribute.
				track[:albumid] = album.id

				# Store record in db.
				track = Track.new track
				unless track.save
					puts "Error: #{track.error}"
				end
			end

		end # End of album search.

		# Turn on logging again.
		ActiveRecord::Base.logger = oldlogger

	end # End of crawl!
end # End of module.
