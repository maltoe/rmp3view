class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.integer :albumid
      t.string :tag
      t.integer :number

      t.timestamps
    end
  end
end
