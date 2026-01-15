# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
#
#
#
ActiveRecord::Base.transaction do
  for i in 1..10 do
    User.create!(
      username: "user #{i}",
      email: "user.#{i}@example.com",
      password: "password",
      status: "active",
      refresh_token: SecureRandom.hex(32)
    )
  end

  user = User.first
  programming = Project.create!(
    user: user,
    name: "プログラミング",
    slug: "programming",
    goal: "期限日までにフロントエンドエンジニアとして就職する。",
    shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
    deadline: Date.today + 6.months,
    status: "active"
  )
  english = Project.create!(
    user: user,
    name: "英語",
    slug: "english",
    goal: "IELTS Over All 7.0を取得する。",
    shouldbe: "英語に浸る",
    deadline: Date.today + 6.months,
    status: "active"
  )
  private_project = Project.create!(
    user: user,
    name: "プライベート",
    slug: "private",
    goal: "長期休みに海外旅行する。",
    deadline: Date.today + 6.month,
    status: "active"
  )

  PROJECT_COUNT = 20
  for i in 1..(PROJECT_COUNT-3) do
    Project.create!(
      user: user,
      slug: "dummy-project-#{i}",
      goal: "ダミーゴール #{i}",
      name: "ダミープロジェクト #{i}",
      deadline: Date.today + i.days,
      status: "active"
    )
  end

  [programming, english, private_project].each do |project|
    milestones = []
    for i in 1..5 do
      Task.create!(
        user: user,
        project: project,
        kind: "milestone",
        title: "milestone #{i}",
        deadline: Date.today + (i * 10).days,
        status: "scheduled"
      )
    end

    if project.slug == "programming"
      for i in 1..100 do
        milestone = milestones[(i - 1) / 20]
        Task.create!(
          user: user,
          project: project,
          kind: "task",
          parent: milestone,
          title: "Task #{i}",
          deadline: Date.today + i.days,
          status: "scheduled"
        )
      end
    else 
      for i in 1..20 do
        milestone = milestones[(i - 1) / 4]
        Task.create!(
          user: user,
          project: project,
          kind: "task",
          parent: milestone,
          title: "Task #{i}",
          deadline: Date.today + i.days,
          status: "scheduled"
        )
      end
    end
  end
end

