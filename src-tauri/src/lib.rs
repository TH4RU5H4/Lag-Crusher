pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(std::sync::Mutex::new(commands::CrusherState::default()))
        .plugin(tauri_plugin_opener::init())
        .plugin(crusher_android::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::start_crusher,
            commands::stop_crusher,
            commands::get_crusher_state,
            commands::update_notification,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
