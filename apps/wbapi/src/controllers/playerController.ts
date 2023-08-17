import { type Player } from "@warbrokers/types"
import { firestore } from "firebase-admin"
import { info } from "firebase-functions/logger"
import { Controller, Get, Path, Res, Route, TsoaResponse } from "tsoa"

@Route("/players")
export class PlayerController extends Controller {
    /**
     * Retrieves player data.
     * @param uid War Brokers Player UID
     */
    @Get("{uid}")
    public async getPlayer(
        @Path() uid: string,
        @Res() notFoundResponse: TsoaResponse<400, { reason: string }>,
        // todo: waiting for https://github.com/lukeautry/tsoa/issues/1256
    ): Promise<unknown> {
        info(`attempting to fetch user info. UID: ${uid}`)

        const doc = await firestore().collection("players").doc(uid).get()

        const data = doc.data() as Player

        if (!data) {
            return notFoundResponse(400, {
                reason: "invalid player UID",
            })
        }

        return data
    }
}
