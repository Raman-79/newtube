// app/components/sessionProvider.tsx
'use client'
import { SessionProvider } from "next-auth/react";
export default function SessionProviderAuth({ children}:{
    children:React.ReactNode
}) {
 return <SessionProvider>{children}</SessionProvider>;
}
