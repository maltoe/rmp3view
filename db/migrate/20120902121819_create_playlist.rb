class CreatePlaylist < ActiveRecord::Migration
  def change
    create_table :playlist do |t|
      t.integer :albumid
      t.integer :position
      
      t.timestamps
    end
  end
end
