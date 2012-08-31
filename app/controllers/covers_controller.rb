require 'base64'

class CoversController < ApplicationController
    def show
        path = Album.find(params[:id])[:cover]

        unless path
            redirect_to "/nocover.jpg"
        else
            send_data open(path, "rb").read, :type => "image/jpeg", :disposition => "inline"
        end
    end

    def thumbnail
        tn = Thumbnail.find_by_albumid params[:id]

        unless tn
            redirect_to "/nocover.jpg"
        else
            send_data Base64.decode64(tn.data), :type => "image/jpeg", :disposition => "inline"
        end
    end

=begin
    render :text => @tn.data
	private

	def to_imgsrc data
		"data:image/jpeg;base64," + data
	end

=end
end