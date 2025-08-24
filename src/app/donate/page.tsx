
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Coffee } from "lucide-react";

export default function DonatePage() {
  const qrCodeUrl = "https://drive.google.com/uc?export=download&id=11GNGZPiUbQIgJwkY4qMWGw8U6YdZMA2N";
  const buyMeACoffeeUrl = "https://buymeacoffee.com/aanandjha";

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Donate</h1>
          <p className="text-muted-foreground">Support the BRO'S SHARE community</p>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit">
                <Heart className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Support Our Platform</CardTitle>
              <CardDescription>
                Your contributions help us keep the community running. Choose your preferred way to donate below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="p-2 border rounded-lg bg-white">
                <Image 
                  src={qrCodeUrl} 
                  alt="Donation QR Code" 
                  width={256} 
                  height={256} 
                  className="rounded-md"
                />
              </div>
              
              <div className="flex items-center w-full">
                <Separator className="flex-1" />
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>

              <Button asChild className="w-full bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90">
                <Link href={buyMeACoffeeUrl} target="_blank" rel="noopener noreferrer">
                  <Coffee className="mr-2 h-5 w-5" />
                  Buy Me a Coffee
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
