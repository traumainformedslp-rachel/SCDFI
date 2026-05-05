/**
 * SCDFI Domain Definitions & Item Banks — v0.3
 *
 * All item language is ORIGINAL.
 *
 * Changes from v0.2:
 *   - Clinician and Teacher are separate versions sharing the same item bank
 *     but with different per-domain context prompts (clinicianContext / teacherContext)
 *   - Self-report is now unified: all first-person Likert statements (no scenario mix)
 *   - Teacher version adds school-specific observation guidance per domain
 */

import { SECTION_COLORS } from "./constants";

const DOMAINS = [
  {
    id: "reg", n: 1, short: "Self-Reg", title: "Self-Regulation & Emotional Availability",
    icon: "🌱", color: "#440154", colorKey: "reg",
    desc: "Capacity to maintain a calm, organized state for social engagement and recover from dysregulation",
    fw: "LSP Emotional Regulation • FEDC Cap 1 • BESSI Emotional Resilience • R&W co-regulation",
    clinicianContext: "Observe during transitions between structured and unstructured activities, during novel or demanding tasks, and after disruptions to routine. Note co-regulation strategies used by the clinician.",
    teacherContext: "Observe during morning arrival, transitions between classes, after recess, during independent seatwork, and after unexpected schedule changes. Note which adults or routines help the student recover.",
    items: [
      "Maintains a calm, organized state during familiar social routines for 2+ minutes",
      "Recovers from dysregulation within a reasonable timeframe with partner support",
      "Recovers from dysregulation within a reasonable timeframe without partner support",
      "Orients to sensory and social aspects of the environment",
      "Sustains a regulated state in the presence of moderate sensory input",
      "Signals dysregulation through recognizable communicative indicators",
    ],
    parent: [
      "My child stays calm during everyday activities",
      "My child can calm down after being upset — with my help",
      "My child can calm down after being upset — on their own",
      "My child shows interest in what's happening around them",
      "My child can handle moderate noise or activity without becoming overwhelmed",
    ],
    self: [
      "When I'm feeling overwhelmed, I can usually find a way to calm myself down",
      "I can stay calm in situations with a lot of noise or activity around me",
      "When I get upset, I can usually recover without someone else's help",
    ],
  },
  {
    id: "orient", n: 2, short: "Social Orient.", title: "Social Orientation & Engagement",
    icon: "👥", color: "#481567", colorKey: "orient",
    desc: "Orientation toward people, curiosity about social partners, sustained social attention",
    fw: "LSP #1 Object vs. People • FEDC Cap 1–2 • BESSI Social Engagement",
    clinicianContext: "Observe balance of orientation toward objects vs. people during free play, structured tasks, and shared activities. Note whether the individual seeks out social partners spontaneously.",
    teacherContext: "Observe during group instruction, partner work, free choice time, lunch, and recess. Note whether the student orients toward peers vs. materials/devices and whether social interest varies by context.",
    items: [
      "Orients to people in the environment (eye gaze, body orientation)",
      "Demonstrates social curiosity toward others (approaches, watches, moves closer)",
      "Sustains attention to a social partner during a shared activity for extended periods",
      "Establishes and maintains joint attention between partner and shared materials",
      "Responds to a partner's overtures with observable positive affect",
    ],
    parent: [
      "My child notices other people in the room",
      "My child seems curious about other people",
      "My child pays attention to people during activities — not just toys or objects",
      "My child enjoys interacting with familiar people",
    ],
    self: [
      "I'm usually interested in what other people are doing around me",
      "When something interesting is happening with other people, I want to check it out",
    ],
  },
  {
    id: "ja", n: 3, short: "Joint Attn", title: "Joint Attention & Shared Focus",
    icon: "🔗", color: "#482677", colorKey: "ja",
    desc: "Triadic attention and shared focus across increasing distances and competing stimuli",
    fw: "LSP Joint Attention (trunk) • LSP #9 • FEDC Cap 2 • R&W localization sequence",
    clinicianContext: "Observe gaze coordination during shared book reading, construction tasks, and joint play. Probe with pointing and gaze shifts. Note distance at which shared attention breaks down.",
    teacherContext: "Observe during whole-class instruction (teacher points to board), partner reading, science demos, and show-and-tell. Note whether the student follows teacher gaze/point from their seat and whether shared attention persists with classroom-level distractions.",
    items: [
      "Coordinates gaze between a social partner and a shared object or event",
      "Follows a social partner's point, gaze, or head turn to a referent",
      "Directs a partner's attention to an object or event of interest (showing, pointing, giving)",
      "Maintains shared focus with a partner during joint activity for extended periods",
      "Attends to partner's bids and cues at increasing physical distances",
      "Maintains shared focus with moderate to high attentional competition",
    ],
    parent: [
      "My child looks back and forth between me and something interesting",
      "My child points or shows me things they find interesting",
      "When I point at something, my child looks where I'm pointing",
      "My child can pay attention to me from across the room",
      "My child can stay focused during an activity even with distractions",
    ],
    self: [
      "When I'm doing something with someone, I can usually tell what they're paying attention to",
      "I can focus on what someone is telling me even when there's noise or activity around us",
    ],
  },
  {
    id: "learn", n: 4, short: "Social Learn", title: "Social Learning & Imitation",
    icon: "🪞", color: "#453781", colorKey: "learn",
    desc: "Capacity to learn through observation of social models, imitation, and rehearsal",
    fw: "LSP #2 Social Models • FEDC Cap 3–4 • R&W joint action routines",
    clinicianContext: "Observe during modeled activities (clinician demonstrates, then waits). Note latency to imitate, accuracy of imitation, and whether imitation occurs with novel vs. familiar actions.",
    teacherContext: "Observe during teacher modeling (math procedures, writing demonstrations, science experiments), peer modeling, and social routines (lining up, raising hand). Note whether the student learns from watching classmates vs. only from direct instruction.",
    items: [
      "Attends to a partner's actions and use of objects during modeled demonstrations",
      "Attends to a partner's nonverbal cues during social models",
      "Spontaneously imitates a partner's meaningful actions with objects",
      "Spontaneously imitates or approximates a partner's verbal communication",
      "Follows a partner's communicative lead during a demonstrated social routine",
      "Applies previously modeled skills in novel but related contexts",
    ],
    parent: [
      "My child watches what other people do during activities",
      "My child copies other people's actions or words after watching them",
      "My child takes turns during activities shown to them by someone else",
    ],
    self: [
      "I learn a lot by watching how other people handle social situations",
      "When someone shows me a new way to do something, I can usually pick it up and try it myself",
    ],
  },
  {
    id: "multi", n: 5, short: "Multi-Partner", title: "Multi-Partner Social Awareness",
    icon: "👂", color: "#3f4788", colorKey: "multi",
    desc: "Ability to attend to and respond to cues from multiple social partners simultaneously",
    fw: "LSP #3 Multiple Partners • FEDC Cap 4 • BESSI Teamwork",
    clinicianContext: "Observe during small group activities (3+ participants). Note whether the individual monitors multiple partners or fixates on one. Probe by having different partners initiate.",
    teacherContext: "Observe during group projects, class discussions, cooperative learning, and recess games. Note whether the student tracks contributions from multiple classmates or only responds to one preferred peer or the teacher.",
    items: [
      "Attends to and monitors actions of more than one partner during shared activity",
      "Anticipates the actions or contributions of multiple partners in a group routine",
      "Imitates or approximates actions of multiple partners (not only one preferred partner)",
      "Contingently responds and reciprocates with multiple partners within shared activity",
    ],
    parent: [
      "My child notices what multiple people are doing during group activities",
      "My child copies or joins in with what multiple people are doing",
      "My child starts activities that were introduced by different people",
    ],
    self: [
      "In a group, I can keep track of what different people are saying and doing",
      "I can follow a group discussion even when several people are contributing",
    ],
  },
  {
    id: "flex", n: 6, short: "Flexibility", title: "Flexibility & Adaptation",
    icon: "🔄", color: "#33568b", colorKey: "flex",
    desc: "Capacity to tolerate and participate in anticipated and unanticipated changes",
    fw: "LSP #4 Flexibility • FEDC Cap 6 • DSM-5 ASD severity mapping • BESSI Adaptability",
    clinicianContext: "Introduce both anticipated changes (warn before modifying a routine) and unanticipated changes (change materials or sequence without warning). Note regulation response and recovery time for each.",
    teacherContext: "Observe during schedule changes, substitute teachers, fire drills, assembly days, changes to seating, and modified assignments. Note the difference between the student's response to forewarned vs. surprise changes.",
    items: [
      "Attends to changes in familiar routines introduced by social partners",
      "Tolerates changes to familiar routines while maintaining a regulated state",
      "Actively participates in modified familiar routines introduced by partners",
      "Maintains engagement when anticipated (forewarned) changes are introduced",
      "Maintains engagement when unanticipated (unexpected) changes are introduced",
      "Demonstrates varied/flexible actions with familiar and novel objects",
      "Engages with a range of social partners — not only preferred individuals",
    ],
    parent: [
      "My child notices when something about a familiar routine has changed",
      "My child stays calm when small, expected changes happen",
      "My child stays calm when unexpected changes happen",
      "My child can use toys and objects in more than one way",
    ],
    self: [
      "When plans change unexpectedly, I can usually adjust without getting too stressed",
      "I can go along with changes even when I'd rather stick to the original plan",
    ],
  },
  {
    id: "shared", n: 7, short: "Shared Ctrl", title: "Shared Control & Problem-Solving",
    icon: "🤝", color: "#26828e", colorKey: "shared",
    desc: "Capacity to share the lead and collaboratively problem-solve within shared activities",
    fw: "LSP #5 Shared Control • FEDC Cap 4 • SSF Negotiation Skill",
    clinicianContext: "Observe during turn-taking games, co-construction tasks, and activities where the clinician shifts between leading and following. Note tolerance for partner's agenda and ability to negotiate.",
    teacherContext: "Observe during partner and group work, collaborative projects, playground negotiations, and shared materials situations. Note whether the student insists on controlling the activity or can share leadership.",
    items: [
      "Tolerates a social partner taking the lead in a shared activity",
      "Sustains participation in activities initiated by another partner",
      "Collaboratively takes turns leading and following within a shared activity",
      "Waits for and anticipates socially appropriate opportunities to take the lead",
      "Engages in shared problem-solving with a partner",
    ],
    parent: [
      "My child only plays with others if they are in charge of the activity",
      "My child will join in when someone else introduces an activity",
      "My child takes turns being the leader during activities with others",
    ],
    self: [
      "I'm okay with letting someone else take the lead in a group activity",
      "When I disagree with someone about what to do, I can usually find a compromise",
    ],
  },
  {
    id: "interact", n: 8, short: "Interaction", title: "Interaction Style: Init / Maint / Respond",
    icon: "💬", color: "#1f9e89", colorKey: "interact",
    desc: "Range and intentionality across initiating, maintaining, and responding to interactions",
    fw: "LSP #6 A/B/C • FEDC Cap 3–4 • BESSI Conversational & Expressive Skill",
    clinicianContext: "Track the balance of initiating, maintaining, and responding across structured and unstructured activities. Use communicative temptations and environmental arrangement to elicit initiations. Note range of communicative functions beyond requesting.",
    teacherContext: "Observe during morning meeting, class discussions, partner work, recess, and lunch. Note whether the student initiates with peers (not only adults), maintains conversations beyond one exchange, and responds when addressed in group contexts.",
    items: [
      "[A] Uses nonverbal/verbal means to initiate interactions (showing, greeting, requesting)",
      "[A] Spontaneously initiates across a range of communicative functions",
      "[B] Uses nonverbal/verbal means to sustain interactions (commenting, turn-taking)",
      "[B] Spontaneously maintains reciprocal interaction for extended exchanges",
      "[C] Uses nonverbal/verbal means to respond to partners (answering, contingent responses)",
      "[C] Spontaneously responds to partner's initiations across varied contexts",
    ],
    parent: [
      "My child starts interactions with people (brings a toy, waves, reaches out)",
      "My child responds when someone communicates with them",
      "My child keeps an interaction going back and forth for a while",
      "My child interacts for many reasons — not only to get things they need",
    ],
    self: [
      "I usually start conversations with people rather than waiting for them to come to me",
      "When someone is talking to me, I can keep the conversation going back and forth",
      "I interact with people for lots of reasons — not just when I need something",
    ],
  },
  {
    id: "comm", n: 9, short: "Communic.", title: "Communication: Symbolic, Generative, Intentional",
    icon: "🗣️", color: "#35b779", colorKey: "comm",
    desc: "Use of intentional, symbolic, and increasingly generative communication forms",
    fw: "LSP #7 Verbal/Symbolic • FEDC Cap 5 • BESSI Expressive Skill • Prizant & Rydell echolalia",
    clinicianContext: "Document the individual's primary communication modality (speech, sign, AAC, gestalt/echoic). Note the proportion of generative vs. non-generative (echoic, scripted) output. Track communication across functions: requesting, commenting, protesting, greeting, labeling, narrating.",
    teacherContext: "Observe communication during academic instruction (answering questions, contributing to discussion), social interactions (lunch, recess), and functional routines (asking for help, requesting materials). Note whether the student uses flexible language vs. scripted/echoic phrases, and whether communication modality shifts between contexts.",
    items: [
      "Uses intentional communication (verbal, gestural, AAC) for wants and needs",
      "Uses single words or gestalt phrases with meaning to represent semantic knowledge",
      "Uses word combinations or mitigated echoic phrases for multi-word meanings",
      "Uses generative, flexible phrases/sentences across contexts and functions",
      "Creates symbolic ideas through pretend play, narrative, or creative expression",
      "Communicates emotional states and abstract ideas — not only concrete requests",
    ],
    parent: [
      "My child understands and responds to words spoken by others",
      "My child uses words, sounds, signs, or a device to communicate",
      "My child uses words for many purposes — not only to ask for things",
      "My child puts words together in flexible, original ways",
    ],
    self: [
      "I can usually find the words to express what I'm thinking or feeling",
      "I use different ways of communicating depending on the situation",
    ],
  },
  {
    id: "ef", n: 10, short: "Exec Func", title: "Executive Function & Planning",
    icon: "🧩", color: "#6ccd5a", colorKey: "ef",
    desc: "Capacity to understand, organize, and execute a plan for tasks and social routines",
    fw: "LSP #8 Executive Function • FEDC Cap 6 • BESSI Self-Management • R&W 5-question framework",
    clinicianContext: "Observe comprehension and use of visual schedules, task sequences, and social plans. Note whether the individual can rehearse, follow, and independently complete multi-step plans. Probe with the 5-question framework: Where do I go? What do I do? How much? When am I finished? What comes next?",
    teacherContext: "Observe during multi-step academic assignments, classroom routines (unpack → breakfast → morning work), project-based learning, and homework planning. Note reliance on visual schedules, teacher prompts, and peer models for task completion.",
    items: [
      "Orients to a partner's use of visual structure for organizing a social plan",
      "Participates in practice/rehearsal activities preparing for upcoming events",
      "Collaboratively follows a mutually agreed-upon, visually structured plan",
      "Independently follows and completes a previously rehearsed plan",
      "Uses contextual/situational/interpersonal cues to collaborate during new activities",
    ],
    parent: [
      "My child understands when I'm setting up or organizing an activity",
      "My child participates in planned activities when steps are shown",
      "My child can complete a familiar routine on their own after being shown how",
    ],
    self: [
      "I can usually figure out the steps I need to take to get something done",
      "When I have a big task, I can make a plan and mostly follow through on it",
    ],
  },
  {
    id: "dist", n: 11, short: "Distance", title: "Contextual Awareness & Distance Learning",
    icon: "📡", color: "#b5de2b", colorKey: "dist",
    desc: "Processing social information at increasing distances and sensory competition levels",
    fw: "LSP #9 Distance Learning • R&W generalization across environments • BESSI Energy Regulation",
    clinicianContext: "Systematically increase physical distance during communicative bids. Test in quiet 1:1 vs. noisy clinic environments. Note the distance and noise threshold at which responsiveness breaks down.",
    teacherContext: "Observe responsiveness from the teacher's desk, across the classroom, in the gymnasium, on the playground, and during assemblies. Note whether the student responds to group instructions from a distance or only to proximity-based cues.",
    items: [
      "Attends to partner's communication at increasing physical distances",
      "Attends to partner's communication in spaces of increasing size",
      "Attends to partner's communication with increasing background noise",
      "Responds to partner's directions and bids at graduating distances",
    ],
    parent: [
      "My child responds when I talk from across the room",
      "My child can follow directions in noisy or busy places",
    ],
    self: [
      "I can follow what's going on in a group even when the room is noisy or there's a lot happening",
    ],
  },
  {
    id: "trans", n: 12, short: "Transitions", title: "Transitions & Attentional Shifting",
    icon: "➡️", color: "#fde725", colorKey: "trans",
    desc: "Capacity to conclude an activity, shift attention, and engage in a new routine",
    fw: "LSP #10 Transitions • DSM-5 difficulty switching • BESSI Adaptability • R&W visual schedules",
    clinicianContext: "Observe responses to session transitions (warm-up → activity → clean-up → new activity). Vary warning types: verbal countdown, visual timer, environmental cue. Note which transition supports are most effective.",
    teacherContext: "Observe during class-to-class transitions, activity shifts within a lesson, moving from preferred to non-preferred tasks, end-of-recess, and dismissal. Note whether the student uses the school bell, teacher signals, or peer cues to transition independently.",
    items: [
      "Attends to interpersonal cues signaling a current activity is ending",
      "Attends to contextual/environmental cues signaling an activity change",
      "Tolerates the conclusion of a current activity without significant dysregulation",
      "Collaboratively participates in ending an activity and shifting to a new one",
      "Independently uses contextual cues to conclude activities and transition",
    ],
    parent: [
      "My child notices when it's time to stop one activity and move to the next",
      "My child can stop and shift to a new activity without significant difficulty",
      "My child participates in both ending one activity and starting the next",
    ],
    self: [
      "When it's time to switch activities, I can usually make the switch without too much trouble",
      "I don't need a lot of extra warning or preparation to move on to the next thing",
    ],
  },
];

export default DOMAINS;
