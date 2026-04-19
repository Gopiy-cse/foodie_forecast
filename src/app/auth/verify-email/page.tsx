'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, AlertCircle } from 'lucide-react'
import { verifyEmailOTP, resendEmailOTP } from '@/actions/auth'

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const email = searchParams.get('email')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pastedValue = value.slice(0, 6).split('')
            const newOtp = [...otp]
            pastedValue.forEach((char, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = char
                }
            })
            setOtp(newOtp)
            const lastFilledIndex = Math.min(index + pastedValue.length, 5)
            inputRefs.current[lastFilledIndex]?.focus()
        } else {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
        setError('')
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = async () => {
        const otpCode = otp.join('')
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code')
            return
        }

        if (!email) {
            setError('Email not found. Please sign up again.')
            return
        }

        setIsVerifying(true)
        setError('')

        try {
            await verifyEmailOTP(email, otpCode)
            // Success - action will redirect to home
        } catch (err: any) {
            setError(err.message || 'Invalid or expired code. Please try again.')
            setIsVerifying(false)
        }
    }

    const handleResend = async () => {
        if (!email) {
            setError('Email not found. Please sign up again.')
            return
        }

        setIsResending(true)
        setError('')
        setResendSuccess(false)

        try {
            await resendEmailOTP(email)
            setResendSuccess(true)
            setOtp(['', '', '', '', '', ''])
            inputRefs.current[0]?.focus()
        } catch (err: any) {
            setError(err.message || 'Failed to resend code. Please try again.')
        } finally {
            setIsResending(false)
        }
    }

    if (!email) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <CardTitle>Email Not Found</CardTitle>
                        <CardDescription>
                            Please return to the signup page and try again.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push('/login')} className="w-full">
                            Back to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-1">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                    <CardDescription>
                        We've sent a 6-digit code to<br />
                        <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {resendSuccess && (
                        <Alert>
                            <Mail className="h-4 w-4" />
                            <AlertDescription>Code sent! Check your email.</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-lg font-semibold"
                                    disabled={isVerifying}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={handleVerify}
                            className="w-full"
                            disabled={isVerifying || otp.join('').length !== 6}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify Email'}
                        </Button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the code?
                            </p>
                            <Button
                                variant="ghost"
                                onClick={handleResend}
                                disabled={isResending}
                                className="text-primary"
                            >
                                {isResending ? 'Sending...' : 'Resend Code'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
