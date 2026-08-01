"use client";

import React from "react";
import { GrindingLedger } from "@/types/grinding-ledger";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import GrindingLedgerManualForm from "./GrindingLedgerManualForm";

interface GrindingLedgerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: GrindingLedger | null;
}

const GrindingLedgerCreateModal: React.FC<GrindingLedgerCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editItem,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent>
        <GrindingLedgerManualForm
          editItem={editItem}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GrindingLedgerCreateModal;
