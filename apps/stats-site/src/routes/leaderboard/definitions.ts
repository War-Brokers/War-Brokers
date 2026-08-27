import { formatTimeAlive } from "$lib/formatting"

import type { LeaderboardDefinition, LeaderboardPlayer } from "./types"

type KillsEloPlayer = LeaderboardPlayer & { killsELO: number }
type GamesEloPlayer = LeaderboardPlayer & { gamesELO: number }
type TimeAlivePlayer = LeaderboardPlayer & { time_alive: number }
type XpPlayer = LeaderboardPlayer & { xp: number; level: number }
type DailyKillsPlayer = LeaderboardPlayer & { dailyKills: number }
type DailyClassicModeWinsPlayer = LeaderboardPlayer & { dailyClassicModeWins: number }
type DailyBattleRoyaleWinsPlayer = LeaderboardPlayer & { dailyBattleRoyaleWins: number }

export const killsEloLeaderboard = {
    heading: "Kills ELO",
    title: "Kills ELO Leaderboard",
    caption: "Kills Elo leaderboard",
    path: "/leaderboard/killsELO",
    columns: [
        {
            label: "Kills ELO",
            class: "min-w-24",
            skeletonClass: "w-20",
            value: (player) => player.killsELO.toFixed(2),
        },
    ],
    barValue: (player) => player.killsELO,
} as const satisfies LeaderboardDefinition<KillsEloPlayer>

export const gamesEloLeaderboard = {
    heading: "Games ELO",
    title: "Games ELO Leaderboard",
    caption: "Games Elo leaderboard",
    path: "/leaderboard/gamesELO",
    columns: [
        {
            label: "Games ELO",
            class: "min-w-24",
            skeletonClass: "w-20",
            value: (player) => player.gamesELO.toFixed(2),
        },
    ],
    barValue: (player) => player.gamesELO,
} as const satisfies LeaderboardDefinition<GamesEloPlayer>

export const timeAliveLeaderboard = {
    heading: "Time Alive",
    title: "Time Alive Leaderboard",
    caption: "Time Alive leaderboard",
    path: "/leaderboard/timeAlive",
    columns: [
        {
            label: "Time Alive",
            class: "min-w-32",
            skeletonClass: "w-24",
            value: (player) => formatTimeAlive(player.time_alive),
        },
    ],
    barValue: (player) => player.time_alive,
} as const satisfies LeaderboardDefinition<TimeAlivePlayer>

export const xpLeaderboard = {
    heading: "XP & Level",
    title: "XP & Level Leaderboard",
    caption: "XP and level leaderboard",
    path: "/leaderboard/xp",
    columns: [
        {
            label: "XP",
            class: "min-w-32",
            skeletonClass: "w-20",
            value: (player) => player.xp.toLocaleString("en-US"),
        },
        {
            label: "Level",
            class: "min-w-24",
            skeletonClass: "w-12",
            value: (player) => player.level,
        },
    ],
    barValue: (player) => player.xp,
} as const satisfies LeaderboardDefinition<XpPlayer>

export const dailyKillsLeaderboard = {
    heading: "Kills",
    title: "Daily Kills Leaderboard",
    caption: "Daily kills leaderboard",
    path: "/leaderboard/daily/kills",
    columns: [
        {
            label: "Kills",
            class: "min-w-18",
            skeletonClass: "w-18",
            value: (player) => player.dailyKills.toLocaleString("en-US"),
        },
    ],
    barValue: (player) => player.dailyKills,
} as const satisfies LeaderboardDefinition<DailyKillsPlayer>

export const dailyClassicModeWinsLeaderboard = {
    heading: "Classic Mode Wins",
    title: "Daily Classic Mode Wins Leaderboard",
    caption: "Daily Classic Mode wins leaderboard",
    path: "/leaderboard/daily/classicModeWins",
    columns: [
        {
            label: "Wins",
            class: "min-w-18",
            skeletonClass: "w-18",
            value: (player) => player.dailyClassicModeWins.toLocaleString("en-US"),
        },
    ],
    barValue: (player) => player.dailyClassicModeWins,
} as const satisfies LeaderboardDefinition<DailyClassicModeWinsPlayer>

export const dailyBattleRoyaleWinsLeaderboard = {
    heading: "Battle Royale Wins",
    title: "Daily Battle Royale Wins Leaderboard",
    caption: "Daily Battle Royale wins leaderboard",
    path: "/leaderboard/daily/battleRoyaleWins",
    columns: [
        {
            label: "Wins",
            class: "min-w-18",
            skeletonClass: "w-18",
            value: (player) => player.dailyBattleRoyaleWins.toLocaleString("en-US"),
        },
    ],
    barValue: (player) => player.dailyBattleRoyaleWins,
} as const satisfies LeaderboardDefinition<DailyBattleRoyaleWinsPlayer>
