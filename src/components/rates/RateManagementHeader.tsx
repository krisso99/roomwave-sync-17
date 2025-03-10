
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, RefreshCw, History, Gift } from 'lucide-react';

interface RateManagementHeaderProps {
  onBulkUpdateOpen: () => void;
  onCheckRateParity: () => void;
  onHistoryLogOpen: () => void;
  onNewPromotion: () => void;
}

const RateManagementHeader: React.FC<RateManagementHeaderProps> = ({
  onBulkUpdateOpen,
  onCheckRateParity,
  onHistoryLogOpen,
  onNewPromotion,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 className="text-2xl font-display font-bold">Rate Management</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBulkUpdateOpen}>
          <Layers className="mr-2 h-4 w-4" />
          Bulk Update
        </Button>
        <Button variant="outline" size="sm" onClick={onCheckRateParity}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Parity
        </Button>
        <Button variant="outline" size="sm" onClick={onHistoryLogOpen}>
          <History className="mr-2 h-4 w-4" />
          Rate History
        </Button>
        <Button onClick={onNewPromotion}>
          <Gift className="mr-2 h-4 w-4" />
          New Promotion
        </Button>
      </div>
    </div>
  );
};

export default RateManagementHeader;
