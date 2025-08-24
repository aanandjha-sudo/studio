
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";
import { createUserProfile } from "@/lib/firestore";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Firebase Auth requires a valid email format, so we create one from the username.
      // This email is only for authentication and won't be shown to users.
      const email = `${values.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@brosshare-user.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, values.password);
      
      const newUser = userCredential.user;

      // Update Firebase Auth profile displayName to the chosen username
      await updateProfile(newUser, {
        displayName: values.username,
      });

      // Create user profile in Firestore
      await createUserProfile(newUser.uid, {
          username: values.username,
          displayName: values.username,
          photoURL: "",
          bio: "",
          followers: [],
          following: [],
          privacySettings: {
            hideFollowers: false,
            hideFollowing: false,
          }
      });

      toast({
        title: "Account Created!",
        description: "Welcome to BRO'S SHARE. You are now logged in.",
      });
      router.push("/");
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This username is already taken. Please choose another.";
      } else if (error.code) {
          errorMessage = `An error occurred: ${error.code.replace('auth/', '')}`;
      }
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
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
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join BRO'S SHARE today!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Create a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
