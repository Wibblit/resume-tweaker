"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Loader2, RefreshCw, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  paymentId: string;
  productName: string;
  id: string;
  quantity: number;
  total: number;
  currency: string;
  status: string;
  updatedAt: string;
  credits: number;
}

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentHistoryModal({
  isOpen,
  onClose,
}: PaymentHistoryModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false); // Added cooldown state
  const { toast } = useToast();
  const lastRefreshTime = useRef<number>(0);

  const fetchPaymentHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-transaction-history");
      const data = await response.json();
      setPayments(data?.History);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payment history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      lastRefreshTime.current = Date.now();
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentHistory();
    }
  }, [isOpen, fetchPaymentHistory]);

  const handleRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 3000 || isInCooldown) {
      toast({
        title: "Please wait",
        description: "You can refresh again in a few seconds.",
        variant: "default",
      });
      return;
    }

    if (refreshCount >= 10) {
      setRefreshDisabled(true);
      toast({
        title: "Refresh Limit Reached",
        description: "Please wait 2 minutes before refreshing again.",
        variant: "destructive",
      });
      setTimeout(() => {
        setRefreshDisabled(false);
        setRefreshCount(0);
      }, 120000); // 2 minutes
      return;
    }

    setIsInCooldown(true);
    setRefreshCount((prevCount) => prevCount + 1);
    fetchPaymentHistory();

    // Set a timeout to remove the cooldown after 3 seconds
    setTimeout(() => {
      setIsInCooldown(false);
    }, 3000);
  }, [fetchPaymentHistory, refreshCount, toast, isInCooldown]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Transaction ID copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] h-[90vh] flex flex-col bg-background text-foreground">
        <DialogHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-lg font-semibold">
              Payment History
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading || refreshDisabled || isInCooldown} // Updated disabled prop
                className={`mr-4 ${
                  refreshDisabled || isInCooldown ? "cursor-not-allowed" : ""
                } text-foreground/60 hover:text-foreground`} // Updated className
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Refresh payment history</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%] md:w-[20%]">
                    Bundle Name
                  </TableHead>
                  <TableHead className="w-[25%] md:w-[25%]">
                    Payment ID
                  </TableHead>
                  <TableHead className="w-[10%] md:w-[10%]">Quantity</TableHead>
                  <TableHead className="w-[15%] md:w-[15%]">Total</TableHead>
                  <TableHead className="w-[15%] md:w-[15%]">Credits</TableHead>
                  <TableHead className="w-[10%] md:w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%] md:w-[15%]">
                    Last Updated
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-xs sm:text-sm md:text-base">
                      {payment.productName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="truncate max-w-[80px] md:max-w-[150px] lg:max-w-[200px] text-xs sm:text-sm md:text-base">
                          {payment.paymentId}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(payment.paymentId)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy transaction ID</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm md:text-base">
                      {payment.quantity}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm md:text-base">{`${payment.total} ${payment.currency}`}</TableCell>
                    <TableCell className="text-xs sm:text-sm md:text-base">
                      {payment.credits}
                    </TableCell>
                    <TableCell
                      className={`text-xs sm:text-sm md:text-base ${
                        payment.status === "SUCCESS"
                          ? "text-green-500"
                          : payment.status === "PENDING"
                          ? "text-yellow-500"
                          : payment.status === "FAILED"
                          ? "text-red-500"
                          : "text-gray-500" // Default color for other statuses
                      }`}
                    >
                      {payment.status}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm md:text-base">
                      {new Date(payment.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              // Add your contact support logic here
              toast({
                title: "Contact Support",
                description: "Redirecting to support page...",
              });
            }}
          >
            Contact Support
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
