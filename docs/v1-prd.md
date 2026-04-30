# Bury It! V1 PRD

## Goal

Launch a text-first, fully anonymous mobile app that lets users bury emotional digital clutter and optionally share anonymized burials in a public graveyard.

## Success Criteria

- Users understand the concept within the first session
- Users complete at least one burial in under 2 minutes
- Public burials feel safe, readable, and emotionally compelling
- Users return to browse the public graveyard and create additional burials

## Non-Goals For V1

- Image uploads
- Real-name profiles
- Direct messaging
- Follower graphs
- Search by person
- Location features
- Ads marketplace

## Core Features

### 1. Anonymous Access

- No first name or last name required
- User enters with anonymous auth or magic-link style access
- Public identity is represented only by a generated anonymous handle if needed
- No public profile metadata that could reveal identity

### 2. Burial Creation

Users can create a burial with:

- title
- body text
- category
- tombstone style
- epitaph
- privacy selection: `Private` or `Public`

### 3. Categories

Suggested starter categories:

- Past Love
- Friendship
- Career
- Old Self
- Regret
- Embarrassment
- Broken Dream
- Digital Clutter
- Other

### 4. Tombstone Styles

V1 styles can be simple presets:

- Classic Stone
- Soft Marble
- Minimal Slate
- Weathered Marker
- Midnight Obsidian

### 5. Public Graveyard Feed

Users can browse:

- recent burials
- popular burials
- category-based burials

Each feed card shows:

- title
- category
- epitaph
- excerpt
- tombstone style
- respect count

### 6. Grave Detail

Each public grave includes:

- burial title
- full text or moderated text excerpt
- category
- epitaph
- burial date
- reactions

### 7. Respectful Interactions

V1 reactions:

- Light a Candle
- Leave Flowers
- Pay Respect

Optional short anonymous condolence messages may be added later, but should not block V1.

### 8. Profile

Anonymous users can still have a private account area with:

- my private burials
- my public burials
- total burials
- total respects received
- unlocked badges

## User Stories

- As a user, I want to bury something painful without deleting it forever.
- As a user, I want to stay anonymous so I can be emotionally honest.
- As a user, I want public burials to feel safe and non-exploitative.
- As a user, I want a burial flow that feels ceremonial, not mechanical.
- As a user, I want to browse other anonymous burials and feel less alone.

## Functional Requirements

### Burial Composer

- User can write a text entry up to a defined length
- User must choose a category before publishing
- User can save privately without publishing publicly
- User can add an epitaph separate from the main body

### Public Posting Rules

- Public burials must pass moderation checks
- Personal identifiers should be blocked or masked
- Phone numbers, emails, addresses, full names, and account IDs should be flagged
- System should warn users before public posting if risky text is detected

### Feed

- Feed supports tabs for `Recent`, `Popular`, and `Categories`
- Feed card layout should be consistent and calm
- Content previews should avoid showing overly sensitive raw text when flagged

### Privacy

- No public list of followers or friends
- No public comments in V1 if moderation resources are limited
- No public author identity beyond anonymous system labeling if necessary

## Suggested Badge System

- First Burial
- Let It Rest
- Quiet Visitor
- Gravekeeper
- Cemetery Regular

## Monetization Direction

Premium can include:

- more tombstone styles
- expanded burial limits
- private vault organization
- premium cemetery themes
- advanced personalization

## Risks

- Oversharing and accidental identification
- Harmful content in public burials
- A tone that feels exploitative instead of reflective
- Weak onboarding if the burial metaphor is unclear

## Open Product Decisions

- Whether public burials show full text or excerpt only
- Whether condolences are enabled in V1
- Whether private burials should support timed resurfacing later
