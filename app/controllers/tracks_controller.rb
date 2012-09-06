class TracksController < ApplicationController
	# GET /tracks/:id
	def show
		path = Track.find(params[:id])[:path]
		file_begin = 0
		file_size = File.size path
		file_end = file_size - 1

	  if !request.headers["Range"]
	    status_code = "200 OK"
	  else
	    status_code = "206 Partial Content"
	    match = request.headers['Range'].match(/bytes=(\d+)-(\d*)/)
	    if match
	      file_begin = match[1]
	    end
	    response.header["Content-Range"] = "bytes " + file_begin.to_s + "-" + file_end.to_s + "/" + file_size.to_s
	  end

		response.header["Content-Length"] = (file_end.to_i - file_begin.to_i + 1).to_s
	  response.header["Cache-Control"] = "public, must-revalidate, max-age=0"
	  response.header["Pragma"] = "no-cache"
	  response.header["Accept-Ranges"]=  "bytes"
	  response.header["Content-Transfer-Encoding"] = "binary"

	  fd = open(path, "rb")
	  fd.seek(file_begin.to_i)

		send_data fd.read,
			:type => "audio/mpeg", 
			:disposition => "inline",
			:status => status_code
	end
end
