"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, PlusSquare, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GrindingLedgerManualForm from "@/components/grindingLedger/GrindingLedgerManualForm";
import GrindingLedgerOcrStudio from "@/components/grindingLedger/GrindingLedgerOcrStudio";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function NewGrindingLedgerClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "ocr" ? "ocr" : "manual";
  const [activeTab, setActiveTab] = useState<"manual" | "ocr">(initialMode);
  const queryClient = useQueryClient();

  const [isOcrDirty, setIsOcrDirty] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<"manual" | "ocr" | "back" | null>(null);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["grindingLedger"] });
    router.push("/grinding-ledger");
  };

  const handleCancel = () => {
    handleAttemptNavigate("back");
  };

  const handleAttemptNavigate = (target: "manual" | "ocr" | "back") => {
    if (activeTab === "ocr" && isOcrDirty && target !== "ocr") {
      setPendingTab(target);
      setShowConfirmDialog(true);
    } else {
      if (target === "back") {
        router.push("/grinding-ledger");
      } else {
        setActiveTab(target);
      }
    }
  };

  const handleConfirmNavigate = () => {
    setShowConfirmDialog(false);
    if (pendingTab === "back") {
      router.push("/grinding-ledger");
    } else if (pendingTab) {
      setActiveTab(pendingTab);
    }
    setPendingTab(null);
  };

  return (
    <div className="container max-w-7xl mx-auto p-3 sm:p-6 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleAttemptNavigate("back")}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shrink-0"
            title="Back to Ledger"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground leading-tight">
              New Grinding Ledger Entry
            </h1>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">
              Select how you want to add new customer slips today.
            </p>
          </div>
        </div>

        {/* Option Selector (Manual vs OCR) */}
        <div className="flex items-center p-1 bg-muted/70 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleAttemptNavigate("manual")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === "manual"
              ? "bg-amber-600 text-white shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <PlusSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Manual Entry</span>
          </button>
          <button
            type="button"
            onClick={() => handleAttemptNavigate("ocr")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === "ocr"
              ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse shrink-0" />
            <span className="truncate">AI OCR Upload</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="transition-all duration-300">
        {activeTab === "manual" ? (
          <GrindingLedgerManualForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <GrindingLedgerOcrStudio
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onDirtyChange={setIsOcrDirty}
          />
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
              Discard AI OCR Results?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              You currently have unsaved AI OCR extraction results. AI calls are expensive and if you switch tabs or leave this page now, these extracted records will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setPendingTab(null)}>
              Stay on OCR Page
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmNavigate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
            >
              Yes, Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
