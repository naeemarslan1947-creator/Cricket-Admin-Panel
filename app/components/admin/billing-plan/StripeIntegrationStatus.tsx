import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { AlertCircle, CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';

interface StripeIssue {
  message: string;
}

interface StripeStatus {
  connected: boolean;
  lastSynced: string;
  apiVersion: string;
  webhooksActive: boolean;
  testMode: boolean;
  issues: StripeIssue[];
}

interface StripeIntegrationStatusProps {
  stripeStatus: StripeStatus;
}

const StripeIntegrationStatus: React.FC<StripeIntegrationStatusProps> = ({ stripeStatus }) => {
  return (
    <Card className="border-[#e2e8f0] ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1e293b]">Stripe Integration Status</CardTitle>
            <p className="text-sm text-[#64748b]">Monitor your Stripe connection and webhooks</p>
          </div>

          {stripeStatus.connected ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Connected
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Disconnected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-[#1e293b]">Connection Details</h3>
            <div className="space-y-3">

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                {stripeStatus.connected ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#1e293b]">Connection Status</p>
                  <p className="text-sm text-[#64748b]">
                    {stripeStatus.connected
                      ? 'Successfully connected to Stripe'
                      : 'Not connected'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1e293b]">Last Sync</p>
                  <p className="text-sm text-[#64748b]">{stripeStatus.lastSynced}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1e293b]">API Version</p>
                  <p className="text-sm text-[#64748b]">{stripeStatus.apiVersion}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-[#1e293b]">Webhook Configuration</h3>
            <div className="space-y-3">

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                {stripeStatus.webhooksActive ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#1e293b]">Webhook Status</p>
                  <p className="text-sm text-[#64748b]">
                    {stripeStatus.webhooksActive
                      ? 'Active and receiving events'
                      : 'Inactive'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                {stripeStatus.testMode ? (
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#1e293b]">Environment</p>
                  <p className="text-sm text-[#64748b]">
                    {stripeStatus.testMode
                      ? 'Test Mode (Development)'
                      : 'Live Mode (Production)'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {stripeStatus.issues.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-medium text-red-900">Active Issues</h3>
            </div>
            <div className="space-y-2">
              {stripeStatus.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600">•</span>
                  <p className="text-red-800">{issue.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {stripeStatus.issues.length === 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">
                No issues detected. Your Stripe integration is working properly.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Now
          </Button>

          <Button variant="outline" className="border-[#e2e8f0]">
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeIntegrationStatus;
