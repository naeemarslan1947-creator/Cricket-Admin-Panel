"use client";
import React, { useState, useEffect } from "react";
import makeRequest from "../../../../Api's/apiHelper";
import { GetViewHtmlFile, UpdateViewHtmlFile } from "../../../../Api's/repo";
import { toastError, toastSuccess } from "../../../helper/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Loader2, Save } from "lucide-react";

interface EmailTemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  templateLabel: string;
}

const EmailTemplateEditor = ({
  isOpen,
  onClose,
  filename,
  templateLabel,
}: EmailTemplateEditorProps) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch HTML content when dialog opens
  useEffect(() => {
    if (isOpen && filename) {
      fetchHtmlContent();
    }
  }, [isOpen, filename]);

  const fetchHtmlContent = async () => {
    setIsLoading(true);
    try {
      const response = await makeRequest<{ content?: string; result?: { content: string } } | string>({
        url: `${GetViewHtmlFile}?filename=${encodeURIComponent(filename)}`,
        method: "GET",
      });

      if (response.data) {
        let content = "";
        if (typeof response.data === "string") {
          content = response.data;
        }
        else if (typeof response.data.content === "string") {
          content = response.data.content;
        }
        else if (
          response.data.result &&
          typeof response.data.result.content === "string"
        ) {
          content = response.data.result.content;
        }

        setHtmlContent(content);
      }
    } catch (error) {
      console.error("Error fetching HTML content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await makeRequest({
        url: UpdateViewHtmlFile,
        method: "POST",
        data: {
          content: htmlContent,
          filename: filename,
        },
      });
      setHasChanges(false);
      toastSuccess("Template saved successfully!");
      onClose();
    } catch (error) {
      toastError("Failed to save template. Please try again.");
      console.error("Error saving HTML content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (!confirmDiscard) return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Template: {templateLabel}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#007BFF]" />
            <span className="ml-2 text-[#64748b]">Loading template...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <textarea
                value={htmlContent}
                onChange={handleContentChange}
                className="w-full h-[400px] p-4 font-mono text-sm bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#007BFF] resize-none"
                placeholder="HTML content will appear here..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-[#e2e8f0]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-[#007BFF] hover:bg-[#0056b3]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplateEditor;

