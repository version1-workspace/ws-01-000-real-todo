class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :uuid, null: false, index: { unique: true }, default: -> { '(uuid())' }
      t.string :name, null: false
      t.references :user, null: false, index: true
      t.string :slug, null: false
      t.text :goal, null: false
      t.text :shouldbe
      t.timestamp :deadline, null: false
      t.timestamp :starting_at
      t.timestamp :started_at
      t.timestamp :finished_at
      t.timestamp :archived_at
      t.string :status, null: false, default: "initial"

      t.timestamps
    end
  end
end
