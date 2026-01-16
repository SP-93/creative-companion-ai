# OHL Oracle Platform Architecture

## Page Structure

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero + Features + CTA |
| `/chat` | World Chat | Public chat for all users |
| `/oracle` | Oracle AI | AI-powered Q&A (Basic/DEV access) |
| `/project` | Project Preview | Token economics, roadmap, team |
| `/pricing` | Pricing | All subscription tiers |
| `/admin` | Admin Panel | Platform management (admin only) |
| `/token-deploy` | Token Deploy | Smart contract deployment |

## Access Levels

| Level | Price | Duration | Features |
|-------|-------|----------|----------|
| Free | $0 | Forever | World Chat, wallet auth |
| Basic Oracle | $1.99 | Lifetime | AI Q&A access |
| DEV 48h | $1.99 | 48 hours | Advanced AI + OHL rewards |
| DEV 15 days | $11.99 | 15 days | Advanced AI + OHL rewards |
| DEV Monthly | $19.99 | 30 days | Advanced AI + OHL rewards |

## Token Economics

- **Token**: OHL (O'HippoLab)
- **Total Supply**: 250,000,000 OHL
- **Initial Circulation**: 50% (125M)
- **Rewards Pool**: 25% (62.5M)
- **Team & Dev**: 15% (37.5M)
- **Reserve**: 10% (25M)

## Key Components

### Pages
- `src/pages/Index.tsx` - Landing page
- `src/pages/Chat.tsx` - World Chat
- `src/pages/Oracle.tsx` - Oracle AI
- `src/pages/Project.tsx` - Project info
- `src/pages/Pricing.tsx` - Pricing plans

### Components
- `src/components/WorldChat.tsx` - Public chat
- `src/components/OracleChat.tsx` - AI chat
- `src/components/TokenEconomics.tsx` - Tokenomics display
- `src/components/ProjectRoadmap.tsx` - Development timeline

## Supabase Tables

### profiles
- wallet_address (PK)
- username
- has_basic_access
- dev_tier
- dev_expires_at

### chat_messages
- id, wallet_address, username
- content, message_type
- created_at

### token_rewards (NEW)
- id, wallet_address
- amount, reason
- tx_hash, claimed_at
