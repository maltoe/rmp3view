require 'RMagick'
require 'taglib'
require 'find'
require 'base64'

module Crawler
	def self.crawl!
		basedir = Rmp3view::Application.config.crawler[:basedir]
		basedir += "/" unless basedir.end_with? "/"

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

		# Top-most directory is [123,A-Z].
		Dir.foreach(basedir) do |letter|
			next if letter.start_with? "."

			puts "Processing #{letter}..."

			# Below this, there are the albums, titled
			# "Artist" - "Year" - "Title"
			Dir.foreach(basedir + letter) do |albumdir|			
				next if albumdir.start_with? "."

				puts "Processing #{albumdir}..."

				fullalbumdir = basedir + letter + "/" + albumdir
				next unless File.directory? fullalbumdir

				vs = albumdir.split " - "
				case vs.length
				when 1
					title = vs[0]
				when 2
					title = vs[0]
					year = vs[1]
				when 3
					artist = vs[0]
					year = vs[1]
					title = vs[2]
				else
					artist = vs[0]
					year = vs[1]
					title = vs[2...vs.length].join(" - ")
				end

				# Album cover is in #{albumdir}/folder.jpg
				cover = fullalbumdir + "/folder.jpg"
				cover = nil unless File.exist? cover

				# Convert year to integer.
				begin
					iyear = Integer(year) if year
				rescue ArgumentError
					puts "Error while processing #{albumdir}: #{year} is not the year."
					next
				end

				record = Album.new :artist => artist, :title => title, :year => iyear, :cover => cover

				unless record.save
					puts "Error while processing #{albumdir}: #{record.error}"
					next
				end

				# Create thumbnail for cover.
				if cover
					tbsize = Rmp3view::Application.config.crawler[:thumbnail_size]
					image = Magick::Image.read(cover).first
					image.thumbnail! tbsize, tbsize
					data = Base64.encode64(image.to_blob)
					tn = Thumbnail.new :albumid => record.id, :data => data
					unless tn.save
						puts "Error while saving thumbnail to database for #{albumdir}: #{tn.error}"
					end
				end

				# Load tags from last.fm
				toptags = Lastfm.album_toptags artist, title, Rmp3view::Application.config.crawler[:lastfm_toptags]
				toptags.each do |tag|
					t = Tag.new :albumid => record.id, :tag => tag[:tag], :number => tag[:number]
					unless t.save
						puts "Error while saving toptags for #{albumdir}: #{t.error}"
						break
					end
				end

				# In the album folder, files are called like "01" - "Interpret" - "Title".mp3.
				# Yet sometimes, they are also stored in subdirectories "CD1", "CD2" and the like.
				# Thus, we use Find here to recursivly look for mp3 files.
				Find.find(fullalbumdir) do |path|
					p = /\/([^\/]*)\.[mp3|ogg]\Z/.match path
					next unless p

					# Extract track information.
					# Assuming a[0] is the track number, but maybe also a[1].
					begin
						begin
						a = p.captures[0].split(" - ")
					rescue NoMethodError
						puts p
						puts p.captures
					end
						if /[\d][\d]/ =~ a[0] 
							number = Integer a[0], 10
							artist = a[1]
						else
							number = Integer a[1], 10
							artist = a[0]
						end
						title = a[2...a.length].join(" - ")
					rescue ArgumentError
						# Track number conversion failed.
						puts "Invalid track name: #{p.captures[0]}"
					end

					# Grep CD number from path.
					p = /\/CD\s?([0-9]+)\//.match path
					cd = p.nil? ? 1 : p.captures[0]

					track = Track.new :albumid => record.id, 
						:title => title,
						:artist => artist,
						:number => track,
						:cd => 1,
						:path => path
					unless track.save
						puts "Error while saving track to database for #{albumdir}: #{track.error}"
					end

				end # End of File loop.
			end # End of Album dir loop.
		end # End Letter dir loop.

		# Turn on logging again.
		ActiveRecord::Base.logger = oldlogger

		true
	end # End of crawl!
end # End of module.
