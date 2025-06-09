import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Key,
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Copy,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CryptographySettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cryptoSettings, setCryptoSettings] = useState<CryptographySettings>({
    keyPairGenerated: true,
    publicKey:
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0m7Iyi42WbZ+tDg39Hn/vOIh8Q4XJ3Yd...",
    keyStrength: "RSA-2048",
    lastKeyRotation: "2024-06-01T10:00:00Z",
  });
  const generateNewKeyPair = async () => {
    if (
      !confirm(
        "Generating a new key pair will invalidate your current keys. Continue?"
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      // Mock key generation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCryptoSettings({
        ...cryptoSettings,
        lastKeyRotation: new Date().toISOString(),
        publicKey:
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA" +
          Math.random().toString(36).substring(2),
      });
      toast.success("New key pair generated successfully!");
    } catch (error) {
      console.error("Error generating key pair:", error);
      toast.error("Failed to generate new key pair. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const copyPublicKey = () => {
    navigator.clipboard.writeText(cryptoSettings.publicKey);
    toast.success("Public key copied to clipboard!");
  };
  
  return (
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
                <span className="text-sm font-medium text-green-800">
                  Key Pair Status
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {cryptoSettings.keyPairGenerated
                  ? "Generated"
                  : "Not Generated"}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Key Strength
                </span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {cryptoSettings.keyStrength}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-800">
                  Last Rotation
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                {new Date(cryptoSettings.lastKeyRotation).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-gray-700 mb-2 block">Public Key</Label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  RSA Public Key
                </span>
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
                {cryptoSettings.publicKey}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">
                  Key Rotation
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Generating a new key pair will invalidate your current keys
                  and may affect existing votes. This action cannot be undone.
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
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Delete Account
            </h4>
            <p className="text-sm text-red-700 mb-3">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptographySettings;
