"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Shield,
  Bell,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Copy,
} from "lucide-react"

interface UserSettings {
  profile: {
    username: string
    email: string
    firstName: string
    lastName: string
    bio: string
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    loginNotifications: boolean
  }
  notifications: {
    emailNotifications: boolean
    pollCreated: boolean
    pollEnding: boolean
    voteConfirmation: boolean
    securityAlerts: boolean
  }
  privacy: {
    profileVisibility: "public" | "private"
    showVotingHistory: boolean
    allowDataExport: boolean
  }
  cryptography: {
    keyPairGenerated: boolean
    publicKey: string
    keyStrength: string
    lastKeyRotation: string
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Form states
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginNotifications: true,
    },
    notifications: {
      emailNotifications: true,
      pollCreated: true,
      pollEnding: true,
      voteConfirmation: true,
      securityAlerts: true,
    },
    privacy: {
      profileVisibility: "public",
      showVotingHistory: false,
      allowDataExport: true,
    },
    cryptography: {
      keyPairGenerated: true,
      publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0m7Iyi42WbZ+tDg39Hn/vOIh8Q4XJ3Yd...",
      keyStrength: "RSA-2048",
      lastKeyRotation: "2024-06-01T10:00:00Z",
    },
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      setTimeout(() => {
        setSettings({
          ...settings,
          profile: {
            ...settings.profile,
            username: user?.username || "",
            email: user?.username ? `${user.username}@university.edu` : "",
          },
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching settings:", error)
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      // Mock save - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }

    try {
      setSaving(true)
      // Mock password change - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("Password changed successfully!")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      console.error("Error changing password:", error)
      alert("Failed to change password. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const generateNewKeyPair = async () => {
    if (!confirm("Generating a new key pair will invalidate your current keys. Continue?")) {
      return
    }

    try {
      setSaving(true)
      // Mock key generation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSettings({
        ...settings,
        cryptography: {
          ...settings.cryptography,
          lastKeyRotation: new Date().toISOString(),
          publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA" + Math.random().toString(36).substring(2),
        },
      })
      alert("New key pair generated successfully!")
    } catch (error) {
      console.error("Error generating key pair:", error)
      alert("Failed to generate new key pair. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const exportData = async () => {
    try {
      // Mock data export - replace with actual API call
      const data = {
        profile: settings.profile,
        votingHistory: [],
        polls: [],
        exportDate: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `evote-data-${user?.username}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data. Please try again.")
    }
  }

  const copyPublicKey = () => {
    navigator.clipboard.writeText(settings.cryptography.publicKey)
    alert("Public key copied to clipboard!")
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "cryptography", label: "Cryptography", icon: Key },
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-gray-100 shadow">
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card className="bg-white border-gray-100 shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Username</Label>
                    <Input
                      value={settings.profile.username}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, username: e.target.value },
                        })
                      }
                      className="mt-1"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Email</Label>
                    <Input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, email: e.target.value },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">First Name</Label>
                    <Input
                      value={settings.profile.firstName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, firstName: e.target.value },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Last Name</Label>
                    <Input
                      value={settings.profile.lastName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, lastName: e.target.value },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700">Bio</Label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, bio: e.target.value },
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card className="bg-white border-gray-100 shadow">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorEnabled: checked },
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-gray-700">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.security.sessionTimeout.toString()}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: Number.parseInt(value) },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Login Notifications</Label>
                      <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                    </div>
                    <Switch
                      checked={settings.security.loginNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, loginNotifications: checked },
                        })
                      }
                    />
                  </div>

                  <Button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                    {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card className="bg-white border-gray-100 shadow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Current Password</Label>
                    <div className="relative mt-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700">New Password</Label>
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700">Confirm New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button onClick={handlePasswordChange} disabled={saving} className="bg-red-600 hover:bg-red-700">
                    {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <Card className="bg-white border-gray-100 shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">New Poll Created</Label>
                    <p className="text-sm text-gray-500">Get notified when new polls are available</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pollCreated}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, pollCreated: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">Poll Ending Soon</Label>
                    <p className="text-sm text-gray-500">Get reminded when polls are about to close</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pollEnding}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, pollEnding: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">Vote Confirmation</Label>
                    <p className="text-sm text-gray-500">Confirm when your votes are successfully recorded</p>
                  </div>
                  <Switch
                    checked={settings.notifications.voteConfirmation}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, voteConfirmation: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">Security Alerts</Label>
                    <p className="text-sm text-gray-500">Important security notifications (recommended)</p>
                  </div>
                  <Switch
                    checked={settings.notifications.securityAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, securityAlerts: checked },
                      })
                    }
                  />
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <Card className="bg-white border-gray-100 shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-700">Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value: "public" | "private") =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, profileVisibility: value },
                      })
                    }
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">Show Voting History</Label>
                    <p className="text-sm text-gray-500">Allow others to see which polls you've participated in</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showVotingHistory}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showVotingHistory: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">Allow Data Export</Label>
                    <p className="text-sm text-gray-500">Enable the ability to export your data</p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowDataExport}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, allowDataExport: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Data Export</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Download a copy of all your data including profile information, voting history, and created polls.
                  </p>
                  <Button
                    onClick={exportData}
                    disabled={!settings.privacy.allowDataExport}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export My Data
                  </Button>
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Cryptography Settings */}
          {activeTab === "cryptography" && (
            <div className="space-y-6">
              <Card className="bg-white border-gray-100 shadow">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Cryptographic Keys
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Key Pair Status</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        {settings.cryptography.keyPairGenerated ? "Generated" : "Not Generated"}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">Key Strength</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">{settings.cryptography.keyStrength}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <RefreshCw className="h-5 w-5 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-800">Last Rotation</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {new Date(settings.cryptography.lastKeyRotation).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 mb-2 block">Public Key</Label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">RSA Public Key</span>
                        <Button
                          onClick={copyPublicKey}
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs font-mono text-gray-800 break-all bg-white p-2 rounded border">
                        {settings.cryptography.publicKey}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Key Rotation</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Generating a new key pair will invalidate your current keys and may affect existing votes.
                          This action cannot be undone.
                        </p>
                        <Button
                          onClick={generateNewKeyPair}
                          disabled={saving}
                          variant="outline"
                          className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                        >
                          {saving ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Key className="mr-2 h-4 w-4" />
                          )}
                          Generate New Key Pair
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-white border-red-200 shadow">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
