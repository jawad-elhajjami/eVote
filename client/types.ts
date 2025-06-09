interface Poll {
  _id: string;
  title: string;
  description: string;
  options: Array<{
    text: string;
    votes: number;
  }>;
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  endDate?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    roles: string[];
  };
}
interface CryptographySettings {
  keyPairGenerated: boolean
  publicKey: string
  keyStrength: string
  lastKeyRotation: string
}