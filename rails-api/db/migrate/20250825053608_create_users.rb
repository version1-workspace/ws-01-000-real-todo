class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :uuid, null: false, index: true, default: 'uuid()'
      t.string :email, null: false, index: { unique: true }
      t.string :username, null: false
      t.string :password, null: false
      t.string :refresh_token, null: false
      t.string :status, null: false

      t.timestamps
    end
  end
end
