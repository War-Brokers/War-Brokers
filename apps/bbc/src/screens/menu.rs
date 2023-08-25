use crate::constants::FONT_BOLD;
use bevy::prelude::*;

pub struct MenuScreenPlugin;

impl Plugin for MenuScreenPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, setup);
    }
}

fn setup(mut commands: Commands, asset_server: Res<AssetServer>) {
    // Title
    commands
        .spawn(NodeBundle {
            style: Style {
                position_type: PositionType::Absolute,
                justify_content: JustifyContent::Center,
                align_items: AlignItems::Center,
                width: Val::Percent(100.),
                height: Val::Percent(100.),
                ..default()
            },
            ..default()
        })
        .with_children(|parent| {
            parent
                .spawn(NodeBundle {
                    style: Style {
                        position_type: PositionType::Absolute,
                        justify_content: JustifyContent::Center,
                        align_items: AlignItems::Center,
                        width: Val::Percent(100.),
                        padding: UiRect {
                            left: Val::Px(15.),
                            right: Val::Px(15.),
                            top: Val::Px(7.),
                            bottom: Val::Px(7.),
                        },
                        ..default()
                    },
                    background_color: BackgroundColor(Color::BLACK),
                    ..default()
                })
                .with_children(|parent| {
                    parent.spawn(
                        TextBundle::from_section(
                            "War Brokers",
                            TextStyle {
                                font: asset_server.load(FONT_BOLD),
                                font_size: 100.0,
                                color: Color::WHITE,
                            },
                        )
                        .with_text_alignment(TextAlignment::Center),
                    );
                });
        });
}
