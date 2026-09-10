fn main() {
    if std::env::var("TARGET")
        .map(|target| target.contains("android"))
        .unwrap_or(false)
    {
        println!("cargo:rustc-link-arg=-Wl,-z,max-page-size=16384");
        println!("cargo:rustc-link-arg=-Wl,-z,common-page-size=16384");
    }
    tauri_build::build()
}
