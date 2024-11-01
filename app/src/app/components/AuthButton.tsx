import { signIn } from 'next-auth/react';

import { Button } from "@/components/ui/button"
import { EnvelopeOpenIcon } from "@radix-ui/react-icons"

export default function AuthButton() {
  return (
    <>
    <Button onClick={() => signIn()}>
      <EnvelopeOpenIcon  
       />  Continue with Email
    </Button>
    </> 
    
  );
}
