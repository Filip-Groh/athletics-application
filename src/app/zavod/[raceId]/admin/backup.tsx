"use client"

import React from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "~/components/ui/alert-dialog"
import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from '~/trpc/react'

const raceBackupFileSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date(),

    name: z.string(),
    date: z.date(),
    place: z.string(),
    organizer: z.string(),
    visible: z.boolean(),
    ownerId: z.string(),

    event: z.array(z.object({
        id: z.number()
    })),

    racer: z.array(z.object({
        id: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),

        personalDataId: z.number(),
        startingNumber: z.number(),
    })),

    performace: z.array(z.object({
        id: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),

        orderNumber: z.number(),
        subEventId: z.number(),
        racerId: z.number(),

        measurement: z.array(z.object({
            id: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),

            value: z.number()
        }))
    })),

    managers: z.array(z.object({
        id: z.string()
    }))
})

function downloadJSON(object: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(object, null, 4)], {
        type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    URL.revokeObjectURL(url)
}

function BackupTab({raceId}: {raceId: number}) {
    const [errorMessage, setErrorMessage] = React.useState("")

    const getRaceBackupFile = api.backup.getRaceBackupFile.useMutation({
        async onSuccess(data) {
            if (!data) {
                toast("Někde se stala chyba.")
                return
            }
            downloadJSON(data, `zavod_${raceId}`)
            toast(`Backup soubor "zavod_${raceId}.json" úspěšně stažen.`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const loadRaceBackupFile = api.backup.loadRaceBackupFile.useMutation({
        async onSuccess(data) {
            toast(`Backup úspěšně načetl závod ${data.race.name} s ${data.measurements.flat().length} měřeními.`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const handleUpload = async (data: FormData) => {
        setErrorMessage("")

        const file = data.get("backupFile")

        if (!file || !(file instanceof File) || file.size === 0) {
            setErrorMessage("Musíte zvolit soubor.")
            return
        }

        const parseTry = raceBackupFileSchema.safeParse(await JSON.parse(await file.text()))

        if (!parseTry.success) {
            console.error(parseTry.error)
            setErrorMessage(parseTry.error.message)
            return
        }

        const backup = parseTry.data
        console.warn("Upload!")
        console.log(backup)
        loadRaceBackupFile.mutate({
            raceId: raceId,
            race: backup
        })
    }

    const handleDownload = () => {
        getRaceBackupFile.mutate({
            raceId: raceId
        })
    }

    return (
        <div className='flex flex-row gap-2'>
            <Card>
                <CardHeader>
                    <CardTitle>Uložit zálohu</CardTitle>
                    <CardDescription>Uložte si všechny data spojená s tímto závodem do 1 souboru.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleDownload}>Stáhnout zálohu</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Načíst zálohu</CardTitle>
                    <CardDescription>Obnovte všechna data z uloženého souboru.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleUpload} id="backupUpload" className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="backupFile">Vložte předem vytvořenou zálohu.</Label>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input id="backupFile" name='backupFile' type="file" />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant={'destructive'}>Načíst</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Jste si jistí?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tato akce se nedá vrátit! Přejete si pokračovat?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                                        <AlertDialogAction type='submit' form='backupUpload'>
                                            Pokračovat
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <Label className='text-sm font-medium text-destructive'>{errorMessage}</Label>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default BackupTab