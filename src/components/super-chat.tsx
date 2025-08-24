"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SuperChat as SuperChatType } from '@/lib/types';

interface SuperChatProps {
    children: React.ReactNode;
    onSendSuperChat: (chat: SuperChatType) => void;
}

const amountTiers = [
  { amount: 1, color: '#1E88E5' }, // Blue
  { amount: 5, color: '#00E676' }, // Green
  { amount: 10, color: '#FFD600' }, // Yellow
  { amount: 20, color: '#FF6D00' }, // Orange
  { amount: 50, color: '#D50000' }, // Red
];

export default function SuperChat({ children, onSendSuperChat }: SuperChatProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(5);
  const [message, setMessage] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const selectedColor = amountTiers.slice().reverse().find(tier => amount >= tier.amount)?.color || '#1E88E5';

  const handleSend = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (message.trim() && finalAmount > 0) {
      onSendSuperChat({
        user: 'You',
        message,
        amount: finalAmount,
        color: selectedColor
      });
      setMessage('');
      setCustomAmount('');
      setOpen(false);
    }
  };
  
  const handleAmountClick = (newAmount: number) => {
    setAmount(newAmount);
    setCustomAmount('');
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if(parseFloat(value) > 0) {
        setAmount(parseFloat(value));
    } else {
        setAmount(amountTiers[0].amount); // reset to lowest tier if invalid
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Zap className="text-yellow-400"/> Send a Super Chat</DialogTitle>
          <DialogDescription>
            Your message will be highlighted in the chat. Choose an amount to show your support.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="flex gap-2">
              {amountTiers.map(tier => (
                <Button 
                  key={tier.amount}
                  variant={amount === tier.amount && !customAmount ? "default" : "outline"}
                  onClick={() => handleAmountClick(tier.amount)}
                  style={amount === tier.amount && !customAmount ? { backgroundColor: tier.color, color: 'white' } : {}}
                  className="flex-1"
                >
                  ${tier.amount}
                </Button>
              ))}
            </div>
            <Input 
                placeholder="Or enter custom amount"
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="mt-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea 
                id="message" 
                placeholder="Say something nice!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
                style={{
                    border: `2px solid ${selectedColor}`,
                    boxShadow: `0 0 5px ${selectedColor}`
                }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSend} style={{ backgroundColor: selectedColor, color: 'white' }}>
            Send Super Chat for ${customAmount ? parseFloat(customAmount).toFixed(2) : amount.toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
