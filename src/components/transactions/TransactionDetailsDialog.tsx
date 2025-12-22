import { useState } from 'react';
import { format } from 'date-fns';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Tag, 
  AlignLeft,
  Pencil,
  X
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type Transaction } from '@/db';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

interface TransactionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionDetailsDialog({ 
  open, 
  onOpenChange, 
  transaction,
  onEdit 
}: TransactionDetailsDialogProps) {
  const { formatCurrency } = useCurrency();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!transaction) return null;

  const handleEditClick = () => {
    onOpenChange(false);
    onEdit(transaction);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setIsDescriptionExpanded(false);
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Enforced max-height and overflow-y-auto on the dialog content 
        to ensure it remains accessible on small Android screens.
      */}
      <DialogContent className="glass-strong border-border/50 w-[95vw] max-w-[400px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl outline-none">
        
        {/* Header Section */}
        <div className={cn(
          "p-6 flex flex-col items-center justify-center relative shrink-0",
          transaction.type === 'income' 
            ? "bg-secondary/10" 
            : "bg-primary/10"
        )}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            {/* <X className="h-4 w-4" /> */}
          </Button>

          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg ring-1 ring-black/5",
            transaction.type === 'income' 
              ? "bg-secondary text-secondary-foreground" 
              : "bg-primary text-primary-foreground"
          )}>
            {transaction.type === 'income' ? (
              <ArrowUpRight className="h-7 w-7" />
            ) : (
              <ArrowDownRight className="h-7 w-7" />
            )}
          </div>
          
          <h2 className={cn(
            "text-3xl font-bold tracking-tight font-mono",
            transaction.type === 'income' ? "text-secondary" : "text-primary"
          )}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </h2>
          <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-[0.2em] opacity-60">
            {transaction.type}
          </span>
        </div>

        {/* Details Body */}
        <div className="p-5 space-y-5">
          
          {/* Description Section */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-2 rounded-lg bg-muted/50 text-muted-foreground shrink-0">
              <AlignLeft className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Description</p>
                {transaction.description.length > 40 && (
                  <button 
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-[10px] text-primary font-medium hover:underline"
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
              
              {/* Enforced line clamping with fallback styles to ensure it matches the 
                "Recent Transactions" look until expanded.
              */}
              <p 
                className={cn(
                  "text-sm font-medium text-foreground/90 leading-snug break-words transition-all duration-300",
                  !isDescriptionExpanded && "line-clamp-2 overflow-hidden"
                )}
                style={!isDescriptionExpanded ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                } : {}}
              >
                {transaction.description}
              </p>
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Category Section */}
          <div className="flex items-start gap-3">
             <div className="mt-0.5 p-2 rounded-lg bg-muted/50 text-muted-foreground shrink-0">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Category</p>
              <span className="text-sm font-medium">{transaction.category}</span>
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Date Section */}
          <div className="flex items-start gap-3">
             <div className="mt-0.5 p-2 rounded-lg bg-muted/50 text-muted-foreground shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date</p>
              <p className="text-sm font-medium">
                {format(new Date(transaction.date), 'EEEE, MMM do, yyyy')}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="pt-2">
            <Button 
              className="w-full gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-m<d"
              onClick={handleEditClick}
            >
              <Pencil className="h-4 w-4" />
              Edit Transaction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}