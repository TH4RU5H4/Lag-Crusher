use serde::{Deserialize, Serialize};

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrusherState {
    pub running: bool,
    pub latency: Option<u64>,
    pub ping_count: u64,
}

impl Default for CrusherState {
    fn default() -> Self {
        Self {
            running: false,
            latency: None,
            ping_count: 0,
        }
    }
}

#[tauri::command]
pub fn start_crusher(app: tauri::AppHandle) -> Result<(), String> {
    let state = app.state::<std::sync::Mutex<CrusherState>>();
    let mut s = state.lock().map_err(|e| e.to_string())?;
    s.running = true;
    Ok(())
}

#[tauri::command]
pub fn stop_crusher(app: tauri::AppHandle) -> Result<(), String> {
    let state = app.state::<std::sync::Mutex<CrusherState>>();
    let mut s = state.lock().map_err(|e| e.to_string())?;
    s.running = false;
    Ok(())
}

#[tauri::command]
pub fn get_crusher_state(app: tauri::AppHandle) -> Result<CrusherState, String> {
    let state = app.state::<std::sync::Mutex<CrusherState>>();
    let s = state.lock().map_err(|e| e.to_string())?;
    Ok(s.clone())
}

#[tauri::command]
pub fn update_notification(app: tauri::AppHandle, latency: String, ping_count: String) -> Result<(), String> {
    #[cfg(target_os = "android")]
    {
        use tauri::Emitter;
        app.emit("notification-update", serde_json::json!({
            "latency": latency,
            "pingCount": ping_count
        })).map_err(|e| e.to_string())?;
    }
    Ok(())
}
