/* =========================================================================
   SINGLE SOURCE OF TRUTH. Every number/claim on the site lives here, once.

   THE ONE RULE: never type a number into an HTML file or a data-count attribute.
   If it's a fact, it lives in this file and nowhere else. Both index.html and
   mmu/index.html read from this, so the two builds can never disagree.

   proofPending: true  →  DO NOT send/publish the link until BOTH are true:
       (a) a screenshot backs the figure, AND
       (b) Paul's LinkedIn shows the same number.
   Employers cross-check. A mismatch reads as inflation and kills credibility.
   The day LinkedIn is updated, update the value here too, the same day, the same number.
   ========================================================================= */
window.FACTS = Object.freeze({
  // ---- Views / profile visits (PROOF-GATED. LinkedIn shows 1.1M+ views / 300k+ profile visits) ----
  monthlyViews:      { value: 1100000, prefix: '', suffix: '+', unit: 'monthly views across socials', proofPending: true },
  monthlyReach:      { value: 300000,  prefix: '', suffix: '+', unit: 'monthly profile visits',       proofPending: true },

  // ---- Commerce (MAIN site only, kept off the MMU build) ----
  revenueDay:        { value: 3000, prefix: '£', suffix: '+', unit: 'in a day · first pop-up' },
  leads:             { value: 500,  prefix: '', suffix: '+', unit: 'leads captured' },
  // Merchants Yard fan zone: Paul's conservative floor estimate (sold out across 6 tiers, £6-£120). MAIN site only, not the MMU comms build.
  ticketRevenue:     { value: 5000, prefix: '£', suffix: '+', unit: 'revenue in ticket sales' },

  // ---- Audience ----
  followers:         { value: 9400, prefix: '', suffix: '+', unit: 'followers, grown from ~50' },

  // ---- Social operations (MMU-relevant) ----
  communityMessages: { value: 3000, prefix: '', suffix: '+', unit: 'messages & DMs answered', proofPending: true },
  educators:         { value: 1000, prefix: '', suffix: '+', unit: 'educators reached', full: true },

  // ---- Pop-up 01 detail ----
  popupEntries:      { value: 491, prefix: '', suffix: '',  unit: 'raffle entries' },
  popupLeads:        { value: 533, prefix: '', suffix: '',  unit: 'leads' },
  popupPeople:       { value: 200, prefix: '', suffix: '+', unit: 'through the door' },
  popupDays:         { value: 11,  prefix: '', suffix: '',  unit: 'days to launch' },

  // ---- Per-video performance (cross-platform; verified) ----
  dubaiLikes:        { value: 5000,   prefix: '', suffix: '+', unit: 'likes' },
  // Paul's viral "your brand finally understood marketing" reel (IG DWRJv2Qii-m).
  // NOTE: these belong to THAT reel, NOT the Merchants Yard hero. Unused until that reel is placed.
  viralReelLikes:    { value: 20000,  prefix: '', suffix: '+', unit: 'likes' },
  viralReelViews:    { value: 350000, prefix: '', suffix: '+', unit: 'views across socials' },
  matchaViews:       { value: 500000, prefix: '', suffix: '+', unit: 'views across socials' },

  // ---- Lists & contact ----
  platforms: ['LinkedIn', 'Instagram', 'TikTok', 'X', 'Facebook'],
  contact: {
    email: 'frompaulxam@gmail.com',
    linkedin: 'https://www.linkedin.com/in/paul-ma-986ab8328/'
  }
});

/* PROOF GATE. Flip to true ONLY when BOTH are true:
   (a) you have the Instagram Insights screenshots for the proofPending figures, AND
   (b) your LinkedIn shows the same numbers.
   While false, proof-gated figures still show (they are your real numbers) but carry a
   small "*" and an "being verified" footnote, so nothing reads as a hard verified claim
   that contradicts LinkedIn. Do not send either link until this is true. */
window.FACTS_PROOF_READY = true; // Paul confirmed (2026-06-20) his LinkedIn now shows the same 1.1M+ views / 300k+ profile visits, so these proof-gated figures are send-safe.
