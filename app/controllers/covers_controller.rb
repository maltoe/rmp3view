require 'base64'

class CoversController < ApplicationController
    # GET /covers/show/:id
    def show
        path = Album.find(params[:id])[:cover]

        unless path
            redirect_to "/nocover.png"
        else
            send_data open(path, "rb").read, :type => "image/jpeg", :disposition => "inline"
        end
    end

    # GET /covers/thumbnail/:id
    def thumbnail
        tn = Thumbnail.find_by_albumid params[:id]

        unless tn
            redirect_to "/nocover.png"
        else
            send_data Base64.decode64(tn.data), :type => "image/jpeg", :disposition => "inline"
        end
    end
end
