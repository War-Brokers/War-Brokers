import { faker } from "@faker-js/faker"
import { vehicles } from "@warbrokers/types/src/vehicle"

import { distribute, fakeRecord } from "./fake-record"

export function fakeVehicleStats(totalKills: number) {
    return (
        faker.helpers.maybe(() => {
            const activeVehicles = faker.helpers.arrayElements(vehicles, {
                min: totalKills > 0 ? 1 : 0,
                max: vehicles.length,
            })
            const distanceDrivenCount = fakeRecord({
                keys: activeVehicles,
                fakeValue: () => faker.number.int(100),
            })

            return {
                selfDestructs: fakeRecord({
                    keys: activeVehicles,
                    fakeValue: () => faker.number.int(20),
                }),
                distanceDriven: fakeRecord({
                    keys: activeVehicles,
                    fakeValue: (vehicle) =>
                        distanceDrivenCount[vehicle] *
                        faker.number.float({
                            min: 0,
                            max: 10_000,
                            fractionDigits: 5,
                        }),
                }),
                distanceDrivenCount,
                killsPerVehicle: distribute({
                    keys: activeVehicles,
                    total: totalKills,
                }),
            }
        }) ?? null
    )
}

export function fakeVehiclePlayerFields(vehicleStats: ReturnType<typeof fakeVehicleStats>) {
    return {
        self_destructs: vehicleStats?.selfDestructs ?? null,
        distance_driven: vehicleStats?.distanceDriven ?? null,
        distance_driven_count: vehicleStats?.distanceDrivenCount ?? null,
        kills_per_vehicle: vehicleStats?.killsPerVehicle ?? null,
    }
}
