"use client";
import { useState } from 'react';
import { Shield, Lock, Smartphone, Key, AlertTriangle, CheckCircle, Monitor, MapPin, Clock, Trash2, X, Copy, Check, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/app/components/ui/dialog';


interface Session {
  id: number;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityLog {
  id: number;
  action: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState<'overview' | '2fa' | 'password' | 'activity'>('overview');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [backupCodes, setBackupCodes] = useState([
    'ABCD-EFGH-IJKL',
    'MNOP-QRST-UVWX',
    'YZAB-CDEF-GHIJ',
    'KLMN-OPQR-STUV',
    'WXYZ-1234-5678',
    '9012-3456-7890',
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [activeSessions, setActiveSessions] = useState<Session[]>([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ipAddress: '103.21.45.78',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: 2,
      device: 'Safari on iPhone 14 Pro',
      location: 'Mumbai, India',
      ipAddress: '103.21.45.79',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: 3,
      device: 'Firefox on MacBook Pro',
      location: 'Delhi, India',
      ipAddress: '49.36.218.45',
      lastActive: '1 day ago',
      isCurrent: false,
    },
  ]);

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: 1,
      action: 'Successful login',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ipAddress: '103.21.45.78',
      timestamp: 'Today, 10:30 AM',
      status: 'success',
    },
    {
      id: 2,
      action: 'Password changed',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ipAddress: '103.21.45.78',
      timestamp: 'Nov 5, 2024, 3:45 PM',
      status: 'success',
    },
    {
      id: 3,
      action: 'Failed login attempt',
      device: 'Unknown device',
      location: 'Bangalore, India',
      ipAddress: '182.75.34.21',
      timestamp: 'Nov 3, 2024, 11:20 PM',
      status: 'failed',
    },
    {
      id: 4,
      action: '2FA enabled',
      device: 'Safari on iPhone',
      location: 'Mumbai, India',
      ipAddress: '103.21.45.79',
      timestamp: 'Nov 1, 2024, 9:15 AM',
      status: 'success',
    },
    {
      id: 5,
      action: 'Suspicious login detected',
      device: 'Chrome on Android',
      location: 'Kolkata, India',
      ipAddress: '45.127.89.56',
      timestamp: 'Oct 28, 2024, 2:30 AM',
      status: 'warning',
    },
  ]);

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      setShowQRDialog(true);
    } else {
      setTwoFactorEnabled(false);
    }
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    setShowQRDialog(false);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleTerminateSession = (id: number) => {
    setActiveSessions(activeSessions.filter(session => session.id !== id));
  };

  const handleTerminateAllSessions = () => {
    setActiveSessions(activeSessions.filter(session => session.isCurrent));
  };

  const copyBackupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const regenerateBackupCodes = () => {
    setBackupCodes([
      'NEW1-NEW2-NEW3',
      'NEW4-NEW5-NEW6',
      'NEW7-NEW8-NEW9',
      'NEWA-NEWB-NEWC',
      'NEWD-NEWE-NEWF',
      'NEWG-NEWH-NEWI',
    ]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Warning</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl text-[#1e293b] mb-1">Security & 2FA</h1>
          <p className="text-[#64748b]">Manage your account security and authentication settings</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="w-5 h-5 text-[#00C853]" />
          <div>
            <p className="text-xs text-[#64748b]">Security Status</p>
            <p className="text-sm text-green-700">Secured</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e2e8f0]">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#007BFF] text-[#007BFF]'
                : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            className={`px-4 py-3 text-sm transition-colors border-b-2 ${
              activeTab === '2fa'
                ? 'border-[#007BFF] text-[#007BFF]'
                : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Two-Factor Auth
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-3 text-sm transition-colors border-b-2 ${
              activeTab === 'password'
                ? 'border-[#007BFF] text-[#007BFF]'
                : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-3 text-sm transition-colors border-b-2 ${
              activeTab === 'activity'
                ? 'border-[#007BFF] text-[#007BFF]'
                : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Activity & Sessions
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Security Score Card */}
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Security Score</p>
                  <h3 className="text-3xl text-[#1e293b]">95%</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-[#64748b]">Your account security is excellent</p>
            </CardContent>
          </Card>

          {/* 2FA Status Card */}
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Two-Factor Auth</p>
                  <h3 className="text-lg text-[#1e293b]">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full ${twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                  <Smartphone className={`w-6 h-6 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[#e2e8f0]"
                onClick={() => setActiveTab('2fa')}
              >
                Manage 2FA
              </Button>
            </CardContent>
          </Card>

          {/* Active Sessions Card */}
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Active Sessions</p>
                  <h3 className="text-3xl text-[#1e293b]">{activeSessions.length}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[#e2e8f0]"
                onClick={() => setActiveTab('activity')}
              >
                View Sessions
              </Button>
            </CardContent>
          </Card>

          {/* Password Status */}
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-[#64748b] mb-1">Password</p>
                  <h3 className="text-sm text-[#1e293b]">Last changed</h3>
                  <p className="text-xs text-[#64748b]">Nov 5, 2024</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[#e2e8f0]"
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-[#e2e8f0] shadow-sm md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#1e293b]">Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' :
                        log.status === 'failed' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`} />
                      <div>
                        <p className="text-sm text-[#1e293b]">{log.action}</p>
                        <p className="text-xs text-[#64748b]">{log.timestamp}</p>
                      </div>
                    </div>
                    {getStatusBadge(log.status)}
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[#e2e8f0] mt-4"
                onClick={() => setActiveTab('activity')}
              >
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2FA Tab */}
      {activeTab === '2fa' && (
        <div className="max-w-2xl">
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#007BFF]" />
                </div>
                <div>
                  <CardTitle className="text-[#1e293b]">Two-Factor Authentication</CardTitle>
                  <CardDescription className="text-[#64748b]">
                    Add an extra layer of security to your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Section */}
              <div className="p-5 bg-slate-50 rounded-lg border border-[#e2e8f0]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${twoFactorEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    <div>
                      <p className="text-sm text-[#1e293b]">Status: {twoFactorEnabled ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <Badge className={twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900">
                      {twoFactorEnabled 
                        ? 'Your account is protected with 2FA. Keep your backup codes in a safe place.'
                        : 'Enable 2FA to protect your account from unauthorized access.'
                      }
                    </p>
                  </div>
                </div>

                <Button 
                  className={`w-full ${twoFactorEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00C853] hover:bg-[#00A843]'} text-white`}
                  onClick={handleToggle2FA}
                >
                  {twoFactorEnabled ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Disable 2FA
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enable 2FA
                    </>
                  )}
                </Button>
              </div>

              {/* Backup Codes Section - Only show when enabled */}
              {twoFactorEnabled && (
                <div className="p-5 bg-slate-50 rounded-lg border border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm text-[#1e293b]">Backup Recovery Codes</h4>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">6 available</Badge>
                  </div>
                  <p className="text-xs text-[#64748b] mb-4">Use these codes to access your account if you lose your device</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {backupCodes.slice(0, 4).map((code, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border border-[#e2e8f0] rounded-lg">
                        <code className="text-xs text-[#1e293b]">{code}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyBackupCode(code)}
                        >
                          {copiedCode === code ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-[#64748b]" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full border-[#e2e8f0]">
                        <Key className="w-3.5 h-3.5 mr-2" />
                        View All {backupCodes.length} Codes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Key className="w-5 h-5 text-[#007BFF]" />
                          Backup Recovery Codes
                        </DialogTitle>
                        <DialogDescription>
                          Save these codes securely. Each code can only be used once.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 my-4">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-[#e2e8f0] rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#64748b] w-6">#{index + 1}</span>
                              <code className="text-sm text-[#1e293b]">{code}</code>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => copyBackupCode(code)}
                            >
                              {copiedCode === code ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-[#64748b]" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          className="border-[#e2e8f0] w-full"
                          onClick={regenerateBackupCodes}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate All Codes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Authenticator Details - Only show when enabled */}
              {twoFactorEnabled && (
                <div className="p-5 bg-slate-50 rounded-lg border border-[#e2e8f0]">
                  <h4 className="text-sm text-[#1e293b] mb-4">Authenticator App Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">App Name</span>
                      <span className="text-sm text-[#1e293b]">Google Authenticator</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Configured On</span>
                      <span className="text-sm text-[#1e293b]">Nov 1, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Last Used</span>
                      <span className="text-sm text-[#1e293b]">Today, 10:30 AM</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="max-w-2xl">
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-[#1e293b]">Change Password</CardTitle>
                  <CardDescription className="text-[#64748b]">
                    Keep your password secure by changing it regularly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-50 border border-[#e2e8f0] rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#1e293b]">Last Password Change</p>
                    <p className="text-xs text-[#64748b]">Nov 5, 2024 at 3:45 PM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Secure</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-[#1e293b]">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-[#e2e8f0] h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-[#1e293b]">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-[#e2e8f0] h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-[#1e293b]">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-[#e2e8f0] h-11"
                  />
                </div>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-[#1e293b] mb-3">
                  Your password must meet these requirements:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs text-blue-900">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Minimum 8 characters
                  </li>
                  <li className="flex items-center gap-2 text-xs text-blue-900">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mix of uppercase and lowercase
                  </li>
                  <li className="flex items-center gap-2 text-xs text-blue-900">
                    <CheckCircle className="w-3.5 h-3.5" />
                    At least one number
                  </li>
                  <li className="flex items-center gap-2 text-xs text-blue-900">
                    <CheckCircle className="w-3.5 h-3.5" />
                    At least one special character
                  </li>
                </ul>
              </div>

              <Button 
                className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white h-11"
                onClick={handlePasswordChange}
              >
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity & Sessions Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Active Sessions */}
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-[#007BFF]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#1e293b]">Active Login Sessions</CardTitle>
                    <CardDescription className="text-[#64748b]">
                      {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''} • Manage your devices
                    </CardDescription>
                  </div>
                </div>
                {activeSessions.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleTerminateAllSessions}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    End All Others
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-5 rounded-lg border transition-all ${
                      session.isCurrent 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-slate-50 border-[#e2e8f0] hover:border-[#007BFF]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                          session.isCurrent ? 'bg-green-100' : 'bg-white'
                        }`}>
                          <Monitor className={`w-6 h-6 ${session.isCurrent ? 'text-green-600' : 'text-[#64748b]'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm text-[#1e293b]">{session.device}</h4>
                            {session.isCurrent && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
                              <span className="text-xs text-[#64748b]">{session.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Key className="w-3.5 h-3.5 text-[#64748b]" />
                              <span className="text-xs text-[#64748b]">{session.ipAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-[#64748b]" />
                              <span className="text-xs text-[#64748b]">{session.lastActive}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleTerminateSession(session.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Activity Log */}
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#64748b]" />
                </div>
                <div>
                  <CardTitle className="text-[#1e293b]">Security Activity Log</CardTitle>
                  <CardDescription className="text-[#64748b]">
                    Recent security events and account changes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y divide-[#e2e8f0]">
                {securityLogs.map((log) => (
                  <div key={log.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 ${
                          log.status === 'success' ? 'bg-green-500' :
                          log.status === 'failed' ? 'bg-red-500' :
                          'bg-amber-500'
                        }`} />
                        <div>
                          <h4 className="text-sm text-[#1e293b] mb-1">{log.action}</h4>
                          <p className="text-xs text-[#64748b]">{log.timestamp}</p>
                        </div>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5 text-[#64748b]" />
                        <span className="text-xs text-[#64748b]">{log.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
                        <span className="text-xs text-[#64748b]">{log.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2FA Setup Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#007BFF]" />
              Enable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 my-4">
            <div className="flex justify-center p-8 bg-slate-50 border-2 border-dashed border-[#e2e8f0] rounded-lg">
              <div className="w-48 h-48 bg-white border border-[#e2e8f0] flex items-center justify-center rounded-lg shadow-sm">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-[#64748b] mx-auto mb-2" />
                  <p className="text-xs text-[#64748b]">QR Code</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#64748b] mb-3">Or enter manually:</p>
              <div className="p-4 bg-slate-50 border border-[#e2e8f0] rounded-lg">
                <code className="text-sm text-[#1e293b] tracking-wider">JBSW Y3DP EHPK 3PXP</code>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code" className="text-[#1e293b]">
                Enter 6-digit code
              </Label>
              <Input
                id="verification-code"
                placeholder="000000"
                maxLength={6}
                className="text-center text-xl tracking-[0.5em] border-[#e2e8f0] h-14"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowQRDialog(false)}
              className="border-[#e2e8f0] flex-1"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#00C853] hover:bg-[#00A843] text-white flex-1"
              onClick={handleEnable2FA}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
