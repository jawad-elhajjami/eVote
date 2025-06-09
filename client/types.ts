interface PollOption {
  _id: string
  text: string
  votes: number
}
interface Poll {
  _id: string
  title: string
  description: string
  options: PollOption[]
  createdBy: {
    _id: string
    username: string
  }
  createdAt: string
  deadline?: string
  isActive: boolean
  hasVoted: boolean
  userVote?: string
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