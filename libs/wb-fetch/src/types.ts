export interface DBAuth {
    id: string
    pw: string
    ip: string
}

export enum FailReason {
    // when the returned value does not match our schema
    // this is done to prevent any potential data leaks
    InvalidType = "INVALID_TYPE",

    // when the fetch request fails altogether
    RequestFailed = "REQUEST_FAILED",
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
