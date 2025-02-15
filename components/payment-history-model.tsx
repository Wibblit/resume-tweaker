import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Loader2, RefreshCw } from "lucide-react";
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
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

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

const statusConfig = {
  succeeded: {
    color: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    label: "Succeeded"
  },
  failed: {
    color: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    label: "Failed"
  },
  processing: {
    color: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    label: "Processing"
  },
  cancelled: {
    color: "bg-gray-50 dark:bg-gray-950/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800",
    label: "Cancelled"
  }
};

export function PaymentHistoryModal({
  isOpen,
  onClose,
}: PaymentHistoryModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
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
      }, 120000);
      return;
    }

    setIsInCooldown(true);
    setRefreshCount((prevCount) => prevCount + 1);
    fetchPaymentHistory();

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
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1200px] h-[90vh] flex flex-col bg-background">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Payment History
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading || refreshDisabled || isInCooldown}
            className={cn(
              "transition-all duration-200",
              (refreshDisabled || isInCooldown) && "opacity-50 cursor-not-allowed"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span className="sr-only">Refresh payment history</span>
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-auto mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[20%] font-medium">Bundle Name</TableHead>
                    <TableHead className="w-[25%] font-medium">Transaction ID</TableHead>
                    <TableHead className="w-[10%] font-medium text-center">Quantity</TableHead>
                    <TableHead className="w-[15%] font-medium text-right">Total</TableHead>
                    <TableHead className="w-[10%] font-medium text-center">Credits</TableHead>
                    <TableHead className="w-[10%] font-medium">Status</TableHead>
                    <TableHead className="w-[10%] font-medium">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{payment.productName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-sm">
                            {payment.paymentId}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(payment.paymentId)}
                            className="h-8 w-8 hover:bg-background"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{payment.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {payment.total/100} {payment.currency}
                      </TableCell>
                      <TableCell className="text-center">{payment.credits}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 text-xs font-medium",
                            statusConfig[payment.status as keyof typeof statusConfig]?.color
                          )}
                        >
                          {statusConfig[payment.status as keyof typeof statusConfig]?.label || payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit"
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
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