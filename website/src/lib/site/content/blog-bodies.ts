/**
 * Long-form bodies for blog posts.
 *
 * A small set of high-value slugs get genuinely deep, hand-written articles
 * (DEEP_BODIES). Every other slug gets a substantial, useful body generated
 * from the topic's title, category and excerpt (buildGeneratedBody) so that no
 * page is ever thin or empty.
 *
 * Voice: first-person Phil. Phil finds, monitors and qualifies opportunities.
 * He does not write proposals or submit bids.
 */

import type { Faq } from "@/components/site/faq";
import type { Section } from "./types";
import type { BlogTopic } from "@/lib/site/blog";

export type BlogBody = {
  /** Estimated read time in minutes. */
  readMins: number;
  /** Long-form sections rendered through LongFormBody. */
  sections: Section[];
  /** Post-specific FAQ rendered above the closing CTA. */
  faqs: Faq[];
  /** Optional related cross-links (paths under /platforms or /industries). */
  related?: { label: string; href: string }[];
  /** Which lead-form variant to close with. */
  leadVariant: "call" | "sample" | "guide";
};

/* ------------------------------------------------------------------ Deep bodies */

export const DEEP_BODIES: Record<string, BlogBody> = {
  "merx-complete-guide": {
    readMins: 11,
    leadVariant: "call",
    related: [
      { label: "MERX expert", href: "/merx-expert" },
      { label: "Ontario government contracts", href: "/blog/ontario-government-contracts-guide" },
      { label: "Construction opportunities", href: "/construction-government-contracts" },
    ],
    sections: [
      {
        id: "what-merx-is",
        heading: "What MERX actually is (and is not)",
        blocks: [
          {
            type: "p",
            text: "MERX is the largest tender aggregation service in Canada. It pulls together opportunities from federal departments, provinces, municipalities, broader public sector bodies and a long tail of agencies that have chosen it as their posting home. For a lot of Canadian buyers it is the default place to publish, which is exactly why so many vendors treat it as the front door to government work.",
          },
          {
            type: "p",
            text: "Here is the part most people get wrong. MERX is an aggregator, not the source. It is excellent at breadth, but it does not carry every opportunity, and the way it ingests and categorizes postings from hundreds of different buyers is uneven. Two postings for nearly identical work can land under different categories, with different keywords, on different days. If you treat MERX as the whole picture, you will miss things, and you will miss them quietly.",
          },
          {
            type: "callout",
            text: "I treat MERX as the single most important Canadian source, never as the only one. It catches the majority of opportunities for most trades, but the gaps are real and they are predictable once you know where to look.",
          },
        ],
      },
      {
        id: "how-postings-are-organized",
        heading: "How postings are organized, and why that trips people up",
        blocks: [
          {
            type: "p",
            text: "MERX organizes opportunities by category and by the codes a buyer attaches when they post. The trouble is that the buyer chooses those codes, and buyers are inconsistent. A facilities maintenance contract might be tagged under building services by one municipality and under janitorial or general construction by the next. If your notification profile only watches one of those, you never see the other.",
          },
          {
            type: "p",
            text: "On top of category drift, the search itself rewards exact wording. A bid for snow and ice management reads very differently from one titled winter maintenance services, even though you would happily do both. The portal does not know they are the same to you. That is the core limitation of any keyword-driven system, and it is why I qualify by intent rather than by matching strings.",
          },
          {
            type: "h3",
            text: "The three layers I watch on every MERX search",
          },
          {
            type: "ul",
            items: [
              "Category and code coverage, set wide enough that adjacent tagging does not hide a relevant posting.",
              "Title and description language, read for intent rather than exact-match keywords.",
              "Buyer and jurisdiction, so I can cross-check against the agencies I know post elsewhere too.",
            ],
          },
        ],
      },
      {
        id: "notification-blind-spots",
        heading: "Where the default notifications let bids slip past",
        blocks: [
          {
            type: "p",
            text: "Most vendors set up a MERX notification profile once, choose a few categories, and trust it. Then they wonder why a competitor down the road won work they never saw. The notification engine only fires on the categories and codes you selected, against the codes the buyer happened to use. Every mismatch between those two is a silent miss. Nothing bounces, nothing flags, the opportunity simply never reaches you.",
          },
          {
            type: "p",
            text: "There is also a timing problem. Amendments and addenda change scope, deadlines and mandatory requirements after a bid posts. If you are not tracking the document set on every opportunity you care about, you can prepare against a scope that no longer exists. I track changes on everything I am watching for a client, so a late addendum is news the day it lands, not a surprise the week the bid closes.",
          },
          {
            type: "callout",
            text: "A notification profile is a starting point, not a strategy. The opportunities that hurt most are the ones a profile was never configured to catch, because you never knew they were missing.",
          },
        ],
      },
      {
        id: "how-i-read-a-merx-posting",
        heading: "How I read a MERX posting before recommending a bid",
        blocks: [
          {
            type: "p",
            text: "When a posting clears my monitoring and looks relevant, I do not hand it over and call it a lead. I read the documents the way an evaluator will, and I qualify fit before it ever reaches you. That review follows the same order every time.",
          },
          {
            type: "ol",
            items: [
              "Mandatory requirements first. These are pass or fail. If you cannot prove a mandatory, nothing else matters and I say so up front.",
              "Scope of work. What is actually being bought, at what volume, over what term, and whether it matches the work you want more of.",
              "Evaluation criteria. How the bid is scored, so I can judge whether you can realistically place high enough to win, not just submit.",
              "Bonding, insurance and certifications. The thresholds that quietly eliminate bidders before a single price is compared.",
              "Term and recompete signals. Whether this is a one-off or the kind of multi-year work, or standing offer, worth real effort.",
            ],
          },
          {
            type: "p",
            text: "Only after that do I form a view on whether the opportunity is a go or a no-go for you. Plenty of relevant-looking postings come back as a clear no, and that is the point. Knowing what to skip protects the time you would otherwise spend chasing work you were never positioned to win.",
          },
        ],
      },
      {
        id: "merx-and-the-rest",
        heading: "MERX inside a wider monitoring setup",
        blocks: [
          {
            type: "p",
            text: "For clients bidding in Canada, MERX anchors the coverage but it never stands alone. Ontario work also flows through Biddingo and a long list of municipal portals on bids&tenders. Quebec lives on SEAO. Provinces run their own systems, and some buyers post only on their own sites. My job is to consolidate all of that into one reviewed feed so you see qualified opportunities, not a pile of portals to check by hand.",
          },
          {
            type: "p",
            text: "If you want to see how I handle MERX specifically, the dedicated guide goes deeper on the platform itself. And if you bid in Ontario, the provincial guide maps how MERX, Biddingo and the municipal layer fit together.",
          },
        ],
      },
      {
        id: "getting-the-most-from-merx",
        heading: "Getting the most out of MERX as a vendor",
        blocks: [
          {
            type: "p",
            text: "A few habits separate vendors who win work through MERX from those who keep wondering where it went. The first is keeping your supplier profile complete and current. MERX uses your profile to decide what to surface and to let buyers find you, so a thin or outdated profile quietly narrows the funnel before you ever search. The second is widening your notification categories well past the obvious one, because the cost of a few extra notices is nothing next to the cost of a missed bid that was tagged a category over.",
          },
          {
            type: "p",
            text: "The third habit is reading the document set, not just the summary. The posting page tells you the headline, but the requirements, the evaluation and the real scope live in the attachments. Plenty of bids that look perfect in the summary fall apart in the fine print, and plenty that look unremarkable turn out to be exactly the recurring work you want. I always go to the documents, because that is where the decision actually gets made.",
          },
          {
            type: "callout",
            text: "MERX rewards the vendors who treat it as a tool to work, not a feed to skim. A complete profile, wide categories and a genuine read of the documents will catch more, and qualify better, than any amount of casual checking.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is MERX free to use?",
        a: "You can browse and search a great deal on MERX without paying, and registering as a supplier is free. Paid tiers add notification features and access conveniences, but the bigger limitation is never the price, it is that any single portal, free or paid, only shows you part of the picture.",
      },
      {
        q: "Does MERX show every government opportunity in Canada?",
        a: "No. It is the largest aggregator and it catches the majority of opportunities for most trades, but provinces, municipalities and broader public sector bodies post in places MERX does not always reach. That is why I monitor it alongside the other sources your buyers use.",
      },
      {
        q: "Why do I miss opportunities even with MERX notifications turned on?",
        a: "Notifications only fire on the categories and codes you selected, against the codes the buyer happened to use. Every mismatch is a silent miss. I monitor by intent and read postings myself, so a posting tagged in an unexpected category still gets caught.",
      },
    ],
  },

  "how-to-qualify-a-government-bid": {
    readMins: 10,
    leadVariant: "call",
    related: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Reading an RFP", href: "/blog/reading-an-rfp-what-matters" },
      { label: "When not to bid", href: "/blog/when-not-to-bid" },
    ],
    sections: [
      {
        id: "why-qualify-first",
        heading: "Why qualification comes before everything else",
        blocks: [
          {
            type: "p",
            text: "A proposal is expensive. Even a modest bid eats hours of your most senior people, and those hours come straight out of the work that already pays you. So the single most valuable thing I do is decide, before you spend any of that time, whether an opportunity is genuinely worth pursuing. Qualification is not paperwork. It is the gate that protects your capacity.",
          },
          {
            type: "callout",
            text: "The goal is not to bid more. It is to bid the work you can actually win, and to walk away from the rest early, while it is still cheap to walk away.",
          },
        ],
      },
      {
        id: "step-mandatories",
        heading: "Step one: clear the mandatory requirements",
        blocks: [
          {
            type: "p",
            text: "Mandatory requirements are pass or fail. Miss one and the most beautiful proposal in the world gets set aside unread. So this is always where I start. I pull every mandatory out of the document, including the ones buried in appendices and referenced standards, and I check each one against what you can actually prove on paper.",
          },
          {
            type: "p",
            text: "Common mandatories that quietly disqualify bidders include minimum years in business, specific certifications, licensing in the jurisdiction, bonding capacity, insurance limits, and reference projects of a defined size or recency. If you cannot meet one and it is not waivable, the qualification ends here and I tell you plainly. That is a good outcome, not a failure. You just got hours of your week back.",
          },
        ],
      },
      {
        id: "step-scope",
        heading: "Step two: read the scope for genuine fit",
        blocks: [
          {
            type: "p",
            text: "A posting can match your trade on paper and still be wrong for you. The scope of work tells the real story: the volume, the term, the locations, the service levels, the response times. I read it asking one question on your behalf, is this the kind of work you want more of, delivered the way you can actually deliver it?",
          },
          {
            type: "ul",
            items: [
              "Volume and term: is this a one-off or the multi-year, recurring work that is worth real effort?",
              "Geography: are the locations inside the area you can serve profitably, not just technically reach?",
              "Service levels: are response times and performance standards ones you can hit without bleeding margin?",
              "Hidden scope: are there obligations tucked into the contract terms that change the true cost of the job?",
            ],
          },
        ],
      },
      {
        id: "step-evaluation",
        heading: "Step three: understand how you will be scored",
        blocks: [
          {
            type: "p",
            text: "Submitting is not the same as competing. The evaluation criteria tell you how the buyer will actually decide, and they vary enormously. Some contracts are lowest compliant price and nothing else. Others weight experience, methodology, team and references heavily, with price as a fraction of the score. I read the scoring scheme to judge whether you can realistically place high enough to win, not merely qualify to be considered.",
          },
          {
            type: "p",
            text: "This is also where I watch for red flags that a contract is wired for an incumbent: oddly specific requirements that only one firm could meet, reference criteria that mirror an existing contract a little too closely, or evaluation weightings that reward exactly what the current holder already does. None of that is provable, but the patterns are real, and they belong in an honest go or no-go.",
          },
        ],
      },
      {
        id: "step-go-no-go",
        heading: "Step four: the go or no-go",
        blocks: [
          {
            type: "p",
            text: "By this point I can give you a clear recommendation with the reasoning behind it. A go means the mandatories are clear, the scope fits, and the evaluation gives you a realistic path to winning. A no-go means one of those failed, and I tell you which one so the decision is yours to make with full information.",
          },
          {
            type: "ol",
            items: [
              "Can you meet every mandatory and prove it? If no, stop here.",
              "Does the scope match the work you want, at a volume and term that justify the effort?",
              "Does the evaluation give you a realistic path to win, not just to submit?",
              "Are there red flags suggesting the outcome is decided? If so, weigh them honestly.",
              "Is the expected value worth the hours this bid will cost your team?",
            ],
          },
          {
            type: "callout",
            text: "A disciplined no-go is worth as much as a good lead. Every bid you correctly decline frees the time and energy for one you can actually win.",
          },
        ],
      },
      {
        id: "hidden-disqualifiers",
        heading: "The disqualifiers hiding in the fine print",
        blocks: [
          {
            type: "p",
            text: "Some of the most expensive surprises are not in the obvious mandatory section at all. They are tucked into the terms and conditions, the appendices, and the standards a document references rather than spells out. Bonding capacity is the classic one: a contract size that needs a surety line larger than yours will write ends the conversation, no matter how good a fit the work is. Insurance limits work the same way, and so do requirements to carry specific coverage you do not currently hold.",
          },
          {
            type: "p",
            text: "Reference projects are another quiet gate. A buyer may require past work of a defined size, recency and type, and may require those references to be verifiable and contactable. If your strongest projects are a year too old or a little too small, you can be technically capable and still ineligible. I pull these requirements out into the open early, because finding one halfway through writing is the worst possible time to learn you never qualified.",
          },
          {
            type: "ul",
            items: [
              "Bonding and surety limits that exceed what your line will support.",
              "Insurance coverage types or limits you do not currently carry.",
              "Reference projects that must match a defined size, recency or scope.",
              "Jurisdiction-specific licensing or registration that takes time to obtain.",
              "Referenced standards and codes that add obligations the summary never mentions.",
            ],
          },
        ],
      },
      {
        id: "value-of-the-bid",
        heading: "Weighing the value against the cost of bidding",
        blocks: [
          {
            type: "p",
            text: "Even a bid you can win is not automatically worth winning. The last thing I weigh is the expected value of the work against what the pursuit will cost you. A small one-off contract that demands a heavy, complex proposal may simply not pay for the hours it takes to chase, while a less glamorous standing offer that feeds orders for years can be worth far more than its modest headline value suggests.",
          },
          {
            type: "p",
            text: "This is where qualification turns from a checklist into judgment. I bring you the facts: the requirements, the scope, the evaluation and the realistic odds. You bring the knowledge of your own margins and capacity. Together that produces a decision you can stand behind, rather than a reflex to bid everything that lands in the inbox. Over a year, that discipline is the difference between a team stretched thin across long shots and one focused on the work it can actually win.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do you write the proposal once a bid is qualified?",
        a: "No. I find, monitor and qualify opportunities. I read the documents, check the requirements and give you a clear go or no-go with the reasoning. Writing and submitting the proposal stays with you and your team, where it belongs.",
      },
      {
        q: "How long does qualifying an opportunity take?",
        a: "The first gate, mandatory requirements, is usually fast and can rule a bid out in minutes. A full read for scope, evaluation and red flags takes longer, but it always costs far less than discovering the problem halfway through writing the proposal.",
      },
      {
        q: "What if I disagree with a no-go?",
        a: "It is your business and your call. I give you the reasoning, not a verdict. Plenty of clients choose to pursue a bid I flagged as marginal, and that is fine. The point is that you decide with full information rather than finding out the hard way.",
      },
    ],
  },

  "government-construction-contracts-guide": {
    readMins: 10,
    leadVariant: "sample",
    related: [
      { label: "Construction industry coverage", href: "/construction-government-contracts" },
      { label: "MERX guide", href: "/blog/merx-complete-guide" },
      { label: "Bid bonds and insurance", href: "/blog/understanding-bid-bonds-and-insurance" },
    ],
    sections: [
      {
        id: "where-construction-posts",
        heading: "Why construction is the hardest trade to monitor",
        blocks: [
          {
            type: "p",
            text: "Public construction work is posted across more portals than almost any other category, and that is not an accident. Every level of government builds: federal departments, provinces and states, cities, school boards, hospitals, transit authorities, utilities. Each tends to use its own posting home, and many use several. A single mid-size contractor might have relevant work appearing on MERX, BidNet Direct, a handful of bids&tenders municipal instances, Biddingo, a state system and two or three Bonfire portals in the same week.",
          },
          {
            type: "callout",
            text: "The fragmentation is the whole problem. No contractor has time to check a dozen portals every morning, so opportunities slip past not because the work is hidden, but because there are too many doors to watch by hand.",
          },
        ],
      },
      {
        id: "types-of-construction-work",
        heading: "The kinds of construction work hiding in the postings",
        blocks: [
          {
            type: "p",
            text: "Construction is not one category, it is many, and they are tagged inconsistently. Knowing the shapes the work takes helps me catch it regardless of how a buyer labelled it.",
          },
          {
            type: "ul",
            items: [
              "New build and major capital projects, often with prequalification stages before the bid even opens.",
              "Renovation, retrofit and tenant improvement work tucked under facilities or building services.",
              "Civil and infrastructure: roads, water, site work, frequently posted by transit and utility authorities.",
              "Standing offers and pre-qualified vendor lists for ongoing repair and small works.",
              "Trade-specific packages, where electrical, mechanical or roofing scopes are bid separately.",
            ],
          },
          {
            type: "p",
            text: "Each of these is found differently. A capital project announces itself with a prequalification notice months ahead. A standing offer for small works might post once and then quietly feed orders for years. I watch for all of them, because the recurring, less glamorous work is often where the steady margin lives.",
          },
        ],
      },
      {
        id: "qualifying-construction-bids",
        heading: "How I qualify a construction opportunity",
        blocks: [
          {
            type: "p",
            text: "Construction bids carry requirements that eliminate contractors before price is ever compared, so my qualification leans hard on the gating items first. I read for the things that decide whether you can even compete.",
          },
          {
            type: "ol",
            items: [
              "Bonding capacity. Bid, performance and labour and material payment bonds, and whether your surety can support the contract size.",
              "Insurance limits. Whether the required coverage matches what you carry, before the work goes any further.",
              "Prequalification. Many large projects require you to be prequalified before you can bid at all, on a separate timeline.",
              "Reference projects. Size, recency and type of past work, which often must mirror the project on offer.",
              "Trade certifications and licensing valid in the jurisdiction where the work sits.",
            ],
          },
          {
            type: "p",
            text: "Only once those gates are clear do I look at scope, schedule and the evaluation. A project can fit your capabilities perfectly and still be a no-go because the bonding requirement is twice what your surety will write, or because prequalification closed before the bid posted. Catching that early is exactly the point.",
          },
        ],
      },
      {
        id: "timing-and-prequalification",
        heading: "Timing, prequalification and reading ahead",
        blocks: [
          {
            type: "p",
            text: "Construction rewards lead time more than almost any trade. Capital programs telegraph themselves through budget documents, board approvals and prequalification notices long before the formal bid. By watching those pre-solicitation signals, I can tell you that work is forming while there is still time to position for it, rather than reacting to an RFP with a tight clock already running.",
          },
          {
            type: "p",
            text: "If you want the deeper view on the platforms most of this work flows through, the MERX guide is the place to start, and the construction industry page lays out how I cover the trade end to end.",
          },
        ],
      },
      {
        id: "subcontractor-vs-prime",
        heading: "Prime, sub or trade package: knowing your lane",
        blocks: [
          {
            type: "p",
            text: "A lot of public construction work is winnable two or three different ways, and qualifying an opportunity means understanding which lane is realistic for you. On a large capital project you might be the prime, but you might also be far better positioned as a subcontractor to whichever prime wins, or as the bidder on a trade package the owner has chosen to tender separately. Each of these is a different bid with different requirements, and the same project can be a no-go as a prime but a strong yes as a trade.",
          },
          {
            type: "p",
            text: "I read for this distinction because it changes everything downstream. A prime bid carries the full bonding, the full insurance and the coordination risk. A trade package narrows the scope to what you do best and often softens the gating requirements to match. When I qualify a construction opportunity, I am not just asking whether you can do the work, I am asking which way of pursuing it gives you the best odds for the least exposure.",
          },
          {
            type: "callout",
            text: "The biggest projects are rarely won the way they first appear. Often the smartest move is not the prime bid at all, but a trade package or a subcontract position that fits your shop without the full weight of the general contract.",
          },
        ],
      },
      {
        id: "construction-recompetes",
        heading: "Recurring works and the value of recompetes",
        blocks: [
          {
            type: "p",
            text: "Not all construction spending is one-off capital work. A large share of it is recurring: maintenance contracts, small-works standing offers, term agreements for repairs across a portfolio of buildings. These rarely make headlines, but they produce the steady, predictable revenue that keeps crews busy between the big jobs. Because they recur, they also come back around, and the award record often tells you roughly when.",
          },
          {
            type: "p",
            text: "When an opportunity like that is not right today, perhaps the term is wrong or the incumbent is entrenched, I flag it to revisit at the recompete rather than discard it. Construction rewards patience as much as speed: knowing a multi-year term contract reopens in eighteen months lets you position long before the bid posts. That forward view, combined with reading the pre-solicitation signals on capital work, is how I keep your pipeline full rather than reactive.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Which portals carry the most government construction work?",
        a: "In Canada, MERX, BidNet Direct, Biddingo and the bids&tenders municipal instances carry the bulk of it, with provincial systems on top. In the U.S., it is spread across state systems and local portals like PlanetBids, OpenGov and Bonfire. The right mix depends entirely on where you build.",
      },
      {
        q: "Do you help with prequalification submissions?",
        a: "I flag prequalification opportunities early and read the requirements so you know what is needed and by when. The submission itself is yours to prepare. My job is making sure the deadline never catches you by surprise.",
      },
      {
        q: "Can you tell me if a construction bid is worth pursuing?",
        a: "Yes. That is the core of what I do. I check bonding, insurance, prequalification and references first, then scope and evaluation, and I give you a clear go or no-go with the reasoning before you commit estimating hours.",
      },
    ],
  },

  "how-to-monitor-government-opportunities": {
    readMins: 9,
    leadVariant: "call",
    related: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Commodity codes explained", href: "/blog/commodity-codes-explained" },
      { label: "All platforms I monitor", href: "/platforms" },
    ],
    sections: [
      {
        id: "the-two-failure-modes",
        heading: "The two ways monitoring usually fails",
        blocks: [
          {
            type: "p",
            text: "Almost every monitoring setup I am asked to look at has failed in one of two directions. Either it sends too much, burying real opportunities under a daily flood of noise until nobody reads it, or it sends too little, quietly missing the work that did not happen to match a narrow set of keywords. Both feel like monitoring. Neither one actually catches the opportunities that matter.",
          },
          {
            type: "callout",
            text: "Good monitoring is not about volume in either direction. It is about surfacing the right opportunities, qualified, while keeping everything else out of your inbox.",
          },
        ],
      },
      {
        id: "why-keywords-fail",
        heading: "Why keyword and code matching is not enough",
        blocks: [
          {
            type: "p",
            text: "Portals route notifications using keywords and commodity codes. Both are imperfect in ways that cost you bids. Keywords reward exact wording: a search for snow removal does not fire on a posting titled winter maintenance services, even though you would bid both. Codes depend on the buyer choosing the right one, and buyers are inconsistent, so the same kind of work lands under different codes from one agency to the next.",
          },
          {
            type: "p",
            text: "This is why I never trust automated matching as the whole system. It is a useful first filter, nothing more. The opportunities that hurt most are the ones tagged in a way your filters were never built to catch, and no amount of keyword tuning fully closes that gap.",
          },
        ],
      },
      {
        id: "how-i-monitor",
        heading: "How I actually monitor",
        blocks: [
          {
            type: "p",
            text: "My approach combines wide automated coverage with human reading on top. The machine casts a deliberately wide net across every source your buyers use. Then I read, because intent is something a person judges and a keyword cannot.",
          },
          {
            type: "ol",
            items: [
              "Map your real footprint: the trades, the jurisdictions and the buyers that matter to you.",
              "Cast the net wide across every relevant portal, set broader than feels comfortable so adjacent tagging does not hide a posting.",
              "Read for intent, separating genuinely relevant opportunities from look-alikes the filters caught.",
              "Track changes: amendments and addenda on everything you care about, so a late scope change is news, not a surprise.",
              "Deliver qualified opportunities, not raw alerts, so what reaches you is already worth your attention.",
            ],
          },
        ],
      },
      {
        id: "amendments-matter",
        heading: "The part everyone forgets: amendments",
        blocks: [
          {
            type: "p",
            text: "Finding an opportunity once is not monitoring it. Bids change after they post. An addendum can move a deadline, alter the scope or add a mandatory requirement, and if you are working from the original documents, you can prepare against a bid that no longer exists. I track the document set on every opportunity I am watching for you, so changes surface the day they land.",
          },
          {
            type: "p",
            text: "If you want to understand why the portal landscape is so fragmented in the first place, and why one-portal monitoring will always leave gaps, the platforms overview lays out the full picture.",
          },
        ],
      },
      {
        id: "mapping-your-footprint",
        heading: "It starts with mapping your real footprint",
        blocks: [
          {
            type: "p",
            text: "Good monitoring is not a generic firehose pointed at every government portal. It is shaped to you. Before I watch anything, I map your real footprint: the trades you actually want more of, the jurisdictions you can serve profitably rather than just reach, and the specific buyers who tend to put out the kind of work you do. That map decides which of the eighteen-plus platforms matter to you and which are noise.",
          },
          {
            type: "p",
            text: "This is also where I learn the difference between the work you say you want and the work you actually win. Vendors often describe themselves more broadly than their results warrant, and a monitoring setup built on the broad description drowns them in marginal leads. Built on the real footprint, it stays tight and relevant. The map is the part that makes everything downstream work, and it is the part automated tools skip entirely.",
          },
          {
            type: "ul",
            items: [
              "The trades and service lines where you are genuinely competitive, not just capable.",
              "The geography you can serve at a margin that makes a contract worth winning.",
              "The buyers and agency types whose work fits your scale and capacity.",
              "The platforms and systems those buyers actually post on, which is a smaller set than the full landscape.",
            ],
          },
        ],
      },
      {
        id: "human-in-the-loop",
        heading: "Why a human still reads every relevant posting",
        blocks: [
          {
            type: "p",
            text: "Automation is essential for breadth. No person can refresh a dozen portals every morning, so the machine does the casting. But the machine cannot tell whether a posting genuinely fits you, only whether it matched a rule. That judgment, separating a real opportunity from a convincing look-alike, is what I do on top of the automation, and it is the part that turns a feed of alerts into a short list of qualified opportunities.",
          },
          {
            type: "p",
            text: "Reading also catches the things rules never could: the posting tagged in an unexpected category, the scope that technically matches your trade but is wrong for your operation, the buyer whose award history suggests the outcome is already decided. A keyword cannot weigh any of that. The combination, wide automated coverage plus a person who reads with your business in mind, is the only setup I have found that catches the right work without burying you in everything else.",
          },
          {
            type: "callout",
            text: "Automation decides what to look at. A human decides what is worth your time. Monitoring that skips the second step is just noise on a schedule.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Can I not just set up alerts myself?",
        a: "You can, and you should as a baseline. But portal alerts only fire on the categories and codes you select, against the codes a buyer happened to use. The gap between those two is where opportunities slip past silently. The value I add is wide coverage plus a human reading for intent on top of the automation.",
      },
      {
        q: "How many platforms do you monitor?",
        a: "More than eighteen, across Canada and the U.S., plus buyer-specific portals and state and provincial systems. The right set for you depends on your trade and where you bid. I consolidate whatever that mix is into one reviewed feed.",
      },
      {
        q: "Will I get flooded with notifications?",
        a: "No. The whole point is the opposite. The automation casts a wide net, but I read on top of it, so what reaches you is qualified opportunities rather than raw, unfiltered alerts.",
      },
    ],
  },
};

/* ------------------------------------------------------------- Generated bodies */

/**
 * Per-category framing used to generate a genuinely rich, ~2,500-word article
 * for any topic without a hand-written deep body. Each frame carries enough
 * distinct prose, lists and stat selections that two articles in the same
 * category still read differently once the topic title and excerpt are woven
 * in. The result is real prose, never lorem ipsum.
 *
 * Voice: first-person Phil. Phil finds, monitors and qualifies opportunities.
 * He does not write proposals or submit bids.
 */
type CategoryFrame = {
  /** A one-line framing of the subject, completing "<subject> ...". */
  angle: string;
  /** Heading + paragraphs for the "what I watch" section. */
  landscapeHeading: string;
  landscape: string[];
  /** Heading + paragraphs + a bulleted list for the structural section. */
  structureHeading: string;
  structure: string[];
  structureList: string[];
  /** Heading + intro for the qualification section (ordered list is shared). */
  qualifyHeading: string;
  qualifyIntro: string;
  /** Heading + paragraphs for the themed mid-article section. */
  themeHeading: string;
  theme: string[];
  /** A deeper, category-specific section: heading, paragraphs and a list. */
  deepDiveHeading: string;
  deepDive: string[];
  deepDiveList: string[];
  /** A short practical playbook with H3 + paragraphs. */
  playbookHeading: string;
  playbook: string[];
  /** Mistakes section bullets. */
  mistakes: string[];
  /** A pull-quote style callout sentence. */
  callout: string;
  /** Stat ids to weave in (2-4), chosen so they are always relevant. */
  statIds: string[];
  /** Closing-section framing. */
  closing: string;
  /** Which lead-form variant suits the category. */
  lead: "call" | "sample" | "guide";
};

const CATEGORY_FRAMES: Record<string, CategoryFrame> = {
  Platforms: {
    angle:
      "is one more place your buyers post work, which means it is one more place an opportunity can slip past while you are looking somewhere else.",
    landscapeHeading: "What this platform actually is, and what it is not",
    landscape: [
      "The first thing to be clear about is that a procurement platform is plumbing, not a market. It is where certain buyers happen to publish, route notifications and accept submissions. That is genuinely useful, but it is easy to mistake the plumbing for the whole house. One portal is not one market, and treating it as the front door to government work is how vendors end up surprised by a contract a competitor won on a system they never logged into.",
      "Every platform has its own coverage footprint, its own categorization scheme and its own quirks in how it surfaces work. Some are aggregators that pull postings from hundreds of buyers. Others are buyer-side systems where a single agency runs its own procurement and you only see it if you know to look. The breadth ranges enormously, and the gaps between platforms are real, predictable and quiet. Nothing flags when an opportunity lands somewhere you are not watching.",
      "So I treat any single platform as one important input, never the complete picture. It earns its place in a wider monitoring setup precisely because of what it carries that nothing else does, and I map that overlap deliberately rather than assuming any one source is comprehensive.",
    ],
    structureHeading: "How postings get organized, and why that trips people up",
    structure: [
      "Most platforms route notifications using categories and codes that the buyer attaches when they post. The trouble is that the buyer chooses those codes, and buyers are inconsistent. The same scope of work can be tagged one way by one agency and a completely different way by the next. If your notification profile only watches one of those labels, the other one never reaches you, and nothing tells you it happened.",
      "On top of category drift, the search itself usually rewards exact wording. A posting titled one way reads very differently from one describing identical work in other terms, even though you would happily bid both. The portal does not know they are the same to you. That is the core limitation of any keyword-driven system, and it is why I qualify by intent rather than by matching strings.",
    ],
    structureList: [
      "Category and code coverage, set wide enough that adjacent tagging does not hide a relevant posting.",
      "Title and description language, read for intent rather than exact-match keywords.",
      "Buyer and jurisdiction, cross-checked against the agencies I know post on more than one system.",
      "The document set on every live opportunity, so a late amendment is news the day it lands.",
    ],
    qualifyHeading: "How I read a posting here before recommending a bid",
    qualifyIntro:
      "When a posting on this platform clears my monitoring and looks relevant, I do not hand it over and call it a lead. I read the documents the way an evaluator will, and I qualify fit before it ever reaches you. The review follows the same order every time, because the cheapest mistakes to catch sit at the top of the list.",
    themeHeading: "Where the default notifications let bids slip past",
    theme: [
      "Most vendors set up a notification profile once, choose a few categories, and trust it. Then they wonder why a competitor down the road won work they never saw. The notification engine only fires on the categories and codes you selected, against the codes the buyer happened to use. Every mismatch between those two is a silent miss. Alerts tell you what exists inside a narrow filter. They do not tell you what is worth bidding, and they do not catch what fell outside the filter in the first place.",
      "There is also a timing problem that pure automation handles badly. Amendments and addenda change scope, deadlines and mandatory requirements after a bid posts. If you are not tracking the document set on every opportunity you care about, you can prepare against a scope that no longer exists. I track changes on everything I am watching for a client, so a late addendum surfaces the day it lands, not the week the bid closes.",
    ],
    deepDiveHeading: "What this platform carries that others do not",
    deepDive: [
      "The reason a platform earns a place in my coverage is rarely that it duplicates what the big aggregators already show. It is that it carries something they do not. A buyer-side system may be the only place a particular agency ever publishes. A regional network may reach a cluster of local buyers that nothing national aggregates. The value of any platform is defined by its unique coverage, the slice of work that appears here and nowhere else, and that is exactly the slice a single-portal habit misses.",
      "Mapping that unique coverage is deliberate work. I look at which buyers post here exclusively, which post here and elsewhere, and which only appear when an amendment changes the document set. Then I reconcile this platform against the others your buyers use so the same opportunity is not counted twice and, more importantly, so a genuinely unique one is never missed. The registration and profile mechanics matter too: an incomplete supplier profile quietly narrows what the system surfaces to you before you have searched at all.",
      "There is also a cost question worth being honest about. Many platforms have a free tier that covers browsing and basic notifications, with paid tiers that add reach or convenience. The price is almost never the real constraint. The real constraint is that any single platform, free or paid, only ever shows you part of the picture, so the decision is not free versus paid, it is how this source fits a coverage strategy that no single subscription can replace.",
    ],
    deepDiveList: [
      "The buyers who publish here exclusively, which define this platform's unique value.",
      "Whether your supplier profile is complete enough that the system surfaces the right work to you.",
      "How notifications are scoped, and how wide to set them so adjacent tagging does not hide a posting.",
      "Where this platform's coverage overlaps the big aggregators, so the same bid is not chased twice.",
      "How amendments are published here, since a changed document set can reopen a bid you had dismissed.",
    ],
    playbookHeading: "Getting the most out of this platform as a vendor",
    playbook: [
      "A few habits separate the vendors who win work through any given platform from those who keep wondering where it went. Keep your supplier profile complete and current, because the system uses it to decide what to surface and to let buyers find you. Set your notification categories well past the obvious one, because the cost of a few extra notices is nothing next to the cost of a missed bid tagged a category over. And read the document set, not just the summary, because the requirements, the evaluation and the real scope live in the attachments.",
      "Those habits help, but they do not solve the structural problem, which is that one portal is not one market. That is the part I take off your plate. I treat this platform as one important input, work it properly, and fold it into a wider setup so its unique coverage is captured and its blind spots are covered by the other sources your buyers use.",
    ],
    mistakes: [
      "Treating one portal as the whole market and never reconciling it against the other systems your buyers use.",
      "Setting notification categories once, too narrowly, and trusting them for years without revisiting the coverage.",
      "Reading the summary page instead of the document set, where the real scope and the disqualifiers actually live.",
      "Letting an incumbent recompete pass unwatched because the portal never flagged the contract was coming up again.",
    ],
    callout:
      "A notification profile is a starting point, not a strategy. The opportunities that hurt most are the ones a profile was never configured to catch, because you never knew they were missing.",
    statIds: ["bidnet-daily-bids", "us-local-govs", "response-hours"],
    closing:
      "No single portal is the whole picture. I fold this one into a wider monitoring setup, reconciled against everything else your buyers use, so you see qualified opportunities rather than another login to remember.",
    lead: "call",
  },
  Industries: {
    angle:
      "shows up across more portals and under more category labels than most people expect, which is exactly why the steady, winnable work in it is so easy to miss.",
    landscapeHeading: "Why this work is harder to track than it looks",
    landscape: [
      "Public buyers at every level need this work, and that breadth is the problem. Federal departments, provinces and states, cities, school boards, hospitals, transit and utility authorities all tender it, and each tends to use its own posting home. Many use several. A single mid-size firm might have relevant work appearing on a national aggregator, a regional bid network, a handful of municipal instances and two or three buyer-side portals in the same week.",
      "The fragmentation is the whole challenge. No operator has time to check a dozen portals every morning, so opportunities slip past not because the work is hidden, but because there are too many doors to watch by hand. The work is out there in volume. Catching it reliably is a coverage and discipline problem, not a scarcity problem.",
      "Compounding that, the same scope gets labelled differently from one buyer to the next. What one agency files under one category, the next files under another, and a keyword-only setup quietly misses the variants. I watch for this work wherever it posts and however it is tagged, because intent is something a person judges and a code cannot.",
    ],
    structureHeading: "The shapes this work takes in the postings",
    structure: [
      "This category is not one thing, it is many, and knowing the shapes the work takes helps me catch it regardless of how a buyer labelled it. Each shape is found differently and qualified differently, which is why a generic keyword sweep underperforms a setup built around how the work actually appears.",
    ],
    structureList: [
      "One-off projects and capital work, often with a prequalification stage before the bid even opens.",
      "Recurring service contracts and term agreements, the less glamorous work where steady margin tends to live.",
      "Standing offers and pre-qualified vendor lists that post once and then quietly feed orders for years.",
      "Scopes bundled inside larger solicitations, where your piece is a line item rather than the headline.",
      "Emergency and as-needed work, awarded fast and easy to miss without active monitoring.",
    ],
    qualifyHeading: "How I qualify an opportunity in this category",
    qualifyIntro:
      "A posting can match your trade on paper and still be wrong for you. So I read each opportunity for genuine fit before it reaches you, leaning first on the requirements that decide whether you can even compete. The review runs in the same order every time, because the cheapest disqualifiers to catch are the ones at the top.",
    themeHeading: "The capacity squeeze behind every bid decision",
    theme: [
      "The reason qualification matters so much in this category is capacity. The same people who would deliver the work are usually the ones pricing the bid, and that time is the scarcest thing your operation has. Hiring your way out of the squeeze is not the easy fix it once was, which makes every hour spent on a poor-fit pursuit an hour stolen from work you could actually win.",
      "This is where opportunity waste does its real damage. An estimator who spends days on a bid that was never winnable is not just a sunk cost, it is the qualified opportunity that went unread while the clock ran. Qualification discipline beats volume here every time. The goal is not to chase everything that matches your trade, it is to put your limited estimating hours behind the work that fits and to walk away early, while walking away is still cheap.",
    ],
    deepDiveHeading: "How I read the scope for genuine fit",
    deepDive: [
      "A title that matches your trade is the start of the question, not the answer. The scope of work is where I find out whether a posting is genuinely yours. I read it asking, on your behalf, whether this is the kind of work you want more of, at a volume and term that justify the effort, in locations you can serve at a margin rather than merely reach. Plenty of postings that look perfect in the summary fall apart in the scope, and plenty that look unremarkable turn out to be exactly the recurring work that keeps crews busy between the bigger jobs.",
      "The gating requirements in this category often decide the bid before price is ever compared, so I lean on them hard and early. Certifications valid in the jurisdiction, insurance limits, bonding capacity where it applies, reference projects of a defined size and recency, and licensing that takes time to obtain. Any one of these can end the conversation regardless of how well you could do the work, and the worst time to discover one is halfway through pricing. I pull them into the open first.",
      "Then there is the hidden scope, the obligations tucked into the contract terms rather than the headline. Response times you have to staff for, performance standards that erode margin, reporting and compliance overhead, geographic spread that turns a tidy contract into a logistics problem. These are the things that make a bid look better on paper than it will ever be in practice, and reading for them is exactly the difference between a relevant lead and a qualified one.",
    ],
    deepDiveList: [
      "Volume and term: is this a one-off, or the multi-year, recurring work that is worth real effort?",
      "Geography: are the locations inside the area you can serve profitably, not just technically reach?",
      "Service levels: are response times and performance standards ones you can hit without bleeding margin?",
      "Gating requirements: certifications, insurance, bonding and references you can actually prove today.",
      "Hidden scope: obligations in the contract terms that change the true cost of the job.",
    ],
    playbookHeading: "Catching the recurring work, not just the headline jobs",
    playbook: [
      "The instinct in this category is to watch for the big, visible projects. The steadier money is usually quieter. Standing offers, term maintenance agreements and small-works lists rarely make a splash in a posting, but they feed orders for years and they recur on cycles you can often read from the award record. I make a point of catching these, because they are precisely the work a busy operator misses while waiting for the marquee job to appear.",
      "Because so much of it recurs, this category rewards patience as much as speed. When an opportunity is not right today, perhaps the term is wrong or an incumbent is entrenched, I flag it to revisit at the recompete rather than discard it. Knowing a multi-year contract reopens in eighteen months lets you position long before the bid posts, which is a very different game from reacting to an RFP with a tight clock already running.",
    ],
    mistakes: [
      "Chasing every posting that mentions your trade, regardless of volume, term or whether it fits your operation.",
      "Underestimating the loaded cost of the estimating hours a marginal bid quietly consumes.",
      "Missing the recurring, lower-profile work because it never looks exciting in a posting summary.",
      "Ignoring an addendum that changed the scope after estimating had already started.",
    ],
    callout:
      "The recurring, less glamorous work in this category is often where the steady margin lives. Alerts tell you what exists. My job is telling you which of it is genuinely worth your estimating hours.",
    statIds: ["estimator-hiring", "response-hours", "delays-shortage"],
    closing:
      "The steady, winnable work in this category rewards coverage and discipline, not volume. I make sure the opportunities that genuinely fit reach you before the deadline does, and that the ones that do not never cost you a wasted estimate.",
    lead: "sample",
  },
  States: {
    angle:
      "splits its procurement across a central state system and a long tail of county, city, school and district portals, so no single source shows you everything.",
    landscapeHeading: "Why one state is really dozens of buyers",
    landscape: [
      "It is tempting to think of a state as one buyer with one procurement website. In reality the state system is just the top layer. Beneath it sit counties, cities, towns, school districts, special districts and authorities, each running its own buying, often on its own portal. The work that matters to a lot of vendors lives in that local layer, not in the headline state contracts.",
      "That is why the central state system, useful as it is, never tells the whole story. A vendor watching only the state portal misses the municipal and district postings entirely, and those are frequently the recurring, right-sized contracts that fit a regional operator best. The state layer is the easy part to find. The local layer is where coverage actually gets tested.",
      "I watch the state system alongside the local layer, and I map which buyers in your service area post where. Some publish on the state system, some on a regional bid network, some only on their own site. Treating any one of those as complete is how opportunities slip through the gaps between portals.",
    ],
    structureHeading: "The layers I watch across the state",
    structure: [
      "Covering a state properly means watching several distinct layers at once, because each carries work the others do not. The right mix depends entirely on where you operate and what you do, but the layers themselves are consistent from state to state.",
    ],
    structureList: [
      "The central state procurement system, for statewide contracts and registration.",
      "County and city portals, where a large share of right-sized local work posts.",
      "School and special districts, which often run buying on their own platforms.",
      "Regional bid networks and buyer-side systems that individual agencies have adopted.",
      "Cooperative purchasing vehicles that can open work to vendors already on the right list.",
    ],
    qualifyHeading: "How I qualify an opportunity once it surfaces",
    qualifyIntro:
      "Finding a posting is only the start. I read each opportunity for the requirements that actually gate it, then for scope and evaluation, before recommending whether it is worth your time. The order matters, because the fastest disqualifiers sit at the top and rule a bid out before you spend a single hour on it.",
    themeHeading: "The scale of the local layer most vendors never see",
    theme: [
      "The reason local coverage matters so much comes down to sheer numbers. The volume of distinct local buyers in the United States dwarfs the handful of state systems, and each is a potential source of work that no central portal aggregates for you. That is the opportunity and the problem in one: enormous breadth, scattered across systems that were never designed to be watched together.",
      "Renewal and incumbent intelligence is the quiet advantage in this layer. Local contracts come back around on cycles you can often read from the award record, and a regional operator who knows a multi-year contract reopens in eighteen months can position long before the bid posts. I track that timing rather than reacting to whatever happens to appear, because in a fragmented local market, knowing what is coming back is worth as much as knowing what is open today.",
    ],
    deepDiveHeading: "Mapping where the work in your area actually posts",
    deepDive: [
      "Good coverage in a state is not a generic firehose pointed at every portal. It is shaped to where you operate. Before I watch anything, I map the buyers in your service area: which counties, cities, districts and authorities tender the kind of work you do, and which system each of them publishes on. Some post on the central state system, some on a regional bid network, some only on their own site. That map decides which sources matter to you and which are noise, and it is the part automated tools skip entirely.",
      "The map also separates the work you say you want from the work you actually win. Vendors often describe themselves more broadly than their results warrant, and coverage built on the broad description drowns them in marginal leads from agencies they will never realistically serve. Built on the real footprint, the trades where you are genuinely competitive and the geography you can serve at a margin, it stays tight and relevant. In a state with this many distinct buyers, that discipline is what keeps the feed actionable instead of overwhelming.",
      "Cooperative purchasing vehicles deserve their own mention here. A lot of local buyers piggyback on contracts another agency has already competitively awarded, which means being on the right cooperative can open work without a fresh bid at all. I watch for these because they change the math on an opportunity entirely: sometimes the smartest move in a state is not to chase the open tender, but to get onto the vehicle the next ten buyers will purchase through.",
    ],
    deepDiveList: [
      "The counties, cities and districts in your service area that tender your kind of work.",
      "Which system each of those buyers actually publishes on, which is rarely just the state portal.",
      "The trades and service lines where you are genuinely competitive, not merely capable.",
      "The geography you can serve at a margin that makes a contract worth winning.",
      "Cooperative purchasing vehicles that could open work without a fresh competitive bid.",
    ],
    playbookHeading: "Covering state and local as one picture",
    playbook: [
      "The practical goal is to see the whole state as one reviewed feed rather than a dozen tabs to refresh. That means watching the central system for statewide work and registration, the local layer for the right-sized contracts that fit a regional operator, and the recompete calendar for the multi-year work coming back around. Each layer carries something the others do not, and the only way to avoid gaps is to reconcile them against each other.",
      "Done this way, the sprawl stops being a liability and starts being an advantage. Most competitors are watching one or two obvious sources, which means the work tucked into the local layer is genuinely less contested for a vendor who actually sees it. Alerts on a single portal will never get you there. A mapped, reconciled view of the state will.",
    ],
    mistakes: [
      "Watching only the state portal and missing the county, city and district work that fits best.",
      "Assuming a single regional network covers every local buyer in your service area.",
      "Reacting to live postings only, instead of tracking recompetes you could prepare for in advance.",
      "Ignoring cooperative purchasing vehicles that could open work without a fresh competitive bid.",
    ],
    callout:
      "The headline state contracts are the easy part to find. The local layer beneath them is where coverage is actually won or lost, and where most of the right-sized work hides.",
    statIds: ["us-local-govs", "us-special-districts", "us-federal-spend"],
    closing:
      "I consolidate the state and local picture into one reviewed feed so opportunities here do not slip through the gaps between portals, and so the recurring local work that fits your operation reaches you on time.",
    lead: "call",
  },
  Provinces: {
    angle:
      "spreads tenders across a provincial system, broader public sector bodies and a list of municipal portals, which is more fragmented than it looks from the outside.",
    landscapeHeading: "Why provincial coverage is more than the provincial portal",
    landscape: [
      "From the outside, a province looks like it should have one tender website and that should be that. In practice the provincial system is one layer among several. The broader public sector, municipalities, academic institutions, school boards and health authorities run a great deal of their own buying, frequently on portals the provincial hub does not aggregate. Relevant work routinely posts outside the obvious place.",
      "So watching only the provincial hub leaves predictable gaps. The MASH sector alone, municipalities, academic institutions, school boards and hospitals, generates a steady stream of the recurring, right-sized contracts that suit regional vendors, and a lot of it never touches the central system. The provincial portal is the anchor, not the whole picture.",
      "I watch the provincial hub alongside the MASH-sector and municipal sources, and I map which buyers in your area publish where. Some post on the provincial system, some on a national aggregator, some on a municipal platform, some only on their own site. Assuming any one of those is comprehensive is how bids slip past quietly.",
    ],
    structureHeading: "The layers I watch across the province",
    structure: [
      "Covering a province properly means watching several layers at once, because each carries work the others miss. The right mix depends on where you operate and what you do, but the layers are consistent across the country.",
    ],
    structureList: [
      "The provincial procurement system, for provincial contracts and vendor registration.",
      "Municipal portals, where a large share of right-sized local work posts.",
      "The MASH sector, municipalities, academic institutions, school boards and hospitals.",
      "Crown corporations and authorities that run their own procurement.",
      "National aggregators that some provincial and local buyers also publish to.",
    ],
    qualifyHeading: "How I qualify a provincial or local opportunity",
    qualifyIntro:
      "A posting clearing my monitoring is the start, not the finish. I read the documents for mandatory requirements, scope and evaluation, and give you a clear go or no-go rather than a raw lead. The review runs in the same order every time, with the fastest disqualifiers first.",
    themeHeading: "Competition is thinner than the headlines suggest",
    theme: [
      "One thing the Canadian public record makes clear is that competition is often lighter than vendors assume. A meaningful share of competitive federal processes draw only a single bid, and the same pattern shows up at the provincial and local level. That is not a reason to bid everything, but it is a reason to take fit seriously: where you are genuinely qualified, the field may be far thinner than the perceived crowd suggests.",
      "Renewal and incumbent intelligence is the edge in a fragmented provincial market. Multi-year contracts come back around on cycles the award record often reveals, and a vendor who knows a term agreement reopens next year can position well ahead of the posting. I track that timing across the provincial and municipal layers rather than reacting to whatever happens to appear, because in a scattered market, knowing what is coming back is as valuable as knowing what is open now.",
    ],
    deepDiveHeading: "Mapping where the work in the province actually posts",
    deepDive: [
      "Covering a province well is not a generic sweep of every Canadian portal. It is shaped to where you operate. Before I watch anything, I map the buyers in your area: which municipalities, school boards, hospitals, academic institutions and Crown corporations tender your kind of work, and which system each publishes on. Some post on the provincial hub, some on a national aggregator, some on a municipal platform, some only on their own site. That map decides which sources matter and which are noise, and it is the work automated tools skip.",
      "The map also separates the work you say you want from the work you actually win. Vendors routinely describe themselves more broadly than their results warrant, and coverage built on the broad description buries them in marginal leads. Built on the real footprint, the trades where you are genuinely competitive and the geography you can serve at a margin, it stays tight and relevant. Across the number of public buyers a province contains, that discipline is what keeps the feed worth reading.",
      "The MASH sector deserves particular attention because it is where so much of the recurring, right-sized work hides. Municipalities, academic institutions, school boards and hospitals each run their own buying, often on their own schedules and systems, and a great deal of it never touches the provincial hub. A vendor watching only the provincial portal misses this layer entirely, and it is frequently the layer that suits a regional operator best.",
    ],
    deepDiveList: [
      "The municipalities, boards, hospitals and Crown corporations in your area that tender your work.",
      "Which system each of those buyers actually publishes on, which is rarely just the provincial hub.",
      "The trades and service lines where you are genuinely competitive, not merely capable.",
      "The geography you can serve at a margin that makes a contract worth winning.",
      "National aggregators that some provincial and local buyers also publish to, to avoid double-counting.",
    ],
    playbookHeading: "Covering the province as one picture",
    playbook: [
      "The practical goal is to see the whole province as one reviewed feed rather than several separate searches. That means watching the provincial hub for provincial work and registration, the MASH and municipal layers for the right-sized contracts that fit a regional operator, and the recompete calendar for the multi-year work coming back around. Each layer carries something the others miss, and reconciling them against each other is the only way to close the gaps.",
      "Handled this way, the fragmentation stops being a liability. Most competitors watch one or two obvious sources, so the work tucked into the MASH and municipal layers is genuinely less contested for a vendor who actually sees it. Alerts on a single portal will never get you there. A mapped, reconciled view of the province will.",
    ],
    mistakes: [
      "Watching only the provincial portal and missing the MASH-sector and municipal work that fits best.",
      "Assuming a national aggregator captures every local buyer in the province.",
      "Reacting to live postings instead of tracking recompetes you could prepare for in advance.",
      "Overestimating the competition and walking away from work where you were a genuine fit.",
    ],
    callout:
      "The provincial portal is the anchor, not the whole market. The MASH sector and municipal layer beneath it is where a lot of the recurring, right-sized work actually hides.",
    statIds: ["canada-public-units", "canada-local-units", "one-bid-open"],
    closing:
      "I cover the province as one picture instead of several separate searches, reconciling the provincial, MASH and municipal layers, so the right opportunities reach you on time rather than after a competitor has already seen them.",
    lead: "call",
  },
  Statistics: {
    angle:
      "is one of those areas where the public data tells a clearer story than the headlines, once you know how to read it honestly.",
    landscapeHeading: "What the numbers actually tell you, and what they do not",
    landscape: [
      "Public spending data is more accessible than most vendors assume, and it is genuinely useful for understanding the shape of the field. But the headline figures can mislead you about your own real opportunity. A multi-billion-dollar total tells you the field is large. It tells you almost nothing about whether a specific contract is winnable for your operation, in your trade, in your service area.",
      "So I treat published spending and award data as context, not gospel. The patterns are valuable for sharpening where I look and for setting realistic expectations. The danger is reading a big aggregate number as if it were your addressable market, then bidding accordingly. Most of that headline total is work you will never be eligible for, in places you do not serve, at scales you cannot deliver.",
      "The honest use of the data is narrower and more useful: which buyers are active, how often certain work recurs, how competition actually distributes, and where the realistic openings sit for a vendor like you. I never manufacture a statistic that is not there, and I am wary of anyone who does.",
    ],
    structureHeading: "The figures worth keeping in view",
    structure: [
      "A handful of well-sourced figures do more to calibrate expectations than a wall of statistics. These are the kinds of numbers I keep in view, not to impress anyone, but because they reframe how a vendor should think about effort, win rates and where revenue actually comes from.",
    ],
    structureList: [
      "How many RFPs a typical organization responds to in a year, and the hours each one consumes.",
      "Realistic win rates, especially in the public sector, against the volume most teams attempt.",
      "How much of company revenue is genuinely tied to bids, tenders and proposals.",
      "How competition distributes, including how often supposedly competitive processes draw few bids.",
    ],
    qualifyHeading: "How I turn data into a qualification edge",
    qualifyIntro:
      "Numbers are only useful if they change a decision. I use the patterns in the public data to sharpen where I look and to qualify the specific opportunities in front of you, not to generate a forecast nobody can act on. The qualification itself still runs the same disciplined order on every posting.",
    themeHeading: "What the volume-versus-win-rate gap really means",
    theme: [
      "The most important story in the benchmark data is the gap between how much teams bid and how often they win. Organizations respond to a high volume of RFPs every year, sink real hours into each one, and still win less than half. In the public sector the average is lower still. Read honestly, that is not an argument to bid more. It is an argument to bid better.",
      "This is exactly where qualification discipline beats volume. If a large share of revenue rides on bids, and each bid costs serious time, then the leverage is not in attempting more pursuits, it is in declining the unwinnable ones early and concentrating effort where the odds are real. Alerts tell you what exists. The number that should keep you up at night is how many of those hours went into bids that were never going to land.",
    ],
    deepDiveHeading: "How to read public spending data without fooling yourself",
    deepDive: [
      "The single most common error with procurement data is mistaking the size of the field for the size of your opportunity. A headline spending figure describes an enormous, mostly inaccessible total: work in trades you do not do, in places you do not serve, at scales you cannot deliver, under set-asides you do not qualify for. Reading it as your addressable market leads straight to bidding too widely and winning too little. The honest version is always narrower and always more useful.",
      "The data earns its keep when it answers practical questions. Which buyers in your space are genuinely active, and how often. How the size distribution of contracts actually looks, because most public contracts are smaller than the headlines suggest, which is good news for a lot of vendors. How competition distributes, including how often supposedly competitive processes draw surprisingly few bids. These are the patterns that change where I look and how I set expectations, and none of them require inventing a number.",
      "I am deliberately careful about sourcing, because confident statistics with no checkable origin are worse than no statistics at all. Every figure I lean on traces to a named source, and I would rather say I do not know than manufacture precision. The point of the data is to calibrate judgment, not to dress up a guess as a forecast, and a vendor is far better served by an honest range than by a fabricated certainty.",
    ],
    deepDiveList: [
      "Distinguish the total field from your addressable slice, which is always far smaller.",
      "Use the contract size distribution to target the right-sized work, not just the headline awards.",
      "Read competition data honestly, including how often processes draw few bidders.",
      "Treat win-rate benchmarks as a reason to bid better, not simply to bid more.",
      "Trust only figures you can trace to a named, checkable source.",
    ],
    playbookHeading: "From numbers to a sharper search",
    playbook: [
      "Once the data has calibrated expectations, the value is in how it shapes the search. If the size distribution says the right-sized work for you sits below the headline contracts, I weight coverage toward the buyers and systems where that work posts. If the competition data says a particular kind of process tends to draw few bids, that is a flag to take fit seriously rather than assume the field is crowded. The numbers point; the qualification still has to be done opportunity by opportunity.",
      "That is the honest boundary of statistics. They are excellent for understanding the field and terrible as a substitute for reading the documents in front of you. I use them to aim, then do the actual work of qualifying the specific opportunities the aim turns up. Alerts and aggregates both tell you what exists. Neither tells you what is worth bidding.",
    ],
    mistakes: [
      "Reading a headline spending total as if it were your addressable opportunity.",
      "Bidding more in response to a low win rate, rather than bidding more selectively.",
      "Ignoring how much real time each pursuit costs when totting up whether the volume pays.",
      "Trusting a confident-sounding statistic with no source you can actually check.",
    ],
    callout:
      "Data is excellent for understanding the field. Winning still comes down to qualifying the specific opportunities in front of you, which is the work I focus on.",
    statIds: ["rfp-volume", "response-hours", "win-rate-public", "revenue-tied-bids"],
    closing:
      "Use the data to calibrate expectations and sharpen where you look, then put the effort into qualifying real opportunities. That is the part the numbers can point toward but never do for you, and it is where I spend my time.",
    lead: "guide",
  },
  "Bid qualification": {
    angle:
      "is where most wasted effort begins, because the decision to pursue a bid is usually made before anyone checks whether it can actually be won.",
    landscapeHeading: "Why qualification comes before everything else",
    landscape: [
      "A proposal is expensive. Even a modest bid eats hours of your most senior people, and those hours come straight out of the work that already pays you. So the single most valuable thing I do is decide, before you spend any of that time, whether an opportunity is genuinely worth pursuing. Qualification is not paperwork. It is the gate that protects your capacity.",
      "The mistake almost everyone makes is treating the decision to bid as automatic once a posting looks relevant. Relevant and winnable are not the same thing. A contract can match your trade perfectly and still be wrong for you, because of a mandatory you cannot meet, an evaluation you cannot place high in, or simply a value that does not justify the hours. Catching that early is the whole point.",
      "Done well, qualification is a disciplined read of the documents that produces a clear recommendation with the reasoning behind it. The goal is not to bid more. It is to bid the work you can actually win, and to walk away from the rest early, while walking away is still cheap.",
    ],
    structureHeading: "The signals that decide fit early",
    structure: [
      "Before I form any view on a bid, I pull out the signals that decide fit, and I read them in the order that protects the most time. The fastest disqualifiers come first, because there is no point studying scope and evaluation on a bid a single mandatory has already ruled out.",
    ],
    structureList: [
      "Mandatory requirements, including the ones buried in appendices and referenced standards.",
      "Bonding, insurance and certifications, the thresholds that quietly eliminate bidders before price.",
      "Reference projects of a defined size, recency and type that you must be able to prove.",
      "Evaluation weighting, which tells you whether you can place high enough to win, not just submit.",
      "Red flags that suggest the outcome is wired for an incumbent before the bid even posted.",
    ],
    qualifyHeading: "The order I work a solicitation in",
    qualifyIntro:
      "Turning a long solicitation into a clear go or no-go follows the same order every time. It is deliberately front-loaded with the cheapest mistakes to catch, so a bid that cannot clear the first gate never costs you the hours the later gates would.",
    themeHeading: "Why the selective firms are winning more",
    theme: [
      "The evidence increasingly favours selectivity. Across the architecture and engineering sector, firms have pursued far fewer opportunities year over year while the value of the work they won rose sharply, and median win rates climbed as they became more disciplined about what to chase. Fewer, better-qualified pursuits beat a high-volume scattergun.",
      "The same logic shows up in the wider data: the firms that run a formal go or no-go process win more than those that do not. None of this is mysterious. A bid you decline early frees the senior time and energy for one you can actually win. Alerts tell you what exists. A disciplined qualification tells you what is worth the hours, and over a year that discipline is the difference between a team stretched thin across long shots and one focused on winnable work.",
    ],
    deepDiveHeading: "The disqualifiers hiding in the fine print",
    deepDive: [
      "Some of the most expensive surprises are not in the obvious mandatory section at all. They are tucked into the terms and conditions, the appendices, and the standards a document references rather than spells out. Bonding capacity is the classic one: a contract size that needs a surety line larger than yours will write ends the conversation, no matter how good a fit the work is. Insurance limits work the same way, and so do requirements to carry specific coverage you do not currently hold. Finding one of these halfway through writing is the worst possible time to learn you never qualified.",
      "Reference projects are another quiet gate. A buyer may require past work of a defined size, recency and type, and may require those references to be verifiable and contactable. If your strongest projects are a year too old or a little too small, you can be technically capable and still ineligible. Jurisdiction-specific licensing belongs in the same bucket, because it can take time to obtain and a deadline does not wait. I pull all of these into the open early, because they decide eligibility before any amount of proposal craft can help.",
      "Then there is the evaluation, which is where submitting and competing part ways. Some contracts are lowest compliant price and nothing else. Others weight experience, methodology, team and references heavily, with price as a fraction of the score. Reading the scoring scheme tells me whether you can realistically place high enough to win, not merely qualify to be considered, and that judgment is often the difference between a go and a polite no.",
    ],
    deepDiveList: [
      "Bonding and surety limits that exceed what your line will support.",
      "Insurance coverage types or limits you do not currently carry.",
      "Reference projects that must match a defined size, recency or scope.",
      "Jurisdiction-specific licensing or registration that takes time to obtain.",
      "Referenced standards and codes that add obligations the summary never mentions.",
    ],
    playbookHeading: "Weighing value against the cost of bidding",
    playbook: [
      "Even a bid you can win is not automatically worth winning. The last thing I weigh is the expected value of the work against what the pursuit will cost you in loaded senior time. A small one-off contract that demands a heavy, complex proposal may simply not pay for the hours it takes to chase, while a less glamorous standing offer that feeds orders for years can be worth far more than its modest headline value suggests. This is where qualification turns from a checklist into judgment.",
      "I watch here too for the red flags that a contract is wired for an incumbent: oddly specific requirements only one firm could meet, reference criteria that mirror an existing contract a little too closely, evaluation weightings that reward exactly what the current holder already does. None of it is provable, but the patterns are real, and they belong in an honest go or no-go. I bring the facts and the odds; you bring the knowledge of your own margins; together that produces a decision you can stand behind.",
    ],
    mistakes: [
      "Deciding to bid the moment a posting looks relevant, before checking whether it is winnable.",
      "Missing a mandatory buried in an appendix or a referenced standard until the proposal is half-written.",
      "Reading scope and price while skipping the evaluation weighting that decides who actually wins.",
      "Bidding everything, then wondering why the win rate is low and the team is exhausted.",
    ],
    callout:
      "A disciplined no-go is worth as much as a good lead. Every bid you correctly decline frees the time and energy for one you can actually win.",
    statIds: ["go-no-go-top", "ae-volume-drop", "ae-value-up", "win-rate-public"],
    closing:
      "I bring you the facts: the requirements, the scope, the evaluation and the realistic odds. You bring the knowledge of your own margins and capacity. Together that produces a go or no-go you can stand behind, rather than a reflex to bid everything that lands in the inbox.",
    lead: "call",
  },
  "Opportunity monitoring": {
    angle:
      "is the difference between hearing about the right work in time and finding out a competitor won something you never saw.",
    landscapeHeading: "The two ways monitoring usually fails",
    landscape: [
      "Almost every monitoring setup I am asked to look at has failed in one of two directions. Either it sends too much, burying real opportunities under a daily flood of noise until nobody reads it, or it sends too little, quietly missing the work that did not happen to match a narrow set of keywords. Both feel like monitoring. Neither one actually catches the opportunities that matter.",
      "Portals route notifications using keywords and commodity codes, and both are imperfect in ways that cost you bids. Keywords reward exact wording, so a search for one phrasing does not fire on a posting that describes the same work differently. Codes depend on the buyer choosing the right one, and buyers are inconsistent, so the same work lands under different codes from one agency to the next.",
      "This is why I never trust automated matching as the whole system. It is a useful first filter, nothing more. The opportunities that hurt most are the ones tagged in a way your filters were never built to catch, and no amount of keyword tuning fully closes that gap.",
    ],
    structureHeading: "How I actually monitor",
    structure: [
      "My approach combines wide automated coverage with human reading on top. The machine casts a deliberately wide net across every source your buyers use. Then I read, because intent is something a person judges and a keyword cannot. Built right, monitoring is not a firehose, it is shaped to you.",
    ],
    structureList: [
      "Map your real footprint: the trades, jurisdictions and buyers that genuinely matter to you.",
      "Cast the net wide across every relevant portal, broader than feels comfortable, so adjacent tagging does not hide a posting.",
      "Read for intent, separating genuinely relevant opportunities from look-alikes the filters caught.",
      "Track amendments and addenda on everything you care about, so a late scope change is news, not a surprise.",
      "Deliver qualified opportunities, not raw alerts, so what reaches you is already worth your attention.",
    ],
    qualifyHeading: "Why a human still reads every relevant posting",
    qualifyIntro:
      "Automation is essential for breadth. No person can refresh a dozen portals every morning, so the machine does the casting. But the machine cannot tell whether a posting genuinely fits you, only whether it matched a rule. That judgment is what I add on top, and it runs the same disciplined order on every opportunity that clears the net.",
    themeHeading: "Bandwidth is now the constraint, not discovery",
    theme: [
      "The bigger shift in recent years is that bandwidth, not discovery, has become the binding constraint for most teams. For the first time, half of respondents in the benchmark data rank bandwidth as a top challenge. There is no shortage of opportunities to look at. There is a severe shortage of qualified attention to spend on them.",
      "That reframes what good monitoring is for. It is not about surfacing more, it is about surfacing the right work and keeping everything else out of your inbox, so your scarce attention lands where it pays. Alerts tell you what exists. I tell you what is worth bidding, and across the sheer number of public buyers out there, that filtering is the difference between a feed you can act on and one you stop reading.",
    ],
    deepDiveHeading: "It starts with mapping your real footprint",
    deepDive: [
      "Good monitoring is not a generic firehose pointed at every government portal. It is shaped to you. Before I watch anything, I map your real footprint: the trades you actually want more of, the jurisdictions you can serve profitably rather than just reach, and the specific buyers who tend to put out the kind of work you do. That map decides which platforms matter to you and which are noise, and it is the part automated tools skip entirely.",
      "This is also where I learn the difference between the work you say you want and the work you actually win. Vendors often describe themselves more broadly than their results warrant, and a setup built on the broad description drowns them in marginal leads. Built on the real footprint, it stays tight and relevant. The map is the part that makes everything downstream work, because a wide net is only useful if it is cast over the right water.",
      "Then there is the part everyone forgets, which is that finding an opportunity once is not monitoring it. Bids change after they post. An addendum can move a deadline, alter the scope or add a mandatory requirement, and if you are working from the original documents, you can prepare against a bid that no longer exists. I track the document set on every opportunity I am watching for you, so a change surfaces the day it lands rather than the week the bid closes.",
    ],
    deepDiveList: [
      "The trades and service lines where you are genuinely competitive, not just capable.",
      "The geography you can serve at a margin that makes a contract worth winning.",
      "The buyers and agency types whose work fits your scale and capacity.",
      "The platforms those buyers actually post on, which is a smaller set than the full landscape.",
      "The amendments and addenda on everything live, so a late change is never a surprise.",
    ],
    playbookHeading: "Why a human still reads every relevant posting",
    playbook: [
      "Automation is essential for breadth. No person can refresh a dozen portals every morning, so the machine does the casting. But the machine cannot tell whether a posting genuinely fits you, only whether it matched a rule. That judgment, separating a real opportunity from a convincing look-alike, is what I do on top of the automation, and it is the part that turns a feed of alerts into a short list of qualified opportunities.",
      "Reading also catches the things rules never could: the posting tagged in an unexpected category, the scope that technically matches your trade but is wrong for your operation, the buyer whose award history suggests the outcome is already decided. A keyword cannot weigh any of that. The combination, wide automated coverage plus a person who reads with your business in mind, is the only setup I have found that catches the right work without burying you in everything else.",
    ],
    mistakes: [
      "Relying on a single source or a narrow keyword set to catch everything relevant.",
      "Tuning alerts so tightly that real work falls outside them, or so loosely that nobody reads the feed.",
      "Treating discovery as the finish line instead of qualifying what the net brings back.",
      "Failing to track amendments, then preparing against a scope that has quietly changed.",
    ],
    callout:
      "Automation decides what to look at. A human decides what is worth your time. Monitoring that skips the second step is just noise on a schedule.",
    statIds: ["bandwidth-challenge", "response-hours", "us-local-govs"],
    closing:
      "Good monitoring surfaces qualified opportunities and keeps everything else out of your inbox. Alerts tell you what exists. I tell you what is worth bidding, and that is the standard I hold this work to.",
    lead: "call",
  },
  "Government procurement": {
    angle:
      "follows rules that look strange from the outside until you understand the why behind them, at which point the opportunities start to make sense.",
    landscapeHeading: "The mechanics, in plain English",
    landscape: [
      "Public buying looks bureaucratic because it is built to be defensible. The rules around competition, documentation and evaluation exist so that an agency can show it spent public money fairly. Once you understand that motivation, the mechanics stop looking arbitrary and start telling you how to compete. The same opportunity can demand a very different approach depending on the procurement path the buyer chose.",
      "The scale of public procurement is genuinely large, which is why the rules matter so much. Enormous sums move through these processes every year, across thousands of distinct buyers, and the structure is what keeps that spending accountable. For a vendor, the practical upshot is that how a contract is being bought shapes your strategy as much as what is being bought.",
      "So I read each opportunity in the context of its procurement path. A formally tendered competition, a standing offer, a cooperative vehicle and a low-dollar direct buy are different games with different rules, and treating them the same is how vendors misjudge both the effort and the odds.",
    ],
    structureHeading: "The paths a contract can take to award",
    structure: [
      "Government work reaches a vendor through several distinct routes, and each changes how you compete, how you are evaluated and how much effort a pursuit justifies. Knowing which path you are on is the first step in qualifying anything.",
    ],
    structureList: [
      "Open competitive solicitations, the formal tenders most people picture, with full documentation and scoring.",
      "Standing offers and supply arrangements, where being on the right list can mean steady orders for years.",
      "Cooperative purchasing vehicles that let one agency buy off another's competitively awarded contract.",
      "Low-dollar and direct buys below the thresholds that force open competition.",
      "Sole-source awards, where the public record often explains why competition was skipped.",
    ],
    qualifyHeading: "How the path changes my qualification",
    qualifyIntro:
      "Once I know how a contract is being bought, I read it in that light and give you a clear go or no-go. The disciplined order is the same on every opportunity, but the procurement path tells me which gates matter most and how much effort the pursuit can justify.",
    themeHeading: "Thresholds, trade agreements and where the real openings are",
    theme: [
      "A lot of strategy hides in the thresholds. Trade agreements and procurement rules dictate how openly a contract must be tendered above certain values, which shapes which opportunities you can realistically reach and how crowded they tend to be. Below those thresholds, buying is faster and often less contested, which can favour a nimble regional vendor over a national one.",
      "This is where renewal and incumbent intelligence pays off. Standing offers and term agreements come back around on cycles the public record often reveals, and a vendor who tracks that timing can get on the right list before the orders start flowing. Alerts tell you what exists today. Understanding the mechanics, and reading the award history, is how you see what is forming and position for it early.",
    ],
    deepDiveHeading: "Why the solicitation type changes your whole approach",
    deepDive: [
      "The acronyms matter more than they look. A request for proposals invites a scored response on methodology, team and price, and is won on more than the lowest number. An invitation to bid or request for quotation is usually price-driven and compliant-or-not. A request for information is not an award opportunity at all, it is the buyer shaping a future procurement, and treating it as a bid is a classic way to waste effort. Knowing which one you are looking at tells you immediately how to compete and how much effort the pursuit can justify.",
      "Standing offers and supply arrangements are their own game, and an underrated one. Getting onto the right list can mean steady orders for years without bidding each one individually, which makes them some of the most valuable positions in public procurement and some of the most overlooked. They rarely look exciting in a posting, but the recurring revenue they carry is exactly the kind of work a disciplined vendor should be qualifying for deliberately rather than stumbling into.",
      "Sole-source and direct awards round out the picture. Not every contract goes to open competition, and the public record usually explains why when it does not. Understanding when a buyer can skip competition, and reading the notices that document it, tells you which opportunities are genuinely reachable and which were never going to be open in the first place. That is qualification at the level of the procurement path, before a single document is read.",
    ],
    deepDiveList: [
      "RFP: a scored response on more than price, where methodology and team carry real weight.",
      "IFB or RFQ: usually price-driven and compliant-or-not, with little room to differentiate.",
      "RFI: not an award, but the buyer shaping a future procurement, so weigh the effort carefully.",
      "Standing offers and supply arrangements: a list position that can carry years of recurring orders.",
      "Sole-source and direct awards: often documented in the record, which tells you what was never open.",
    ],
    playbookHeading: "Registration and the setup that unlocks opportunities",
    playbook: [
      "A surprising amount of the battle is being registered and findable before the opportunity posts. The right vendor registrations, on the systems your buyers actually use, are what let a buyer find you and what let the notifications reach you in the first place. An incomplete or missing registration quietly narrows the funnel before you have searched at all, and the order you tackle them in matters, because some take time to clear.",
      "I treat that setup as part of the groundwork, mapped to where you actually bid rather than done blanket across every system in existence. The point is not to be everywhere, it is to be properly positioned on the handful of systems that carry your work. Get that right, understand how each opportunity is being bought, and the qualification that follows has solid ground to stand on.",
    ],
    mistakes: [
      "Treating every procurement path the same, and misjudging both the effort and the odds.",
      "Overlooking standing offers and cooperative vehicles that quietly carry recurring revenue.",
      "Ignoring thresholds that determine how openly a contract must be competed.",
      "Reacting only to open tenders while the recurring, lower-profile work goes unwatched.",
    ],
    callout:
      "Understanding the mechanics is the groundwork. Qualifying the specific opportunities in front of you is where the work actually pays off.",
    statIds: ["us-federal-spend", "canada-public-units", "single-bid-frequency"],
    closing:
      "Understanding how government buys is the groundwork. Qualifying the specific opportunities in front of you, in the light of how they are being bought, is where I spend my time and where the effort actually pays.",
    lead: "guide",
  },
  Competition: {
    angle:
      "is something the public record will tell you more about than most vendors realize, if you are willing to read the award data.",
    landscapeHeading: "The field is more readable than you think",
    landscape: [
      "Most vendors enter a competition with only a vague sense of who else is in it. That is a missed advantage, because the public award record tells you a great deal: who wins, where, at what scale and how often. Reading that history before you decide to bid turns competition from a guess into something you can actually judge.",
      "The surprising part is how thin competition often is. A meaningful share of supposedly competitive public processes draw very few bids, and some draw only one. That cuts both ways. It means the crowd you imagine may not be there, and it means where you are genuinely qualified, the realistic field can be far smaller than the perceived one.",
      "So I use public award history to understand the field before you commit, not to manufacture confidence. The goal is to compete where your odds are genuinely strongest, and to recognise the fights you cannot win before they cost you anything.",
    ],
    structureHeading: "What the award record reveals",
    structure: [
      "Award data is free intelligence most vendors waste. Read carefully, it answers questions that otherwise turn into expensive guesses, and it feeds directly into a realistic go or no-go on whatever you are weighing now.",
    ],
    structureList: [
      "Who the incumbent is, how long they have held the work and how entrenched they look.",
      "How many bidders a given buyer or contract type tends to attract.",
      "The scale and price band of past awards, which sets realistic expectations.",
      "Whether a buyer rotates vendors or keeps renewing the same one, which shapes your odds.",
      "When a contract was last awarded, which points toward the next recompete window.",
    ],
    qualifyHeading: "Folding competition into the go or no-go",
    qualifyIntro:
      "I factor the competitive picture into a realistic recommendation, rather than letting an attractive-looking opportunity pull you into a fight you cannot win. The competitive read sits alongside the usual disciplined order, sharpening the judgment rather than replacing it.",
    themeHeading: "What single-bid contracts tell you about the field",
    theme: [
      "The single-bid pattern in the public record is worth dwelling on. When a large share of competitive processes draw only one bid, it tells you the field is often far less crowded than vendors fear. It also carries a warning: single-bid contracts tend to cost the buyer more, which means buyers are increasingly watching for them and trying to widen participation.",
      "For you, the practical reading is twofold. First, do not talk yourself out of work on the assumption the field is packed, because frequently it is not. Second, where you are the obvious strong fit, that is exactly the situation worth pursuing with discipline. Alerts tell you a contract exists. The award history tells you whether the fight is real, and that is the difference between entering a competition blind and entering it informed.",
    ],
    deepDiveHeading: "Reading the incumbent, and reading their pricing",
    deepDive: [
      "When a contract has an incumbent, that single fact reshapes the whole calculation. Incumbents carry real advantages: relationships, sunk setup costs, a track record the buyer already trusts. They also carry real vulnerabilities: complacency, price creep, service that has slipped, a scope the buyer has quietly outgrown. The award record helps me read which way a given incumbent leans, how long they have held the work, and whether the buyer shows any sign of being ready to switch. Challenging an entrenched incumbent with no evidence of an opening is one of the most common ways to waste a pursuit.",
      "Past awards also leak pricing context if you know how to read them. The value and scope of previous awards set a realistic band for what the work goes for, which keeps you from pricing into a fantasy in either direction. It is context, not a crystal ball, and I am careful not to overread a single data point. But across a run of awards, the pattern is usually clear enough to set expectations honestly, which is worth far more than guessing.",
      "All of this feeds one decision: whether the realistic odds justify the effort. Niche or broad is part of the same question. Competing everywhere usually means winning nowhere, and the award record helps identify the lanes where your odds are genuinely strongest, the buyers and contract types where you are the obvious fit rather than one of many. Picking those lanes deliberately beats spreading effort across a field you have not actually read.",
    ],
    deepDiveList: [
      "How long the incumbent has held the work, and whether the buyer rotates or renews.",
      "Signs in the record that a buyer may be ready to switch, versus signs they are entrenched.",
      "The value and scope band of past awards, which sets realistic pricing expectations.",
      "Which buyers and contract types you are the obvious fit for, versus one of a crowd.",
      "Where focusing your effort beats spreading it thin across an unread field.",
    ],
    playbookHeading: "Choosing the lanes worth competing in",
    playbook: [
      "The output of all this reading is a deliberate choice of where to compete, not a reflex to enter everything that looks plausible. I help clients pick the lanes where the award record says their odds are genuinely strongest: the buyers who rotate rather than renew, the contract sizes that fit, the work where the field is thinner than it looks. That focus is what turns a low public-sector win rate into a respectable one, because the wins come from picking the right fights, not from fighting more of them.",
      "It also means being honest about the fights you cannot win. An entrenched incumbent with a happy buyer and a wired-looking solicitation is not a competition, it is a formality, and recognising that before you commit estimating hours is exactly the value of reading the field first. Knowing where not to compete is as much a part of competing well as knowing where to push.",
    ],
    mistakes: [
      "Entering a competition with no read on the incumbent or the likely field.",
      "Assuming every contract is heavily contested when much of the record says otherwise.",
      "Ignoring award scale and price bands, then misjudging where you fit.",
      "Chasing an entrenched incumbent's contract with no evidence the buyer is ready to switch.",
    ],
    callout:
      "Knowing the field is part of qualifying it. I help you compete where your odds are genuinely strongest, not everywhere at once.",
    statIds: ["one-bid-open", "one-bid-limited", "single-bid-frequency", "single-bid-premium"],
    closing:
      "Reading the field is part of qualifying it. I use the public award record to help you compete where your odds are genuinely strongest, and to walk away from the fights the data says you cannot win, before they cost you anything.",
    lead: "call",
  },
  "No-bid analysis": {
    angle:
      "is the half of intelligence nobody markets, because saying no is harder to sell than another lead, even though it protects more of your time.",
    landscapeHeading: "Why the no-bid is the valuable half",
    landscape: [
      "Everyone sells you more leads. Almost nobody sells you the discipline to decline the wrong ones, and yet that is where the real protection of your time lives. Every pursuit you take on consumes the same scarce senior hours that deliver and price your winnable work. A no-bid is not a failure to find an opportunity. It is a decision to protect the capacity an opportunity would have wasted.",
      "The cost of chasing the wrong work is easy to underestimate because it is invisible on a balance sheet. The estimator who spends days on a bid that was never winnable is a real, loaded cost, and the qualified opportunity that went unread while they did it is a second cost on top. Opportunity waste is the quiet drain on most operations, and disciplined no-bid analysis is the cure.",
      "So I watch for the signals that an opportunity is not worth pursuing, no matter how appealing it looks on the surface, and I give you the reasoning for walking away. Where it makes sense, I flag the opportunity to revisit at the recompete instead of discarding it entirely.",
    ],
    structureHeading: "The signals that point to a no-bid",
    structure: [
      "A no-bid recommendation is never a shrug. It rests on specific signals, read in the order that catches the cheapest disqualifiers first, so the decision is defensible and the reasoning is yours to weigh.",
    ],
    structureList: [
      "A mandatory you cannot meet or prove, which ends the question on its own.",
      "Bonding or insurance thresholds beyond what your line will support.",
      "An evaluation that gives you no realistic path to place high enough to win.",
      "Signals that the contract is wired for an incumbent before it ever posted.",
      "A value that simply does not justify the loaded hours the pursuit would cost.",
    ],
    qualifyHeading: "How I cost out a pursuit before recommending against it",
    qualifyIntro:
      "A no-bid is a judgment about value as much as eligibility. Even a bid you could win is not automatically worth winning, so I weigh the realistic odds against what the pursuit will actually cost in loaded senior time. That cost is higher than most teams admit, which is exactly why the discipline pays.",
    themeHeading: "The real, loaded cost of a bad pursuit",
    theme: [
      "Put a number on it and the discipline sells itself. A proposal absorbs many hours of senior time, and that time is not free. Loaded properly, a practical blended rate for the people who price and pursue your bids runs to a meaningful figure per hour, and a single ill-judged pursuit can quietly burn through a serious amount of it before anyone notices the bid was never winnable.",
      "Hiring your way around the squeeze is not the escape it once was either, which makes the protection of existing capacity even more valuable. Every pursuit you correctly decline is hours returned to winnable work. Alerts tell you what exists. The harder, more valuable judgment is what to skip, and that is exactly why disciplined qualification pays for itself many times over.",
    ],
    deepDiveHeading: "How I cost out the time a bad pursuit consumes",
    deepDive: [
      "To make a no-bid concrete, it helps to put the cost in hours and dollars rather than vague discomfort. A proposal pulls in your most senior people, the same ones who price, plan and deliver the work you already have. Those hours are not free, and loaded properly with the overhead that sits on top of a salary, they add up faster than most operators expect. A single misjudged pursuit can quietly burn through a serious figure before anyone steps back and notices the bid was never winnable in the first place.",
      "The second cost is the one nobody invoices: the qualified opportunity that went unread because the team was buried in the wrong one. Opportunity waste is exactly this, the winnable work that slips past while attention is spent on a lost cause. When I recommend against a bid, I am protecting both costs at once, the hours the pursuit would have consumed and the better opportunity those hours could have served instead.",
      "Sometimes the right answer is not a flat no but a not yet. When an opportunity is wrong today because of timing, an entrenched incumbent or a scope that does not fit, I flag it to revisit at the recompete rather than discard it. The award record often points to roughly when it comes back around, and a no today that becomes a well-prepared yes in eighteen months is a far better outcome than either chasing it now or forgetting it entirely.",
    ],
    deepDiveList: [
      "The loaded hourly cost of the senior people a pursuit actually consumes.",
      "The total hours a complex proposal realistically demands, not the optimistic estimate.",
      "The winnable opportunity those same hours could have served instead.",
      "Whether a no today should become a tracked recompete for later.",
      "The honest odds, weighed against the value, before any of those hours are spent.",
    ],
    playbookHeading: "Saying no without losing the opportunity for good",
    playbook: [
      "A disciplined no-bid is not the end of a relationship with an opportunity, it is a decision about timing and fit made with open eyes. I give you the reasoning in plain terms, so the call is yours to weigh against what only you know about your margins and capacity. Plenty of clients choose to pursue something I flagged as marginal, and that is fine. The point is that you decide with full information rather than finding out the hard way, halfway through writing.",
      "Where it makes sense, the no comes with a follow-up plan: track the contract toward its recompete, watch the incumbent, and revisit when the timing actually fits. That way the discipline never costs you a genuine opportunity. It simply makes sure the hours go to the work you can win now, and the rest is held for when it becomes winnable rather than chased while it is not.",
    ],
    mistakes: [
      "Treating the cost of a pursuit as free because it does not show up as a line item.",
      "Bidding an attractive-looking contract you have no realistic path to win.",
      "Discarding a poor-fit opportunity entirely instead of flagging it for the recompete.",
      "Confusing activity with progress, and measuring the team on bids submitted rather than won.",
    ],
    callout:
      "Every wasted pursuit is time stolen from a winnable one. Knowing what to skip is exactly why disciplined qualification pays for itself.",
    statIds: ["response-hours", "estimator-hiring", "blended-rate", "single-bid-frequency"],
    closing:
      "The no-bid is the half of intelligence that protects the most time. I give you the reasoning to walk away with confidence, and I flag the opportunities worth revisiting at the recompete, so a no today is not a no forever.",
    lead: "call",
  },
  "Contract awards": {
    angle:
      "is not just closure on a bid, it is a map of who buys what, from whom, and on what cycle, if you read it the right way.",
    landscapeHeading: "Award notices are intelligence, not closure",
    landscape: [
      "Most vendors glance at an award notice, note who won, and move on. That is a waste of one of the best free intelligence sources in public procurement. An award record is a map: who buys, from whom, at what scale, and on what cycle. Read across time, it tells you how a buyer behaves, and how an agency has bought in the past is the strongest available predictor of how it will buy next.",
      "The value compounds when you read awards as a series rather than one at a time. A single notice tells you who won a contract. A run of them tells you whether the buyer rotates vendors or keeps renewing the same one, how often the work recurs, and roughly when it will come back around. That pattern is exactly what you need to position early instead of reacting late.",
      "So I read award notices and history to understand the buyer, not just to close the file on a bid. The point is forward-looking: using what already happened to sharpen qualification on the opportunities still ahead.",
    ],
    structureHeading: "What I pull from an award record",
    structure: [
      "An award record answers questions that otherwise become expensive guesses. Reading it carefully feeds directly into recompete timing and into a realistic view of whether you are a fit before the next opportunity opens.",
    ],
    structureList: [
      "Who won, and whether they are the same vendor the buyer has used before.",
      "The contract value and term, which together point toward the next recompete window.",
      "How the scope was actually defined, versus how the original solicitation described it.",
      "Whether the buyer favours incumbents or genuinely rotates, which shapes your odds.",
      "Patterns across similar buyers, which help you read a new opportunity faster.",
    ],
    qualifyHeading: "Turning award history into a qualification edge",
    qualifyIntro:
      "Award data only matters if it changes a decision. I use it to estimate recompete timing and to judge whether you are a realistic fit before the next opportunity opens, then run the usual disciplined qualification when it does. The history sharpens the judgment rather than replacing it.",
    themeHeading: "Reading recompete timing and the wider field",
    theme: [
      "The most actionable thing in an award record is timing. A contract value and term together tell you roughly when the work reopens, and a vendor who knows a multi-year agreement recompetes next year can position long before the bid posts. That forward view is worth far more than reacting to whatever happens to appear in a feed this week.",
      "Awards also calibrate your read of the competitive field. Across the wider record, the gap between the firms that treat this intelligence seriously and those that do not shows up in results, with the stronger performers winning a clearly higher share. Alerts tell you what exists today. The award history tells you what is coming back, who tends to win it, and whether the next round is worth your effort, which is precisely the renewal and incumbent intelligence most vendors leave on the table.",
    ],
    deepDiveHeading: "Reading a single notice, then reading the series",
    deepDive: [
      "A single award notice already carries more than most vendors take from it. Who won, the value, the term, and how the scope was actually defined versus how the original solicitation described it. That last point is quietly valuable: the gap between the solicitation and the award tells you how the buyer really thinks about the work, which is exactly the context you want before you respond to their next one. One notice, read carefully, is a free briefing on how an agency behaves.",
      "The real power comes from reading awards as a series rather than one at a time. A run of notices for similar work tells you whether the buyer rotates vendors or keeps renewing the same one, how often the work recurs, and roughly when it will come back around. That pattern is the difference between reacting to a posting with a tight clock already running and positioning months ahead because you saw the recompete coming. Across similar buyers, the patterns also let you read a brand-new opportunity faster, because agencies of the same type tend to behave alike.",
      "All of this is forward-looking. I am not reading award history to close the file on a bid, I am reading it to sharpen qualification on the opportunities still ahead. The value, the term and the cadence together estimate when the work reopens; the win pattern estimates whether you are a realistic fit; and the two together tell you whether to start preparing now or to let it pass.",
    ],
    deepDiveList: [
      "The winner, and whether they are the same vendor the buyer has used before.",
      "The value and term, which together point toward the next recompete window.",
      "How the awarded scope differed from the original solicitation, and what that reveals.",
      "Whether the buyer favours incumbents or genuinely rotates, which shapes your odds.",
      "Patterns across similar buyers, which help you read a new opportunity faster.",
    ],
    playbookHeading: "Building a recompete calendar from the record",
    playbook: [
      "The practical output of award reading is a calendar. For the contracts that matter to you, the value and term estimate a recompete window, and that window is when positioning actually pays. A vendor who knows a multi-year agreement reopens next year can build relationships, close capability gaps and be ready on day one, rather than scrambling when the RFP finally posts. That forward view is worth far more than any single live alert.",
      "I keep that calendar running alongside the live monitoring, so you are working two timelines at once: the opportunities open now, qualified honestly, and the ones coming back that you can prepare for in advance. Most competitors only ever see the first. Reading the award record is how you also see the second, which is the renewal and incumbent intelligence that quietly separates the vendors who are always reacting from the ones who are always ready.",
    ],
    mistakes: [
      "Reading an award notice as closure rather than as intelligence for next time.",
      "Ignoring contract terms that telegraph when the work will recompete.",
      "Failing to spot whether a buyer favours incumbents before challenging one.",
      "Reacting to live postings only, and missing the recompetes you could have prepared for.",
    ],
    callout:
      "Award history is free intelligence most vendors waste. I put it to work sharpening qualification on the opportunities still ahead.",
    statIds: ["single-bid-frequency", "us-federal-spend", "leaders-laggards"],
    closing:
      "Award history is free intelligence most vendors leave on the table. I put it to work estimating recompete timing and sharpening qualification, so you are positioned for the next opportunity well before it posts.",
    lead: "call",
  },
};

/**
 * Build a substantial, citation-backed article body (~2,500 words) for any
 * topic without a hand-written deep body. The prose is generated from the
 * topic's own title, category and excerpt, woven through a per-category frame
 * with at least two cited stat blocks and a callout, so every page reads as a
 * real, useful article rather than a thin stub.
 */
export function buildGeneratedBody(topic: BlogTopic): BlogBody {
  const frame = CATEGORY_FRAMES[topic.category] ?? CATEGORY_FRAMES["Government procurement"];
  const subject = stripTrailingParen(topic.title);
  const stats = frame.statIds;

  // Split the available stat ids across the article so they land in different
  // sections rather than bunching up. Every article gets at least two.
  const statLandscape = stats[0];
  const statTheme = stats[1] ?? stats[0];
  const statClosingContext = stats[2] ?? null;

  const sections: Section[] = [
    {
      id: "the-lede",
      heading: "What this comes down to",
      blocks: [
        { type: "p", text: topic.excerpt },
        {
          type: "p",
          text: `${subject} ${frame.angle} I work in this corner of government opportunity intelligence every day, across Canada and the United States, so the rest of this piece is the practical view from someone who reads these documents for a living: what I actually watch, how I read it, and how I decide what is worth your time.`,
        },
        {
          type: "p",
          text: "One thing up front, because it shapes everything below. I find, monitor and qualify government opportunities. I read the documents and tell you plainly what fits and what does not. I do not write proposals and I do not submit bids. That stays with you and your team, where it belongs. My job is to make sure the work you spend those hours on is work you can actually win.",
        },
        {
          type: "callout",
          text: "Alerts tell you what exists. I tell you what is worth bidding. That distinction is the whole point, and it runs through everything in this article.",
        },
      ],
    },
    {
      id: "landscape",
      heading: frame.landscapeHeading,
      blocks: [
        ...frame.landscape.map((text) => ({ type: "p" as const, text })),
        { type: "stat", id: statLandscape },
        {
          type: "p",
          text: "I lead with that figure because it sets the scale honestly. A number like that is context for where the work sits and how much of it there is, not a promise about your own opportunity. The job from here is narrowing it down to what genuinely fits you.",
        },
      ],
    },
    {
      id: "structure",
      heading: frame.structureHeading,
      blocks: [
        ...frame.structure.map((text) => ({ type: "p" as const, text })),
        { type: "ul", items: frame.structureList },
        {
          type: "p",
          text: "I keep this map in view on every opportunity, because the shape of the work decides how I read it. A posting that looks marginal under one lens can be exactly the recurring, right-sized work you want under another, and the only way to tell is to read past the summary into the documents themselves.",
        },
      ],
    },
    {
      id: "how-i-qualify",
      heading: frame.qualifyHeading,
      blocks: [
        { type: "p", text: frame.qualifyIntro },
        {
          type: "ol",
          items: [
            "Mandatory requirements first. They are pass or fail, so if you cannot meet one and prove it, nothing else matters and I say so plainly. That alone can return hours to your week.",
            "Scope of work. What is actually being bought, at what volume, over what term, in which locations, and whether it matches the work you want more of, delivered the way you can deliver it.",
            "Evaluation criteria. How the bid is actually scored, so I can judge whether you can realistically place high enough to win, not merely qualify to be considered.",
            "Bonding, insurance, certifications and references. The quiet thresholds that eliminate bidders before a single price is ever compared.",
            "Red flags and value. The signals that an opportunity is wired or marginal, weighed against whether the work is worth the loaded hours the pursuit would cost.",
          ],
        },
        {
          type: "p",
          text: "Only after that do I form a view on whether the opportunity is a go or a no-go for you, with the reasoning behind it. Plenty of relevant-looking postings come back as a clear no, and that is the point. Knowing what to skip protects the time you would otherwise spend chasing work you were never positioned to win.",
        },
        {
          type: "p",
          text: "I run the order the same way every time on purpose. The cheapest mistakes to catch sit at the top, so a bid that fails the first gate never costs you the hours the later gates would have demanded. It also keeps the recommendation honest and repeatable: you get the same disciplined read on every opportunity, not a gut feeling dressed up as analysis. That consistency is what lets you trust a no as much as a yes, because both came from the same process rather than from whichever way the wind was blowing that week.",
        },
      ],
    },
    {
      id: "the-theme",
      heading: frame.themeHeading,
      blocks: [
        { type: "p", text: frame.theme[0] },
        { type: "stat", id: statTheme },
        ...(frame.theme.slice(1).map((text) => ({ type: "p" as const, text }))),
        { type: "callout", text: frame.callout },
      ],
    },
    {
      id: "deep-dive",
      heading: frame.deepDiveHeading,
      blocks: [
        ...frame.deepDive.map((text) => ({ type: "p" as const, text })),
        { type: "ul", items: frame.deepDiveList },
      ],
    },
    {
      id: "playbook",
      heading: frame.playbookHeading,
      blocks: [
        { type: "h3", text: "The practical version" },
        ...frame.playbook.map((text) => ({ type: "p" as const, text })),
      ],
    },
    {
      id: "common-mistakes",
      heading: "Where vendors usually go wrong here",
      blocks: [
        {
          type: "p",
          text: "After enough of these, the same handful of mistakes show up again and again. The root of nearly all of them is treating discovery as the finish line. Finding an opportunity is the easy part. The expensive part is deciding, honestly and early, whether it is worth pursuing, and then tracking it so a late change does not quietly undo your preparation.",
        },
        { type: "ul", items: frame.mistakes },
        {
          type: "p",
          text: "None of these are exotic. They are the ordinary ways busy operators lose work and waste hours, and every one of them is avoidable with disciplined coverage and an honest read of the documents. That is the entire job, and it is why I treat qualification, not volume, as the thing that actually moves results.",
        },
      ],
    },
    {
      id: "how-this-fits",
      heading: "How this fits the way I work",
      blocks: [
        {
          type: "p",
          text: "Everything above lives inside one consistent approach. I cast a deliberately wide net across the platforms and systems your buyers actually use, reconcile them against each other so no single source is treated as complete, and then read what comes back with your business in mind. What reaches you is a short list of qualified opportunities, not a pile of raw alerts to sort through yourself.",
        },
        {
          type: "p",
          text: "Where it helps, I connect the threads: a bid I would qualify against my usual go or no-go discipline, a contract worth tracking toward its renewal rather than chasing today, an incumbent whose hold on the work the award record helps me read. The opportunity waste this avoids, the senior hours not spent on unwinnable bids, is usually the part that pays for the whole arrangement.",
        },
        {
          type: "p",
          text: "None of this depends on bidding more. It depends on bidding better, which is the through-line of everything I do. A vendor who sees the right opportunities early, reads them honestly, and puts their limited estimating hours behind the work they can actually win will beat a vendor chasing twice the volume on guesswork, every year, without fail. The discipline is unglamorous, but it is where the results come from.",
        },
        ...(statClosingContext
          ? [{ type: "stat" as const, id: statClosingContext }]
          : []),
        {
          type: "p",
          text: "That is the difference between a feed of everything and a feed you can act on. The first buries you. The second protects the one resource you cannot buy more of, which is the focused attention of the people who win your work.",
        },
      ],
    },
    {
      id: "the-report",
      heading: "Where to take it from here",
      blocks: [
        { type: "p", text: frame.closing },
        {
          type: "p",
          text: "If you want to see this applied to your own trade and jurisdictions, the fastest starting point is my free Government Opportunity Intelligence Report. Tell me where you bid and what you chase, and I will come back with the picture as it actually looks for you: where the work is, what is worth pursuing, and what to leave alone. You can find it at /government-opportunity-intelligence-report, and a short call is always open if you would rather talk it through.",
        },
      ],
    },
  ];

  const faqs: Faq[] = [
    {
      q: "Do you write or submit the proposal?",
      a: "No. I find, monitor and qualify opportunities, read the documents, and give you a clear go or no-go with the reasoning behind it. Writing and submitting the bid stays with you and your team, where it belongs.",
    },
    {
      q: "How is this different from setting up my own alerts?",
      a: "Alerts only fire on the categories and keywords you select, against whatever code a buyer happened to use, and the gap between those two is where opportunities slip past silently. I cast a wider net across every source your buyers use and read on top of the automation for intent, so what reaches you is qualified rather than raw.",
    },
    {
      q: "What is the free Government Opportunity Intelligence Report?",
      a: "It is a no-cost starting point. You tell me your trade and the jurisdictions you bid in, and I come back with a practical read on where the work is, which opportunities are worth pursuing, and which are not. It is the simplest way to see how qualification changes the picture before you commit to anything.",
    },
  ];

  return { readMins: 11, sections, faqs, leadVariant: frame.lead };
}

/** Resolve the body for a given topic, deep or generated. */
export function getBlogBody(topic: BlogTopic): BlogBody {
  return DEEP_BODIES[topic.slug] ?? buildGeneratedBody(topic);
}

function stripTrailingParen(title: string): string {
  // Drop a trailing "(2026)"-style parenthetical and any ": subtitle" so the
  // title reads cleanly when woven into a sentence.
  const noParen = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const colon = noParen.indexOf(":");
  return (colon === -1 ? noParen : noParen.slice(0, colon)).trim();
}
