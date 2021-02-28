# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_02_23_153748) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "list_sets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "user_managed", default: false
    t.string "type"
    t.index ["user_id"], name: "index_list_sets_on_user_id"
  end

  create_table "lists", force: :cascade do |t|
    t.string "title"
    t.date "date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id", null: false
    t.bigint "list_set_id"
    t.integer "position"
    t.index ["list_set_id"], name: "index_lists_on_list_set_id"
    t.index ["user_id"], name: "index_lists_on_user_id"
  end

  create_table "todos", force: :cascade do |t|
    t.string "title"
    t.boolean "pinned"
    t.bigint "list_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "complete", default: false
    t.integer "position"
    t.index ["list_id"], name: "index_todos_on_list_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "time_zone", default: "Pacific Time (US & Canada)"
    t.bigint "plan_list_id"
    t.bigint "plan_list_set_id"
    t.bigint "current_list_set_id"
    t.bigint "archive_list_set_id"
    t.bigint "daily_tickler_list_set_id"
    t.index ["archive_list_set_id"], name: "index_users_on_archive_list_set_id"
    t.index ["current_list_set_id"], name: "index_users_on_current_list_set_id"
    t.index ["daily_tickler_list_set_id"], name: "index_users_on_daily_tickler_list_set_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["plan_list_id"], name: "index_users_on_plan_list_id"
    t.index ["plan_list_set_id"], name: "index_users_on_plan_list_set_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "list_sets", "users"
  add_foreign_key "lists", "list_sets"
  add_foreign_key "lists", "users"
  add_foreign_key "todos", "lists"
  add_foreign_key "users", "list_sets", column: "archive_list_set_id"
  add_foreign_key "users", "list_sets", column: "current_list_set_id"
  add_foreign_key "users", "list_sets", column: "daily_tickler_list_set_id"
  add_foreign_key "users", "list_sets", column: "plan_list_set_id"
  add_foreign_key "users", "lists", column: "plan_list_id"
end
