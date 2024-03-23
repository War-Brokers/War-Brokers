export interface DBAuth {
    id: string
    pw: string
    base: string
}

export enum FailReason {
    // when the returned value does not match our schema
    // this is done to prevent any potential data leaks
    SchemaValidationFail = "SCHEMA_VALIDATION_FAIL",

    // when player with the given uid was not found
    PlayerNotFound = "PLAYER_NOT_FOUND",

    // when the server is not able to get a response from WB's DB
    WBDBConnectionFail = "WB_DB_CONNECTION_FAIL",

    // when the server is not able to get a response from WB's API
    WBAPIConnectionFail = "WB_API_CONNECTION_FAIL",

    // when the server is not able to get a response from WB's DB mirror
    DBMirrorConnectionFail = "DB_MIRROR_CONNECTION_FAIL",

    // when the server is not able to get a response from WB's stats site
    StatsSiteConnectionFail = "STATS_SITE_CONNECTION_FAIL",
}

export type Result<T> =
    | {
          success: true
          data: T
      }
    | {
          success: false
          reason: FailReason
      }
