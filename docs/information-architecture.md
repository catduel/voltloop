# Bury It! Information Architecture

## App Structure

### Main Navigation

- Graveyard
- Bury
- My Graves
- Profile

## Primary Screens

1. Splash
2. Onboarding
3. Anonymous Access
4. Graveyard Feed
5. Burial Composer
6. Burial Preview
7. Grave Detail
8. My Graves
9. Profile
10. Settings
11. Premium

## Key Flow: First Burial

1. User opens the app
2. User sees a short onboarding story about burying what they cannot delete
3. User enters anonymously
4. User taps `Bury Something`
5. User writes a title and body
6. User chooses a category
7. User selects a tombstone style
8. User writes an epitaph
9. User chooses `Private` or `Public`
10. If `Public`, system runs anonymity and safety checks
11. User confirms burial
12. Burial appears in `My Graves` and possibly in the public feed

## Key Flow: Public Browsing

1. User opens `Graveyard`
2. User scrolls public burials
3. User filters by `Recent`, `Popular`, or category
4. User opens a grave
5. User reads the burial and leaves a respectful reaction

## Data Model

### User

- `anonymous_user_id`
- `generated_handle`
- `created_at`
- `subscription_status`
- `badge_state`

### Burial

- `burial_id`
- `anonymous_user_id`
- `title`
- `body`
- `epitaph`
- `category`
- `tombstone_style`
- `privacy_status`
- `moderation_status`
- `created_at`
- `reaction_counts`

### Reaction

- `reaction_id`
- `burial_id`
- `anonymous_user_id`
- `reaction_type`
- `created_at`

## Privacy Rules In Structure

- No first name field
- No last name field
- No profile photo
- No public social graph
- No public contact fields
- No public linking to external accounts

## Content Strategy

### Feed Card Anatomy

- category label
- burial title
- short epitaph
- safe text excerpt
- reaction bar

### Grave Detail Anatomy

- title
- category
- epitaph
- full or limited body
- date
- reaction row

## States

### Burial Visibility States

- Draft
- Private
- Pending Review
- Public
- Limited
- Removed

### Moderation States

- Clean
- Needs Masking
- Needs Review
- Rejected

## Future Expansion

- timed reopening of private burials
- curated cemetery themes
- voice ambience
- guided letting-go rituals
- seasonal memorial events
