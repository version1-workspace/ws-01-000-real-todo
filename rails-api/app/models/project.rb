class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validates :name, presence: true
  validates :status, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :goal, presence: true

  enum :status, { initial: 0, active: 100, archived: 900 }
end
