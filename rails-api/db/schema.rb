# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_25_055045) do
  create_table "projects", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "uuid", default: -> { "(uuid())" }, null: false
    t.string "name", null: false
    t.bigint "user_id", null: false
    t.string "slug", null: false
    t.text "goal", null: false
    t.text "shouldbe"
    t.timestamp "deadline", null: false
    t.timestamp "starting_at"
    t.timestamp "started_at"
    t.timestamp "finished_at"
    t.timestamp "archived_at"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
    t.index ["uuid"], name: "index_projects_on_uuid", unique: true
  end

  create_table "tag_tasks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "uuid", default: -> { "(uuid())" }, null: false
    t.bigint "tag_id", null: false
    t.bigint "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_tag_tasks_on_tag_id"
    t.index ["task_id"], name: "index_tag_tasks_on_task_id"
    t.index ["uuid"], name: "index_tag_tasks_on_uuid", unique: true
  end

  create_table "tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "uuid", default: -> { "(uuid())" }, null: false
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_tags_on_user_id"
    t.index ["uuid"], name: "index_tags_on_uuid", unique: true
  end

  create_table "tasks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "uuid", default: -> { "(uuid())" }, null: false
    t.bigint "project_id", null: false
    t.bigint "user_id", null: false
    t.bigint "parent_id"
    t.string "kind", null: false
    t.string "title", null: false
    t.integer "status", default: 0, null: false
    t.timestamp "deadline"
    t.timestamp "starting_at"
    t.timestamp "started_at"
    t.timestamp "finished_at"
    t.timestamp "archived_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_tasks_on_parent_id"
    t.index ["project_id"], name: "index_tasks_on_project_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
    t.index ["uuid"], name: "index_tasks_on_uuid", unique: true
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "uuid", default: -> { "(uuid())" }, null: false
    t.string "email", null: false
    t.string "username", null: false
    t.string "password_digest", null: false
    t.string "refresh_token", null: false
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["uuid"], name: "index_users_on_uuid", unique: true
  end
end
