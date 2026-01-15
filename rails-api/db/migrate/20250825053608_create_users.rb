class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :uuid, null: false, index: { unique: true }, default: -> { '(uuid())' }
      t.string :email, null: false, index: { unique: true }
      t.string :username, null: false
      t.string :password_digest, null: false
      t.string :refresh_token, null: false
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end
end
