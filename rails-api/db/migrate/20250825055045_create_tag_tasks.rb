class CreateTagTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tag_tasks do |t|
      t.string :uuid, null: false, index: true, default: 'uuid()'
      t.references :user, null: false, index: true
      t.string :name, null: false
      t.integer :status, null: false

      t.timestamps
    end
  end
end
