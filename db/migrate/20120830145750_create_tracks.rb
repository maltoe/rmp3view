class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.integer :albumid
      t.string :title
      t.string :artist
      t.integer :number
      t.integer :cd
      t.string :path

      t.timestamps
    end
  end
end
