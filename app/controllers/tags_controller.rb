class TagsController < ApplicationController
	def toptags
		@tags = Tag.all(:select => 'tag, sum(number) as number', 
										:having => 'sum(number) >= 1000', 
										:group => :tag, 
										:order => "sum(number) DESC")
		render json: @tags
	end
end