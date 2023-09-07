import admin from "firebase-admin"

export const db = admin.firestore()

const usersRef = db.collection("users")
const users: { [key: DiscordID]: SquadBotUser } = {}

/**
 * Finds and returns a user object from the DB.
 */
export async function getUser(
    discordID: DiscordID,
): Promise<SquadBotUser | undefined> {
    if (discordID in users) return users[discordID]

    const user = await usersRef.doc(discordID).get()

    if (!user.exists) return

    return user.data() as SquadBotUser
}

/**
 * Create / Update a user
 */
export async function setUser(
    discordID: DiscordID,
    warbrokersID: WarBrokersID,
): Promise<void> {
    await usersRef.doc(discordID).set(
        {
            uid: warbrokersID,
        } as SquadBotUser,
        { merge: true },
    )
}
