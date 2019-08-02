# TODO

- [ ] Fix: Tooltips cause horizontal scroll on less-wide screens. Investigate.
- [ ] Fix: Tooltips positioned incorrectly after animating back to Home

- [ ] Lay out Talents using flexbox
- [ ] Move routing logic from `Home` into `Calculator`
- [ ] Responsiveness:
  - [ ] Talent tooltips on mobile need different UX
- [ ] Tooltips: 
  - [ ] Support multiple positions for tooltip (currently only `top-right` with fallbacks based on viewport)
  - [ ] Performance: see if we can cache Trigger's getBoundingClientRect and reset it on url change (?)

- [ ] Move icons back under `/src` when https://github.com/facebook/create-react-app/pull/6060 is released as part of 3.0.2