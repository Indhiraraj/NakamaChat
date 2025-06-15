import { SignUpForm } from "@/components/signup-form"

export default function SignUp() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">🌊 Your Adventure Starts Here</h1>
          <p className="text-sm text-muted-foreground">
            The sea is wide, the map is blank — and somewhere out there, your Nakama are waiting.
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
