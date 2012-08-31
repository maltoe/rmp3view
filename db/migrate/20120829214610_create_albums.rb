class CreateAlbums < ActiveRecord::Migration
  def change
    create_table :albums do |t|
      t.string  :artist
      t.string  :title
      t.integer :year
      t.string  :path
      t.string  :cover
      
      t.timestamps
    end
  end
end
