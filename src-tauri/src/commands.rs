use serde::{Deserialize, Serialize};
use std::sync::OnceLock;
use tauri::Manager;

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

fn get_client() -> &'static reqwest::Client {
    static CLIENT: OnceLock<reqwest::Client> = OnceLock::new();
    CLIENT.get_or_init(|| {
        reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(5))
            .build()
            .expect("failed to build reqwest client")
    })
}

#[tauri::command]
pub async fn ping_url(url: String) -> Result<u64, String> {
    let client = get_client();

    let cache_bust = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    let separator = if url.contains('?') { "&" } else { "?" };
    let cache_busted_url = format!("{url}{separator}_z={cache_bust}");

    let start = std::time::Instant::now();
    client
        .get(&cache_busted_url)
        .header("Cache-Control", "no-cache")
        .header("Pragma", "no-cache")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    Ok(start.elapsed().as_millis() as u64)
}
