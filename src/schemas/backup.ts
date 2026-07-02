import { z } from "zod";

export const raceBackupFileSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),

  name: z.string(),
  date: z.coerce.date(),
  place: z.string(),
  organizer: z.string(),
  visible: z.boolean(),
  ownerId: z.string(),

  event: z.array(
    z.object({
      id: z.number(),
    }),
  ),

  racer: z.array(
    z.object({
      id: z.number(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),

      personalDataId: z.number(),
      startingNumber: z.number(),
    }),
  ),

  performace: z.array(
    z.object({
      id: z.number(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),

      orderNumber: z.number(),
      subEventId: z.number(),
      racerId: z.number(),

      measurement: z.array(
        z.object({
          id: z.number(),
          createdAt: z.coerce.date(),
          updatedAt: z.coerce.date(),

          value: z.number(),
        }),
      ),
    }),
  ),

  managers: z.array(
    z.object({
      id: z.string(),
    }),
  ),
});

export const loadBackupFileSchema = z.array(
  z.object({
    id: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),

    name: z.nullable(z.string()),
    category: z.enum(["man", "woman"]),

    subEvent: z.array(
      z.object({
        id: z.number(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),

        name: z.string(),
        a: z.number(),
        b: z.number(),
        c: z.number(),

        ageCoeficient: z.array(
          z.object({
            id: z.number(),
            createdAt: z.coerce.date(),
            updatedAt: z.coerce.date(),

            age: z.number(),
            coeficient: z.number(),
          }),
        ),
      }),
    ),
  }),
);

export const getRaceBackupFileSchema = z.object({
  raceId: z.number(),
});

export const loadRaceBackupFileSchema = z.object({
  raceId: z.number(),
  race: raceBackupFileSchema,
});