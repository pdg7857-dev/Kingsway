/**
 * The no-bid / disqualification library. A structured catalogue of the reasons
 * a government opportunity should be declined, grouped into seven categories,
 * plus an early-screening checklist that catches hard disqualifiers before any
 * estimator time is spent. Phil uses these lenses when reading and qualifying
 * opportunities; the content surfaces on the bid/no-bid and screening pages.
 */

export type NoBidCategory = {
  title: string;
  intro: string;
  factors: string[];
};

export const NO_BID_LIBRARY: NoBidCategory[] = [
  {
    title: "Financial",
    intro:
      "Before anything else, I look at whether the money works. A bid you win on bad economics is worse than one you never wrote, so these are the dollar-and-cents reasons I flag an opportunity as a likely no-bid.",
    factors: [
      "Contract value too small",
      "margin too thin",
      "retained amounts too high",
      "mobilization cost too high",
      "bid bond cost too high",
      "performance bond exposure too high",
      "insurance limits too high",
      "wage/fringe requirements erode margin",
      "fixed-price exposure too long",
      "escalation risk too high",
      "payment cycle too slow",
      "cash-flow burden too heavy",
      "liquidated damages too aggressive",
      "price realism likely to punish honest pricing",
    ],
  },
  {
    title: "Capability",
    intro:
      "The next question is whether you can actually deliver the work as specified. When a requirement sits outside what your shop can credibly self-perform or staff, that is a capability gap I want to surface early.",
    factors: [
      "Scope outside core trade",
      "self-perform gap",
      "no local crews",
      "weak geographic coverage",
      "no relevant past performance",
      "no similar public-sector references",
      "insufficient superintendent or PM capacity",
      "insufficient estimator bandwidth",
      "subcontractor partners not lined up",
      "equipment unavailable",
      "union or open-shop mismatch",
      "security-clearance gap",
      "technical-certification gap",
      "sustainability-reporting gap",
      "service-level commitments exceed operating model",
    ],
  },
  {
    title: "Compliance",
    intro:
      "Public bids are won and lost on the fine print. These are the mandatory and procedural traps that get a strong bid thrown out before it is ever evaluated, so I read for them deliberately.",
    factors: [
      "Mandatory criteria too restrictive",
      "missed mandatory site meeting",
      "missing bid bond",
      "bond in wrong legal name",
      "missing insurance certificate",
      "incomplete forms",
      "unsigned forms",
      "wrong submission form",
      "conditional bid language",
      "conflict-of-interest disclosure issue",
      "exceeded mandatory price cap",
      "missed addendum acknowledgement",
      "missing security clearance",
      "missing certifications",
      "late submission risk",
      "failure to meet minimum resource qualifications",
    ],
  },
  {
    title: "Timing",
    intro:
      "Even a perfect-fit opportunity is a no-bid if the clock does not allow a quality response. I weigh the deadlines and internal cycles against what it really takes to put together a competitive submission.",
    factors: [
      "Turnaround too short",
      "addenda too late",
      "Q&A window too tight",
      "internal sign-off cycle too slow",
      "estimator already committed",
      "executive reviewer unavailable",
      "site-visit timing impossible",
      "holiday-period deadline",
      "too little time for subcontractor pricing",
      "award window too uncertain",
      "start date unrealistic",
      "close date overlaps other priority pursuits",
      "insufficient time for compliance checking",
      "insufficient time to price volatile inputs",
    ],
  },
  {
    title: "Competitive",
    intro:
      "Some bids are wired, crowded, or simply stacked against a newer entrant. These are the signals that tell me the field is unfavourable enough that the hours are better spent elsewhere.",
    factors: [
      "Incumbent advantage too strong",
      "buyer appears to favour repeat players",
      "prior-experience scoring excludes newer entrants",
      "overly specific specs imply a preferred vendor",
      "framework or roster already closed",
      "set-aside misalignment",
      "contract too bundled",
      "evaluation weighted away from your strengths",
      "low chance to differentiate",
      "existing local-network disadvantage",
      "discouraging buyer history",
      "market already crowded with entrenched firms",
      "relationship gap too large",
      "likely cover-bid situation",
    ],
  },
  {
    title: "Administrative",
    intro:
      "A lot of opportunity waste hides in the plumbing: portals, profiles and codes that have to be set up before you can even read the documents. I flag when the administrative lift outweighs the prize.",
    factors: [
      "New platform registration needed",
      "duplicate company-profile creation",
      "NIGP or commodity-code setup",
      "SAP Business Network account needed",
      "CanadaBuys questionnaire needed",
      "W-9 or tax form needed",
      "portal login required to access documents",
      "addenda scattered across systems",
      "keyword alerts too noisy",
      "category mapping too weak",
      "documents hidden behind viewer accounts",
      "portal data incomplete",
      "internal tracker not updated",
      "too many portals for one coordinator to watch well",
    ],
  },
  {
    title: "Strategic",
    intro:
      "Finally, I ask whether the work moves your business in the direction you want. A winnable bid that pulls you off strategy is still a no-bid, so these are the higher-level fit questions I weigh last.",
    factors: [
      "Opportunity outside target vertical",
      "wrong contract-size band",
      "poor customer fit",
      "weak expected win probability",
      "distracts from active backlog",
      "no follow-on potential",
      "no recurring-revenue value",
      "low strategic geography",
      "wrong delivery model",
      "weak cross-sell potential",
      "weak past relationship",
      "resources better deployed elsewhere",
      "bid would consume disproportionate senior attention",
    ],
  },
];

export type ScreeningCheck = {
  question: string;
  disqualifier: string;
  why: string;
};

export const SCREENING_CHECKLIST: ScreeningCheck[] = [
  {
    question: "Is there a mandatory site meeting or prequalification event, and can you attend it?",
    disqualifier: "Missed mandatory event",
    why: "Most buyers reject any bid from a firm that skipped a mandatory meeting, regardless of how strong the rest of the submission is.",
  },
  {
    question: "Are all mandatory criteria genuinely attainable for your shop?",
    disqualifier: "Unattainable mandatory",
    why: "A single failed mandatory means automatic disqualification, so if even one is out of reach the bid is dead before it starts.",
  },
  {
    question: "Are the insurance and bonding requirements realistic for you to meet?",
    disqualifier: "Bond or insurance gap",
    why: "If you cannot secure the required bond or carry the required limits in time, you cannot submit a compliant bid.",
  },
  {
    question: "Does your legal-entity information line up across bond, registration and certificates?",
    disqualifier: "Entity-name mismatch",
    why: "A bond or certificate issued in a name that does not match your registration is a common and avoidable cause of rejection.",
  },
  {
    question: "Is the geography practical for your crews and supervision?",
    disqualifier: "Out-of-range geography",
    why: "Work too far from your base eats margin in mobilization and supervision, and often signals a poor fit from the start.",
  },
  {
    question: "Does the contract value justify the cost of pursuing it?",
    disqualifier: "Pursuit cost too high",
    why: "If the estimating and proposal effort outweighs the realistic return, the opportunity is not worth your team's hours.",
  },
  {
    question: "Is the response window realistic for a quality submission?",
    disqualifier: "Window too short",
    why: "A turnaround that forces a rushed bid usually produces a losing one, so a hopeless timeline is an early no.",
  },
  {
    question: "Can you provide proof of past performance in exactly the form required?",
    disqualifier: "Past-performance gap",
    why: "Buyers often demand similar projects of a specific size or sector, and references that do not match the form score poorly or fail outright.",
  },
  {
    question: "Are the required certifications and clearances current?",
    disqualifier: "Lapsed credential",
    why: "An expired certification or clearance you cannot renew before the deadline will knock you out on compliance.",
  },
  {
    question: "Are there unusual ESG, emissions or diversity-reporting demands you can meet?",
    disqualifier: "Reporting demand unmet",
    why: "Some buyers now require sustainability or diversity reporting that a smaller firm cannot produce in time, which quietly disqualifies it.",
  },
  {
    question: "Does the evaluation method reward how you actually win?",
    disqualifier: "Evaluation misaligned",
    why: "If scoring is weighted toward strengths you do not have, even a strong bid is unlikely to place, so the math rarely favours you.",
  },
  {
    question: "Is the buyer, size and delivery model strategically aligned with your business?",
    disqualifier: "Off-strategy fit",
    why: "Winning work that pulls you away from your target market and delivery model can cost more than it returns.",
  },
  {
    question: "Do you have the internal delivery capacity if you actually win?",
    disqualifier: "No delivery capacity",
    why: "Bidding work you cannot staff or supervise on award damages performance, references and the next pursuit.",
  },
  {
    question: "Are there signs the solicitation may be cancelled, reissued or has confused scope?",
    disqualifier: "Likely cancellation",
    why: "Contradictory documents, missing attachments or scope confusion often precede a cancellation or reissue, wasting any effort spent early.",
  },
];
