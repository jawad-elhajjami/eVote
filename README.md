# 🗳️ eVote — Secure Cryptography-Based Voting App

eVote is a full-stack web application that enables secure, anonymous voting using cryptographic principles, built as part of the Cryptography & Blockchain course (Master Réseaux et Services Mobiles – FS Kénitra).

This project simulates a centralized structure using separate services:
- A **Key Management System** for user registration and key generation
- A **Voting Server** for vote submission and validation
- A **Frontend Client** for user interaction

---

## 🔐 Core Features

- 🔑 **RSA Key Pair Generation** per voter (2048-bit)
- 🧾 **One Vote per User**, tracked server-side
- ✍️ **Digital Signatures** to verify vote authenticity
- ✅ **Vote Validation** via public-key cryptography
- ❌ **Private Key Never Stored** server-side (downloaded by user only)

---

## 🧪 User Flow

1. **Register** via `/api/auth/register`
   - Generates an RSA key pair
   - Stores public key on server
   - Returns private key for user to download and keep
2. **Login** via `/api/auth/login`
   - Authenticates user with hashed credentials
3. **Vote** via `/api/vote/submit`
   - User selects a candidate and signs the vote with their private key
   - Server verifies signature with stored public key
   - Accepts vote if valid and user hasn’t already voted
4. **Confirmation** shown after successful vote

## 📦 Tech Stack

| Layer       | Technology       |
|-------------|------------------|
| Frontend    | React, OpenPGP.js |
| Backend     | Express.js        |
| Crypto Lib  | Node's `crypto` or `openpgp` |
| Database    | MongoDB (via Mongoose) |
| Auth        | Email + Password (bcrypt) |

---

## 🛡️ Security Principles Applied

- **Asymmetric Cryptography**: RSA keys generated per voter
- **Digital Signatures**: Each vote is signed and verified
- **One-Time Voting**: Server marks voter as “hasVoted”
- **Private Key Confidentiality**: Not stored or sent to server again

