fn main() {
    tauri_plugin::Builder::new(&["startService", "stopService", "updateNotification"])
        .android_path("android")
        .build();
}
