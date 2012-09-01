require 'httparty'

module Lastfm
	def self.album_toptags artist, album, limit
		options = { :query =>
			{
				"artist" => artist,
				"album" => album,
				"api_key" => Rmp3view::Application.config.lastfm_key,
				"autocorrect" => "1"
			}
		}

		begin
			response = HTTParty.get('http://ws.audioscrobbler.com/2.0/?method=album.gettoptags', options)
		rescue Timeout::Error
			puts "Timeout error while fetching lastfm tags for #{artist} - #{album}!"
			return []
		end

		res = []
		if response["lfm"]["status"] == "ok" &&	response["lfm"]["toptags"]["tag"]
			count = 0
			tags = response["lfm"]["toptags"]["tag"]
			tags = [tags] if tags.class == Hash
			tags.each do |tag|
				res << { :tag => tag["name"], :number => tag["count"] }
				count += 1
				break if count == limit
			end
		end

		res
	end
end