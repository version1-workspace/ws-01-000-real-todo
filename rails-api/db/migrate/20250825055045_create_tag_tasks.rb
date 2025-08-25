class CreateTagTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tag_tasks do |t|
      t.string :uuid, null: false, index: { unique: true }, default: -> { '(uuid())' }
      t.references :tag, null: false, index: true
      t.references :task, null: false, index: true

      t.timestamps
    end
  end
end
