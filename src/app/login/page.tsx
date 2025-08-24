
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const otpSchema = z.object({
  otp: z.string().length(4, { message: "OTP must be 4 digits." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, requestLoginOtp, verifyLoginOtp } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  React.useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleRequestOtp = async (values: z.infer<typeof emailSchema>) => {
    try {
      const generatedOtp = await requestLoginOtp(values.email);
      setEmail(values.email);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Your one-time password is: ${generatedOtp}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
  };
  
  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    try {
      await verifyLoginOtp(email, values.otp);
      toast({
        title: "Logged In!",
        description: "Welcome back to BRO'S SHARE.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
  };

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">{step === 'email' ? 'Welcome Back!' : 'Enter Your Code'}</CardTitle>
          <CardDescription>
            {step === 'email' ? 'Enter your email to receive a login code.' : `We sent a 4-digit code to ${email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleRequestOtp)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={emailForm.formState.isSubmitting}>
                  {emailForm.formState.isSubmitting ? "Sending..." : "Send Code"}
                </Button>
              </form>
            </Form>
          ) : (
             <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <Input placeholder="1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={otpForm.formState.isSubmitting}>
                  {otpForm.formState.isSubmitting ? "Verifying..." : "Login"}
                </Button>
                 <Button variant="link" size="sm" className="w-full" onClick={() => setStep('email')}>Use a different email</Button>
              </form>
            </Form>
          )}
          <div className="mt-4 text-center text-sm">
            {step === 'email' && (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline text-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
