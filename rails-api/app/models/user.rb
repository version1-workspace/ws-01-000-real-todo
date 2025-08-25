class User < ApplicationRecord
  has_secure_password

  has_many :tasks, dependent: :destroy
  has_many :projects, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :username, presence: true
  validates :password, presence: true
  validates :refresh_token, presence: true

  enum :status, { active: 0, deactive: 900 }
end
