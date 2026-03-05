# iOS Release QA Checklist

## Before You Start

Run the quality gate and confirm it passes cleanly:

```
npm run check
```

All Prettier and TypeScript errors must be resolved before proceeding.

---

## Device Requirements

| Test area                    | Simulator    | Real device required |
| ---------------------------- | ------------ | -------------------- |
| UI layout, navigation        | OK           | —                    |
| Audio playback (orin, sutta) | Not reliable | Yes                  |
| Sleep / background resume    | Not reliable | Yes                  |
| AppState foreground event    | Partial      | Yes                  |
| TestFlight install + launch  | No           | Yes                  |

**Use a real iPhone for all audio and sleep tests.**

---

## Manual Tests

### 1. Timer — Sleep / Resume

> Regression target: timer drift after iOS suspends the JS thread.

- [ ] Start a countdown timer (select a course, tap start)
- [ ] Lock the screen and wait at least 2 minutes
- [ ] Unlock the screen
- [ ] Verify the displayed time matches wall-clock elapsed time (within 1–2 seconds)
- [ ] Verify the next bell fires at the correct segment boundary after resume

### 2. Audio — Startup Sequence

> Regression target: orin / sutta players failing silently on mount.

- [ ] With `readingOn = false`: tap start → orin bell plays → timer begins counting
- [ ] With `readingOn = true`: tap start → sutta MP3 plays → sange MP3 plays → orin bell plays → timer begins counting
- [ ] No audio plays after tapping Stop and navigating back to TimerStart

### 3. Audio — Segment Bells

- [ ] Create a course with 3 segments (e.g., 1 min / 1 min / 1 min)
- [ ] Run the timer to completion
- [ ] Confirm a bell sounds at each segment boundary (3 bells total)
- [ ] Confirm no duplicate or missed bells after a sleep/resume in the middle

### 4. Mode Toggle — Countdown vs Countup

- [ ] In TimerConfig, switch to **countup** mode, save
- [ ] Start a timer — confirm display counts up from 0:00:00
- [ ] In TimerConfig, switch to **countdown** mode, save
- [ ] Start a timer — confirm display counts down from the total course time
- [ ] Verify mode persists after app restart (AsyncStorage)

### 5. Stop / Resume Cycle

- [ ] Start a timer, tap the pause button — confirm timer freezes
- [ ] Tap play — confirm timer resumes from where it paused (no jump)
- [ ] Tap Stop — confirm audio stops and navigation returns to TimerStart
- [ ] Immediately start again — confirm a fresh timer (no stale state from previous run)

### 6. Course Persistence

- [ ] Add a new course in TimerConfig, save
- [ ] Force-quit the app and relaunch
- [ ] Verify the course appears in TimerStart

### 7. Bell Type Selection

- [ ] In TimerConfig, change the orin (bell) type
- [ ] Start a timer — confirm the newly selected bell sound plays (not the previous one)
- [ ] Verify selection persists after app restart

---

## Release Candidate Checklist

### Code & Build

- [ ] `npm run check` passes with no warnings
- [ ] All manual tests above pass on a real iPhone
- [ ] No `console.error` output during normal flows (check Metro logs)

### EAS Build

```
eas build --platform ios --profile production
```

- [ ] Build completes without errors
- [ ] `appVersionSource: remote` — confirm build number auto-incremented in EAS dashboard
- [ ] Bundle ID is `jp.theravada.meditation`

### TestFlight

- [ ] Submit build to TestFlight: `eas submit --platform ios`
- [ ] Install on real device via TestFlight (not Simulator)
- [ ] Repeat audio and sleep/resume tests on the TestFlight build
- [ ] Confirm app launches without crash on first install (cold start)
