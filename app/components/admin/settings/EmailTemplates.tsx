"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Mail } from "lucide-react";
import { Button } from "../../ui/button";
import EmailTemplateEditor from "./EmailTemplateEditor";

interface Template {
  label: string;
  file: string;
}

const EMAIL_TEMPLATES: Template[] = [
  { label: "Invitation Email", file: "invitation-email.html" },
  { label: "Password Email", file: "password-email.html" },
  { label: "Payment Failed", file: "payment-failed.html" },
  { label: "Payment Received", file: "payment-recieved.html" },
  { label: "Send OTP", file: "send-otp.html" },
  { label: "Public User Notification", file: "public/user.html" },
];

const EmailTemplates = () => {
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleCloseEditor = () => {
    setEditingTemplate(null);
  };

  return (
    <>
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">
            Email & Notification Templates
          </CardTitle>
          <p className="text-sm text-[#64748b]">
            Customize automated email communications
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {EMAIL_TEMPLATES.map((template, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#007BFF]" />
                  <span className="text-[#1e293b]">{template.label}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#e2e8f0]"
                  onClick={() => handleEditClick(template)}
                >
                  Edit Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingTemplate && (
        <EmailTemplateEditor
          isOpen={!!editingTemplate}
          onClose={handleCloseEditor}
          filename={editingTemplate.file}
          templateLabel={editingTemplate.label}
        />
      )}
    </>
  );
};

export default EmailTemplates;
