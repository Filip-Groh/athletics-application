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
import { downloadJSON } from '~/lib/utils'
import { api } from '~/trpc/react'

const backupFileSchema = z.array(z.object({
    id: z.number(),
    createdAt: z.string().transform((str) => new Date(str)),
    updatedAt: z.string().transform((str) => new Date(str)),

    name: z.nullable(z.string()),
    category: z.enum(["man", "woman"]),

    subEvent: z.array(z.object({
        id: z.number(),
        createdAt: z.string().transform((str) => new Date(str)),
        updatedAt: z.string().transform((str) => new Date(str)),

        name: z.string(),
        a: z.number(),
        b: z.number(),
        c: z.number(),

        ageCoeficient: z.array(z.object({
            id: z.number(),
            createdAt: z.string().transform((str) => new Date(str)),
            updatedAt: z.string().transform((str) => new Date(str)),

            age: z.number(),
            coeficient: z.number()
        }))
    }))
}))

function Backup() {
    const [errorMessage, setErrorMessage] = React.useState("")
    const utils = api.useUtils()

    const getBackupFile = api.backup.getBackupFile.useMutation({
        async onSuccess(data) {
            if (!data) {
                toast("Někde se stala chyba.")
                return
            }
            downloadJSON(data, "zaloha")
            toast(`Backup soubor "zaloha.json" úspěšně stažen.`)
            await utils.event.getEvents.invalidate()
            await utils.event.getEventsWithAgeCoeficients.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const loadBackupFile = api.backup.loadBackupFile.useMutation({
        async onSuccess(data) {
            toast(`Backup úspěšně načetl ${data.length} disciplíny.`)
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

        const parseTry = backupFileSchema.safeParse(await JSON.parse(await file.text()))

        if (!parseTry.success) {
            console.error(parseTry.error)
            setErrorMessage(parseTry.error.message)
            return
        }

        const backup = parseTry.data
        console.warn("Upload!")
        console.log(backup)
        loadBackupFile.mutate(backup)
    }

    const handleDownload = () => {
        getBackupFile.mutate()
    }

    return (
        <div className='flex flex-row gap-2'>
            <Card>
                <CardHeader>
                    <CardTitle>Uložit zálohu</CardTitle>
                    <CardDescription>Uložte si všechna data disciplín do 1 souboru.</CardDescription>
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

export default Backup