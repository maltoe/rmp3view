class CreateThumbnails < ActiveRecord::Migration
  def change
    create_table :thumbnails do |t|
      t.integer :albumid
      t.string :data

      t.timestamps
    end
  end
end
