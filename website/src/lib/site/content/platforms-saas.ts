import type { LongForm } from "./types";

/**
 * Hand-authored, deep authority bodies for the SaaS procurement platforms that
 * power U.S. local government: PlanetBids, OpenGov, DemandStar and Ion Wave.
 * First-person Phil Dave voice, no em or en dashes, written to be the most
 * useful page on the internet about using each platform as a contractor.
 */
export const SAAS_PLATFORM_CONTENT: Record<string, LongForm> = {
  planetbids: {
    readMins: 18,
    intro:
      "If you chase public work in California, you already know PlanetBids, even if you have never thought hard about it. It is the vendor portal sitting behind a huge share of the state's cities, counties and special districts, plus a long list of municipalities elsewhere. Here is the catch almost nobody names out loud: every agency runs its own PlanetBids portal. There is no single feed, no master switch, no one login that covers the market. I know how that fragmentation actually plays out, where its per-agency alerts go quiet, and how good bids slip past firms who think one or two registrations have them covered. This is the full picture, and how I close that gap.",
    sections: [
      {
        id: "what-is-planetbids",
        heading: "What PlanetBids is, and what it is not",
        blocks: [
          { type: "p", text: "PlanetBids is a vendor and bid-management portal that public agencies use to publish solicitations, distribute documents, track vendor certifications and accept electronic bids. It is best known as the system of record behind a large share of California public agencies, and it shows up well beyond California too, in municipalities across the country that adopted it for the same reasons: it is built for the way government buys, it handles the paperwork, and it keeps a clean audit trail." },
          { type: "p", text: "Now the part that matters most and that the marketing never leads with. PlanetBids is not one platform you log into once. Each agency runs its own PlanetBids vendor portal. A city has one. The county next to it has another. The water district, the school district, the transit authority, each has its own. They share the same underlying software, the same look and feel, but they are separate front doors with separate vendor lists and separate notification settings. There is no single PlanetBids feed that shows you everything posted across every agency." },
          { type: "callout", text: "PlanetBids is excellent at being an agency's system of record. What it is not is a market. It will never hand you one list of every opportunity across every agency, because no such list exists. That stitching-together is a separate job, and it is the job I do." },
          { type: "p", text: "I want to be precise about that distinction, because it shapes everything below. None of this is a knock on PlanetBids. A per-agency portal is exactly what an individual buyer needs to run a clean, defensible procurement. The limitation only appears when you step back and look at the market as a contractor does, across dozens of agencies at once. At that altitude, the per-agency design becomes a coverage problem, and coverage is something a person has to solve, agency by agency." },
          { type: "p", text: "Think about what PlanetBids was actually built to optimize for. A procurement officer at a single agency wants a tool that publishes a notice cleanly, controls who can download which documents, timestamps every bid, manages addenda so the record is defensible, and confirms that vendors held the right certifications when they submitted. PlanetBids does all of that well, which is exactly why so many agencies chose it. Every one of those design goals serves the buyer running one procurement. None of them serves the contractor trying to watch forty agencies at once, because that contractor was never the customer. That is not a criticism. It is just whose problem the software was built to solve, and it explains precisely why the gaps you feel are structural rather than accidental." },
        ],
      },
      {
        id: "who-uses-planetbids",
        heading: "Who posts on PlanetBids",
        blocks: [
          { type: "p", text: "The buyers you care about on PlanetBids cluster into a few familiar types, and the density of them in California is the whole story." },
          { type: "ul", items: [
            "California cities, from the largest metros down to small towns, each running their own portal for public works, facilities and services.",
            "Counties, which post high volume across construction, maintenance, professional services and supply.",
            "Special districts and authorities: water, sanitation, transit, parks, flood control and more, each a separate buyer with its own portal and its own cycle.",
            "School and community college districts, which run on their own calendars and use their own language.",
            "Municipalities outside California that adopted PlanetBids and behave the same way: one portal each, no shared feed.",
          ] },
          { type: "p", text: "Step back and look at the scale of that buyer universe and the coverage problem comes into focus immediately. The United States is not a tidy market with a handful of buyers." },
          { type: "stat", id: "us-local-govs" },
          { type: "p", text: "California alone holds a remarkable density of them, and a large share use PlanetBids. Add the special districts and the number of separate front doors gets larger still." },
          { type: "stat", id: "us-special-districts" },
          { type: "h3", text: "Why the density trips up good contractors" },
          { type: "p", text: "The mistake I see constantly is a contractor registering with the two or three agencies they already work with and assuming that covers their market. It does not come close. In a single California metro a working contractor's real service area can span a city, two neighbouring cities, a county, a water district and a school district, and that is five separate PlanetBids portals, each with its own registration and its own notification settings. Miss one and you have a blind spot you do not even know is there, because nothing tells you about a portal you never registered on." },
          { type: "p", text: "There is a quieter version of the same mistake that costs even more. A contractor expands into a new county or a new line of work, wins a job or two, and assumes the agencies they have already touched represent the whole opportunity in that area. But the agencies you have done business with are almost never the full set of agencies that buy your kind of work. The transit authority, the flood-control district, the community college and the joint-powers authority next door may all run their own PlanetBids portals and post exactly the work you just won elsewhere, and you would never hear a word about it. The density that makes California such a rich market is the same density that makes the blind spots so easy to acquire and so hard to notice." },
        ],
      },
      {
        id: "how-planetbids-categorizes",
        heading: "How PlanetBids categorizes and notifies",
        blocks: [
          { type: "p", text: "Within any single agency portal, PlanetBids works the way you would expect. You register as a vendor, you select category codes that describe what you do, you keep your certifications and documents current, and the agency notifies registered vendors when it posts a solicitation tagged with categories that overlap yours. Inside one portal that loop is clean and reliable." },
          { type: "p", text: "The fragility is not inside any one portal. It is that the loop only runs for portals you have actually found and joined. The notification you get from the City of Anytown tells you nothing about what the county next door posted this morning, because that is a different portal with a different vendor list. Your coverage is the sum of your individual registrations, and nothing more. There is no overlay that catches what your registrations miss." },
          { type: "p", text: "There is also a workflow wrinkle specific to PlanetBids that catches people out. Not every opportunity is actually accepted on PlanetBids. Some agencies use their portal to advertise a notice but then direct vendors back to the agency's own website to obtain documents or submit, an off-platform workflow. If you assume the PlanetBids listing is the whole story, you can read a notice, see no bid mechanism you recognize, and move on, when the real action and the documents are sitting on the agency's own site. That split between platform and agency site is a quiet source of missed bids." },
          { type: "callout", text: "The single most underrated fact about PlanetBids: your coverage equals the portals you personally registered on, and some opportunities route off the platform entirely. The work you never see is not hidden. It is sitting on a portal or a website you have not found yet." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of PlanetBids alerts",
        blocks: [
          { type: "p", text: "PlanetBids notifications are genuinely useful inside the agencies you have joined. They are also limited in ways that matter to a working contractor, and the limits compound across a fragmented market." },
          { type: "ul", items: [
            "You only hear from the agencies whose portals you found and registered on. There is no single PlanetBids feed, so a perfect fit posted by an agency you never joined is simply invisible to you.",
            "Category codes vary agency to agency, so a solicitation tagged loosely or under a neighbouring code on a portal you do belong to can still slip past your notification settings.",
            "Some opportunities are advertised on PlanetBids but routed back to the agency's own site for documents and submission, and an alert that points you off-platform is easy to misread or abandon.",
            "A notification tells you a solicitation posted. It does not tell you whether the prevailing-wage determination fits your crew, whether the bonding is something you can post, whether there is a mandatory pre-bid walk next Tuesday, or whether the scope quietly favours an incumbent.",
          ] },
          { type: "p", text: "None of that is a flaw in the feature. A per-agency alert is a tripwire for that one agency, and a tripwire cannot tell you about the agency down the road, read the documents, or weigh a pre-bid walk against your crew's calendar. Public bids close on hard deadlines, and the clock is unforgiving." },
          { type: "stat", id: "response-hours" },
          { type: "p", text: "When a real fit posts on an agency you never joined, you do not even get the chance to spend those hours. You find out after the award, if you find out at all." },
        ],
      },
      {
        id: "search-registration-friction",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "When alerts come up short, contractors fall back on searching and on widening their registrations. Both run straight into the per-agency design, and the friction is real." },
          { type: "ul", items: [
            "There is no unified cross-agency search. To search PlanetBids the way you would search a single national site, you would have to visit each agency's portal in turn, which nobody actually does at scale.",
            "Each agency hides the decisive scope inside its own document set. The listing text under-reports the work, and the specifications, plan sets and addenda that decide whether you can win live in attachments the listing never summarizes.",
            "Registration is a per-agency chore. Every new portal means another vendor profile, another set of category selections, another round of keeping certifications and insurance current.",
            "California's sheer density means there are always more agencies you have not found yet, and new buyers adopt the platform on their own timeline without announcing it to you.",
          ] },
          { type: "p", text: "Put plainly, PlanetBids rewards you for already knowing every agency in your service area and for keeping a registration current on each one. That is a real, ongoing discipline, and it does not scale by logging in more often. It scales by having someone whose whole job is to maintain the map of agencies, keep the registrations alive, and read what posts." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on PlanetBids",
        blocks: [
          { type: "p", text: "Stack the fragmentation, the alert limits and the off-platform workflow together and a clear, repeatable pattern emerges. Contractors miss winnable PlanetBids work for a small number of reasons, over and over." },
          { type: "ol", items: [
            "The opportunity posts on an agency portal they never registered on, so no notification ever fires. A paving project on a neighbouring city's portal they had not found is the classic example.",
            "The agency tagged the solicitation under a category that does not overlap the codes the contractor selected, so even on a portal they belong to, the alert stays silent.",
            "The notice routes off-platform to the agency's own website for documents and submission, and the contractor reads the PlanetBids listing, sees no familiar bid mechanism, and moves on.",
            "The notice does arrive, but the contractor judges fit from the title alone and never opens the documents where the prevailing-wage determination, bonding and pre-bid walk live.",
            "An addendum changes scope or moves the closing date after the first look, and on a portal they only check occasionally, nobody circles back.",
          ] },
          { type: "p", text: "Every one of these is preventable. Not one of them is prevented by logging in more often or registering with one more agency at random. They are prevented by someone maintaining the full map of agencies in your footprint, watching each portal, and reading carefully before anything reaches your estimators." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where PlanetBids fits in the fragmented U.S. local market",
        blocks: [
          { type: "p", text: "It helps to zoom all the way out. The U.S. local government market is not one buyer or one platform. It is tens of thousands of independent buyers, each free to choose its own procurement tool, and PlanetBids is one of several major systems competing for them, strong in California and present elsewhere." },
          { type: "stat", id: "us-local-govs" },
          { type: "p", text: "Against that backdrop, PlanetBids is a large and important slice, but it is still a slice. The same metro can run some agencies on PlanetBids, others on a competing SaaS portal, and still others on a regional notification network entirely. A contractor who watches only PlanetBids is watching only the agencies that happen to use it, and even within PlanetBids, only the portals they personally registered on." },
          { type: "p", text: "That is the real shape of the problem. Fragmentation is not a single platform's failing. It is the structure of the market itself, where every buyer is sovereign over how it advertises. PlanetBids solves it for one agency at a time. Nobody inside the platform solves it across agencies, because that is not what the platform is for. Solving it across agencies, and across platforms, is exactly the gap I exist to fill." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement PlanetBids",
        blocks: [
          { type: "p", text: "I do not replace PlanetBids, and I would be suspicious of anyone who claimed to. Each agency's PlanetBids portal stays your system of record and, where the workflow runs on-platform, the place you ultimately submit. I sit on top of the whole fragmented landscape and do the part no single portal was built to do." },
          { type: "ul", items: [
            "I maintain the list of PlanetBids agencies active in your footprint, across cities, counties, districts and authorities, and I keep your registrations current so coverage does not depend on you having found every portal.",
            "I watch each agency the way buyers actually tag and title work, not just the way you would search, so loosely coded and oddly titled fits still reach you.",
            "I catch the off-platform notices that route back to an agency's own site, so a split workflow never becomes a missed bid.",
            "I open the documents and read the scope, the prevailing-wage determination, the bonding, the mandatory walks, the evaluation criteria and the addenda as they post.",
            "I qualify fit against your trades, capacity and geography, then send a short, plain-language summary with a direct link back to the source, so you act on the system of record.",
          ] },
          { type: "p", text: "The result is simple and it is the whole point. Instead of a dozen portals to check and a dozen logins to maintain, you get one short list of opportunities that actually fit, each one already found, read, qualified and linked. Your estimators price. Your team submits. Nobody spends a morning hunting across agency portals, because that hunt is finished before anything reaches them." },
          { type: "callout", text: "If you are registered with two or three PlanetBids agencies and assume that covers California, let me show you, on a call, the agencies in your own service area you are not even seeing yet." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The portal across the city line",
        result: "A paving package found on a neighbouring city's PlanetBids portal the contractor had never joined.",
        body: "A paving contractor was registered with the two cities they regularly worked and assumed that was their market. The project that fit them best posted on an adjacent city's PlanetBids portal they had never found, so no notification fired. Mapping every PlanetBids agency in their real service area surfaced it, and a steady stream behind it, with time to prepare. Illustrative example.",
      },
      {
        title: "The notice that pointed off-platform",
        result: "A facilities bid caught despite routing back to the agency's own website.",
        body: "A special district advertised a solicitation on its PlanetBids portal but directed vendors to the agency's own site for documents and submission. The contractor had skimmed the listing, seen no familiar bid mechanism, and moved on. Reading the notice the way the agency actually ran it put the real opportunity and its documents back on their desk in time. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Is there one PlanetBids login that shows me everything?", a: "No, and that is the heart of the problem. Each agency runs its own PlanetBids portal with its own vendor list and notifications. Your coverage equals the portals you personally registered on. I maintain the full map of agencies in your footprint so coverage does not depend on you having found every one." },
      { q: "Do I still need my own PlanetBids registrations?", a: "Usually yes, and that is fine. The agency portals stay your systems of record and, where the workflow runs on-platform, where you submit. I work alongside them: I keep your registrations current, monitor each portal, read the documents and qualify fit before anything reaches you." },
      { q: "Why do I sometimes see a notice but no way to bid on it?", a: "Some agencies advertise on PlanetBids but route vendors back to their own website for documents and submission, an off-platform workflow. I catch those split notices so a confusing listing never turns into a missed bid." },
      { q: "Can you really catch what my PlanetBids alerts miss?", a: "That is the entire point. Per-agency alerts only fire for agencies you joined and codes you selected. I watch the full set of agencies in your area the way buyers actually tag work, read the documents, and judge fit, so the bids that slip past a per-portal net are exactly the ones I am looking for." },
      { q: "Is this PlanetBids training or consulting?", a: "No. I am not here to teach you the platform. I do the monitoring, reading and qualifying for you as an ongoing service, so your team spends its hours bidding rather than hunting across agency portals." },
      { q: "How quickly will I see PlanetBids opportunities?", a: "On a discovery call I will already have looked at the PlanetBids agencies in your service area, so you see real examples before you pay anything. Once we start, qualified opportunities reach you on a steady cadence as they post and close." },
    ],
  },

  opengov: {
    readMins: 17,
    intro:
      "OpenGov Procurement, the suite many people still call ProcureNow, is one of the more modern faces of public buying, and a growing number of U.S. local governments now run their solicitations on it. Vendor access is free, the workflows walk you step by step, and the platform even error-checks your submission, which makes it a pleasure to bid through once you are in front of the right notice. The trouble is everything that happens before that. OpenGov is one vendor's slice of a market with tens of thousands of buyers, and every government runs its own portal. I know where its per-government notifications go quiet and how good bids slip past firms watching only one corner. This is the full picture.",
    sections: [
      {
        id: "what-is-opengov",
        heading: "What OpenGov Procurement is, and what it is not",
        blocks: [
          { type: "p", text: "OpenGov Procurement, formerly ProcureNow and now part of the broader OpenGov platform, is a modern cloud procurement suite that local governments use to build, publish and evaluate solicitations. For vendors it is one of the friendlier systems out there. Access is free, registration is straightforward, the response workflow guides you step by step through each required section, and built-in error checking catches the small omissions that get bids thrown out elsewhere. If more buyers ran on tools this clean, public bidding would be far less painful." },
          { type: "p", text: "Here is the context that the friendly interface can hide. OpenGov as a company serves a large footprint of communities, well over two thousand, across its products. Not all of those communities use the procurement module, and even those that do each run their own OpenGov procurement portal. The pleasant vendor experience is real, but it lives inside one government's instance at a time. There is no single OpenGov feed that shows you every solicitation posted by every government on the platform." },
          { type: "callout", text: "OpenGov makes responding to a solicitation genuinely easy once you are in front of it. What it does not do is get you in front of every solicitation that fits you, across every government on the platform. Finding and qualifying those is a separate job, and it is the job I do." },
          { type: "p", text: "I am precise about this because the quality of the tool can lull a contractor into thinking the hard part is solved. The hard part of public bidding was never filling in the form. It was knowing which form to fill in, on which government's portal, before the clock ran out. A great submission workflow does nothing for the bid you never knew was open." },
          { type: "p", text: "It is worth understanding why OpenGov is so pleasant to bid through, because the reason it is good for buyers is the same reason it does not solve your discovery problem. OpenGov sells governments on transparency, on cleaner evaluations, and on a vendor experience that reduces incomplete and disqualified bids, which makes their procurements smoother and more defensible. All of that is aimed at the government running the solicitation and the vendors already in front of it. None of it is aimed at the contractor across town trying to find out a solicitation exists in the first place. The friendliness is real, and it is downstream of finding the work, never a substitute for it." },
        ],
      },
      {
        id: "who-uses-opengov",
        heading: "Who posts on OpenGov Procurement",
        blocks: [
          { type: "p", text: "The buyers you care about on OpenGov are squarely in the local-government world, and they skew toward the agencies actively modernizing how they buy." },
          { type: "ul", items: [
            "Cities and counties moving off paper and legacy systems onto a modern procurement suite.",
            "Special districts: water, sanitation, parks, transit and the like, each its own buyer with its own portal.",
            "Local agencies and authorities that adopted OpenGov for its workflow and transparency features.",
            "A steadily growing roster of new adopters, because OpenGov is winning local-government customers at a fast clip.",
          ] },
          { type: "p", text: "That growth is the double edge. A growing footprint means more of your buyers may be on OpenGov this year than were last year, which is good. It also means the map keeps shifting under you, and a government that posted on a different system last cycle may quietly move to OpenGov this one without telling its vendors. To put the footprint in perspective, OpenGov's local-government presence, large as it is, sits inside a market of staggering size." },
          { type: "stat", id: "us-local-govs" },
          { type: "p", text: "Against that backdrop, even two thousand communities is a slice, not the market. And those numbers grow further once you count the special districts that run their own procurements." },
          { type: "stat", id: "us-special-districts" },
        ],
      },
      {
        id: "how-opengov-categorizes",
        heading: "How OpenGov categorizes and notifies",
        blocks: [
          { type: "p", text: "Within a single government's OpenGov portal, the experience is clean. You create a free vendor account, you indicate the categories of work you are interested in, and the government notifies registered vendors when it posts a matching solicitation. The guided workflow then carries you through the response. Inside one portal, that loop works well, and the error checking genuinely helps you submit a complete bid." },
          { type: "p", text: "The fragility, exactly as with every per-government platform, is that the loop only runs for the portals you have actually found and joined. A notification from one city tells you nothing about what the county or the water district posted, because each is a separate OpenGov instance with its own vendor list. Your coverage is the sum of the individual portals you registered on, and there is no platform-wide overlay that catches what your registrations miss." },
          { type: "p", text: "Category matching inside a portal is only as good as the alignment between the categories a buyer chose and the categories you selected. A solicitation tagged loosely, or filed under a neighbouring category, can still slip past your notification settings even on a portal you belong to. And the decisive detail, as always, lives in the document set the notification does not summarize." },
          { type: "p", text: "The growth of the platform interacts with all of this in a way that is easy to underestimate. Because OpenGov is winning new local-government customers steadily, the set of portals you would need to watch is not a fixed list you can build once and forget. A government that posted on a legacy system or a competing portal last cycle may run on OpenGov this cycle, and the only signal you get is the work itself going quiet on the old system, which feels like a slow stretch rather than a platform move. By the time you realize a buyer switched, you may have missed a full cycle of their solicitations. The convenience of free access does nothing to alert you that a buyer you care about has moved." },
          { type: "callout", text: "The most underrated fact about OpenGov: a free account and a great submission workflow do not give you coverage. Your coverage equals the individual government portals you found and joined, and the platform's footprint keeps growing under you." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of OpenGov alerts",
        blocks: [
          { type: "p", text: "OpenGov notifications are useful inside the governments you have joined, and limited in ways that matter once you look at your whole market." },
          { type: "ul", items: [
            "You only hear from the governments whose portals you found and registered on. A perfect fit posted by a government you never joined is invisible to you, free account or not.",
            "There is no single OpenGov feed across all governments, so coverage depends entirely on you knowing every buyer in your area that runs on the platform.",
            "Category matching within a portal can still miss a loosely tagged or neighbouring-category solicitation.",
            "Adoption is growing fast, so the set of governments you would need to watch keeps changing, and a new adopter does not announce itself to vendors who were not already registered.",
            "A notification tells you a solicitation posted. It does not tell you whether the scope fits, whether the insurance and bonding work for you, or whether a mandatory pre-proposal meeting is on the calendar.",
          ] },
          { type: "p", text: "None of that is a flaw in OpenGov. A per-government alert is a tripwire for that one government, and a tripwire cannot tell you about the agency down the road or read the documents. Public solicitations close on firm deadlines, and missing the notice means missing the window entirely." },
        ],
      },
      {
        id: "search-registration-friction",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "When notifications come up short, contractors fall back on searching and on registering more widely. The friendly interface does not change the structural friction here." },
          { type: "ul", items: [
            "There is no unified cross-government search. To search OpenGov the way you would search a single national site, you would have to visit each government's portal in turn.",
            "Each government's portal hides the decisive scope inside its own document set, so the listing under-reports the real work that lives in the attachments.",
            "Registration is free, which is a genuine plus, but it is still a per-government step, and the burden is in knowing which governments to register with, not the cost of doing so.",
            "New buyers adopt OpenGov constantly, and you will not know a government has moved onto the platform unless you are watching for it.",
          ] },
          { type: "p", text: "The throughline is the same one that runs across the fragmented local market. Free, friendly access removes the cost of joining a portal but does nothing to solve the discovery problem of which portals exist and which buyers are on them this year. That is a mapping-and-reading job, and it does not scale by logging in more often." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on OpenGov",
        blocks: [
          { type: "p", text: "The misses on OpenGov follow a tight, recognizable pattern, and the pleasant interface can mask them right up until the award is announced." },
          { type: "ol", items: [
            "The solicitation posts on a government portal the contractor never registered on, so no notification fires. An engineering RFQ on a city's OpenGov portal that just went live is the classic example.",
            "A government recently moved onto OpenGov from another system, and the contractor, who watches the old system, never learns the work shifted platforms.",
            "On a portal they do belong to, the solicitation is tagged under a category that does not overlap their selections, so the alert stays silent.",
            "The notice arrives, but the contractor judges fit from the title and never opens the documents where the scope, insurance and pre-proposal meeting live.",
            "An addendum changes scope or timing after the first look, and on a portal they check only occasionally, nobody circles back.",
          ] },
          { type: "p", text: "Each of these is a discovery-and-reading failure, not a strategy failure. You fix them by knowing every OpenGov government in your footprint, tracking the new adopters as they appear, and reading every solicitation that could plausibly fit, not by checking one portal more often." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where OpenGov fits in the fragmented U.S. local market",
        blocks: [
          { type: "p", text: "Zoom out and the shape of the problem is clear. The U.S. local government market is tens of thousands of independent buyers, each choosing its own procurement tool, and OpenGov is one of several modern platforms competing for them. Its footprint is growing impressively, but it is still one vendor's slice of an enormous field." },
          { type: "stat", id: "us-special-districts" },
          { type: "p", text: "In any given region, some buyers run on OpenGov, others on a competing SaaS portal, others on a regional notification network, and others still on a homegrown system. A contractor who watches only OpenGov sees only the governments that happen to use it, and even then only the portals they personally joined. The friendliness of the platform does not widen that view by a single buyer." },
          { type: "p", text: "That is the real shape of the problem. Fragmentation is the structure of the market, not a failing of any one platform, and a great vendor experience inside one instance does nothing to stitch the instances together. OpenGov solves bidding for one government at a time. Solving discovery across governments, and across the competing platforms they choose, is exactly the gap I exist to fill." },
          { type: "p", text: "There is a strategic reading of OpenGov's growth that I want contractors to internalize, because it cuts against the instinct to wait. As OpenGov wins more local governments, the value of watching it rises, but so does the cost of watching it casually, because the list of relevant portals keeps moving. The firms that benefit most from a modern platform are not the ones who happened to be registered already; they are the ones who notice early when a buyer in their lane moves onto it and get registered before the first solicitation closes. Being early on a buyer's new OpenGov portal is a quiet competitive edge, and it is only available to whoever is actually tracking the moves. Left to a free account and an occasional login, that edge goes to someone else." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement OpenGov",
        blocks: [
          { type: "p", text: "I do not replace OpenGov, and I would not want to. Its guided workflow and error checking make it one of the better places to actually submit a bid, and each government's portal stays your system of record and the place you respond. I sit on top of the fragmented landscape and do the part no single portal was built to do." },
          { type: "ul", items: [
            "I track the OpenGov governments active in your footprint and register your free vendor accounts where needed, so coverage does not depend on you having found every portal.",
            "I watch for new adopters, the governments that just moved onto OpenGov, so a platform switch never becomes a blind spot.",
            "I monitor each portal the way buyers actually tag and title work, so loosely coded fits still reach you.",
            "I open the documents and read the scope, the insurance and bonding, the pre-proposal meetings, the evaluation criteria and the addenda as they post.",
            "I qualify fit against your trades, capacity and geography, then send a short, plain-language summary with a direct link back to the source so you respond on the platform itself.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of trying to track which of your buyers are on OpenGov this year and which moved last month, you get one short list of opportunities that actually fit, each already found, read, qualified and linked. You enjoy the easy submission workflow on work you would never have known was open. Your team spends its hours bidding, not hunting." },
          { type: "p", text: "Worth being clear about what I do and do not do, because contractors sometimes assume a service like mine writes their proposals. I do not. I find the work and I qualify it. I do not write or submit your responses, and I would not want to, because the response is where your firm's expertise has to come through in your own voice. What I hand you is a decision already made about whether an opportunity is worth your team's time, with the documents read and the catches flagged, so the hours your people spend go into a strong submission rather than into deciding whether to open the file at all." },
          { type: "callout", text: "OpenGov makes the bid easy. I make sure you are in front of every OpenGov bid that fits you, across every government in your area, including the ones that just switched. Let me show you the ones you are missing on a call." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The city that just switched platforms",
        result: "An engineering RFQ caught on a city's brand-new OpenGov portal.",
        body: "An engineering firm had watched a city's old procurement system for years. The city moved its solicitations onto OpenGov, and the firm, still watching the old system, never saw the new postings. Tracking the city's move onto OpenGov surfaced an RFQ that fit them squarely, with time to respond through the guided workflow. Illustrative example.",
      },
      {
        title: "The friendly form for a bid they never knew was open",
        result: "A services contract found on an OpenGov government the contractor had never registered with.",
        body: "A services contractor loved bidding through OpenGov's step-by-step workflow on the one government they had joined, and assumed that was the extent of their OpenGov exposure. A neighbouring special district, well within their service area, ran its own OpenGov portal they had never found. Registering a free account there and reading what posted put a qualified contract on their desk. Illustrative example.",
      },
    ],
    faqs: [
      { q: "If OpenGov vendor access is free, why do I need help?", a: "Free access removes the cost of joining a portal, but it does nothing to solve discovery. Each government runs its own OpenGov portal, and your coverage equals the ones you personally found and joined. I maintain the full map of OpenGov governments in your footprint, including new adopters, so you stop missing work on portals you never knew existed." },
      { q: "Is there one OpenGov login that shows me everything?", a: "No. OpenGov serves over two thousand communities across its products, not all use the procurement module, and each that does runs its own portal. There is no single feed. I stitch the relevant portals together into one shortlist for you." },
      { q: "Do I still respond through OpenGov myself?", a: "Yes, and you will be glad to. The guided workflow and error checking make OpenGov one of the better places to actually submit. Each government's portal stays where you respond. I find and qualify the work; you bid it." },
      { q: "How do you handle governments that just moved onto OpenGov?", a: "I watch for new adopters specifically, because a buyer switching platforms is one of the most common ways contractors lose sight of work. When a government in your area moves onto OpenGov, I pick it up and add it to your coverage." },
      { q: "Is this OpenGov training or consulting?", a: "No. The platform is easy enough that you do not need training on it. I do the monitoring, reading and qualifying for you across every relevant government as an ongoing service, so your team spends its time bidding the work that fits." },
      { q: "How quickly will I see OpenGov opportunities?", a: "On a discovery call I will already have looked at the OpenGov governments in your area, so you see real examples before you pay anything. Once we start, qualified opportunities reach you on a steady cadence as they post." },
    ],
  },

  demandstar: {
    readMins: 17,
    intro:
      "DemandStar is the platform that promises to solve fragmentation with a single registration, and it genuinely connects suppliers to thousands of U.S. local-government agencies in one place. That is a real strength, and it is also where the trouble starts. The free tier limits how many agencies and notices you actually receive, the commodity matching only fires when a buyer's codes happen to overlap yours, and the sheer volume across thousands of agencies buries the handful of bids that truly fit. I know exactly where DemandStar's network model goes quiet and how good bids drown in the stream. This is the full picture, and how I turn that stream into a shortlist.",
    sections: [
      {
        id: "what-is-demandstar",
        heading: "What DemandStar is, and what it is not",
        blocks: [
          { type: "p", text: "DemandStar is a bid-notification network. Rather than every agency standing up its own portal, DemandStar connects a large number of U.S. local-government agencies to a shared network, and suppliers register once to receive notices from across that network. For a contractor that is an appealing proposition: instead of hunting down dozens of separate portals, you sign up in one place and let the agencies come to you. Many local agencies post on DemandStar to reach a broad supplier base." },
          { type: "p", text: "Here is what the single-registration pitch quietly leaves out. The network is huge, your free notifications from it are limited, and a stream of notices is not the same thing as a shortlist of winnable work. DemandStar is excellent at one job: pushing a high volume of agency notices toward registered suppliers based on commodity and geography matching. What it does not do, and is not built to do, is decide which of those notices is worth your estimator's afternoon. That judgment is a separate job, and it is the one I do." },
          { type: "callout", text: "DemandStar solves the find-the-portals problem by firehosing notices at you. It does not solve the much harder problem underneath: which of these thousands of notices actually fits, and which are worth pursuing. That is a reading-and-qualifying job, not a notification job." },
          { type: "p", text: "I am precise about this because the convenience of one registration can feel like the whole problem is solved. It is not. A broad notification stream trades the pain of hunting for portals for a different pain: triaging a flood of notices, most of which do not apply to you, while the few that do scroll past in the noise." },
          { type: "p", text: "It helps to see DemandStar's model clearly against the per-agency portals like PlanetBids or Ion Wave. Those make you go find each buyer; DemandStar brings the buyers to you. That is a genuine and useful inversion. But notice what it does and does not change. It reduces the work of discovery, which is real. It does nothing for the work of judgment, which is harder. A platform that brings you a thousand notices has not told you which three matter any more than a platform that made you go find a thousand notices yourself. The convenience is upstream of the actual problem, which is reading and qualifying, and that problem is untouched by how the notices arrive." },
        ],
      },
      {
        id: "who-uses-demandstar",
        heading: "Who posts on DemandStar",
        blocks: [
          { type: "p", text: "The buyers you reach through DemandStar are local government across the country, and the breadth is the selling point." },
          { type: "ul", items: [
            "Cities, counties and municipalities posting public works, facilities, services and supply.",
            "Special districts and authorities of every kind, each on its own cycle and using its own language.",
            "Local agencies nationwide that use DemandStar to broadcast notices beyond their immediate vendor list.",
            "Suppliers and contractors who want broad local coverage without chasing individual portals one by one.",
          ] },
          { type: "p", text: "That breadth is exactly why volume becomes the defining challenge. DemandStar's reach spans a large share of the U.S. local-government universe, and that universe is enormous to begin with." },
          { type: "stat", id: "us-local-govs" },
          { type: "p", text: "When a network pushes notices from a meaningful fraction of that many buyers toward you, the math turns against you fast. The signal you want, the few bids genuinely in your lane, is a tiny fraction of the notices arriving, and the network has no way to know which fraction matters to your shop." },
        ],
      },
      {
        id: "how-demandstar-categorizes",
        heading: "How DemandStar categorizes and notifies",
        blocks: [
          { type: "p", text: "DemandStar runs on commodity codes and geography. When you register, you select the commodity codes that describe what you do and the geographies you serve, and the network notifies you when an agency posts a solicitation tagged with codes that overlap yours within your selected areas. That matching is the engine, and it carries the same fragility every code-driven system does, amplified by the network's scale." },
          { type: "p", text: "The code a buyer tags and the codes you registered under have to line up for the notification to fire. Buyers tag loosely all the time, choosing a broad or neighbouring commodity, or under-tagging a solicitation that spans several trades. If your registration does not happen to overlap their choice, you get nothing, even when the work is squarely in your wheelhouse. Geography settings cut the same way: trim too tightly and you hide work just across a line you would gladly serve." },
          { type: "p", text: "Then there is the tier dimension, which is central to DemandStar specifically. Free access exists, and it is real, but it limits how many agencies and notices you actually receive. The cheapest setup is often the one with the largest blind spots, and contractors routinely discover only after losing a job that the notice never reached them because of where they sat in the network's tiers." },
          { type: "p", text: "What makes the tier limit so insidious is that it is silent. A missing alert and a slow market look identical from your inbox. When an agency you would have bid sits outside the agencies your tier delivers, you do not get a notice that says you are missing something. You simply get nothing, and nothing feels like a quiet week rather than a coverage gap. By the time a competitor mentions a job you never saw, the award is done. Paying up a tier widens the delivery, but it also widens the volume you then have to triage, so you can easily trade a coverage problem for a noise problem and feel no better off." },
          { type: "callout", text: "The most underrated fact about DemandStar: the free tier caps the agencies and notices you actually get, and commodity matching only fires on code overlap. The work you never see is buried by the model, not absent from the network." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of DemandStar alerts",
        blocks: [
          { type: "p", text: "DemandStar notifications are useful, and they are limited in ways that matter to a working contractor, with volume making each limit bite harder." },
          { type: "ul", items: [
            "Free and lower tiers cap the agencies and notices you actually receive, creating blind spots that feel exactly like silence.",
            "Commodity matching misses loosely coded or under-tagged work, so a fit tagged a category over never fires a notice.",
            "Geography settings can hide nearby work just outside your selected areas.",
            "Volume across many agencies buries the handful of bids that genuinely fit beneath everything that does not apply to you.",
            "A notice tells you a solicitation posted. It does not tell you about the prevailing-wage requirement, the bonding, the mandatory pre-bid meeting, or whether the scope quietly favours an incumbent.",
          ] },
          { type: "p", text: "The notification is a starting gun, not a scouting report, and on a high-volume network the starting guns blur together. Reading each solicitation that could plausibly fit, and judging it, is where the real work is, and it takes real time." },
          { type: "stat", id: "response-hours" },
          { type: "p", text: "You cannot afford to spend that kind of time on a bid that was never right for you, and you cannot afford to miss the one that was because it scrolled past in the stream." },
        ],
      },
      {
        id: "search-registration-friction",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "When the notification stream overwhelms or comes up short, contractors fall back on searching and on tuning their registration. Both inherit the network's code-and-tier logic." },
          { type: "ul", items: [
            "Commodity-driven search misses work a buyer tagged under a neighbouring code, which is constant across thousands of agencies.",
            "The real scope sits in documents the keyword search never opens, so even a found notice under-reports the work.",
            "Geography settings that trim the noise also hide opportunities just across a line you would happily serve.",
            "Upgrading tiers widens the notice flow but also widens the noise, so paying more without a way to triage simply means more to wade through.",
          ] },
          { type: "p", text: "The throughline is the one that runs across the whole fragmented market. A broad network surfaces work the way buyers coded it, not the way you would look for it, and the decisive detail lives in documents no search engine reads. The deeper problem here is not coverage, which DemandStar's breadth helps with, but triage. Turning a high-volume stream into a short, qualified list is a reading job, and reading is a person's job." },
          { type: "p", text: "There is also a discipline most contractors never apply to a notification stream: the go or no-go decision. Every notice that arrives deserves a fast, honest judgment about whether it is worth pursuing, and that judgment depends on reading the actual scope, not the subject line. On a high-volume network, the temptation is to skip the judgment entirely and either bid reflexively at whatever is in front of you or ignore the stream until it is too late. Both are expensive. The work of pulling each plausible notice, opening its documents, and deciding go or no-go on real criteria is exactly what gets abandoned when the stream is overwhelming, and it is exactly the work that separates firms that win from firms that merely respond." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on DemandStar",
        blocks: [
          { type: "p", text: "The misses on DemandStar follow a pattern shaped by volume and by tiers, and they are remarkably consistent." },
          { type: "ol", items: [
            "A solicitation is coded under a commodity the contractor did not register for, so no notice fires. A janitorial bid coded outside their DemandStar registration is the classic example.",
            "The contractor's free or lower tier caps the agencies they receive, so the work is on the network but they are not being told.",
            "The notice does arrive, but it lands in a flood of irrelevant matches and gets skimmed past in the morning triage.",
            "The notice's geography sits just outside the contractor's selected areas, so it never surfaces despite being well within their real service range.",
            "A prevailing-wage clause, bonding requirement or mandatory pre-bid meeting hides in the documents and sinks the bid for anyone who did not read carefully.",
          ] },
          { type: "p", text: "Each of these is a triage-and-reading failure layered on a network model, not a strategy failure. You do not fix them by upgrading your tier and drinking from a bigger firehose. You fix them by reading the right notices across the network and judging fit before anything reaches your estimators." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where DemandStar fits in the fragmented U.S. local market",
        blocks: [
          { type: "p", text: "Zoom out and DemandStar occupies an interesting spot. Where most SaaS portals are per-agency, DemandStar is a network that aggregates across agencies, which makes it a partial answer to fragmentation rather than another instance of it. That is genuinely valuable. But it aggregates only the agencies that participate, and only at the level your tier allows, inside a market of overwhelming size." },
          { type: "stat", id: "us-local-govs" },
          { type: "p", text: "So DemandStar covers a broad swath of local agencies, but not all of them, and not every agency that uses it posts everything there. In any region, some buyers are on DemandStar's network, others on a per-agency SaaS portal, others on a regional purchasing group, and others on a homegrown site. A contractor who relies only on DemandStar sees a large slice of the market filtered through commodity codes and tier limits, which is better than one portal but still partial, and still un-triaged." },
          { type: "p", text: "That is the real shape of the problem. DemandStar reduces the coverage half of fragmentation and leaves the triage half wide open, then adds a tier model that quietly trims coverage too. The capacity to read and qualify a high-volume stream is precisely what the network cannot provide, and it is exactly the gap I exist to fill, especially for shops that cannot spare a person to triage notices all day." },
          { type: "stat", id: "estimator-hiring" },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement DemandStar",
        blocks: [
          { type: "p", text: "I do not replace DemandStar. Its breadth is a real asset, and the network stays a useful source. I sit on top of it and do the part a notification firehose was never built to do: turn the stream into a short, qualified list." },
          { type: "ul", items: [
            "I use the network the way buyers actually code work, not just the way you registered, so loosely coded and neighbouring-commodity fits still reach you.",
            "I watch across the geographies you truly serve, not only the ones your settings happen to cover, so nearby work does not slip across a line.",
            "I read past the commodity code into the documents, where the scope, prevailing wage, bonding and pre-bid meetings actually live.",
            "I triage the volume so the handful of real fits no longer scroll past in a flood of notices that do not apply to you.",
            "I qualify fit against your trades, capacity and geography, then send a short, plain-language summary with a direct link back to the source.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of a daily flood of network notices to wade through, or a free tier quietly hiding agencies from you, you get one short list of opportunities that actually fit, each one already read, qualified and linked. Your estimators price. Your team bids. Nobody spends a morning triaging a notification stream, because that triage is finished before anything reaches them. That matters most when you cannot easily hire someone to do the reading." },
          { type: "p", text: "I should be plain about the boundary of my role, because the value of triage is sometimes confused with proposal help. I find and qualify the work; I do not write or submit your bids. The triage I do is the front of the process, the part where a flood of notices becomes a short list of real, read, qualified opportunities. What your team does with that short list, the pricing and the response, stays yours, and it is far better work when it is not competing with the daily chore of wading through a notification stream first." },
          { type: "callout", text: "If DemandStar feels like a firehose you cannot keep up with, or you suspect your tier is hiding agencies, let me show you on a call what a triaged, qualified version of that stream looks like in your own market." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The fit that scrolled past at seven in the morning",
        result: "A qualified facilities bid pulled out of a flood of network notices.",
        body: "A facilities contractor received dozens of DemandStar notices a day and triaged them in a hurried morning scan. The bid that fit them best arrived in the same flood as everything that did not, and got skimmed past. Reading the network the way buyers code work, and triaging it properly, put that bid back on their desk with time to prepare. Illustrative example.",
      },
      {
        title: "The agencies the free tier hid",
        result: "Whole agencies the contractor was never being notified about, surfaced.",
        body: "A contractor on DemandStar's free tier assumed they were seeing the market. Their tier capped the agencies and notices they actually received, so a set of nearby buyers never reached them at all. Working the network without relying on tier-limited notifications surfaced qualified work they had been blind to. Illustrative example.",
      },
    ],
    faqs: [
      { q: "DemandStar already aggregates thousands of agencies. Why do I need help?", a: "Aggregation solves coverage, not triage. A stream of notices from thousands of agencies is not a shortlist, and most of it does not apply to you. I read the right notices across the network, qualify fit, and hand you a short list, so the few real fits no longer scroll past in the flood." },
      { q: "Does the free tier really limit what I see?", a: "Yes. DemandStar's free tier caps how many agencies and notices you actually receive, which creates blind spots that feel like silence. I work the network so coverage does not hinge on where your tier places you." },
      { q: "Will you catch bids my commodity-code notifications miss?", a: "Yes. Code matching is exactly where network alerts fail, because buyers tag loosely and span multiple trades. I read past the code into the documents, so loosely coded fits still reach you." },
      { q: "Do I still keep my DemandStar registration?", a: "It stays useful as one source. DemandStar remains a place you can act and submit. I work on top of it: I triage the volume, read the solicitations, and qualify fit before anything reaches you." },
      { q: "Is this DemandStar training or setup?", a: "No. I am not teaching you the platform. I monitor it, triage the stream, read the solicitations and qualify them for you as an ongoing service, so your team spends its time bidding rather than wading through notices." },
      { q: "How quickly will I see DemandStar opportunities?", a: "On a discovery call I will already have looked at the network in your market, so you see real examples before you pay anything. After that, qualified opportunities reach you on a steady cadence as they post." },
    ],
  },

  ionwave: {
    readMins: 16,
    intro:
      "Ion Wave is one of the quieter names in public procurement, but it powers many state and local buyer portals across the country, and if your buyers run on it, you cannot afford to overlook it. It is now part of the Euna procurement portfolio, so the familiar ionwave.net brand increasingly routes into Euna's wider platform, which adds its own wrinkle to keeping track of where your buyers actually live. Per-portal commodity registration drives every notification, which means coverage depends entirely on finding each buyer and registering correctly. I know where that model goes quiet and how good bids slip past. This is the full picture, and how I close the gap.",
    sections: [
      {
        id: "what-is-ionwave",
        heading: "What Ion Wave is, and what it is not",
        blocks: [
          { type: "p", text: "Ion Wave is procurement software that powers buyer portals for a wide range of state agencies, cities, counties and special districts. Buyers use it to publish solicitations, manage supplier registrations and send notifications. For a contractor, Ion Wave is one of the systems behind the public portals you log into to register as a supplier and receive bid notices, and in many states and localities it is a workhorse you have used without necessarily knowing the platform by name." },
          { type: "p", text: "Two things matter about Ion Wave specifically. First, like the other SaaS portals, each buyer runs its own Ion Wave instance with its own supplier registration and its own notifications. There is no single Ion Wave feed across all buyers. Second, Ion Wave is now part of the Euna procurement portfolio, and the ionwave.net brand routes into Euna's broader platform. That consolidation means the portal you registered on may carry Euna branding, may sit alongside other Euna products, and may shift in ways that are easy to lose track of if you are not watching." },
          { type: "callout", text: "Ion Wave is a fine system of record for each buyer that runs on it. What it is not is a market. There is no one feed across all Ion Wave buyers, and the Euna consolidation makes the landscape shift under you. Stitching it together is a separate job, and it is the job I do." },
          { type: "p", text: "I am precise about this because the brand shift can genuinely confuse coverage. A contractor who registered on an ionwave.net portal a couple of years ago may find the experience now flows through Euna, may wonder whether their old registration still notifies them, and may not realize other buyers in their area run on the same family of tools. None of that is a knock on the software. It is the ordinary friction of a per-portal model going through a brand consolidation." },
          { type: "p", text: "The Euna context matters for a practical reason beyond branding. When a procurement software company acquires others and folds them into a portfolio, the underlying portals do not all migrate at once or behave identically afterward. Some buyers stay on the familiar Ion Wave experience for a while, some move to a consolidated Euna environment, and the supplier-facing pieces, including how you register and how notifications are generated, can shift on a timeline you have no visibility into. For a contractor, the lesson is simple but easy to forget: a registration is not a set-and-forget asset. It is a connection that has to be maintained, and a consolidation is exactly the kind of event that quietly breaks connections you assumed were permanent." },
        ],
      },
      {
        id: "who-uses-ionwave",
        heading: "Who posts on Ion Wave",
        blocks: [
          { type: "p", text: "The buyers you care about on Ion Wave span the levels of government, with a notable presence at the state level alongside local agencies." },
          { type: "ul", items: [
            "State agencies, which often run high-volume central purchasing through an Ion Wave portal.",
            "Cities and counties using Ion Wave for public works, facilities, services and supply.",
            "Special districts and authorities, each its own buyer with its own portal and cycle.",
            "Public bodies that came into the Ion Wave family and now sit within the Euna portfolio.",
          ] },
          { type: "p", text: "Because the model is per-portal, your coverage is only as good as your map of which buyers run on Ion Wave and your registration on each. And that map sits inside a local-government market of enormous size, before you even count the state portals." },
          { type: "stat", id: "us-local-govs" },
          { type: "p", text: "Add the special districts that run their own procurements and the number of separate front doors grows further still." },
          { type: "stat", id: "us-special-districts" },
          { type: "p", text: "A contractor who works a region served by a state Ion Wave portal, a county portal and a couple of special-district portals is looking at several separate registrations, each with its own commodity selections, to see the work. Miss one and the blind spot is invisible to you." },
          { type: "p", text: "The state-level presence is worth dwelling on, because it changes the stakes. State central purchasing tends to run high volume and high dollar value, often through statewide contracts and term agreements that, once awarded, lock in a supplier for years. Miss the window on a state Ion Wave portal and you are not just missing one job; you may be missing a multi-year position that does not come around again for the length of the contract. That is a very different kind of loss from missing a single municipal bid, and it is precisely the kind of opportunity a per-portal notification model, left to chance, lets slip." },
        ],
      },
      {
        id: "how-ionwave-categorizes",
        heading: "How Ion Wave categorizes and notifies",
        blocks: [
          { type: "p", text: "Ion Wave runs on per-portal commodity registration. On each buyer's instance you register as a supplier, select the commodity codes that describe what you do, and the buyer notifies registered suppliers when it posts a solicitation tagged with codes that overlap yours. Inside one portal that loop works, and it is the standard public-procurement pattern." },
          { type: "p", text: "The fragility is the familiar one, with the Euna twist on top. The loop only runs for the portals you have actually found and registered on, and the commodity codes a buyer tags have to overlap the codes you selected for a notification to fire. Buyers tag loosely; a solicitation spanning several trades can be under-coded; and your registration may not happen to overlap their choice even when the work is squarely yours. There is no overlay across Ion Wave buyers that catches what your individual registrations miss." },
          { type: "p", text: "The Euna consolidation adds a wrinkle worth naming. As the ionwave.net brand routes into Euna, the way portals present, where notifications come from, and how registrations carry forward can change. A registration you set up under the old brand may need attention to keep notifying you reliably, and you would not necessarily be told. Keeping commodity registrations alive and correct across a shifting brand landscape is exactly the kind of maintenance that quietly lapses." },
          { type: "callout", text: "The most underrated fact about Ion Wave: per-portal commodity registration means your coverage equals the portals you joined and the codes you picked, and the Euna brand shift can change how those registrations behave under you." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of Ion Wave alerts",
        blocks: [
          { type: "p", text: "Ion Wave notifications are useful inside the portals you have joined, and limited in ways that matter to a working contractor." },
          { type: "ul", items: [
            "You only hear from the buyers whose portals you found and registered on. A perfect fit on a portal you never joined is invisible to you.",
            "There is no single Ion Wave feed across buyers, so coverage depends on knowing every buyer in your area that runs on the platform.",
            "Commodity coding varies by buyer, so a loosely tagged or neighbouring-code solicitation can slip past even on a portal you belong to.",
            "The Euna brand consolidation can change how a portal notifies, so a registration that worked last year may quietly stop reaching you.",
            "A notification tells you a solicitation posted. It does not tell you about the prevailing-wage requirement, the bonding, the mandatory pre-bid meeting, or whether the scope favours an incumbent.",
          ] },
          { type: "p", text: "None of that is a flaw in the software. A per-portal alert is a tripwire for that one buyer, and a tripwire cannot tell you about the agency down the road, survive a brand migration unattended, or read the documents. State and local solicitations close on hard deadlines, and a missed notice is a missed window." },
        ],
      },
      {
        id: "search-registration-friction",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "When notifications come up short, contractors fall back on searching and on widening their registrations. Both run into the per-portal model and the brand shift." },
          { type: "ul", items: [
            "There is no unified search across Ion Wave buyers. To search the way you would a single national site, you would have to visit each buyer's portal in turn.",
            "Each portal hides the decisive scope inside its own document set, so the listing under-reports the real work in the attachments.",
            "Registration is a per-portal chore, and the burden is in knowing which buyers run on Ion Wave and keeping each registration current, especially through the Euna transition.",
            "There are many buyers to find, and a buyer that adopts the platform, or whose portal migrates into Euna, does not announce it to suppliers who were not already watching.",
          ] },
          { type: "p", text: "The throughline is the one that runs across the fragmented market. The system surfaces work the way buyers coded it, on portals you must individually find and maintain, and the decisive detail lives in documents no search reads. The Euna consolidation adds a layer of change on top. Closing that gap is a mapping-and-reading job, and it does not scale by logging in more often." },
          { type: "p", text: "One more piece of friction is specific to commodity-driven state and local portals like Ion Wave, and it trips up even diligent contractors: the commodity code lists themselves are long, inconsistent between portals, and rarely map cleanly onto how you describe your own work. The same trade can live under several codes, and the code a buyer reaches for under deadline pressure is not always the one you would expect. Registering on a portal is therefore only half the job; registering under the right spread of codes, and revisiting those selections as your work and the buyer's habits change, is the other half. Most contractors set their codes once at signup and never touch them again, which slowly turns a live registration into a partial one without anyone noticing." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on Ion Wave",
        blocks: [
          { type: "p", text: "The misses on Ion Wave follow a tight pattern, with the brand shift adding a modern twist." },
          { type: "ol", items: [
            "The solicitation posts on a portal the contractor never registered on, so no notification fires. A supply contract on a state Ion Wave portal they had not joined is the classic example.",
            "The buyer tagged the work under a commodity that does not overlap the contractor's selections, so even on a portal they belong to, the alert stays silent.",
            "A registration set up under the old ionwave.net brand stopped notifying reliably after the portal routed into Euna, and the contractor never noticed.",
            "The notice arrives, but the contractor judges fit from the title and never opens the documents where the scope, prevailing wage and pre-bid meeting live.",
            "An addendum changes scope or timing after the first look, and on a portal checked only occasionally, nobody circles back.",
          ] },
          { type: "p", text: "Each of these is a coverage-and-maintenance failure, not a strategy failure. You fix them by mapping every Ion Wave buyer in your footprint, keeping each registration alive through the Euna transition, and reading every solicitation that could plausibly fit, not by checking one portal more often." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where Ion Wave fits in the fragmented U.S. local market",
        blocks: [
          { type: "p", text: "Zoom out and Ion Wave is one of several procurement platforms competing for tens of thousands of independent buyers, now consolidated under the Euna umbrella alongside other procurement products. Its presence at the state level makes it especially worth watching for contractors who sell to state central purchasing, but it remains one vendor's slice of an enormous, splintered market." },
          { type: "stat", id: "us-special-districts" },
          { type: "p", text: "In any region, some buyers run on Ion Wave or Euna, others on a competing SaaS portal, others on a regional notification network, and others on a homegrown system. A contractor who watches only Ion Wave sees only the buyers that happen to use it, and even then only the portals they personally joined and kept current. The Euna consolidation reshuffles the landscape but does not unify it into one feed for you." },
          { type: "p", text: "That is the real shape of the problem. Fragmentation is the structure of the market, brand consolidation rearranges the pieces without merging them into a single view, and a per-portal model leaves coverage on the contractor's shoulders. Stitching Ion Wave and Euna buyers together with the rest of the platforms your buyers use, and keeping it current, is exactly the gap I exist to fill." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement Ion Wave",
        blocks: [
          { type: "p", text: "I do not replace Ion Wave or Euna. Each buyer's portal stays your system of record and the place you submit. I sit on top of the fragmented and consolidating landscape and do the part no single portal was built to do." },
          { type: "ul", items: [
            "I keep your registrations current across the Ion Wave and Euna buyers in your footprint, so coverage does not depend on you having found every portal or survived the brand migration.",
            "I watch for portals routing into Euna and for new buyers adopting the platform, so a brand shift or an adoption never becomes a blind spot.",
            "I monitor each portal the way buyers actually tag and title work, so loosely coded fits still reach you.",
            "I open the documents and read the scope, the prevailing wage, the bonding, the pre-bid meetings, the evaluation criteria and the addenda as they post.",
            "I qualify fit against your trades, capacity and geography, then send a short, plain-language summary with a direct link back to the source so you act on the portal itself.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of tracking which of your buyers run on Ion Wave, which have moved into Euna, and whether your old registrations still notify you, you get one short list of opportunities that actually fit, each already found, read, qualified and linked. Your estimators price. Your team submits. Nobody spends a morning hunting across portals or chasing a brand migration, because that work is finished before anything reaches them." },
          { type: "p", text: "And to be clear about the limits of what I take on: I find and qualify the work, I do not write or submit your bids. Across Ion Wave and Euna that means keeping the map of your buyers current, keeping your registrations alive through the consolidation, reading what posts, and handing you a qualified short list. The submission itself, on whichever portal a buyer runs, stays with your team, where it belongs. My job is to make sure that team is always pointed at real, winnable work rather than spending its time wondering whether an old portal still notifies them." },
          { type: "callout", text: "If you registered on an ionwave.net portal a while back and are not sure it still reaches you, or whether other buyers in your area run on the same family of tools, let me show you on a call exactly what you are seeing and what you are missing." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The state portal under a code they never picked",
        result: "A state supply contract caught despite a commodity mismatch.",
        body: "A supplier was registered on a state Ion Wave portal but had selected a narrow set of commodity codes. The contract that fit them best was tagged under a neighbouring commodity, so no notification fired. Reading the portal the way the buyer coded the work, rather than waiting on code overlap, surfaced it in time to bid. Illustrative example.",
      },
      {
        title: "The registration that quietly went silent",
        result: "A lapsed notification path restored after a portal routed into Euna.",
        body: "A contractor had registered on an ionwave.net portal years earlier and relied on its notices. After the portal routed into the Euna platform, the notifications they counted on quietly stopped reaching them, and they did not notice until they lost a job. Watching the portal through the transition restored their visibility into the work. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Is Ion Wave the same as Euna now?", a: "Ion Wave is now part of the Euna procurement portfolio, and the ionwave.net brand routes into Euna's broader platform. For you that means the portals you registered on may carry Euna branding and may behave differently than before. I track the buyers through that transition so the brand shift does not become a blind spot." },
      { q: "Is there one Ion Wave login that shows me everything?", a: "No. Each buyer runs its own Ion Wave instance with its own supplier registration and notifications, and there is no single feed across buyers. I maintain the map of Ion Wave and Euna buyers in your footprint and stitch them into one shortlist." },
      { q: "Do I still need my own Ion Wave registrations?", a: "Yes, and they stay your point of action. Each buyer's portal remains your system of record and where you submit. I keep your registrations current across buyers, monitor the portals, read the documents and qualify fit before anything reaches you." },
      { q: "My old ionwave.net account stopped sending notices. What happened?", a: "That is a common symptom of the Euna consolidation. As portals route into Euna, the way they notify can change, and an old registration may quietly stop reaching you. I watch for exactly that so a lapsed notification path does not cost you a job." },
      { q: "Will you catch bids my commodity-code notifications miss?", a: "Yes. Per-portal commodity matching only fires on code overlap, and buyers tag loosely. I read the portals the way buyers actually code work rather than waiting on overlap, so loosely coded fits still reach you." },
      { q: "How quickly will I see Ion Wave opportunities?", a: "On a discovery call I will already have looked at the Ion Wave and Euna buyers in your area, so you see real examples before you pay anything. Once we start, qualified opportunities reach you on a steady cadence as they post." },
    ],
  },
};
