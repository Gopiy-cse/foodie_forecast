'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ConfirmEmailPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Check your email
                    </CardTitle>
                    <CardDescription>
                        We've sent you a verification code
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                        Please check your email for a 6-digit verification code and enter it on the next page.
                        The code will expire in 24 hours.
                    </p>
                    <div className="space-y-2">
                        <p className="text-center text-xs text-muted-foreground">
                            Didn't receive the code? Check your spam folder.
                        </p>
                    </div>
                    <div className="pt-4 space-y-2">
                        {email && (
                            <Link href={`/auth/verify-email?email=${encodeURIComponent(email)}`} className="w-full block">
                                <Button className="w-full">
                                    Enter Verification Code
                                </Button>
                            </Link>
                        )}
                        <Link href="/login" className="w-full block">
                            <Button variant="outline" className="w-full">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
