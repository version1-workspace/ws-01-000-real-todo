class CreateTags < ActiveRecord::Migration[8.0]
  def change
    create_table :tags do |t|
      t.string :uuid, null: false, index: { unique: true }, default: -> { '(uuid())' }
      t.references :user, null: false, index: true
      t.string :name, null: false
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end
end
