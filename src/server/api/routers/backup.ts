import { getRaceBackupFileSchema, loadBackupFileSchema, loadRaceBackupFileSchema } from "~/schemas/backup";

import {
  createTRPCRouter,
  protectedProcedureAdmin,
  protectedProcedureRaceManager,
} from "~/server/api/trpc";

export const backupRouter = createTRPCRouter({
  getBackupFile: protectedProcedureAdmin.mutation(({ ctx }) => {
    return ctx.db.event.findMany({
      include: {
        subEvent: {
          include: {
            ageCoeficient: true,
          },
        },
      },
    });
  }),

  loadBackupFile: protectedProcedureAdmin
    .input(loadBackupFileSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(
        input.map((event) => {
          return ctx.db.event.upsert({
            where: {
              id: event.id,
            },
            update: {
              createdAt: event.createdAt,
              updatedAt: event.updatedAt,

              name: event.name,
              category: event.category,

              subEvent: {
                upsert: event.subEvent.map((subEvent) => {
                  return {
                    where: {
                      id: subEvent.id,
                    },
                    create: {
                      id: subEvent.id,
                      createdAt: subEvent.createdAt,
                      updatedAt: subEvent.updatedAt,

                      name: subEvent.name,
                      a: subEvent.a,
                      b: subEvent.b,
                      c: subEvent.c,

                      ageCoeficient: {
                        create: subEvent.ageCoeficient.map((ageCoeficient) => {
                          return {
                            id: ageCoeficient.id,
                            createdAt: ageCoeficient.createdAt,
                            updatedAt: ageCoeficient.updatedAt,

                            age: ageCoeficient.age,
                            coeficient: ageCoeficient.coeficient,
                          };
                        }),
                      },
                    },
                    update: {
                      createdAt: subEvent.createdAt,
                      updatedAt: subEvent.updatedAt,

                      name: subEvent.name,
                      a: subEvent.a,
                      b: subEvent.b,
                      c: subEvent.c,

                      ageCoeficient: {
                        upsert: subEvent.ageCoeficient.map((ageCoeficient) => {
                          return {
                            where: {
                              age_subEventId: {
                                age: ageCoeficient.age,
                                subEventId: subEvent.id,
                              },
                            },
                            create: {
                              createdAt: ageCoeficient.createdAt,
                              updatedAt: ageCoeficient.updatedAt,

                              age: ageCoeficient.age,
                              coeficient: ageCoeficient.coeficient,
                            },
                            update: {
                              createdAt: ageCoeficient.createdAt,
                              updatedAt: ageCoeficient.updatedAt,

                              coeficient: ageCoeficient.coeficient,
                            },
                          };
                        }),
                      },
                    },
                  };
                }),
              },
            },
            create: {
              createdAt: event.createdAt,
              updatedAt: event.updatedAt,

              name: event.name,
              category: event.category,

              subEvent: {
                create: event.subEvent.map((subEvent) => {
                  return {
                    id: subEvent.id,
                    createdAt: subEvent.createdAt,
                    updatedAt: subEvent.updatedAt,

                    name: subEvent.name,
                    a: subEvent.a,
                    b: subEvent.b,
                    c: subEvent.c,

                    ageCoeficient: {
                      create: subEvent.ageCoeficient.map((ageCoeficient) => {
                        return {
                          id: ageCoeficient.id,
                          createdAt: ageCoeficient.createdAt,
                          updatedAt: ageCoeficient.updatedAt,

                          age: ageCoeficient.age,
                          coeficient: ageCoeficient.coeficient,
                        };
                      }),
                    },
                  };
                }),
              },
            },
          });
        }),
      );
    }),

  getRaceBackupFile: protectedProcedureRaceManager
    .input(getRaceBackupFileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.race.findUnique({
        where: {
          id: input.raceId,
        },
        include: {
          event: {
            select: {
              id: true,
            },
          },
          racer: {
            include: {
              personalData: true,
            },
          },
          performance: {
            include: {
              measurement: true,
            },
          },
          managers: {
            select: {
              id: true,
            },
          },
        },
      });
    }),

  loadRaceBackupFile: protectedProcedureRaceManager
    .input(loadRaceBackupFileSchema)
    .mutation(async ({ ctx, input }) => {
      const raceBackup = input.race;

      const race = await ctx.db.$transaction(async (tx) => {
        await tx.measurement.deleteMany({
          where: {
            performance: {
              raceId: input.raceId,
            },
          },
        });

        await tx.performance.deleteMany({
          where: {
            raceId: input.raceId,
          },
        });

        await tx.racer.deleteMany({
          where: {
            raceId: input.raceId,
          },
        });

        await tx.race.update({
          where: {
            id: input.raceId,
          },
          data: {
            createdAt: raceBackup.createdAt,
            updatedAt: raceBackup.updatedAt,

            name: raceBackup.name,
            date: raceBackup.date,
            place: raceBackup.place,
            organizer: raceBackup.organizer,
            visible: raceBackup.visible,

            owner: {
              connect: {
                id: raceBackup.ownerId,
              },
            },

            event: {
              set: raceBackup.event.map((event) => {
                return {
                  id: event.id,
                };
              }),
            },

            managers: {
              set: raceBackup.managers.map((manager) => {
                return {
                  id: manager.id,
                };
              }),
            },
          },
        });

        for (const racer of raceBackup.racer) {
          const existingUser = racer.personalData.userId === null ? null : await tx.user.findUnique({
            where: {
              id: racer.personalData.userId,
            },
          });

          await tx.personalData.upsert({
            where: {
              id: racer.personalData.id,
            },
            create: {
              id: racer.personalData.id,
              createdAt: racer.personalData.createdAt,
              updatedAt: racer.personalData.updatedAt,
              name: racer.personalData.name,
              surname: racer.personalData.surname,
              birthDate: racer.personalData.birthDate,
              sex: racer.personalData.sex,
              club: racer.personalData.club,
              userId: existingUser?.id ?? null,
            },
            update: {
              createdAt: racer.personalData.createdAt,
              updatedAt: racer.personalData.updatedAt,
              name: racer.personalData.name,
              surname: racer.personalData.surname,
              birthDate: racer.personalData.birthDate,
              sex: racer.personalData.sex,
              club: racer.personalData.club,
              userId: existingUser?.id ?? null,
            },
          });

          await tx.racer.create({
            data: {
              id: racer.id,
              createdAt: racer.createdAt,
              updatedAt: racer.updatedAt,
              personalDataId: racer.personalData.id,
              startingNumber: racer.startingNumber,
              raceId: input.raceId,
            },
          });
        }

        for (const performance of raceBackup.performance) {
          await tx.performance.create({
            data: {
              id: performance.id,
              createdAt: performance.createdAt,
              updatedAt: performance.updatedAt,
              orderNumber: performance.orderNumber,
              raceId: input.raceId,
              subEventId: performance.subEventId,
              racerId: performance.racerId,
              measurement: {
                create: performance.measurement.map((measurement) => {
                  return {
                    id: measurement.id,
                    createdAt: measurement.createdAt,
                    updatedAt: measurement.updatedAt,
                    value: measurement.value,
                  };
                }),
              },
            },
          });
        }

        return await tx.race.findUnique({
          where: {
            id: input.raceId,
          },
          include: {
            event: {
              select: {
                id: true,
              },
            },
            racer: {
              include: {
                personalData: true,
              },
            },
            performance: {
              include: {
                measurement: true,
              },
            },
            managers: {
              select: {
                id: true,
              },
            },
          },
        });
      });

      return race;
    }),
});
