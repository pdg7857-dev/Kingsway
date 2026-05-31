import type { LongForm } from "./types";

/**
 * Hand-authored, deep authority bodies for the SaaS aggregator and sourcing
 * platforms: Bonfire, Biddingo and bids&tenders. First-person Phil voice, no em
 * or en dashes, written to be the most useful page on the internet about using
 * each platform as a contractor who finds and qualifies the work.
 */
export const AGGREGATOR_PLATFORM_CONTENT: Record<string, LongForm> = {
  bonfire: {
    readMins: 17,
    intro:
      "Bonfire is one of the platforms contractors run into constantly and understand least. It is a sourcing and evaluation system that public buyers use to run RFPs, RFQs and qualifications, and it now sits inside the Euna supplier ecosystem. The catch is structural: each agency runs its own Bonfire portal, so there is no single feed you can simply subscribe to and trust. I know how Bonfire matches you to work, how its free and paid tiers quietly decide what you see, and exactly where good opportunities slip between the hundreds of separate front doors. This is the full picture, and how I make sure the scattered portals turn into one clean shortlist for you.",
    sections: [
      {
        id: "what-is-bonfire",
        heading: "What Bonfire is, and what it is not",
        blocks: [
          { type: "p", text: "Bonfire is a sourcing and evaluation platform. Public buyers use it to publish solicitations, collect responses, and score them against evaluation criteria in a structured way. For the buyer it is a clean, auditable way to run a competition. For you, the contractor on the other side, it is a vendor portal where you find the notice, download the documents, and submit your response. That part works well, and I want to be clear that nothing here is a knock on the software." },
          { type: "p", text: "Bonfire is part of the Euna supplier ecosystem, and Euna's supplier network advertises a large reach: more than 1.25 million suppliers and over 3,000 public-sector customers built up across 27 years. Those are impressive numbers, and they describe the size of the network. They do not describe how easy it is for one contractor to actually see every opportunity that fits, because of how Bonfire is structured underneath the marketing." },
          { type: "p", text: "Here is the structural fact that matters more than any headline number. Each agency runs its own Bonfire portal. There is no single Bonfire feed that shows you everything a region is buying. A county, the university across town and a water district can all run Bonfire, and each one is a separate front door with its own registration, its own categories and its own notification settings. The platform aggregates buyers in the sense that many of them use it. It does not aggregate opportunities into one stream you can watch." },
          { type: "callout", text: "Bonfire is a sourcing tool, not a single feed. The network is enormous, but the opportunities are spread across hundreds of separate agency portals, and that distinction decides whether you ever see the work." },
          { type: "p", text: "That distinction is the whole reason a contractor can be registered on Bonfire, feel covered, and still miss a steady stream of fits. Coverage on Bonfire is not a switch you flip once. It is a map you have to build and maintain, one agency at a time." },
        ],
      },
      {
        id: "who-uses-bonfire",
        heading: "Who posts on Bonfire",
        blocks: [
          { type: "p", text: "The buyers who run their solicitations through Bonfire are exactly the local and institutional buyers most contractors want, and they span the public sector." },
          { type: "ul", items: [
            "Municipalities and counties, which post the bulk of the everyday facilities, construction and services work.",
            "Universities and colleges, which run their own procurement cultures and category language.",
            "Health authorities and special districts, which buy on their own cycles and rarely in plain trade terms.",
            "State and provincial agencies, which use Bonfire alongside whatever central system they also feed.",
          ] },
          { type: "p", text: "The sheer count of these buyers is the point, and it is why no contractor can simply watch them all by hand. Consider the size of the U.S. local-government landscape alone." },
          { type: "stat", id: "us-local-govs" },
          { type: "p", text: "Layer on the special districts, the water and fire and transit authorities, the school districts, and the number of independent buyers grows again." },
          { type: "stat", id: "us-special-districts" },
          { type: "p", text: "Not every one of those buyers uses Bonfire, of course. But a meaningful and growing share do, and they each run a separate portal. The practical effect is that the buyers in your service area who happen to be on Bonfire are scattered across a list you have to discover and assemble yourself. Miss a portal and you do not know you missed it, because nothing tells you a buyer exists until you have already found them." },
        ],
      },
      {
        id: "how-bonfire-categorizes",
        heading: "How Bonfire categorizes and notifies",
        blocks: [
          { type: "p", text: "Bonfire matching runs on commodity codes and keywords. When you set up your supplier profile, you tell the system which commodity codes describe your work, and Bonfire uses that, along with keyword matching, to surface opportunities and send notifications. On a single portal that works the way you would expect: tag your codes, get notified when a matching solicitation posts." },
          { type: "p", text: "The complication is what happens across the network, and here the tiers matter a great deal. On the free plan, Bonfire mainly matches you with agencies you are already registered with. In other words, the free plan does not go out and find you new buyers. It notifies you about the portals you already joined. If you have not found and registered with an agency, the free plan is silent about its work." },
          { type: "p", text: "The Pro plan changes that picture. It recommends opportunities from a much larger pool, up to 2,000 or more agencies depending on your region, and Euna markets up to 8 billion dollars in additional opportunities surfaced annually through that recommendation engine. That is genuinely useful reach. It is also a paid upgrade, it is bounded by region, and it is still driven by commodity-code and keyword matching, which means it inherits every weakness of code matching." },
          { type: "callout", text: "The free Bonfire plan mostly tells you about buyers you already found. The Pro plan recommends across many more agencies, but it is region-bounded, paid, and still only as good as the codes and keywords behind the match." },
          { type: "p", text: "There is one more wrinkle worth knowing. External opportunities can surface inside Bonfire, work that lives on other platforms. That sounds helpful, and it can be, but Bonfire support cannot help you with submissions or questions on those external platforms. So an opportunity can appear in front of you in a place where the people who showed it to you cannot actually help you pursue it. You have to recognize that, switch contexts, and go deal with the real issuing system yourself." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of Bonfire alerts",
        blocks: [
          { type: "p", text: "Bonfire notifications are useful and, like every automated match, limited in ways that bite a working contractor. Here is where they fall short." },
          { type: "ul", items: [
            "On the free plan you mostly hear from buyers whose individual portals you already found and registered on, so undiscovered agencies stay invisible.",
            "There is no single Bonfire feed, which means even good notifications only cover the slice of the network you have set up, not the work you would actually want across your area.",
            "Matching is commodity-code and keyword based, so a loosely coded or oddly worded solicitation slips past the match the same way it would on any code-driven system.",
            "The Pro recommendation engine is bounded by region, so work just outside your set region can fail to surface even when you would happily serve it.",
            "An alert tells you a solicitation exists. It does not tell you about the evaluation weighting, the mandatory site visit, the bonding, or whether the scope quietly favours the incumbent.",
          ] },
          { type: "p", text: "And the speed problem is real, because public response windows are not generous. The benchmark for how long a serious response actually takes makes clear that a late notification can cost you the bid before you have read page one." },
          { type: "stat", id: "response-hours" },
          { type: "p", text: "A notification is a tripwire. It cannot read the document set, weigh the evaluation criteria, or tell you whether the work is worth an estimator's afternoon. That judgment is a separate job, and it is the one I do." },
        ],
      },
      {
        id: "search-registration-access",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "Searching and accessing Bonfire yourself is where the per-portal structure really shows itself, and it inherits the same code-and-keyword logic that limits the alerts." },
          { type: "ul", items: [
            "There is no unified search across all Bonfire buyers, so you cannot run one query and see everything a region is buying. You search portal by portal, or you rely on the recommendation engine and its boundaries.",
            "Each portal hides the real scope inside its own document set, so even a found solicitation under-reports what it actually involves until you open the attachments.",
            "Registration is per agency. Each new buyer you want coverage on is another profile, another set of commodity codes to map, another login to keep current.",
            "New buyers adopt Bonfire constantly, and you will not know a buyer in your area went live unless you happen to be watching for it.",
            "Category tagging varies portal to portal, so the codes that surfaced work on one agency's portal may not surface the equivalent work on another's.",
          ] },
          { type: "p", text: "The throughline is the one that runs across every fragmented platform. The system surfaces work the way each buyer set up their portal, not the way you would naturally look for it, and the decisive detail lives in documents no search index reads. On Bonfire that problem is multiplied by the number of separate portals, because every weakness of code-driven search repeats once per agency." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on Bonfire",
        blocks: [
          { type: "p", text: "Stack the structure, the tiers and the code matching together and the misses on Bonfire follow a tight, recognizable pattern." },
          { type: "ol", items: [
            "A buyer in your service area runs a Bonfire portal you never found, so you are not registered and nothing ever notifies you. A facilities RFP on a county's standalone portal is the classic example.",
            "You are on the free plan, which mostly surfaces buyers you already joined, so the recommendation reach that would have found new work was never switched on.",
            "A solicitation is coded or worded in a way your profile does not match, so even on a portal you joined, the notification never fires.",
            "The Pro engine is region-bounded, so a buyer just across your set boundary stays out of your recommendations even though you would serve them.",
            "An external opportunity surfaces, you assume Bonfire support can help, and you lose time before realizing you have to go deal with the real issuing platform yourself.",
            "A mandatory site visit, an evaluation weighting or a bonding requirement is buried in the documents and missed until it is too late to act.",
          ] },
          { type: "p", text: "Every one of these is a coverage-and-reading failure, not a strategy failure. None of them is fixed by logging in more often. They are fixed by maintaining a real map of the Bonfire buyers in your area and by reading every solicitation that could plausibly fit." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where Bonfire fits in a fragmented market",
        blocks: [
          { type: "p", text: "It helps to step back and see Bonfire for what it is: one of many SaaS procurement portals carving up a market that was never unified to begin with. There is no single place where all public work in North America appears. Instead there are central tender services, regional purchasing groups, and a growing roster of per-agency portals like Bonfire, each holding a slice of the whole." },
          { type: "p", text: "Bonfire's slice is real and growing, especially among municipalities, universities and special districts. But because each buyer runs its own portal, Bonfire actually adds to the fragmentation rather than reducing it. Every agency that moves onto Bonfire becomes one more separate front door you have to know about, register with, and watch. The Euna network reach is broad, but reach is not the same as coverage from where you sit." },
          { type: "p", text: "This is why no single platform, Bonfire included, is a complete answer for a contractor. You will almost always be watching Bonfire alongside a central tender service, alongside regional groups, alongside other per-agency portals. The fragmentation is the market's defining feature, and the contractors who win consistently are the ones who treat coverage across all of it as a discipline rather than a collection of logins." },
          { type: "p", text: "The hiring math is what makes that discipline expensive to do in-house. Reading and qualifying across this many portals is real labour, and the people who can do it well are exactly the people who are hard to hire and keep." },
          { type: "stat", id: "estimator-hiring" },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement Bonfire",
        blocks: [
          { type: "p", text: "I do not replace Bonfire, and I would not want to. Bonfire stays the place you find the documents and submit your response on the agencies that use it. I sit on top of the fragmentation and do the part the platform was never built to do for you." },
          { type: "ul", items: [
            "I maintain the list of Bonfire buyers active in your jurisdictions and register where needed, so coverage does not depend on you stumbling onto every new portal.",
            "I read each solicitation's documents and evaluation criteria, not just the title, so the real scope and the decisive details reach you.",
            "I flag the mandatory site visits, evaluation weightings, bonding and insurance catches before you commit an estimator's time.",
            "I qualify fit against your trades, capacity and geography, so a scattered set of portals becomes one clean shortlist.",
            "I write a short, plain-language summary of each opportunity with a direct link back to the source, including the cases where an external opportunity means you act on a different issuing platform.",
          ] },
          { type: "p", text: "The result is the whole point of this service. Instead of a free plan that only watches the buyers you already found, and a paid plan bounded by region, you get a single shortlist of work that actually fits, drawn from across every Bonfire buyer in your area, each opportunity already read, qualified and linked. Your estimators price. Your team responds. Nobody spends a morning hunting for portals." },
          { type: "callout", text: "If you are registered on a handful of Bonfire portals and assuming that is your coverage, you almost certainly have blind spots you cannot see. Let me show you, on a call, the Bonfire buyers in your own area you are missing today." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The portal nobody had found",
        result: "A steady stream of facilities work from a county portal the contractor never knew existed.",
        body: "A facilities contractor was registered on three Bonfire portals and assumed that covered their metro area. A nearby county ran its own Bonfire portal, well inside their service radius, that they had simply never discovered, so no notification ever reached them. Mapping the Bonfire buyers in their region put that county's recurring work on their desk with time to prepare. Illustrative example.",
      },
      {
        title: "The free plan blind spot",
        result: "New buyers surfaced once coverage stopped depending on portals the contractor had already joined.",
        body: "A services firm on the free Bonfire plan was only ever notified about buyers they had already registered with, which felt like complete coverage until a competitor kept winning work nearby. The gap was structural: the free plan does not go find new buyers for you. Watching the broader set of Bonfire agencies in their area closed it. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Do I still need my own Bonfire account?", a: "Yes, and it stays useful. Bonfire remains where you download documents and submit on the agencies that use it. I work on top of it: I map the buyers in your area, read the solicitations, and qualify fit before anything reaches you." },
      { q: "Isn't the Bonfire Pro plan enough to find everything?", a: "Pro genuinely extends your reach by recommending opportunities from many more agencies, but it is bounded by region, it is still driven by commodity-code and keyword matching, and it does not read the documents or judge fit. I cover the buyers it misses and do the reading it cannot." },
      { q: "Can you cover Bonfire buyers I have not found yet?", a: "That is one of the main reasons contractors bring me in. Because each agency runs its own portal and there is no single feed, the undiscovered buyer is the most common blind spot. I maintain the list of Bonfire buyers in your jurisdictions so coverage does not depend on you finding each one." },
      { q: "What about opportunities that come from outside Bonfire?", a: "Bonfire can surface external opportunities, but its support cannot help you with submissions or questions on those other platforms. I recognize those cases, point you to the real issuing system, and still qualify the fit so you do not lose time figuring out where to act." },
      { q: "Is this Bonfire training or setup?", a: "No. I am not here to teach you the platform. I monitor it, read the solicitations and qualify them for you as an ongoing service, so your team spends its hours bidding rather than hunting through portals." },
      { q: "How fast will I see Bonfire opportunities?", a: "On a discovery call I will already have looked at the Bonfire buyers in your area, so you see real examples before you pay anything. After that, qualified opportunities reach you on a steady cadence as they post and close." },
    ],
  },

  biddingo: {
    readMins: 16,
    intro:
      "Biddingo is one of those Canadian platforms that contractors in the right sectors cannot ignore and contractors outside them have barely heard of. It is a long-running bid-distribution service with real strength in education, social housing and municipal buyers, especially across Ontario. If you serve school boards, housing providers or municipalities, a lot of work flows through here, and a separate supplier account is the price of admission. I know how Biddingo routes opportunities by category and buyer, where its notifications quietly fail, and how its less-than-transparent footprint hides work from contractors who think they are covered. This is the full picture, and how I make sure the fits reach you.",
    sections: [
      {
        id: "what-is-biddingo",
        heading: "What Biddingo is, and what it is not",
        blocks: [
          { type: "p", text: "Biddingo is a Canadian bid-distribution service that has been operating for a long time. Public buyers post their solicitations through it, and registered suppliers find and respond to that work. Unlike a per-agency portal, Biddingo aggregates a set of buyers into one service, which is genuinely helpful: it means a single account can be your window onto a cluster of buyers you care about, particularly in the sectors where Biddingo is strong." },
          { type: "p", text: "Those sectors are the thing to understand. Biddingo has particular depth in education, in social and affordable housing, and among municipal buyers, with a heavy concentration in Ontario though not limited to it. If your work touches school boards, housing providers or municipalities, this is a platform you cannot responsibly ignore, because a meaningful share of that work is distributed here and sometimes nowhere else you are watching." },
          { type: "p", text: "What Biddingo is not is fully transparent about its footprint. Its market reach is less visible than some competitors, which means it is genuinely hard, from the outside, to know exactly which buyers distribute through it and how complete your coverage is. That opacity is not a flaw you can fix by reading the marketing. It is a reason to treat coverage as something you actively verify rather than assume." },
          { type: "callout", text: "Biddingo's strength is real depth in education, housing and municipal work. Its weakness is a footprint that is less transparent than competitors, so you cannot simply assume registering once means you see everything." },
          { type: "p", text: "So the honest framing is this. Biddingo is a system of record and distribution for a valuable slice of Canadian public work. It publishes notices and routes them to suppliers who match. What it does not do is decide what fits your shop, read the documents for you, or guarantee you can see the full picture of what is being bought. Those gaps are exactly where contractors lose work they should have won." },
        ],
      },
      {
        id: "who-uses-biddingo",
        heading: "Who posts on Biddingo",
        blocks: [
          { type: "p", text: "The buyers you care about on Biddingo cluster into the sectors that define the platform, and each one writes scope in its own language." },
          { type: "ul", items: [
            "School boards, which run recurring facilities, maintenance and services contracts on their own academic calendars.",
            "Social and affordable housing providers, which buy capital repairs, renewals and ongoing services under sector-specific language.",
            "Municipalities, which post the broad mix of construction, sitework and services that local government buys.",
            "Other public agencies in Ontario and across other provinces, which distribute through Biddingo alongside whatever else they use.",
          ] },
          { type: "p", text: "The scale of the Canadian public sector is what makes this sector concentration matter. There are a great many buying units in Canada, and the local and education layer where Biddingo is strongest is a large part of it." },
          { type: "stat", id: "canada-public-units" },
          { type: "p", text: "Drill into the local and school-board layer specifically, and the count is substantial in its own right." },
          { type: "stat", id: "canada-local-units" },
          { type: "p", text: "Biddingo carries a real share of that education, housing and municipal work, but it does not carry all of it, and the buyers who post here also post elsewhere or move between systems over time. Because the footprint is less transparent, your coverage is only as good as your active understanding of which of your buyers actually distribute through Biddingo right now. That is a moving target, not a fact you learn once." },
        ],
      },
      {
        id: "how-biddingo-categorizes",
        heading: "How Biddingo categorizes and notifies",
        blocks: [
          { type: "p", text: "Biddingo organizes opportunities by category and by buyer, and it sends email notifications tied to the interests you register. When you set up your supplier account, you select the categories that describe your work and, in effect, the buyers and sectors you want to hear from. The platform then notifies you when a matching solicitation posts. On its face that is exactly what you want." },
          { type: "p", text: "The fragility is the same one that limits every category-driven system: the match only works if the category you selected lines up with the category the buyer chose. A procurement officer at a school board or housing provider describes the work in their terms, under time pressure, choosing the closest fit from their options rather than the label you would have picked. When their choice and your registration do not overlap, the notification never fires, even when the work is squarely yours." },
          { type: "p", text: "Sector language makes this worse on Biddingo specifically. Education and housing buyers use vocabulary a generic alert misreads. A school-board cleaning contract can be tagged under building services rather than anything with the word janitorial in it. A housing renewal can be described in capital-program language that never trips your trade keywords. The category system is doing its job; it just cannot translate between how the buyer thinks and how you search." },
          { type: "callout", text: "Biddingo notifications fire on the categories you picked and the way the buyer tagged the work. In education and housing, sector language routinely puts the same job under a label your registration does not cover." },
          { type: "p", text: "And the requirement that you hold a separate supplier account is its own small but real friction. It is one more registration to set up and keep current, one more set of category selections to get right, and a step that gates everything: if the account is not configured to match the buyers and sectors you serve, the notifications it sends will quietly under-report the market." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of Biddingo alerts",
        blocks: [
          { type: "p", text: "Biddingo notifications are useful and, like every automated alert, limited in ways that matter to a working contractor." },
          { type: "ul", items: [
            "Notifications depend on the categories you selected and how the buyer tagged the work, so a mis-categorized solicitation never reaches you.",
            "Education and housing buyers use sector language a generic alert reads literally, so the same job under different wording slips past.",
            "Volume in active regions, Ontario especially, buries the handful of genuine fits beneath everything that does not apply to you.",
            "Because the footprint is less transparent, you cannot easily tell whether quiet means there is no work or means a buyer you care about is not surfacing to your account.",
            "An alert tells you a solicitation posted. It does not tell you about the mandatory meeting, the evaluation weighting, the bonding, or whether the scope favours the incumbent.",
          ] },
          { type: "p", text: "That last point matters more in these sectors than people expect, because so much of education, housing and municipal work is recurring. Incumbents hold contracts for years, and the public competition often draws thin participation, which is its own signal worth reading." },
          { type: "stat", id: "one-bid-open" },
          { type: "p", text: "A notification is a starting gun, not a scouting report. It cannot read the solicitation, weigh the evaluation criteria, or tell you whether a re-bid is genuinely open or wired for the incumbent. That judgment is a person's job, and it is the one I do." },
        ],
      },
      {
        id: "search-registration-access",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "Searching Biddingo yourself helps, and it inherits the same category-and-buyer logic that limits the alerts, with the added friction of the platform's opacity." },
          { type: "ul", items: [
            "Category-driven search misses adjacent work the buyer filed one label over, which is common in sector-specific procurement.",
            "Document-level scope is not what the search ranks on, so the real requirement that decides whether you can win lives in attachments the search never opens.",
            "Re-bids of incumbent contracts surface with little warning, and in education and housing those cycles are long enough that missing one means waiting years for the next.",
            "The separate supplier account is a gate: if it is not configured for the right sectors and buyers, your searches and notifications both under-report.",
            "Because the footprint is less transparent than competitors, it is hard to verify from the outside whether you are seeing everything a sector is buying.",
          ] },
          { type: "p", text: "The throughline is familiar. Search rewards you for already knowing how the buyer thinks and filed, and the decisive detail lives in documents no search engine reads. On Biddingo the sector language and the less-transparent footprint sharpen both problems, because you are guessing at vocabulary you do not use, on a platform that does not fully show you the shape of what it carries." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on Biddingo",
        blocks: [
          { type: "p", text: "The misses on Biddingo follow a tight, recognizable pattern shaped by its sectors and its opacity." },
          { type: "ol", items: [
            "A solicitation is tagged under a category your registration does not cover, so the notification never fires. A school-board cleaning contract filed as building services rather than janitorial is the classic example.",
            "The work is described in education or housing language your trade keywords never catch, so it stays invisible even though it is squarely your scope.",
            "Your supplier account is not configured for the right sectors or buyers, so the platform under-reports the market to you.",
            "A long incumbent contract comes up for re-bid with little warning, and because you were not watching the cycle, you learn about it too late to prepare.",
            "A mandatory meeting, an evaluation weighting or a bonding requirement is buried in the documents and missed until it is too late to act on it.",
          ] },
          { type: "p", text: "Each of these is a coverage-and-reading failure, not a strategy failure. None of them is fixed by checking the portal more often. They are fixed by knowing which buyers actually distribute through Biddingo in your sectors, translating their language into your scope, and reading every solicitation that could plausibly fit." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where Biddingo fits in a fragmented market",
        blocks: [
          { type: "p", text: "Biddingo is best understood as one specialized channel in a Canadian public market that has never been unified. There is no single place where all Canadian public work appears. There are central tender services, there are per-municipality portals, there are regional services, and there are sector-strong distributors like Biddingo. Each holds a slice, and the slices overlap unpredictably." },
          { type: "p", text: "Biddingo's slice is distinctive because it is defined by sector rather than geography or technology: education, housing and municipal work, concentrated in Ontario but reaching beyond it. That makes it indispensable if you serve those sectors and easy to overlook if you do not realize how much of that work flows through it. Its less-transparent footprint means even contractors who use it cannot always tell how complete their coverage is, which is a different problem from the per-portal fragmentation you see on the SaaS platforms but lands in the same place: blind spots you cannot see from the inside." },
          { type: "p", text: "So Biddingo is never a complete answer on its own. A contractor serving school boards and housing providers will be watching Biddingo alongside central tender services, alongside municipal portals, alongside other distributors. The fragmentation is the market's defining feature, and coverage across all of it is a discipline, not a subscription. The firms that win consistently in these sectors are the ones who treat it that way." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement Biddingo",
        blocks: [
          { type: "p", text: "I do not replace Biddingo, and I would be wary of anyone who claimed to. Biddingo stays your account of record and the place you find and respond to the work that distributes through it. I sit on top of it and do the part it was never built to do for you." },
          { type: "ul", items: [
            "I watch the education, housing and municipal buyers that post on Biddingo in your area, so coverage does not depend on you tracking a less-transparent footprint by yourself.",
            "I read the documents and translate sector language into plain fit, so a school-board or housing renewal described in capital-program terms still reaches you as the trade work it actually is.",
            "I flag re-bid cycles before they close, so the long incumbent contracts in these sectors become opportunities you prepare for rather than learn about too late.",
            "I qualify fit against your trades, capacity and geography, and flag the mandatory meetings, evaluation weightings and bonding before you commit time.",
            "I write a short, plain-language summary of each opportunity with a direct link back to the source on Biddingo so you act on the system of record.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of guessing whether a quiet inbox means no work or means a buyer is not surfacing to your account, you get a single shortlist of work that actually fits, drawn from across the Biddingo buyers in your sectors, each opportunity already read, qualified and linked. Your estimators price. Your team responds. Nobody spends a morning decoding sector language to figure out whether a notice is even relevant." },
          { type: "callout", text: "If you serve school boards, housing providers or municipalities and you are relying on Biddingo's category alerts alone, you are almost certainly missing fits hidden in sector language. Let me show you, on a call, the Biddingo work in your sectors you are not seeing today." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The janitorial contract filed as building services",
        result: "A recurring school-board cleaning contract caught despite being tagged under the wrong category.",
        body: "A cleaning contractor's Biddingo notifications were built around janitorial language. A multi-year school-board cleaning contract posted under a broad building-services category, and their category selections never surfaced it. Reading the board's postings the way they actually filed them, rather than waiting on category overlap, put it on the contractor's desk with time to prepare. Illustrative example.",
      },
      {
        title: "The housing re-bid that came around once",
        result: "A long incumbent housing-renewal contract caught at the one moment it reopened.",
        body: "A renovation firm serving social housing knew the work existed but had no view of the re-bid cycle. The incumbent's multi-year contract came up for competition with little warning, described in capital-program language their keywords never caught. Watching the housing buyers on Biddingo and reading the documents surfaced it in time to bid the work they had been shut out of for years. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Do I still need my own Biddingo supplier account?", a: "Usually yes, and that is fine. Biddingo requires a separate supplier account, and it stays where you find and respond to the work that distributes through it. I work alongside it: I monitor the buyers in your sectors, read the solicitations, and qualify fit before anything reaches you." },
      { q: "Why can't I just rely on Biddingo's category alerts?", a: "Because the alerts fire on the categories you picked and the way the buyer tagged the work, and in education and housing the same job routinely lands under sector language your registration does not cover. I read the postings and translate that language into your actual scope, so the mis-tagged fits still reach you." },
      { q: "Biddingo's coverage seems hard to gauge. Can you help with that?", a: "Yes, and it is one of the main reasons contractors in these sectors bring me in. Biddingo's footprint is less transparent than some competitors, so it is genuinely hard to know whether you are seeing everything. I actively track which of your buyers distribute through it so a quiet inbox does not hide work you should be bidding." },
      { q: "Do you cover the re-bid cycles on incumbent contracts?", a: "Yes, and in education and housing this matters a great deal because those contracts run for years. I watch the cycles so you are preparing for a re-bid while competitors are still finding out it exists." },
      { q: "Is this Biddingo training or consulting?", a: "No. I am not here to teach you the platform. I monitor it, read the solicitations and qualify them for you as an ongoing service, so your team spends its hours bidding the work that fits rather than decoding sector language." },
      { q: "How fast will I see Biddingo opportunities?", a: "On a discovery call I will already have looked at the Biddingo buyers in your sectors, so you see real examples before you pay anything. After that, qualified opportunities reach you on a steady cadence as they post and close." },
    ],
  },

  "bids-and-tenders": {
    readMins: 17,
    intro:
      "bids&tenders is the eProcurement system quietly running behind a large share of Canadian municipalities, and most contractors interact with it without ever thinking about it as a single platform. That is the heart of the problem: each municipality runs its own instance, so there is no national feed you can watch. The platform advertises access to hundreds of buyer organizations and around a thousand active projects, but that reach is spread across separate municipal front doors, each with its own rules about registration, document fees and addenda. I know exactly where its structure leaks opportunities, and how I turn dozens of municipal portals into one clean shortlist for you.",
    sections: [
      {
        id: "what-is-bids-and-tenders",
        heading: "What bids&tenders is, and what it is not",
        blocks: [
          { type: "p", text: "bids&tenders is an eProcurement system that a large share of Canadian municipalities use to publish solicitations, manage addenda and collect bids. For the municipality it is a clean, auditable way to run a competition end to end. For you, the contractor, it is the portal where you find the notice, download the documents, ask questions, and submit your response. The software works well, and nothing here is a criticism of it." },
          { type: "p", text: "The platform advertises real reach: access to more than 450 buyer organizations and around 1,000 active projects at a given time. That describes the scale of adoption across Canadian local government, and it is genuinely large. What it does not describe is how that reach reaches you, because of the structural fact that defines the platform." },
          { type: "p", text: "Each municipality runs its own instance of bids&tenders. There is no single national feed that shows you everything every municipality on the platform is buying. A city, a town and a region can all run bids&tenders, and each one is a separate front door with its own bidder registration, its own categories, its own document-fee rules and its own notification settings. The platform is widely adopted in the sense that many municipalities use the same software. It does not aggregate their opportunities into one stream you can watch." },
          { type: "callout", text: "bids&tenders is the software behind hundreds of municipalities, not a single national feed. Each municipality runs its own instance, and that per-instance structure decides whether you ever see the work." },
          { type: "p", text: "That structure is why a contractor can be registered on several municipal instances, feel covered, and still miss a steady stream of fits. Coverage on bids&tenders is not a single registration. It is a map of municipal instances you have to build, join and maintain one at a time." },
        ],
      },
      {
        id: "who-uses-bids-and-tenders",
        heading: "Who posts on bids&tenders",
        blocks: [
          { type: "p", text: "The buyers on bids&tenders are overwhelmingly Canadian local government, which is exactly the layer where most everyday construction, sitework and services work is bought." },
          { type: "ul", items: [
            "Municipalities and regions, which post the broad mix of road, sitework, facilities and services contracts that local government buys.",
            "Some school boards and public agencies, which run their procurement through the same software.",
            "Local public buyers across Canada, concentrated where the platform has been most widely adopted.",
          ] },
          { type: "p", text: "The size of the Canadian local layer is what makes the per-instance structure such a coverage problem. There are a great many public buying units in Canada." },
          { type: "stat", id: "canada-public-units" },
          { type: "p", text: "And the local government and school-board layer where bids&tenders concentrates is a large share of that total." },
          { type: "stat", id: "canada-local-units" },
          { type: "p", text: "Not every one of those buyers runs bids&tenders, but a large and growing share of municipalities do, and each runs a separate instance. The practical effect is that the municipalities in your service area that happen to be on bids&tenders are scattered across a list you have to discover and assemble yourself. Miss an instance and you will not know, because nothing tells you a municipality went live on the platform until you have already found them." },
        ],
      },
      {
        id: "how-bids-and-tenders-categorizes",
        heading: "How bids&tenders categorizes and notifies",
        blocks: [
          { type: "p", text: "Each municipal instance of bids&tenders has its own categories and its own bidder registration, and notifications come from that municipality only. When you register as a bidder with a given municipality, you select the categories that describe your work, and that instance notifies you when a matching solicitation posts. On a single instance that is straightforward." },
          { type: "p", text: "Across the platform it is anything but. There is no central registration that covers every municipality at once. You register, instance by instance, with each municipality whose work you want to see, and you keep each of those profiles current. The platform is explicit that the vendor is solely responsible for keeping account information up to date, and that responsibility has teeth: an out-of-date profile can miss addenda, and a missed addendum can change scope or move a closing date without you ever knowing." },
          { type: "callout", text: "On bids&tenders the vendor is solely responsible for keeping account information current. An out-of-date profile can miss addenda, and a missed addendum can quietly change the scope or the deadline you are bidding to." },
          { type: "p", text: "Notification frequency itself varies by municipality, daily for some and weekly for others, so the cadence at which you even hear about new work depends on each buyer's settings rather than your preference. And the category wording varies instance to instance, so the selections that surfaced work on one municipality's portal may not surface the equivalent work on another's. Every weakness of category-driven notification repeats once per municipal instance." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of bids&tenders alerts",
        blocks: [
          { type: "p", text: "bids&tenders notifications are useful and, like every automated alert, limited in ways that bite a working contractor." },
          { type: "ul", items: [
            "You only get notices from the municipalities you registered with one by one, so undiscovered or unjoined instances stay completely silent.",
            "There is no central feed across all bids&tenders municipalities, which means even good notifications only cover the instances you have set up.",
            "Notification frequency is daily for some agencies and weekly for others, so on a weekly cadence you can lose days against a short response window.",
            "Category wording varies by municipality, so a loosely tagged solicitation slips past the same way it would on any category-driven system.",
            "An out-of-date profile can miss addenda, and an alert about the original notice does not guarantee you hear about the change that follows.",
          ] },
          { type: "p", text: "The speed problem is sharp here, because municipal response windows are not generous and a serious response is real work. A weekly notification on a short-fuse bid can cost you the opportunity before you have read the first page." },
          { type: "stat", id: "response-hours" },
          { type: "p", text: "A notification is a tripwire. It cannot read the document set, weigh the evaluation criteria, track the addenda, or tell you whether a bid is worth an estimator's afternoon. That judgment is a separate job, and it is the one I do." },
        ],
      },
      {
        id: "search-registration-access",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "Accessing and searching bids&tenders yourself is where the per-instance structure and its access rules really bite, and the friction is more than just inconvenience." },
          { type: "ul", items: [
            "There is no unified cross-municipality search, so you cannot run one query and see everything the municipalities in your area are buying. You work instance by instance.",
            "Login is required even to preview public documents, so you cannot quietly scan what a municipality is buying without first registering with that instance.",
            "Some agencies require registration before you can even submit questions, so engaging with a solicitation at all gates on setting up an account first.",
            "Some agencies charge document fees, so getting at the full scope can carry a cost as well as a registration step.",
            "The real scope lives in each instance's document set, and new municipalities adopt the platform constantly, so coverage decays unless you are actively watching for new instances.",
          ] },
          { type: "p", text: "The throughline is the one that runs across every fragmented platform, sharpened by the access rules. The system surfaces work the way each municipality set up its instance, not the way you would look for it; the decisive detail lives in documents you must log in, and sometimes pay, to read; and the whole thing repeats once per municipal instance. That is a lot of friction to absorb if your job is supposed to be building, not registering." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on bids&tenders",
        blocks: [
          { type: "p", text: "Stack the structure, the access rules and the category matching together and the misses on bids&tenders follow a tight, recognizable pattern." },
          { type: "ol", items: [
            "A municipality in your service area runs a bids&tenders instance you never found, so you are not registered and nothing ever notifies you. A road or sitework package on a town's portal outside your usual list is the classic example.",
            "Login is required even to preview documents, so a municipality you have not joined is effectively invisible until you set up an account.",
            "Your profile on an instance is out of date, so you miss an addendum that changed the scope or moved the closing date.",
            "A notification arrives on a weekly cadence against a short response window, and you lose days you needed.",
            "A document fee or a registration-before-questions rule slows you down just enough that you skip a solicitation you could have won.",
            "A mandatory meeting, an evaluation weighting or a bonding requirement is buried in the documents and missed until it is too late to act.",
          ] },
          { type: "p", text: "Every one of these is a coverage, access and reading failure, not a strategy failure. None of them is fixed by logging in more often to the instances you already joined. They are fixed by maintaining a real map of the bids&tenders municipalities in your area, keeping each profile current, and reading every solicitation and addendum that could plausibly fit." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where bids&tenders fits in a fragmented market",
        blocks: [
          { type: "p", text: "bids&tenders is best understood as the dominant municipal layer in a Canadian public market that was never unified. There is no single place where all Canadian public work appears. There are central tender services, there are sector distributors, there are other SaaS portals, and there is the large municipal layer that bids&tenders powers across hundreds of separate instances. Each holds a slice." },
          { type: "p", text: "Because bids&tenders is per-municipality, it actually adds to the fragmentation rather than reducing it, even as it standardizes the software. Every municipality that adopts it becomes one more separate front door you have to find, register with, keep current, and watch, sometimes paying a document fee or logging in just to read. The 450-plus buyer organizations and roughly 1,000 active projects the platform advertises are real, but that reach is not coverage from where any one contractor sits." },
          { type: "p", text: "So bids&tenders is never a complete answer on its own. A contractor serving municipalities will be watching bids&tenders alongside central tender services, alongside sector distributors, alongside other municipal portals. The fragmentation is the market's defining feature, and coverage across all of it is a discipline rather than a login. The firms that win municipal work consistently are the ones who treat it that way instead of hoping one platform covers them." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement bids&tenders",
        blocks: [
          { type: "p", text: "I do not replace bids&tenders, and I would not want to. bids&tenders stays the place you find documents, ask questions and submit on the municipalities that use it. I sit on top of the fragmentation and the access friction and do the part the platform was never built to do for you." },
          { type: "ul", items: [
            "I keep the list of bids&tenders municipalities in your footprint current and register as needed, so coverage does not depend on you finding every new instance or logging in to preview each one.",
            "I read each solicitation and its addenda as they post, so an out-of-date profile or a missed amendment never quietly changes the scope or deadline you are bidding to.",
            "I handle the access friction, the login-to-preview, the registration-before-questions, the document fees, so the cost of looking does not become a reason you skip work.",
            "I qualify fit against your trades, capacity and geography, and flag the mandatory meetings, evaluation weightings and bonding before you commit an estimator's time.",
            "I write a short, plain-language summary of each opportunity with a direct link back to the source instance so you act on the system of record.",
          ] },
          { type: "p", text: "The result is the whole point of this service. Instead of dozens of municipal instances to find, join, pay into and keep current, you get a single shortlist of work that actually fits, drawn from across every bids&tenders municipality in your footprint, each opportunity already read, qualified, addenda-tracked and linked. Your estimators price. Your team responds. Nobody spends a morning registering with portals just to find out whether there is anything worth bidding." },
          { type: "callout", text: "If you are registered on a handful of bids&tenders municipalities and assuming that is your coverage, the per-instance structure almost guarantees blind spots you cannot see. Let me show you, on a call, the municipal work in your footprint you are missing today." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The town nobody had registered with",
        result: "A recurring sitework package from a municipal instance the contractor never knew was live.",
        body: "A civil contractor was registered on four bids&tenders municipalities and assumed that covered their region. A nearby town, well within their service area, ran its own bids&tenders instance they had never found, and because login is required even to preview documents, the work was effectively invisible to them. Mapping and joining the municipal instances in their footprint put that town's recurring sitework on their desk with time to bid. Illustrative example.",
      },
      {
        title: "The addendum that moved the deadline",
        result: "A scope-changing addendum caught before it cost the contractor the bid.",
        body: "A facilities contractor had an out-of-date profile on a municipal instance and was relying on the original notice. An addendum changed the scope and moved the closing date, and the platform puts responsibility for current account information on the vendor, so no fresh tap on the shoulder arrived. Reading the addenda as they posted, rather than trusting the first notice, kept the bid alive and correct. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Do I still need my own bids&tenders registrations?", a: "Yes, and they stay useful. bids&tenders remains where you find documents, ask questions and submit on the municipalities that use it. I work on top of it: I map the instances in your footprint, keep coverage current, read the solicitations and addenda, and qualify fit before anything reaches you." },
      { q: "Why can't I just register with bids&tenders once and be covered?", a: "Because there is no single national feed. Each municipality runs its own instance with its own registration, categories and notification cadence, and login is required even to preview documents. Coverage means joining and watching every relevant instance, which is exactly the work I take off your plate." },
      { q: "How do you handle addenda and out-of-date profiles?", a: "The platform makes the vendor solely responsible for keeping account information current, and an out-of-date profile can miss addenda that change scope or deadlines. I read each solicitation and its addenda as they post, so a quiet amendment never changes the bid under you without your knowing." },
      { q: "What about document fees and registration-before-questions rules?", a: "Some municipalities charge document fees, and some require registration before you can even submit questions. I handle that access friction as part of the service, so the cost or hassle of looking never becomes the reason you skip a solicitation you could have won." },
      { q: "Is this bids&tenders training or setup?", a: "No. I am not here to teach you the platform. I monitor the relevant instances, read the solicitations and addenda, and qualify them for you as an ongoing service, so your team spends its hours bidding rather than registering with portals." },
      { q: "How fast will I see bids&tenders opportunities?", a: "On a discovery call I will already have looked at the bids&tenders municipalities in your footprint, so you see real examples before you pay anything. After that, qualified opportunities reach you on a steady cadence as they post and close, with addenda tracked." },
    ],
  },
};
