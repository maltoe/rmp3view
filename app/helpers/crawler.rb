require 'RMagick'
require 'base64'

module Crawler

	def self.recreate!
		@@sc ||= StagedCrawler.new
		@@sc.recreate!
	end

	class StagedCrawler
		def initialize
			@current_phase = :idle
		end

		def recreate! 
			# Turn off database logging.
			oldlogger = ActiveRecord::Base.logger
			ActiveRecord::Base.logger = nil
			
			case @current_phase
			when :idle
				clear!
				@current_phase = :cleared
				retval = { message: "Deleted database contents.", :done => false }
			when :cleared
				count = crawl!
				@current_phase = :crawled
				retval =  { message: "Found #{count} albums.", :done => false }
			when :crawled
				thumbnail!
				@current_phase = :thumbnailed
				retval =  { message: "Created thumbnails for album covers.", :done => false }
			when :thumbnailed
				tag!
				@current_phase = :tagged
				retval =  { message: "Loaded album tags from Last.FM.", :done => false }
			when :tagged
				tracks!
				@current_phase = :idle
				retval =  { message: "Retrieved track information from albums.", :done => true }
			end

			# Turn on logging again.
			ActiveRecord::Base.logger = oldlogger

			retval
		end

		private

		def clear!
			puts "Clearing old database..."
			Album.delete_all
			Thumbnail.delete_all
			Track.delete_all
			Tag.delete_all
			Playlist.delete_all
		end

		def crawl!
			basedir = Rmp3view::Application.config.crawler[:basedir]
			album_rules = Rmp3view::Application.config.crawler[:album_rules]
			cover_file = Rmp3view::Application.config.crawler[:cover_file]
			count = 0

			puts "Crawling #{basedir} for albums..."
			recursive_match basedir, album_rules do |album|
				# Append cover to attribute list.
				cover = album[:path] + '/' + cover_file
				album[:cover] = cover if File.exist? cover

				# Create database record.
				album = Album.new album
				unless album.save
					puts "Error: #{album.error}"
				else
					count += 1
				end
			end

			count
		end

		def thumbnail!
			tbsize = Rmp3view::Application.config.crawler[:thumbnail_size]

			puts "Creating thumbnails for covers..."
			Album.all.each do |album|
				if album.cover
					image = Magick::Image.read(album.cover).first
					image.thumbnail! tbsize, tbsize
					data = Base64.encode64 image.to_blob
					tn = Thumbnail.new :albumid => album.id, :data => data
					unless tn.save
						puts "Error: #{tn.error}"
					end
				end
			end
		end

		def tag!
			puts "Loading album tags from Last.FM..."
			failures = tag_helper Album.all

			puts "Failed to load tags for several albums. Retrying now..."
			failures = tag_helper failures

			puts "Could not load tags for:"
			failures.each { |album|	puts "#{album.artist} - #{album.title}" }
		end

		def tag_helper albums
			lastfm_toptags = Rmp3view::Application.config.crawler[:lastfm_toptags]			
			failures = []
			albums.each do |album|
				begin
					toptags = Lastfm.album_toptags album.artist, album.title, lastfm_toptags
					toptags.each do |tag|
						t = Tag.new :albumid => album.id, :tag => tag[:tag], :number => tag[:number]
						unless t.save
							puts "Error: #{t.error}"
						end
					end
				rescue LastFmError => err
					puts err
					failures << album
				end
			end

			failures
		end

		def tracks!
			track_rules = Rmp3view::Application.config.crawler[:track_rules]

			puts "Retrieving track information from albums..."
			Album.all.each do |album|
				recursive_match album.path, track_rules do |track|

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
			end
		end

		#
		# This shiny little method lists the contents
		# of a given path, try to match some regexps and
		# recurse into directories ONLY if the regexps did
		# not match. In case of a match, created captures
		# will be stored in a hash and enumerated to the 
		# caller.
		#
		def recursive_match path, rules
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

	end # End of StagedCrawler.

end # End of Crawler.
