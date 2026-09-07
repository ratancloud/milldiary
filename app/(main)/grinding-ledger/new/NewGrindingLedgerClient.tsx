"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { PlusSquare, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="container max-w-7xl mx-auto p-3 sm:p-6 md:p-8 space-y-6">
      {/* Top Breadcrumb & Page Header */}
      <PageHeader
        onBack={() => handleAttemptNavigate("back")}
        items={[
          { label: "Grinding Ledger", href: "/grinding-ledger" },
          { label: "New Slip" },
        ]}
        actions={
          <div className="flex w-full sm:w-auto h-9 sm:h-10 items-center p-1 bg-secondary/40 rounded-xl text-xs font-semibold border border-border/80">
            <button
              type="button"
              onClick={() => handleAttemptNavigate("manual")}
              className={cn(
                "flex-1 sm:flex-none h-7 sm:h-8 px-3 sm:px-3.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs",
                activeTab === "manual"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PlusSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Manual Entry</span>
            </button>
            <button
              type="button"
              onClick={() => handleAttemptNavigate("ocr")}
              className={cn(
                "flex-1 sm:flex-none h-7 sm:h-8 px-3 sm:px-3.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs",
                activeTab === "ocr"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span>AI OCR Studio</span>
            </button>
          </div>
        }
      />

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
