class Task < ApplicationRecord
  belongs_to :user

  validates :kind, presence: true
  validates :title, presence: true
  validates :status, presence: true

  enum :kind, { task: 0, milestone: 100 }
  enum :status, { initial: 0, scheduled: 100, completed: 200, archived: 900 }
end
