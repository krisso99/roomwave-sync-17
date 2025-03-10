
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RoomType, RateRule, Promotion } from '@/contexts/RateContext';
import { DateRange } from 'react-day-picker';
import RateEditor from '@/components/rates/RateEditor';
import PromotionForm from '@/components/rates/PromotionForm';
import RateHistoryLog from '@/components/rates/RateHistoryLog';
import BulkRateUpdate from '@/components/rates/BulkRateUpdate';

interface RateDialogsProps {
  roomTypes: RoomType[];
  channels: any[];
  selectedRoomTypes: string[];
  dateRange: DateRange | undefined;
  isRateEditorOpen: boolean;
  setIsRateEditorOpen: (open: boolean) => void;
  isPromotionFormOpen: boolean;
  setIsPromotionFormOpen: (open: boolean) => void;
  isHistoryLogOpen: boolean;
  setIsHistoryLogOpen: (open: boolean) => void;
  isBulkUpdateOpen: boolean;
  setIsBulkUpdateOpen: (open: boolean) => void;
  selectedRateRule: RateRule | null;
  selectedPromotion: Promotion | null;
}

const RateDialogs: React.FC<RateDialogsProps> = ({
  roomTypes,
  channels,
  selectedRoomTypes,
  dateRange,
  isRateEditorOpen,
  setIsRateEditorOpen,
  isPromotionFormOpen,
  setIsPromotionFormOpen,
  isHistoryLogOpen,
  setIsHistoryLogOpen,
  isBulkUpdateOpen,
  setIsBulkUpdateOpen,
  selectedRateRule,
  selectedPromotion,
}) => {
  return (
    <>
      {/* Rate Editor Dialog */}
      <Dialog open={isRateEditorOpen} onOpenChange={setIsRateEditorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRateRule && 'id' in selectedRateRule ? 'Edit Rate' : 'Create New Rate'}
            </DialogTitle>
          </DialogHeader>
          <RateEditor
            rateRule={selectedRateRule}
            roomTypes={roomTypes}
            onSave={() => setIsRateEditorOpen(false)}
            onCancel={() => setIsRateEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Promotion Form Dialog */}
      <Dialog open={isPromotionFormOpen} onOpenChange={setIsPromotionFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
          </DialogHeader>
          <PromotionForm
            promotion={selectedPromotion}
            roomTypes={roomTypes}
            channels={channels}
            onSave={() => setIsPromotionFormOpen(false)}
            onCancel={() => setIsPromotionFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Rate History Dialog */}
      <Dialog open={isHistoryLogOpen} onOpenChange={setIsHistoryLogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Rate Change History</DialogTitle>
          </DialogHeader>
          <RateHistoryLog roomTypes={roomTypes} />
        </DialogContent>
      </Dialog>
      
      {/* Bulk Update Dialog */}
      <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Rate Update</DialogTitle>
          </DialogHeader>
          <BulkRateUpdate
            roomTypes={roomTypes}
            selectedRoomTypes={selectedRoomTypes}
            dateRange={dateRange}
            onComplete={() => setIsBulkUpdateOpen(false)}
            onCancel={() => setIsBulkUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RateDialogs;
