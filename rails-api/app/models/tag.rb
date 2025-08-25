class Tag < ApplicationRecord
  belongs_to :user
  has_many :tag_tasks, dependent: :destroy
  has_many :tasks, through: :tag_tasks

  enum :status, { disabled: 0, enabled: 100 }
end
