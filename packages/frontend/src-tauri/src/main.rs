// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::PathBuf, sync::Arc};

use log::{self, kv::ToValue};
use serde_json::json;
use tauri::{AppHandle, Emitter, Manager, Wry};
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_log::{Target, TargetKind};
use tauri_plugin_store::{with_store, StoreCollection};
use url::Url;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("logs".to_string()),
                    }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let _ = show_window(app);
            log::info!("args: {:?}", args);
            // get 2nd argument, it's the deep link url: tdu-attendance://auth?session=23bre5bglyrtntd4ncfutrk2k6qm2zx54rchar6v
            if let Some(url) = args.get(1) {
                log::info!("url: {:?}", url);

                // get the session param
                let session = Url::parse(url)
                    .unwrap()
                    .query_pairs()
                    .find(|(key, _)| key == "session")
                    .unwrap()
                    .1
                    .to_string();

                let stores = app.app_handle().state::<StoreCollection<Wry>>();
                let path = PathBuf::from("store.bin");

                let _ = with_store(app.app_handle().clone(), stores, path, |store| {
                    store.insert("session".to_string(), json!(session))?;
    
                    Ok(())
                });

                app.emit("session", Some(json!({ "session": session })))
                    .expect("Couldn't emit session event");
                
                log::info!("session: {:?}", session);
            }

            log::info!("cwd: {:?}", cwd);
            log::info!("app: {:?}", app);
        }))
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;

            app.deep_link().register("tdu-attendance")?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn show_window(app: &AppHandle) {
    let windows = app.webview_windows();

    windows
        .values()
        .next()
        .expect("Sorry, no window found")
        .set_focus()
        .expect("Can't Bring Window to Focus");
}
