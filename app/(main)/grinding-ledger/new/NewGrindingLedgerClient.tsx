"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, PlusSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import GrindingLedgerManualForm from "@/components/grindingLedger/GrindingLedgerManualForm";
import GrindingLedgerOcrStudio from "@/components/grindingLedger/GrindingLedgerOcrStudio";

export default function NewGrindingLedgerClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "ocr" ? "ocr" : "manual";
  const [activeTab, setActiveTab] = useState<"manual" | "ocr">(initialMode);
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["grindingLedger"] });
    router.push("/grinding-ledger");
  };

  const handleCancel = () => {
    router.push("/grinding-ledger");
  };

  return (
    <div className="container max-w-5xl mx-auto p-3 sm:p-6 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
            className="h-10 w-10 rounded-xl shrink-0"
            title="Back to Ledger"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              New Grinding Ledger Entry
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Select how you want to add new customer slips to the ledger today.
            </p>
          </div>
        </div>

        {/* Option Selector (Manual vs OCR) */}
        <div className="flex items-center p-1 bg-muted/70 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "manual"
                ? "bg-amber-600 text-white shadow-md scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PlusSquare className="w-4 h-4" />
            <span>Manual Entry</span>
          </button>
          <button
            onClick={() => setActiveTab("ocr")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "ocr"
                ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI OCR Upload</span>
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
          />
        )}
      </div>
    </div>
  );
}
