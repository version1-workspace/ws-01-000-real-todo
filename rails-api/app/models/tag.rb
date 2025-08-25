class Tag < ApplicationRecord
  belongs_to :user
  validates :name, presence: true, uniqueness: true

  enum :status, { disabled: 0, enabled: 100 }
end
