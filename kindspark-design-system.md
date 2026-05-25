# KindSpark — Design System & UI Implementation Spec v0.1

## Objetivo

Este documento define exclusivamente o design visual, UX, UI patterns e regras de implementação de interface do aplicativo KindSpark.

Este arquivo NÃO define regras de negócio completas do produto.

Fonte de verdade para produto:
- `kindspark.md`

Fonte de verdade para design:
- ESTE ARQUIVO

Objetivo:
garantir consistência visual e permitir implementação fiel via SDD.

---

# Design Philosophy

## Core Principles

O app deve transmitir:

- positividade
- leveza
- acolhimento
- simplicidade
- sensação de recompensa emocional
- baixa fricção
- clareza

A experiência deve parecer:

"gentle habit app"

Nunca:

- corporativo
- pesado
- técnico
- complexo
- agressivo
- gamificação exagerada

---

# Visual Identity

## Brand Personality

KindSpark é:

- warm
- optimistic
- soft
- playful
- emotionally positive
- minimal

Tom emocional:

calm + rewarding + uplifting

---

# Color Palette

## Primary

Warm Orange Gradient

Primary CTA:

Start:
#FF8A3D

End:
#FF6A21

Gradient:
linear-gradient(135deg, #FF8A3D 0%, #FF6A21 100%)

Uso:

- botões principais
- CTAs
- highlights
- active states
- streak highlights

---

## Secondary

Soft Peach:
#FFE8D8

Uso:

- cards secundários
- containers suaves
- background sections

---

## Background

App Background:
#F8F5F0

Card Background:
#FFFFFF

Modal Background:
#FFFFFF

Overlay:
rgba(0,0,0,0.35)

Reward Modal Blur:
rgba(0,0,0,0.55)

---

## Text Colors

Primary:
#1F1F1F

Secondary:
#6D6D6D

Muted:
#9A9A9A

Success:
#2E9E5B

Warning:
#E89C2D

---

## Accent Colors

Yellow:
#FFC94A

Green:
#77C48C

Soft Red:
#FF7B6E

Sky:
#8FD6FF

---

# Typography

## Font Family

Primary:
Inter

Fallback:
System Sans Serif

---

## Weights

Regular:
400

Medium:
500

SemiBold:
600

Bold:
700

---

## Font Scale

Hero:
32

Title:
24

Section:
20

Card Title:
18

Body:
16

Secondary:
14

Caption:
12

Micro:
10

---

# Border Radius

Primary Radius:
24px

Cards:
20px

Buttons:
999px

Modal:
28px

Input:
18px

Mini cards:
16px

---

# Shadows

Soft only.

Never harsh.

Primary card shadow:

0 8px 30px rgba(0,0,0,0.06)

Floating modal:

0 20px 60px rgba(0,0,0,0.18)

CTA button:

0 10px 20px rgba(255,106,33,0.22)

---

# Layout System

## Base Spacing Scale

4
8
12
16
20
24
32
40
48

---

## Safe Area

Respect device notch and safe area.

Mandatory.

---

## Screen Padding

Horizontal:
20px

Vertical:
16px

---

# Illustration Style

Style:

soft editorial illustrations

Characteristics:

- warm palette
- rounded shapes
- minimal details
- friendly characters
- soft gradients
- subtle emotional expression

Never:

- realistic photography
- neon cyberpunk
- flat enterprise icons
- dark illustrations

---

# Iconography

Style:

rounded
minimal
line + filled hybrid

Examples:

- bell
- flame
- heart
- gift
- history
- settings

Stroke:

2px

Rounded corners preferred.

---

# Motion Design

## Philosophy

Motion should feel:

gentle
rewarding
alive

Never:

fast
aggressive
chaotic

---

## Standard Durations

Fast:
150ms

Default:
250ms

Soft:
350ms

Celebration:
500ms

---

## Animations

Allowed:

- fade in
- scale in
- soft bounce
- subtle confetti
- card transition
- tab indicator movement
- button press shrink

Avoid:

- spinning chaos
- excessive parallax
- shaking
- hard spring effects

---

# Navigation Structure

Bottom Tab Navigation

Tabs:

1. Today
2. Progress
3. History
4. Settings

Persistent bottom nav.

Rounded top container preferred.

---

# Screen Specifications

---

# 1. Onboarding 1

Purpose:

introduce brand

Layout:

Top:
logo centered

Middle:
illustration

Bottom:
CTA

Content:

Logo:
KindSpark

Subtitle:
Small actions can create big change.

CTA:
Get Started

Components:

- logo
- illustration
- pagination dots
- primary button

---

# 2. Onboarding 2

Purpose:

communicate emotional value

Message:

A positive habit can transform your day.

Layout same as onboarding 1.

---

# 3. Notifications Permission

Purpose:

push opt-in

Components:

- large bell icon
- explanatory title
- short description
- primary CTA
- secondary text action

CTA:
Enable Notifications

Secondary:
Not now

Behavior:

If accepted:
continue

If denied:
continue

No blocking.

---

# 4. Notification Time Picker

Purpose:

daily reminder scheduling

UI:

wheel picker

Time:
HH:mm

Default:
09:00

CTA:
Save Time

Behavior:

Persist locally.

---

# 5. First Action Intro

Purpose:

transition into first task

Components:

- reward illustration
- celebratory visual
- CTA

CTA:
See My Action

---

# 6. Today Screen

Purpose:

main daily loop

Hierarchy:

Header
Action Card
Primary CTA
Secondary CTA
Refresh Action
Bottom banner ad
Tab navigation

---

## Header

Greeting:

Good morning, {name}

Optional streak badge.

---

## Action Card

Contains:

illustration
title
description

Large emotional centerpiece.

---

## Buttons

Primary:

I did it ✨

Orange gradient

Secondary:

Skip

Outlined

Tertiary:

New idea

Text button with icon

---

## States

Default
Completed
Skipped
Loading new action
Empty fallback

---

# 7. Completion Screen

Purpose:

positive reinforcement

Components:

- celebratory illustration
- affirmation
- streak summary
- CTA

Message:

Amazing ✨

---

# 8. New Idea Modal/Card

Purpose:

replace action

Components:

- dismiss
- illustration
- title
- description
- accept CTA
- regenerate action

Behavior:

soft modal transition

---

# 9. Progress Screen

Purpose:

motivation

Sections:

Current streak
Stats
Achievements
Optional ad banner

---

## Metrics

Show:

Current streak
Completed actions
Skipped actions
Completion rate

---

## Achievements

Milestones:

3 days
7 days
14 days
30 days

Visual states:

locked
active
completed

---

# 10. History Screen

Purpose:

review behavior

List:

chronological

Each row:

icon
title
relative date
status

Statuses:

done
skipped

Optional ad block.

---

# 11. Settings Screen

Sections:

Notifications
Reminder Time
Sound
Vibration
Privacy
Terms
About
Rate App

Chevron rows.

---

# 12. Rewarded Ad Modal

Optional monetization

Purpose:

unlock extra ideas

Layout:

gift illustration
headline
short explanation
primary CTA
dismiss action

Never intrusive.

User must explicitly opt in.

---

# Component Library

## Buttons

Variants:

Primary
Secondary
Ghost
Text

---

## Cards

Variants:

Action card
Stats card
Achievement card
History item
Ad card

---

## Inputs

Wheel picker
Toggle switch
List row

---

## Badges

Streak
Completed
Reward
Achievement

---

# Accessibility

Must support:

minimum touch target 44x44

high text contrast

screen readers

dynamic font scaling

reduced motion fallback

---

# Ads UX Rules

Monetization model:
ads only

Rules:

banner ads:
subtle placement only

rewarded ads:
user initiated only

never:

fullscreen forced interruption
mid-action interruption
aggressive popups

---

# Responsive Rules

Support:

small phones
medium phones
large phones

Tablet optional.

---

# Technical UI Notes

Recommended stack:

React Native
Expo
NativeWind or Tailwind RN
Expo Router
React Navigation
Reanimated
Expo Notifications

---

# Implementation Constraints

Maintain exact emotional tone.

Do NOT redesign into:

dark mode
enterprise dashboard
high contrast fintech style
gaming UI
hyper-gamified UX

This product should feel emotionally warm.

---

# Final UX Principle

The user should feel:

"I did one small good thing today."

That emotional outcome is more important than feature complexity.