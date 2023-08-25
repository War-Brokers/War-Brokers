mod constants;
mod plugins;
mod screens;

use crate::plugins::fps_counter::FPSCounterPlugin;
use crate::screens::menu::MenuScreenPlugin;
use bevy::{
    diagnostic::{FrameTimeDiagnosticsPlugin, LogDiagnosticsPlugin},
    prelude::*,
    window::{PresentMode, WindowPlugin},
};

fn main() {
    App::new()
        // resources
        // plugins
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                present_mode: PresentMode::AutoNoVsync,
                ..default()
            }),
            ..default()
        }))
        .add_plugins(LogDiagnosticsPlugin::default())
        .add_plugins(FrameTimeDiagnosticsPlugin::default())
        .add_plugins(FPSCounterPlugin)
        .add_plugins(MenuScreenPlugin)
        // systems
        .add_systems(Startup, setup)
        // run
        .run();
}

pub fn setup(mut commands: Commands) {
    // UI camera
    commands.spawn(Camera2dBundle::default());
}
