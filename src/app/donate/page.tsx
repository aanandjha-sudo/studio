
"use client";

import React from "react";
import Image from "next/image";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function DonatePage() {
  const qrCodeUrl = "https://drive.google.com/uc?export=download&id=11GNGZPiUbQIgJwkY4qMWGw8U6YdZMA2N";

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
                Your contributions help us keep the community running. Scan the QR code below to donate.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="p-2 border rounded-lg bg-white">
                <Image 
                  src={qrCodeUrl} 
                  alt="Donation QR Code" 
                  width={256} 
                  height={256} 
                  className="rounded-md"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
