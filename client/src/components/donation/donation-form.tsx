import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DonationFormProps {
  campaignId: number;
}

const donationFormSchema = z.object({
  amount: z.string()
    .min(1, "Amount is required")
    .refine(val => !isNaN(parseFloat(val)), "Amount must be a number")
    .refine(val => parseFloat(val) >= 1, "Minimum donation is $1"),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

export function DonationForm({ campaignId }: DonationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Preset donation amounts
  const presetAmounts = [10, 25, 50, 100];
  
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "",
      message: "",
      isAnonymous: false,
    },
  });
  
  const donationMutation = useMutation({
    mutationFn: async (data: { 
      amount: number;
      campaignId: number;
      message?: string;
      isAnonymous: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/donations", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/donations/campaign/${campaignId}`] });
      
      toast({
        title: "Donation successful!",
        description: "Thank you for your generosity.",
      });
      
      // Reset form
      form.reset({
        amount: "",
        message: "",
        isAnonymous: false,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Donation failed",
        description: error.message || "Failed to process your donation. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = async (data: DonationFormValues) => {
    setIsSubmitting(true);
    try {
      await donationMutation.mutateAsync({
        amount: parseFloat(data.amount),
        campaignId,
        message: data.message,
        isAnonymous: data.isAnonymous,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectPresetAmount = (amount: number) => {
    form.setValue("amount", amount.toString());
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {presetAmounts.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              size="sm"
              className={`flex-1 min-w-20 ${
                form.watch("amount") === amount.toString() 
                  ? "bg-primary-50 border-primary-500 text-primary-600" 
                  : ""
              }`}
              onClick={() => selectPresetAmount(amount)}
              disabled={isSubmitting}
            >
              {formatCurrency(amount)}
            </Button>
          ))}
        </div>
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donation Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute top-1/2 left-3 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="Enter amount"
                    className="pl-10"
                    type="number"
                    min="1"
                    step="any"
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add a message of support"
                  className="min-h-[80px]"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Make my donation anonymous
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Donate Now"
          )}
        </Button>
      </form>
    </Form>
  );
}
