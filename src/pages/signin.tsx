import { SignInForm } from "@/components/login-form"

export default function SignIn() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">👒 Welcome Back, Nakama!</h1>
          <p className="text-sm text-muted-foreground">
            The crew's been waiting — it’s time to set sail again.
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
