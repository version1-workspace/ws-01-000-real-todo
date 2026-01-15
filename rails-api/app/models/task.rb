class Task < ApplicationRecord
  belongs_to :user
  belongs_to :project
  belongs_to :parent, class_name: "Task", optional: true

  has_many :tasks, class_name: "Task", foreign_key: "parent_id", dependent: :nullify

  has_many :tag_tasks, dependent: :destroy
  has_many :tags, through: :tag_tasks

  validates :kind, presence: true
  validates :title, presence: true
  validates :status, presence: true

  enum :kind, { task: 0, milestone: 100 }
  enum :status, { initial: 0, scheduled: 100, completed: 200, archived: 900 }
end
