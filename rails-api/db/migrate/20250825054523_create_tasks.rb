class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :uuid, null: false, index: { unique: true }, default: -> { '(uuid())' }
      t.references :project, null: false, index: true
      t.references :user, null: false, index: true
      t.references :parent, index: true
      t.string :kind, null: false
      t.string :title, null: false
      t.integer :status, null: false, default: 0
      t.timestamp :deadline
      t.timestamp :starting_at
      t.timestamp :started_at
      t.timestamp :finished_at
      t.timestamp :archived_at

      t.timestamps
    end
  end
end
