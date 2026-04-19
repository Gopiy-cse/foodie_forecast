'use client'

import { useState } from 'react'
import { migrateData } from '@/actions/migrate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function MigratePage() {
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleMigrate = async () => {
        setIsLoading(true)
        try {
            const result = await migrateData()
            setStatus(result)
        } catch (error: any) {
            setStatus({ success: false, message: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Data Migration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>Click the button below to seed the database with initial data (Hotels and Menu Items).</p>
                    <Button onClick={handleMigrate} disabled={isLoading}>
                        {isLoading ? 'Migrating...' : 'Start Migration'}
                    </Button>
                    {status && (
                        <Alert variant={status.success ? 'default' : 'destructive'}>
                            <AlertTitle>{status.success ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription>{status.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
