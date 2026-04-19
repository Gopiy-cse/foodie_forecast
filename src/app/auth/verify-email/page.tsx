'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, AlertCircle } from 'lucide-react'
import { verifyEmailOTP, resendEmailOTP } from '@/actions/auth'
import { Suspense } from 'react';

function EmailContent() {
    const email = 'test@example.com';

    return (
        <>
            {email && <p>Email: {email}</p>}
        </>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <EmailContent />
        </Suspense>
    );
}
