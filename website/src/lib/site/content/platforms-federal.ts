import type { LongForm } from "./types";

/**
 * Hand-authored, deep authority bodies for the federal-tier platforms:
 * CanadaBuys, SAM.gov, GSA eBuy and USASpending. First-person Phil voice, no em
 * or en dashes. Phil finds and qualifies opportunities; he does not write or
 * submit proposals. Stat blocks reference only the cited ids in lib/site/citations.
 */
export const FEDERAL_PLATFORM_CONTENT: Record<string, LongForm> = {
  canadabuys: {
    readMins: 19,
    intro:
      "CanadaBuys is the front door to the Government of Canada's procurement, and it is also one of the easiest places to lose money without ever realizing it. It replaced Buyandsell, pulls notices from across the federal government and the broader public sector, and posts new tenders every day in two official languages and a wall of formal clause language. I read CanadaBuys the way the buyers write it: by GSIN, by department habit, by what is buried in the solicitation documents you sometimes cannot even open without an account. This is the long version. What it is, who posts on it, how it files and notifies, where its alerts go quiet, and how I make sure the federal work meant for you actually reaches your desk.",
    sections: [
      {
        id: "what-is-canadabuys",
        heading: "What CanadaBuys is, and what it replaced",
        blocks: [
          { type: "p", text: "CanadaBuys is the Government of Canada's official tendering service, the system that replaced the old Buyandsell.gc.ca. It is the single authoritative place where federal opportunities are published, and it aggregates far more than just the headline departments. Notices flow in from Public Services and Procurement Canada, from other federal departments and agencies, from the broader Canadian public sector, from Crown corporations, and even from NATO. New tender notices post every day." },
          { type: "p", text: "That breadth is the reason it matters and the reason it is hard to use well. CanadaBuys is a system of record. It publishes the notice, stores the solicitation documents, manages amendments, and routes bids into the federal submission machinery. What it does not do is tell you which of today's notices is worth your estimator's afternoon. It will show you the volume. It will not do the judging." },
          { type: "callout", text: "CanadaBuys publishes federal opportunities. It does not qualify them for you. The distance between a daily feed of notices and a shortlist of winnable federal work is the entire job I do." },
          { type: "p", text: "I want to be precise here, because federal procurement punishes imprecision. None of what follows is a complaint about CanadaBuys. It is the honest boundary between what an authoritative publishing platform can do and what a person who reads bilingual documents, decodes GSINs and knows your shop can do. Understanding that boundary is the first step to never missing a federal fit again." },
          { type: "p", text: "It also helps to understand what kind of work flows through it. CanadaBuys carries one-off tender notices, but it also carries the federal procurement instruments that run for years: standing offers, where the government pre-arranges pricing and calls up against it as needed, and supply arrangements, where it qualifies a pool of suppliers and competes work among them. Those instruments do not behave like a tender with a clear open-and-close date you can react to. They award on their own cadence, and getting onto one is a different exercise from winning a single contract. A contractor who only watches for tenders is, by definition, blind to a whole category of federal work that decides who gets called for years afterward." },
        ],
      },
      {
        id: "who-posts-canadabuys",
        heading: "Who posts on CanadaBuys",
        blocks: [
          { type: "p", text: "The buyers on CanadaBuys are not one homogeneous federal voice. They are several layers of government, each with its own conventions, and knowing how each behaves matters far more than knowing the list." },
          { type: "ul", items: [
            "Public Services and Procurement Canada, the central purchasing arm that buys on behalf of dozens of departments and sets much of the federal style.",
            "Other federal departments and agencies, which post in their own departmental voice and lean on different GSIN families depending on what they buy.",
            "Crown corporations, which run public-style competitions but often use language and category habits closer to a commercial buyer than a central agency.",
            "The broader Canadian public sector, whose notices land here alongside the federal ones and rarely use identical wording.",
            "NATO, whose notices appear in the feed and follow their own structure entirely.",
          ] },
          { type: "p", text: "That mix is the whole story. A contractor scanning CanadaBuys casually sees a flat federal feed. What is actually there is several buying cultures layered on top of one another, each titling and coding work in its own way. The same essential requirement can read three different ways depending on which department wrote it, and the GSIN one buyer chooses is not always the one you would have predicted." },
          { type: "h3", text: "Why the buyer mix trips up good contractors" },
          { type: "p", text: "The mistake I see constantly is treating CanadaBuys as if the entire federal government speaks one language. You register against the GSINs your industry uses, and matching works fine for the buyers who happen to code the way you expect. The departments that file a little differently, and there are always some, go quiet on you. You are not missing those notices because they are hidden. You are missing them because you and the buyer described the same job under different codes." },
          { type: "p", text: "There is a language dimension on top of the coding one. A Crown corporation describing a maintenance requirement and a central agency describing the same requirement will not pick the same words, and neither will reliably pick the words your industry uses day to day. Add the fact that every document exists in both English and French, with the official clause language that federal procurement requires, and the gap between how the work reads and how you would search for it widens further. The buyers who serve your jurisdiction are not trying to be hard to find. They are simply writing for the record and for the lawyers, not for your search box, and the result is the same: real fits that never surface against the terms you would naturally use." },
        ],
      },
      {
        id: "how-canadabuys-categorizes",
        heading: "How CanadaBuys categorizes and notifies",
        blocks: [
          { type: "p", text: "CanadaBuys organizes opportunities primarily by GSIN codes, the Goods and Services Identification Numbers the federal government uses to classify what it is buying, alongside category, department and closing date. It surfaces work to you through interest matching tied to the codes and criteria you set when you register, and through searches you run yourself. Both mechanisms depend on a single fragile assumption: that the GSIN a contracting officer assigned lines up with the GSINs you selected." },
          { type: "p", text: "They often do not. The GSIN is chosen by a procurement officer describing the work in their terms, under time pressure, sometimes picking the closest fit from a deep taxonomy rather than the perfect one. A multi-trade project gets coded under whichever GSIN the officer judged dominant. So a controls upgrade can land under a generic facilities GSIN, a specialized supply contract can land one family over from where you registered, and the match never fires." },
          { type: "callout", text: "On CanadaBuys the GSIN is chosen by the buyer, not by you. If the code you registered against does not match the code they assigned, the opportunity is invisible to you even though it is sitting in plain sight in the feed." },
          { type: "p", text: "There is a second layer that catches people out. The real description of the work, the part that decides whether you can win it, lives inside the solicitation documents, not the notice. And those documents are bilingual, in formal English and French, with federal clause language and standard instructions that take time to read carefully. The notice tells you a fraction of the story. The document set tells you the rest, and it is written to be precise, not skimmable." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of CanadaBuys alerts",
        blocks: [
          { type: "p", text: "CanadaBuys interest matching and notifications are genuinely useful, and they are nowhere near enough on their own. Here is exactly where they fall short for a working contractor." },
          { type: "ul", items: [
            "Interest matching is only as good as the GSIN codes you selected at registration, so a notice coded one family over never reaches you at all.",
            "Federal notices use formal, clause-heavy language, and a literal keyword alert reads that language literally, missing the plain-English way you would describe the same job.",
            "An alert tells you a notice exists. It does not tell you whether the scope fits, whether there is a mandatory bidders' conference, whether the bonding and certifications are ones you can meet, or whether the evaluation grid quietly favours an incumbent.",
            "Amendments and addenda change scope and move closing dates after the original notice landed, and you do not get a fresh, judged tap on the shoulder telling you the deal just changed.",
            "Standing offers and supply arrangements award once and then run for years. Miss the window when it opens and you wait out the whole term before another chance.",
          ] },
          { type: "p", text: "None of that is a flaw in the feature. An alert is a tripwire, and a tripwire cannot read a bilingual forty-page solicitation, decode the clause language, or weigh it against your crew's calendar. That is a human job, and it is the one I do." },
        ],
      },
      {
        id: "search-registration-access",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "When the matching misses something, contractors fall back on searching and on trying to open the documents themselves. Federal procurement adds friction here that most other platforms do not, and it is worth naming plainly." },
          { type: "ul", items: [
            "Some opportunities require an SAP Business Network viewer account just to see the full solicitation documents. You can find the notice and still be blocked from reading what actually matters until you have set that up.",
            "To submit a federal bid, suppliers have to create an SAP Business Network account and complete a government questionnaire, and if you win you will need your CRA business number ready. None of that is hard, but discovered late it costs you days you may not have.",
            "Some categories route through extra sourcing tools such as SELECT, SRI or the Professional Buyer's Network, which means the work does not all live behind one identical front door.",
            "GSIN-driven search rewards exact coding and punishes broad or mis-coded notices, so the bid that fits you best can be titled in language you would never type into the box.",
            "Bilingual documents and federal clause language slow a fast scan to a crawl, which means the deeper you read the more time it costs, and most contractors stop reading before the decisive detail.",
          ] },
          { type: "p", text: "Put plainly: federal access is not just a search problem, it is a setup-and-reading problem. The contractors who win federal work are the ones who have the right accounts ready, who watch the way departments actually code, and who read the bilingual documents carefully. That does not scale by logging in more often. It scales by having someone whose whole job is to handle the friction and read." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on CanadaBuys",
        blocks: [
          { type: "p", text: "Stack the matching limits, the access friction and the bilingual document load together, and a clear, repeatable pattern emerges. Contractors miss winnable federal work on CanadaBuys for a small number of reasons, over and over." },
          { type: "ol", items: [
            "The notice is coded under a GSIN family they did not register for, so interest matching never fires. A specialized supply requirement filed one family over is the classic example.",
            "The notice reaches them, but it arrives inside a daily flood of federal and broader-public-sector volume and gets skimmed past in the morning.",
            "They find the notice but hit the SAP Business Network viewer requirement, do not set it up in time, and never read the documents that would have told them it was a fit.",
            "An amendment quietly changes the scope or moves the closing date after the first look, and nobody circles back to re-judge it.",
            "A mandatory bidders' conference, a certification requirement, or a clause buried deep in the bilingual document set is missed until it is too late to act on it.",
            "A standing offer or supply arrangement opens its rare window, nobody is watching for it, and the contract runs for years before another chance comes.",
          ] },
          { type: "p", text: "Every one of these is preventable. Not one of them is prevented by logging in more often or registering against a few more codes. They are prevented by someone handling the federal setup, watching the way departments actually file, reading the bilingual documents, and judging fit before anything reaches your team." },
        ],
      },
      {
        id: "single-bid-reality",
        heading: "The competition picture CanadaBuys hides",
        blocks: [
          { type: "p", text: "There is one more gap on CanadaBuys that has nothing to do with alerts and everything to do with strategy: the platform does not display the number of bids received for closed solicitations. That sounds minor. It is not. It means the single most useful piece of competition intelligence, how many firms actually showed up to bid a given requirement with a given buyer, is simply not there to read." },
          { type: "p", text: "That matters because federal competitions are far less crowded than most contractors assume. The federal procurement watchdog in Canada has documented just how often a supposedly open competition draws a single bid." },
          { type: "stat", id: "one-bid-open" },
          { type: "stat", id: "one-bid-limited" },
          { type: "stat", id: "single-bid-frequency" },
          { type: "p", text: "Read those figures together and the lesson is plain. A large share of federal competitions are won by whoever simply shows up prepared, because the field is thin. But CanadaBuys will not tell you that a particular buyer's last three competitions for this kind of work each drew one bid. You have to infer the pattern from outside the platform, which is exactly the kind of reading and cross-referencing I do before I tell you a federal opportunity is worth your time." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where CanadaBuys fits in a fragmented market",
        blocks: [
          { type: "p", text: "CanadaBuys is authoritative for federal work, and federal work is only one layer of the Canadian public market. The country is dense with buyers that never touch CanadaBuys for most of what they purchase." },
          { type: "stat", id: "canada-public-units" },
          { type: "stat", id: "canada-local-units" },
          { type: "p", text: "Those numbers are the context every federal contractor needs. The federal feed is one important door, and beside it sit thousands of provincial, municipal, academic, school-board, hospital and Crown buyers who run their work through MERX, Biddingo, bids&tenders, Bonfire and dozens of other systems. A strategy that watches only CanadaBuys is watching a single layer of a deep stack." },
          { type: "p", text: "I say this so the role of CanadaBuys is clear. It is the right place to watch for federal opportunities and a poor place to assume you are seeing your whole market. The wider Canadian public sector is fragmented across platforms, and coverage of it is its own discipline, which is why I treat CanadaBuys as one watched source among many rather than the entire picture." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement CanadaBuys",
        blocks: [
          { type: "p", text: "I do not replace CanadaBuys, and I would be suspicious of anyone who claimed to. It stays your authoritative federal source and the place bids ultimately route. I sit on top of it and do the part it was never built to do." },
          { type: "ul", items: [
            "I map your offering to the GSIN codes that actually surface your work, not just the obvious one, so the notices coded a family over still reach you.",
            "I handle the access friction: I know which opportunities need an SAP Business Network viewer account to read, and I flag the registration and questionnaire steps before they cost you days.",
            "I open and read the bilingual documents, the clause language, the mandatory conferences, the certifications and the amendments as they post, and I translate them into plain English.",
            "I watch for the standing-offer and supply-arrangement windows that open only occasionally and run for years.",
            "I qualify fit against your trades, capacity and geography before anything reaches your team, and I cross-reference the competition picture the platform will not show you.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of another bilingual inbox to triage, you get a short list of federal opportunities that actually fit, each already read, qualified and linked back to the source notice on CanadaBuys so you act on the system of record. Your team prices and pursues. Nobody loses a morning to clause language or a contract to a viewer-account requirement discovered too late." },
          { type: "callout", text: "If you are still scanning CanadaBuys yourself in two languages every morning, you are doing work I have already mastered. Let me show you, on a call, the federal opportunities your current setup is missing in your own GSIN families." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The supply arrangement one GSIN family over",
        result: "A multi-year federal supply opportunity, found under a code the contractor never registered against.",
        body: "A supplier's CanadaBuys interest matching was built around the GSIN family they thought of as theirs. A multi-year requirement that fit them squarely was coded one family over by the contracting department, so no match ever fired. Reading the feed the way the department filed it, rather than waiting on code overlap, put the opportunity on their desk with time to prepare. Illustrative example.",
      },
      {
        title: "The viewer account that almost lost the bid",
        result: "A federal solicitation read in time because the access step was handled before the clock ran down.",
        body: "A contractor found a promising federal notice but could not open the full solicitation documents without an SAP Business Network viewer account, and did not realize it until late. Because the access requirement was identified up front and the documents read early, the real scope and a mandatory step surfaced with days to spare instead of hours. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Do I still need my own CanadaBuys and SAP Business Network setup?", a: "Yes, and that is fine. CanadaBuys stays your authoritative federal source and the SAP Business Network is where federal bids route. I work alongside both: I watch, handle the access friction, read the bilingual documents and qualify fit, then hand you the opportunity with a direct link back to the source notice." },
      { q: "Can you really catch what my CanadaBuys matching misses?", a: "That is the entire point. Interest matching fires on the GSIN codes you selected. I map the codes that actually carry your work, watch the way departments truly file, and read the documents. The notices coded a family over are exactly the ones I am looking for." },
      { q: "What about the SAP Business Network viewer account requirement?", a: "Some opportunities need a viewer account just to read the full solicitation documents. I know which ones, and I flag the registration, questionnaire and CRA business number steps early so an access requirement never costs you a bid you could have won." },
      { q: "Do you handle the French documents too?", a: "Yes. CanadaBuys documents are bilingual and written in formal clause language. I read them and translate the decisive details into plain English, so the language load never slows down your decision to pursue." },
      { q: "How will I know how much competition a federal bid faces?", a: "CanadaBuys does not display the number of bids received on closed solicitations, which is a real intelligence gap. I cross-reference patterns from outside the platform so you have a read on how thin or crowded a given buyer's competitions tend to be before you commit time." },
      { q: "Is this CanadaBuys training or consulting?", a: "No. I am not here to teach you the platform, and I do not write or submit your proposals. I do the monitoring, reading and qualifying for you as an ongoing service, so your team spends its hours pursuing federal work that fits rather than searching for it." },
    ],
  },

  "sam-gov": {
    readMins: 19,
    intro:
      "SAM.gov is the governmentwide front door to U.S. federal contracting, and it is the noisiest room in the entire market. Every agency posts opportunities above the publicizing threshold here, every serious federal vendor registers here, and the sheer volume drowns the handful of notices that actually fit any one contractor. I know SAM.gov the way you know your trade: how it codes work by NAICS and PSC, where its saved-search alerts go quiet, how the registration friction trips firms before they ever bid, and how the federal feed is only the top layer of a far larger market. This is the full picture. What SAM.gov is, who posts on it, how it files and notifies, where its alerts fail, and how I make sure the federal work meant for you reaches your desk.",
    sections: [
      {
        id: "what-is-sam-gov",
        heading: "What SAM.gov is, and what it is not",
        blocks: [
          { type: "p", text: "SAM.gov is the United States federal government's official, governmentwide point of entry for contract opportunities. Above the publicizing threshold, federal agencies are required to post their opportunities here, which makes it the single authoritative place to find federal solicitations. It is also where vendors register their entity and obtain the Unique Entity ID that federal contracting depends on, and where a large amount of award and exclusion data lives." },
          { type: "p", text: "Here is the part that matters most and gets said least. SAM.gov is a system of record at federal scale. It publishes the notice, stores the attachments, and manages the entity data the government needs. What it does not do is decide anything for you. It will show you an overwhelming daily volume of opportunities, sources-sought notices, special notices and award notices. It will not tell you which three of them are worth your estimator's afternoon." },
          { type: "callout", text: "SAM.gov publishes federal opportunities at enormous scale. It does not qualify them for you. The distance between that firehose and a shortlist of winnable, eligible work is the entire reason this service exists." },
          { type: "p", text: "None of what follows is a knock on SAM.gov. It is the honest boundary between what a governmentwide publishing platform can do and what a person who reads the statement of work, checks the set-aside eligibility and knows your shop can do. Understanding that boundary is the first step to never missing a federal fit, or wasting time on one you can never win." },
          { type: "p", text: "It is worth being clear about the notice types you will see here, because they are not all opportunities. SAM.gov carries combined synopsis solicitations and full solicitations, which are real and biddable. It also carries sources-sought notices and requests for information, which are the government surveying the market before it decides how to buy. It carries presolicitation notices, special notices and award notices announcing who won. To a search alert, all of these look broadly alike: a posting under a code you saved. To a contractor's calendar they are completely different things, and treating a sources-sought notice as a solicitation can burn a week of effort on something that was never a bid in the first place. Knowing the difference at a glance is a skill, and the platform does not supply it." },
        ],
      },
      {
        id: "who-posts-sam-gov",
        heading: "Who posts on SAM.gov",
        blocks: [
          { type: "p", text: "SAM.gov carries the whole federal government, and the buyers behind the notices do not behave the same way. Knowing how each posts matters more than knowing the list." },
          { type: "ul", items: [
            "Federal departments and their contracting offices, which post formal solicitations and route them through the FAR-driven process.",
            "Defense and civilian agencies alike, each with their own buying habits, preferred NAICS and PSC choices, and recurring requirements.",
            "Contracting offices issuing sources-sought and pre-solicitation notices, which look like opportunities but are really the government testing the market.",
            "Set-aside programs, where eligibility, not just capability, decides whether you are allowed to bid at all.",
          ] },
          { type: "p", text: "That mix is the trap. A contractor scanning SAM.gov casually sees one federal feed. What is actually there is hundreds of contracting offices coding work in their own terms, mixed with notices that are not yet real opportunities, mixed with set-asides you may or may not be eligible to pursue. The same requirement can be coded under different NAICS by different offices, and a notice that looks like a bid can turn out to be a market survey." },
          { type: "h3", text: "Why the federal mix trips up good contractors" },
          { type: "p", text: "The mistake I see most often is treating every notice as a real, biddable opportunity and every code as the one you would have predicted. You build a saved search around your primary NAICS and the words your industry uses, and it works for the offices that code the way you expect. The offices that file a little differently go quiet, and the sources-sought noise floods the rest. You end up reacting to notices you cannot use and missing fits coded one NAICS over." },
          { type: "p", text: "Set-asides deserve their own caution. A large share of federal work is reserved for specific categories of business, and the reservation is not advisory: if a solicitation is set aside for a category you do not belong to, you cannot win it no matter how strong your capability or price. The reverse is also true and costs firms money quietly. A contractor who qualifies for a set-aside but does not realize a given notice carries it will pass over work that was, in effect, being protected for firms like them. A saved-search alert does not read your eligibility against the notice. It just tells you a posting matched your code, and leaves the most consequential filter in federal contracting for you to apply yourself, every single time." },
        ],
      },
      {
        id: "how-sam-gov-categorizes",
        heading: "How SAM.gov categorizes and notifies",
        blocks: [
          { type: "p", text: "SAM.gov organizes opportunities by NAICS code, PSC code, set-aside type, agency and notice type, and it surfaces them to you through saved searches and the email alerts those searches generate. That matching is the heart of the system, and it is also its central fragility, because a contracting officer chose the codes, not you." },
          { type: "p", text: "The NAICS and PSC are assigned by a contracting officer describing the requirement in their terms, sometimes loosely, sometimes choosing a broad or generic code rather than the precise one. A multi-discipline project gets the code the officer judged dominant. So a controls upgrade can post under a generic energy or facilities PSC, a specialized service can land under an adjacent NAICS, and your saved search never sees it because your search assumed a different code." },
          { type: "callout", text: "On SAM.gov the NAICS and PSC are chosen by the contracting officer, not by you. If the codes you saved do not match the codes they assigned, the opportunity is invisible to you even though it is sitting in plain sight in the feed." },
          { type: "p", text: "On top of the coding, the real requirement lives inside the statement of work and the attachments, not the notice. The notice gives you a title and a code. The SOW, the evaluation factors, the set-aside conditions and the submission instructions decide whether you can win, and whether you are even allowed to bid. The search index weighs the notice, not the documents where the decisive detail hides." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of SAM.gov alerts",
        blocks: [
          { type: "p", text: "SAM.gov saved-search alerts are useful, and like every automated alert they are limited in ways that matter to a working contractor." },
          { type: "ul", items: [
            "Alerts hinge on the NAICS and PSC codes you saved, and a contracting officer may assign those loosely, so a fit coded one NAICS over never reaches you.",
            "Federal volume is enormous, so genuine fits scroll past in your inbox alongside sources-sought notices, special notices and award notices you cannot act on.",
            "Set-aside and eligibility rules decide whether you can bid at all, and an alert does not check whether you qualify before it lands in your inbox.",
            "An alert tells you a notice exists. It does not tell you whether the SOW fits, whether the evaluation favours an incumbent, whether the response window is realistic, or whether the notice is even a real opportunity rather than a market survey.",
            "Alerts do not follow a notice through amendments, so a scope or date change after the first alert does not generate a judged second look.",
          ] },
          { type: "p", text: "None of that is a flaw in the feature. An alert is a tripwire, and a tripwire cannot read a statement of work, check your set-aside eligibility, or tell a real solicitation from a sources-sought notice. That is a human job, and at federal volume it is the difference between bidding the right work and drowning in the feed." },
          { type: "p", text: "Volume is not an abstraction here, it is the defining problem. A saved search tuned tightly enough to cut the noise will quietly drop fits coded a little off, and a saved search loose enough to catch those fits will bury them under hundreds of postings you cannot use. There is no setting that solves this, because the trade-off is built into the way the feed works: precision and coverage pull against each other, and any single configuration sacrifices one for the other. The contractors who handle federal volume well are not the ones with a cleverer saved search. They are the ones who have a human reading the borderline matches and deciding, posting by posting, which are worth a second look. That is not a tuning exercise. It is a reading exercise, and it does not get easier by adding more alerts." },
        ],
      },
      {
        id: "search-registration-access",
        heading: "Search, registration and access friction",
        blocks: [
          { type: "p", text: "When alerts miss something, contractors fall back on searching and on keeping their registration current. Federal registration adds friction here that catches firms out, and the search itself has familiar blind spots." },
          { type: "ul", items: [
            "Doing business with the federal government requires entity registration and a Unique Entity ID, and that registration must be renewed annually. A lapsed registration can quietly disqualify you from an award you otherwise won.",
            "Code-and-keyword search misses work filed under an adjacent NAICS or a generic PSC, so the bid that fits you best can be titled in language you would never type.",
            "Sources-sought and pre-solicitation notices need interpreting, not just reading: respond well to the right ones and you shape a future requirement, ignore the wrong ones and you save time, but the alert does not tell you which is which.",
            "The real requirement lives in attachments and statements of work the search index does not weigh, so even a found notice under-reports what it actually involves.",
            "Modernization of the federal systems is still incomplete, which means the experience of finding, reading and tracking work is not as seamless as the scale would suggest.",
          ] },
          { type: "p", text: "Federal access is a setup-and-reading problem as much as a search problem. The capacity to read it well is also scarce, which is part of why so many firms underuse the federal market." },
          { type: "stat", id: "estimator-hiring" },
          { type: "p", text: "The contractors who win federal work keep their registration current, watch the way offices actually code, read the statements of work, and check eligibility before they spend a minute on a response. That does not scale by logging in more often. It scales by having someone whose whole job is to handle the friction and read." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on SAM.gov",
        blocks: [
          { type: "p", text: "Stack the alert limits, the registration friction and the federal volume together, and a clear, repeatable pattern emerges. Contractors miss winnable federal work on SAM.gov for a small number of reasons, over and over." },
          { type: "ol", items: [
            "The notice is coded under a NAICS or PSC they did not save, so the saved-search alert never fires. A specialized service coded under a generic PSC is the classic example.",
            "The notice reaches them, but it arrives buried in federal-scale volume and gets skimmed past alongside sources-sought and award notices they cannot use.",
            "They spend time on a notice that turns out to be a market survey, not a real solicitation, because nobody interpreted the notice type first.",
            "They pursue a set-aside they are not actually eligible for, or skip one they qualify for, because the alert never checked eligibility.",
            "Their entity registration lapses, and a win or a pursuit is undermined by a renewal nobody tracked.",
            "An amendment changes scope or moves the closing date after the first look, and nobody re-judges it.",
          ] },
          { type: "p", text: "Every one of these is preventable. Not one of them is prevented by logging in more often or saving more searches. They are prevented by someone keeping the registration current, watching the way offices actually code, reading the statements of work, checking eligibility, and judging fit before anything reaches your team." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where SAM.gov fits in a fragmented market",
        blocks: [
          { type: "p", text: "SAM.gov is authoritative for federal opportunities, and the federal layer is large. The scale of what flows through the federal system is real money." },
          { type: "stat", id: "us-federal-spend" },
          { type: "p", text: "But federal is only one layer of the U.S. public market, and assuming SAM.gov shows you the whole thing is the most expensive mistake a contractor can make. Below the federal tier sit fifty separate state ecosystems and a vast local-government landscape, almost none of which posts to SAM.gov." },
          { type: "stat", id: "us-local-govs" },
          { type: "stat", id: "us-special-districts" },
          { type: "p", text: "Those numbers are the context every federal contractor needs. The federal feed is one important door, and beside it sit tens of thousands of cities, counties, school districts and special districts that run their work through BidNet Direct, PlanetBids, DemandStar, Bonfire and dozens of other systems. A strategy that watches only SAM.gov is watching the top layer of a deep stack and calling it the market." },
          { type: "p", text: "I say this so the role of SAM.gov is clear. It is the right place to watch for federal opportunities and a poor place to assume you are seeing your whole market. The wider U.S. public sector is fragmented across platforms, and coverage of it is its own discipline, which is why I treat SAM.gov as one watched source among many rather than the entire picture." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement SAM.gov",
        blocks: [
          { type: "p", text: "I do not replace SAM.gov, and I would be suspicious of anyone who claimed to. It stays your authoritative federal source, your entity registration, and the place solicitations live. I sit on top of it and do the part it was never built to do." },
          { type: "ul", items: [
            "I track the NAICS and PSC codes that actually carry your work, plus the agencies and offices that buy it, so the fits coded one code over still reach you.",
            "I read the statement of work, the evaluation factors and the set-aside type, and I check eligibility before anything reaches you, so you never spend time on work you cannot win or are not allowed to bid.",
            "I separate the real solicitations from the sources-sought and special-notice noise so your team only sees opportunities it can actually pursue.",
            "I watch amendments through a notice's life so a scope or date change gets a fresh, judged look.",
            "I qualify fit against your trades, capacity and geography, and I write a short, plain-language summary of each opportunity with a direct link back to the source on SAM.gov.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of a federal-scale inbox to triage, you get a short list of opportunities that actually fit and that you are eligible to pursue, each already read, qualified and linked back to the system of record. Your team prices and pursues. Nobody loses a morning to sources-sought noise or a win to a lapsed registration." },
          { type: "callout", text: "If you are still triaging the SAM.gov firehose yourself every morning, you are doing work I have already mastered. Let me show you, on a call, the eligible federal opportunities your current saved searches are missing in your own codes." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The fit coded one NAICS over",
        result: "A specialized federal service opportunity, found under a code the contractor never saved.",
        body: "A firm's SAM.gov saved searches were built around their primary NAICS. A requirement that fit them squarely was coded by the contracting office under an adjacent NAICS and a generic PSC, so no alert ever fired. Watching the way the office actually coded, rather than waiting on the saved-search match, surfaced the opportunity with time to prepare. Illustrative example.",
      },
      {
        title: "The sources-sought that was not a bid",
        result: "An estimator's week saved by reading the notice type before committing to a response.",
        body: "A contractor was about to invest serious time responding to what looked like a solicitation. It was a sources-sought notice, the government still testing the market, not a real opportunity yet. Identifying the notice type up front redirected that effort to a real, biddable requirement instead. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Do I still need my own SAM.gov registration?", a: "Yes, and it is mandatory. You need an active entity registration and a Unique Entity ID to do federal business, and it must be renewed annually. SAM.gov stays your authoritative source and registration. I work on top of it: I watch, read the statements of work, check eligibility and qualify fit, then hand you the opportunity with a direct link back." },
      { q: "Can you really catch what my SAM.gov saved searches miss?", a: "That is the entire point. Saved-search alerts fire on the NAICS and PSC codes you saved, and contracting officers code loosely. I track the codes that actually carry your work and watch the way offices truly file, so the fits coded one code over still reach you." },
      { q: "How do you handle set-asides and eligibility?", a: "I check the set-aside type and your eligibility before an opportunity reaches you, so you never spend time on work you are not allowed to bid, and you never skip a set-aside you actually qualify for. An alert cannot do that check. I do." },
      { q: "What about sources-sought and pre-solicitation notices?", a: "Those need interpreting, not just receiving. I separate the real solicitations from the market surveys, and when a sources-sought notice is worth responding to in order to shape a future requirement, I flag it as exactly that." },
      { q: "Does SAM.gov cover state and local work too?", a: "No, and that is a common and costly assumption. SAM.gov is the federal layer. Tens of thousands of state and local governments run their work through other platforms entirely. I treat SAM.gov as one watched source among many, scoped to your coverage." },
      { q: "Is this SAM.gov training or consulting?", a: "No. I am not here to teach you the platform, and I do not write or submit your proposals. I do the monitoring, reading, eligibility-checking and qualifying for you as an ongoing service, so your team spends its hours pursuing federal work that fits." },
    ],
  },

  "gsa-ebuy": {
    readMins: 16,
    intro:
      "GSA eBuy is where a lot of federal work quietly happens for Schedule holders, and it punishes anyone who is not watching it daily. If you hold a GSA Multiple Award Schedule, agencies send you requests for quotes through eBuy, routed by your Schedule, your Special Item Numbers and category, often on response windows measured in days. Miss the window and the work is gone with no second chance. I know eBuy the way you know your trade: how RFQs route, where the coverage gaps in your SINs hide work, and how the short clocks catch good firms flat-footed. This is the full picture, and how I make sure the RFQs meant for you never close unanswered because nobody was watching.",
    sections: [
      {
        id: "what-is-gsa-ebuy",
        heading: "What GSA eBuy is, and what it is not",
        blocks: [
          { type: "p", text: "GSA eBuy is the federal request-for-quote system that sits on top of the GSA Multiple Award Schedule program. When a federal agency wants to buy off a Schedule, it issues an RFQ through eBuy to the Schedule holders whose contracts cover what it needs. If you hold a Schedule, this is where a large share of your day-to-day federal work flows, and it flows fast." },
          { type: "p", text: "Here is what matters most. eBuy is a routing and quoting system. It delivers the RFQ to eligible holders, stores the requirement documents, and takes your response. What it does not do is decide which RFQs are worth your time, or make sure you saw the one that fit before its short window closed. It routes. It does not judge, and it does not chase you down." },
          { type: "callout", text: "eBuy routes RFQs to eligible Schedule holders. It does not qualify them for you, and it does not guarantee you saw the one that mattered before it closed. The distance between a routed RFQ and a judged, timely shortlist is the job I do." },
          { type: "p", text: "None of this is a knock on eBuy. It is the honest boundary between what an RFQ routing system can do and what a person watching daily, reading the requirement and knowing your shop can do. On a platform defined by short response windows, that boundary is measured in days, and days are exactly what most firms do not have to spare." },
          { type: "p", text: "It helps to be clear about how eBuy differs from an open notice board. On a public tendering site, the buyer broadcasts a notice and anyone who finds it can read it. eBuy is the opposite by design: it is a closed marketplace built on top of the Schedule contracts, and the requirement is pushed only to the holders whose contracts make them eligible. That gating is a feature for the government, which gets pre-vetted, pre-priced vendors, and it is a double-edged feature for you. It cuts the noise of work you could never deliver, and it also means that everything you do not hold the right coverage for is not just hard to find, it is structurally invisible. You cannot search your way to an RFQ that was never routed to you." },
        ],
      },
      {
        id: "who-posts-gsa-ebuy",
        heading: "Who posts on GSA eBuy",
        blocks: [
          { type: "p", text: "The buyers on eBuy are federal agencies buying through the Schedule program, and the vendors are the holders eligible to receive their RFQs. The behaviour that matters is how narrowly the routing works." },
          { type: "ul", items: [
            "Federal agencies and contracting offices buying off Schedule, which issue RFQs to the holders whose SINs match what they need.",
            "GSA Schedule holders, who receive only the RFQs their Schedule and SIN coverage make them eligible for.",
            "Schedule-based service firms and resellers, whose visibility is entirely defined by which SINs sit on their contract.",
          ] },
          { type: "p", text: "That structure is the whole story. Unlike an open notice board, eBuy is a gated channel: you see what your Schedule and SINs say you are eligible to see, and nothing else. A holder who carries the right Schedule but is missing a relevant SIN simply does not receive the RFQ, even when they could deliver the work perfectly. The gate is invisible from the inside, which is why coverage gaps go unnoticed until a competitor wins something you never saw." },
          { type: "h3", text: "Why the gated routing trips up good holders" },
          { type: "p", text: "The mistake I see most is assuming that holding a Schedule means seeing all the relevant work. It does not. Your SIN coverage is the filter, and if an agency's requirement falls under a SIN adjacent to the ones you hold, the RFQ routes to other firms and stays invisible to you. You are not losing those RFQs on price or capability. You are never seeing them at all." },
          { type: "p", text: "This is why a periodic look at your own SIN coverage is worth more than most holders realize. SINs are added to and removed from the Schedule program over time, agencies shift the SINs they buy under as categories are reorganized, and a contract written years ago may no longer carry the SINs the relevant work now routes through. A holder can be technically active and steadily current on price while quietly going dark on a category of RFQs because their coverage drifted out from under the way agencies now buy. None of that shows up as an error. It shows up as silence, and silence is exactly what a busy firm reads as a slow market rather than a coverage gap." },
        ],
      },
      {
        id: "how-gsa-ebuy-categorizes",
        heading: "How GSA eBuy categorizes and notifies",
        blocks: [
          { type: "p", text: "eBuy routes RFQs by Schedule, Special Item Number and category. When an agency posts a requirement, it selects the SINs that describe what it is buying, and the system delivers the RFQ to the holders whose contracts carry those SINs. Your visibility is therefore a direct function of your SIN coverage, and the agency's SIN choice has to line up with yours for the RFQ to reach you." },
          { type: "p", text: "That choice is made by a buyer describing their requirement in their terms, sometimes selecting a broad or neighbouring SIN rather than the exact one you would expect. A facilities requirement can route to a SIN adjacent to the ones you hold, and you will never know it existed. The routing is precise, which cuts both ways: it keeps you from receiving irrelevant noise, and it keeps you from receiving relevant work coded one SIN over." },
          { type: "callout", text: "On eBuy the SIN is chosen by the buyer, and your coverage is chosen by your Schedule. When those do not line up, the RFQ routes elsewhere and you never see it, even though you could have delivered it." },
          { type: "p", text: "The other defining feature is time. eBuy RFQs often carry short response windows, sometimes only a few days. The requirement detail lives in the attachments, not the summary, and reading those attachments and turning a quote around fast is the entire challenge. A holder not watching daily can have an RFQ arrive and close before they ever open it." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of GSA eBuy alerts",
        blocks: [
          { type: "p", text: "eBuy delivery is useful and, like every automated channel, limited in ways that bite hard on a fast-moving platform." },
          { type: "ul", items: [
            "You only receive the RFQs your Schedule and SINs make you eligible for, so a requirement routed to an adjacent SIN you do not hold never reaches you at all.",
            "Short response windows punish anyone not watching daily, because an RFQ can arrive and close inside a few days while you are heads-down on delivery.",
            "Coverage gaps in your SINs create invisible work: you cannot miss what you were never told about, and you have no way of knowing what routed elsewhere.",
            "The RFQ tells you a requirement exists. It does not tell you whether the scope fits your delivery model, whether the timeline is realistic, or whether the requirement quietly favours an incumbent holder.",
          ] },
          { type: "p", text: "None of that is a flaw in the channel. eBuy is built to route to eligible holders quickly, and it does. But a routed RFQ is a starting gun, not a scouting report, and the gun goes off whether or not anyone on your side is in the room to hear it." },
          { type: "p", text: "The timing dimension is what makes eBuy unforgiving in a way slower platforms are not. On an open tender with weeks of lead time, a notice missed for a day or two is recoverable. On eBuy, where a quote may be due in a handful of days, a day lost to delivery work is a meaningful fraction of the entire window, and an RFQ that surfaces with two days left often cannot be responded to at all even when it fits perfectly. The platform is not punishing you for missing the work. It is punishing you for the gap between when the RFQ arrived and when a human on your side actually looked at it. Closing that gap is not a matter of caring more. It is a matter of someone whose job is to look every day, so that no part of a short window is spent in silence." },
        ],
      },
      {
        id: "search-registration-access",
        heading: "Access, SIN coverage and the daily watch",
        blocks: [
          { type: "p", text: "eBuy is gated by your Schedule, so the friction here is less about searching and more about coverage and timing." },
          { type: "ul", items: [
            "Visibility is gated by your Schedule and SIN coverage, so the work you can even see is decided before any RFQ is posted, by what sits on your contract.",
            "RFQ requirements live in attachments that take time to read, and that time competes directly with the short response clock.",
            "Quotes turn around fast, which means an RFQ found late is often an RFQ you cannot realistically respond to even if it fits perfectly.",
            "Watching daily is not optional on eBuy, and daily watching is exactly what a busy holder running delivery cannot reliably sustain in-house.",
          ] },
          { type: "p", text: "The capacity to watch and read daily is also scarce. The people who can read a requirement and judge fit quickly are the same estimating staff firms already struggle to hire and keep." },
          { type: "stat", id: "estimator-hiring" },
          { type: "p", text: "And the time cost of every response is real. Even before you win anything, reading and qualifying federal RFQs eats hours your team does not have to spare." },
          { type: "stat", id: "response-hours" },
          { type: "p", text: "On a winning submission the hours climb further, which is exactly why you do not want your scarce people spending them on RFQs that were never a fit." },
          { type: "stat", id: "winning-hours" },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss opportunities on GSA eBuy",
        blocks: [
          { type: "p", text: "The misses on eBuy follow a tight, recognizable pattern, and almost all of them come down to coverage and timing." },
          { type: "ol", items: [
            "An RFQ routes to a SIN adjacent to the ones the holder carries, so it never arrives and the work is invisible.",
            "An RFQ does arrive, but with a short window, and it closes before anyone heads-down on delivery opens it.",
            "The holder sees the RFQ, glances at the summary, and never reads the attachments where the real requirement and the catch live.",
            "A requirement quietly favours an incumbent holder, and a firm spends precious hours on a quote that was never winnable, while missing one that was.",
            "Nobody is watching daily, so the cadence of fast-closing RFQs simply outpaces a team focused on the work it already has.",
          ] },
          { type: "p", text: "Every one of these is preventable. Not one of them is prevented by logging in when you happen to remember. They are prevented by someone watching eBuy daily against your Schedule and SINs, reading the attachments, judging fit, and flagging the fast-closing ones first." },
          { type: "p", text: "It is worth naming the compounding cost, because it is the part holders feel without quite diagnosing. Each of these misses is invisible in isolation. One RFQ that closed before you looked, one routed to a SIN you did not realize you were missing, one quote spent on a requirement that was always the incumbent's: any single instance reads as ordinary bad luck. It is the accumulation that hurts. Over a year, a holder who is reliably a step behind the eBuy clock and a SIN short of full coverage will conclude their Schedule is underperforming, when in fact the contract is fine and the watching is the gap. That misdiagnosis is expensive in its own right, because it sends firms chasing new Schedules or new categories to fix a problem that was never about coverage breadth, only about whether anyone was reading the channel in time." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where GSA eBuy fits in the wider market",
        blocks: [
          { type: "p", text: "eBuy is a specialized channel: it only matters if you hold a Schedule, and it only routes Schedule-based federal work. That makes it powerful for the firms it serves and irrelevant for everything outside the Schedule program, which is most of the public market." },
          { type: "p", text: "Even within federal, eBuy sits alongside the broader opportunity feed on SAM.gov, where open-market federal solicitations live. Beside both of those sit the entire state and local landscape, which never touches the Schedule program at all. A Schedule holder who watches only eBuy is watching one gated channel of one layer of a far larger market." },
          { type: "p", text: "I say this so the role of eBuy is clear. For a Schedule holder it is a critical daily channel that cannot be ignored, and it is also a narrow one. The wider public market is fragmented across many platforms, and coverage of it is its own discipline, which is why I treat eBuy as one watched channel among many, weighted heavily for the holders who depend on it." },
          { type: "p", text: "There is also a useful relationship between eBuy and the award data on USASpending. The agencies issuing RFQs through eBuy leave a trail of what they have bought off Schedule before, from whom, and at what scale. Reading that history tells you which agencies are active buyers in your category and which of your competitors are winning their RFQs, which in turn tells you where it is worth making sure your coverage and your watching are tight. eBuy tells you what is being quoted right now. The award record tells you the pattern behind it. A holder who reads both is positioning, not just reacting, and that is the difference between a Schedule that produces steady work and one that mostly sits idle." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement GSA eBuy",
        blocks: [
          { type: "p", text: "I do not replace eBuy, and I would be suspicious of anyone who claimed to. It stays the channel that routes your Schedule RFQs and the place you respond. I sit on top of it and do the part it was never built to do." },
          { type: "ul", items: [
            "I watch eBuy daily against your Schedule and SINs, so the fast-closing RFQs get caught while there is still time to act, not after they close.",
            "I read each RFQ's requirements and attachments, the timeline and the conditions, so the real scope and the catches surface before you commit your scarce people.",
            "I flag the fast-closing RFQs first, in order of how little time is left, so nothing winnable expires in your inbox.",
            "I qualify fit against your delivery model and capacity, and I flag when a requirement looks built for an incumbent so you do not burn hours on a quote you cannot win.",
            "I write a short, plain-language summary of each RFQ with a direct link back to the source on eBuy so you respond on the system of record.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of a fast-moving channel you can only watch when delivery lets you, you get the RFQs that fit, read and qualified and ordered by urgency, while there is still time to respond. Your team quotes the right work. Nobody loses a winnable RFQ to a clock that ran out before anyone looked." },
          { type: "callout", text: "If eBuy RFQs are closing before your team gets to them, the problem is daily coverage, not effort. That is exactly what I fix. Let me show you, on a call, how I would watch your Schedule and SINs." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The RFQ on the adjacent SIN",
        result: "A Schedule requirement caught despite routing to a SIN the holder was not certain they carried.",
        body: "A holder assumed they were seeing all the relevant eBuy traffic for their work. A requirement they could deliver perfectly was routing to a SIN at the edge of their coverage, and they had no visibility into how much was passing them by. Mapping their actual SIN coverage against the RFQ flow surfaced work they had been missing entirely. Illustrative example.",
      },
      {
        title: "The three-day window",
        result: "A fast-closing RFQ responded to in time because someone was watching daily.",
        body: "An RFQ that fit the holder squarely arrived with a short response window while their team was heads-down on active delivery. Because eBuy was being watched daily and the RFQ was flagged by urgency, it reached a decision-maker with enough time to quote instead of expiring unopened. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Do I still need my own eBuy and Schedule access?", a: "Yes. eBuy stays the channel that routes your RFQs and the place you respond, and it is gated by your GSA Schedule. I work on top of it: I watch daily against your Schedule and SINs, read the RFQs, judge fit and flag the fast-closing ones, then hand you the opportunity with a direct link back." },
      { q: "Can you catch RFQs routed to SINs I might not even hold?", a: "I can show you where your SIN coverage is leaving work invisible. eBuy only routes to your covered SINs, so requirements on adjacent SINs never reach you. Mapping that gap is often the single most valuable thing I do for a Schedule holder." },
      { q: "How do you handle the short response windows?", a: "Daily watching is the answer. I catch RFQs as they post and flag the fast-closing ones first, in order of how little time is left, so nothing winnable expires in an inbox while your team is busy with delivery." },
      { q: "Will you tell me when an RFQ looks built for an incumbent?", a: "Yes. Reading the requirement and the conditions is how you spot when a quote was never really winnable. I flag those so your scarce estimating time goes to RFQs you can actually win." },
      { q: "Does eBuy cover all my federal work?", a: "No. eBuy only routes Schedule-based work. Open-market federal solicitations live on SAM.gov, and state and local work lives elsewhere entirely. I treat eBuy as one important channel among many, weighted heavily because it moves fast and matters to Schedule holders." },
      { q: "Is this eBuy training or quote-writing?", a: "No. I am not here to teach you the platform, and I do not write or submit your quotes. I do the daily monitoring, reading and qualifying for you as an ongoing service, so your team spends its hours quoting the RFQs that fit." },
    ],
  },

  usaspending: {
    readMins: 16,
    intro:
      "USASpending is not an opportunity feed, and the contractors who treat it like one miss the point entirely. It is the federal government's award-data system: who won, how much, from which agency, and when. Read backward, that history tells you where the work lives, who holds it now, and roughly when it comes up for grabs again. I use USASpending the way a scout uses game film: to find incumbents, time recompetes, and size up how crowded a given lane really is before you commit. This is the full picture. What it is, who is in it, how it organizes award data, where the raw numbers mislead, and how I fold that intelligence into the live opportunities I send you.",
    sections: [
      {
        id: "what-is-usaspending",
        heading: "What USASpending is, and what it is not",
        blocks: [
          { type: "p", text: "USASpending is the United States federal government's official source of award data. It records federal spending in detail: which agency awarded a contract, to which recipient, for how much, under which codes, and over what period. Anyone can query it through the site or its API. It is the public ledger of where federal money actually went." },
          { type: "p", text: "Here is the distinction that changes everything. USASpending is historical award data, not an opportunity feed. It does not post solicitations, and it will never tell you what is open today. It tells you what already happened. That sounds like a limitation, and used carelessly it is, but read with intent it is some of the most valuable intelligence in the federal market, because the past is how you predict the future." },
          { type: "callout", text: "USASpending shows you who won, how much and when. It never shows you what is open. The skill is reading award history backward into where to aim next, and that reading is the job I do." },
          { type: "p", text: "None of this is a knock on USASpending. It is the honest boundary between what an award-data system can do and what a person who reads that data with a strategy in mind can do. The data is comprehensive. The interpretation is everything, and interpretation is not something the platform provides." },
          { type: "p", text: "It is worth being concrete about why historical data is predictive in federal contracting specifically. Federal requirements are rarely one-time purchases. Agencies buy the same services and supplies in cycles, structure contracts with base periods and option years, and recompete the work when those periods run out. That regularity is precisely what makes the past a map of the future here in a way it would not be in a more chaotic market. A contract with a five-year term that started three years ago is telling you, fairly loudly, that the same work is likely to come back to market in roughly two years, to the same agency, probably under the same codes. The platform records that term. It does not draw the arrow forward to the recompete, which is the part that turns a record into a plan." },
        ],
      },
      {
        id: "who-is-in-usaspending",
        heading: "Who is in USASpending",
        blocks: [
          { type: "p", text: "USASpending is not a place buyers post; it is a record of what they did. The parties that show up in the data are the ones whose behaviour you can study." },
          { type: "ul", items: [
            "Federal agencies, recorded as the awarding bodies, whose buying patterns become visible across years of awards.",
            "Recipients, the prime contractors and vendors who won the work, including the incumbents you most want to understand.",
            "Subawards, where prime contractors pass work down, which shows you teaming relationships and where you might fit as a sub.",
            "The codes and time stamps that tie each award to a NAICS, a PSC, an agency and a period of performance.",
          ] },
          { type: "p", text: "That structure is what makes it useful. Reading the award history of a single agency tells you what they buy, how often, at what scale, and from whom. Reading the history of a single recipient tells you who your competition really is and what they hold. The data does not announce these patterns. You have to go looking for them, which is exactly why the platform rewards interpretation over browsing." },
          { type: "h3", text: "Why the data trips up good contractors" },
          { type: "p", text: "The mistake I see most is opening USASpending expecting it to tell them what to bid, finding only history, and closing it again. The value is never on the surface. It is in cross-referencing a recompete date against an incumbent's award, or in noticing that one agency buys a service every three years from the same firm. That is analysis, not browsing, and it is why most contractors never get anything out of the platform at all." },
          { type: "p", text: "Subaward data deserves a closer look, because it answers a question a lot of contractors never think to ask: how do I get in when the prime contract is locked up by someone else. When a large prime wins a federal contract, much of the actual work is often passed down to subcontractors, and those subawards are recorded too. Reading them shows you which primes routinely subcontract the kind of work you do, who they use now, and at what scale. That is a teaming map. A recompete you cannot win as a prime may be very winnable as a sub on someone else's team, and the only way to know which primes to approach, and well before the solicitation drops, is to read who has been passing that work down and to whom." },
        ],
      },
      {
        id: "how-usaspending-categorizes",
        heading: "How USASpending organizes award data",
        blocks: [
          { type: "p", text: "USASpending organizes awards by agency, recipient, NAICS and PSC code, and time, queryable through the website and a public API. You can slice the data by who awarded it, who won it, what it was classified as, and when the period of performance runs. That structure is what lets you turn a wall of awards into a usable picture." },
          { type: "p", text: "The most useful dimension is time. A period of performance has an end, and an end is a recompete. By reading when current contracts expire, you can anticipate when the same work is likely to come back to market, often many months before any notice appears on SAM.gov. That lead time is the whole prize: it is the difference between scrambling when a solicitation drops and positioning for it well in advance." },
          { type: "callout", text: "The single most valuable thing in USASpending is period-of-performance data. An expiring contract is a future opportunity with a rough date attached, and that date is months ahead of any solicitation." },
          { type: "p", text: "The catch is that none of this is handed to you. The codes that classify an award are the same NAICS and PSC a contracting officer chose, with all the looseness that implies. Recompete timing has to be inferred from periods of performance, options and modifications. The data supports the analysis. It does not perform it, and performing it well takes practice most contractors do not have time to build." },
        ],
      },
      {
        id: "alert-limitations",
        heading: "The limits of USASpending as a signal",
        blocks: [
          { type: "p", text: "USASpending has no alerts in the opportunity sense, and that absence is itself the limitation worth naming for a working contractor." },
          { type: "ul", items: [
            "It is historical award data, not a notice feed, so it will never tell you what is open right now. Nothing in it expires onto your desk as an action.",
            "Raw data needs interpretation to be useful, and the interpretation is where almost all the value sits and where almost all contractors stop.",
            "It tells you what happened, not what is open, so it complements opportunity monitoring rather than replacing it. You still have to watch SAM.gov and the rest for the live notice.",
            "Recompete timing is inferred, not stated, and a contract can be extended, modified or re-scoped in ways that move the date you predicted.",
          ] },
          { type: "p", text: "None of that is a flaw. USASpending is doing exactly what a transparency ledger should do. But a ledger is a research source, not a tripwire, and research only pays off when someone sits down and does it on a schedule with your pursuit list in mind." },
          { type: "p", text: "There is also a lag to respect. Award data is reported and posted after the fact, and the most recent activity is the least complete picture, because not every modification, option exercise or subaward has filtered through yet. That does not undermine the platform, but it does mean the data is best read for established patterns rather than for the freshest single transaction. The strength of USASpending is the multi-year trend: the agency that has bought this work like clockwork, the incumbent whose hold has or has not loosened, the recompete cadence that repeats. Reading it for those durable patterns, rather than treating the latest entry as gospel, is the difference between intelligence you can plan around and a snapshot that may still be settling." },
        ],
      },
      {
        id: "search-registration-access",
        heading: "Querying, access and the interpretation gap",
        blocks: [
          { type: "p", text: "USASpending is open to anyone, with no registration to bid and a public API. The friction is not access. It is the skill and time the data demands." },
          { type: "ul", items: [
            "Querying award data well takes practice: knowing which codes, agencies and time ranges to slice, and how to read options and modifications.",
            "Patterns such as incumbents and recompete timing are not handed to you; they have to be assembled from many awards.",
            "It complements, rather than replaces, opportunity monitoring, so it is one half of a workflow whose other half lives on the opportunity platforms.",
            "The volume of federal award data is enormous, and without a focused question it is easy to drown in numbers that lead nowhere.",
          ] },
          { type: "p", text: "The federal market this data describes is genuinely large, which is why the intelligence is worth the effort to extract." },
          { type: "stat", id: "us-federal-spend" },
          { type: "p", text: "And the competition picture the data helps you read is more favourable than most contractors assume, because federal competitions are often far thinner than the headline volume suggests." },
          { type: "stat", id: "single-bid-frequency" },
          { type: "p", text: "Read that figure alongside an incumbent's award history and you start to see where a recompete might be winnable by a prepared challenger rather than locked up. That is the kind of inference USASpending supports and never states, and assembling it is the work." },
        ],
      },
      {
        id: "how-contractors-miss",
        heading: "How contractors miss the value in USASpending",
        blocks: [
          { type: "p", text: "The misses with USASpending are not missed notices, because it has none. They are missed intelligence, and they follow a recognizable pattern." },
          { type: "ol", items: [
            "A contractor opens it expecting an opportunity feed, finds only history, and never returns, leaving all the intelligence on the table.",
            "They never read period-of-performance data, so a recompete they could have prepared for months ahead arrives as a surprise on SAM.gov.",
            "They do not study incumbents, so they walk into a pursuit without knowing who holds the work, at what scale, or how entrenched the relationship is.",
            "They take the codes at face value, missing that a relevant award was classified under an adjacent NAICS or a generic PSC.",
            "They treat it as a replacement for opportunity monitoring rather than a complement, and miss the live notice while studying the history.",
          ] },
          { type: "p", text: "Every one of these is preventable. The fix is not more browsing. It is someone reading the award data with your pursuit list in mind, on a schedule, and folding what they learn into the live opportunities you are deciding whether to chase." },
          { type: "p", text: "The deeper cost of ignoring the award data is strategic, not tactical. A contractor who never reads it is making every federal decision with no memory of the market: every solicitation looks equally fresh, every incumbent equally beatable or equally entrenched, every agency equally worth courting. That is not a level playing field, it is a blindfold, and it puts you at a standing disadvantage against competitors who do read the history and therefore know which doors are worth knocking on and which are wired shut. The data is public, free and open to everyone, which means the firms that mine it are not getting a secret. They are simply doing the reading their competitors could do and do not. Closing that gap is the cheapest edge available in federal contracting, and it is squandered by treating USASpending as a curiosity rather than a standing input." },
        ],
      },
      {
        id: "where-it-fits",
        heading: "Where USASpending fits in the wider workflow",
        blocks: [
          { type: "p", text: "USASpending is the intelligence half of a two-part federal workflow. The other half is opportunity monitoring on SAM.gov, eBuy and the rest. One tells you what is open. This one tells you what is worth pursuing and why, by showing you the history behind it." },
          { type: "p", text: "Used together they are far stronger than either alone. A live solicitation on SAM.gov is more winnable when you already know, from USASpending, who the incumbent is, how big the contract was, and whether the recompete timing lines up. A recompete you spotted early in the award data is more actionable once the live notice confirms it. The two feeds answer different questions, and the answer you actually need usually requires both." },
          { type: "p", text: "I say this so the role of USASpending is clear. It is not a place to find opportunities, and treating it as one is the core mistake. It is a place to understand opportunities, to time them, and to size their competition, which is why I treat it as a standing research input that sharpens every live opportunity I send you rather than a feed I monitor for notices." },
          { type: "p", text: "The same record also sharpens a go-or-no-go decision, which is where federal pursuit money is most often wasted. Knowing that an incumbent has held a given requirement through three consecutive recompetes, never lost it, and grew the value each time is a strong signal to spend your hours elsewhere. Knowing that a requirement has changed hands twice in five years, or that the incumbent only just won it on a single bid, is a signal that the door is open. None of that is on the live solicitation when it posts. It is in the award history, which is why reading USASpending before you commit is one of the cheapest forms of insurance a federal contractor has against pouring effort into a pursuit that was decided before it started." },
        ],
      },
      {
        id: "how-i-help",
        heading: "How I complement USASpending",
        blocks: [
          { type: "p", text: "I do not replace USASpending, and I would be suspicious of anyone who claimed to. It stays the public ledger of federal awards. I sit on top of it and do the analysis it supports but never performs, then fold the result into the live opportunities I bring you." },
          { type: "ul", items: [
            "I read award history to see who holds the work in your lane, at what scale, and how entrenched they are, so you walk into a pursuit knowing your competition.",
            "I read period-of-performance data to anticipate when contracts recompete, so you are positioning months before a solicitation appears rather than reacting when it drops.",
            "I use the award record to size up competition and time your pursuit, including reading where a recompete looks genuinely winnable rather than locked up by an incumbent.",
            "I cross-check the codes so an award classified under an adjacent NAICS or a generic PSC still informs the picture.",
            "I fold that intelligence directly into the live opportunities I send you, so each one arrives with the context that decides whether it is worth your time.",
          ] },
          { type: "p", text: "The result is the whole point. Instead of a public ledger you never have time to mine, you get its intelligence delivered as part of every opportunity I qualify: who holds it, when it recompetes, how crowded the lane is, and why it does or does not fit you. Your team pursues with context. Nobody walks into a recompete blind, and nobody is surprised by a solicitation they could have seen coming." },
          { type: "callout", text: "If federal recompetes keep surprising you when the notice drops, the intelligence to see them coming was sitting in the award data all along. Let me show you, on a call, what USASpending says about the incumbents in your lane." },
        ],
      },
    ],
    caseStudies: [
      {
        title: "The recompete you could see coming",
        result: "A federal opportunity prepared for months early by reading the incumbent's period of performance.",
        body: "A contractor repeatedly learned about federal opportunities in their lane only when the solicitation dropped, leaving no time to position. Reading the incumbent's award history and period-of-performance data in USASpending flagged a likely recompete window well in advance, turning a scramble into a planned pursuit. Illustrative example.",
      },
      {
        title: "The thin lane",
        result: "A pursuit pursued with confidence after the award history showed the field was less crowded than feared.",
        body: "A firm assumed a recurring federal requirement was locked up and not worth chasing. Reading the award record showed the incumbent was beatable and the competition thinner than the headline volume suggested. That context turned a dismissed opportunity into a real, prepared pursuit. Illustrative example.",
      },
    ],
    faqs: [
      { q: "Is USASpending where I find federal opportunities?", a: "No, and this is the core misunderstanding. USASpending is historical award data: who won, how much, from which agency and when. It never shows what is open. I use it to understand and time opportunities, and I monitor SAM.gov, eBuy and the rest for the live notices." },
      { q: "What can you actually learn from award data?", a: "A lot. Who holds the work in your lane and at what scale, when their contracts recompete, how crowded the lane really is, and whether a recompete looks winnable rather than locked up. That intelligence shapes whether a live opportunity is worth your time." },
      { q: "How does recompete timing work if it is not stated?", a: "It is inferred from period-of-performance data, options and modifications. An expiring contract is a future opportunity with a rough date attached, often months ahead of any solicitation. I read those dates so you can position early instead of reacting late." },
      { q: "Do you monitor USASpending for new postings?", a: "There are no postings to monitor; it is a ledger, not a feed. I treat it as a standing research input that sharpens every live opportunity I send you, not as something I watch for notices." },
      { q: "Do I need to register on USASpending?", a: "No. It is open to anyone, with a public API and no registration to bid. The barrier is not access, it is the time and skill to query it well and read the patterns. That reading is what I do for you." },
      { q: "Is this USASpending training or analysis consulting?", a: "It is neither a course nor a standalone report, and I do not write or submit your proposals. I fold the award-data intelligence into the live federal opportunities I qualify and send you, as an ongoing service, so each one arrives with the context that decides whether to pursue it." },
    ],
  },
};
