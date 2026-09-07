"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  PenLine,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Languages,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
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
  const [activeTab, setActiveTab] = useState<"manual" | "ocr">("ocr");
  const queryClient = useQueryClient();

  const [isOcrDirty, setIsOcrDirty] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<"manual" | "ocr" | "back" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "manual") {
        setActiveTab("manual");
      }
    }
  }, []);

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

  const modeSwitch = (
    <div className="flex w-full sm:w-auto items-center p-1 rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-border/80 dark:border-white/10 shadow-2xs shrink-0">
      <button
        type="button"
        onClick={() => handleAttemptNavigate("ocr")}
        className={cn(
          "flex-1 sm:flex-initial h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]",
          activeTab === "ocr"
            ? "bg-primary text-primary-foreground font-bold shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>AI OCR</span>
      </button>
      <button
        type="button"
        onClick={() => handleAttemptNavigate("manual")}
        className={cn(
          "flex-1 sm:flex-initial h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]",
          activeTab === "manual"
            ? "bg-primary text-primary-foreground font-bold shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <PenLine className="w-3.5 h-3.5 shrink-0" />
        <span>Manual Form</span>
      </button>
    </div>
  );

  return (
    <div className="container max-w-7xl mx-auto p-3 sm:p-6 md:p-8 space-y-5">
      {/* 1. Breadcrumbs */}
      <PageHeader
        onBack={() => handleAttemptNavigate("back")}
        items={[
          { label: "Grinding Ledger", href: "/grinding-ledger" },
          { label: "New Slip" },
        ]}
      />

      {/* 2. Active Workflow Workspace with Embedded Header Switch */}
      <div className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        {activeTab === "manual" ? (
          <GrindingLedgerManualForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            modeSwitch={modeSwitch}
          />
        ) : (
          <GrindingLedgerOcrStudio
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onDirtyChange={setIsOcrDirty}
            modeSwitch={modeSwitch}
          />
        )}
      </div>

      {/* 5. Safe Exit Guard Modal (AlertDialog) */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="rounded-2xl border border-border/80 dark:border-white/10 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
              <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span>Discard AI OCR Results?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
              You currently have unsaved AI OCR extraction results. If you switch workflows or navigate away now, these parsed records will be discarded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel
              onClick={() => setPendingTab(null)}
              className="rounded-xl border border-border/80 hover:bg-secondary/70 text-xs font-semibold cursor-pointer"
            >
              Keep Editing OCR
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmNavigate}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold cursor-pointer active:scale-95"
            >
              Discard & Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
