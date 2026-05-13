/**
 * Generate standalone printable HTML protocol forms for SCDFI v0.4
 * Run: node generate-pdfs.mjs
 * Output: printable-pdfs/SCDFI-v04-Clinician-Protocol.html, etc.
 */

import { writeFileSync } from "fs";

const SECTION_COLORS_LIGHT = {
  reg: "#440154", orient: "#481567", ja: "#482677", learn: "#453781",
  multi: "#3f4788", flex: "#33568b", shared: "#26828e", interact: "#1f9e89",
  comm: "#35b779", ef: "#6ccd5a", dist: "#b5de2b", trans: "#fde725",
};

const SCALE = [
  { label: "Not Observed", abbrev: "NO", color: "#c0392b", bg: "#fdf0ef" },
  { label: "Emerging", abbrev: "EM", color: "#b89446", bg: "#fef9ee" },
  { label: "Consistent with Support", abbrev: "CS", color: "#2a6fa0", bg: "#e8f0f7" },
  { label: "Consistent Independently", abbrev: "CI", color: "#27864e", bg: "#e8f5ed" },
];

const DOMAINS = [
  {
    id: "reg", n: 1, icon: "🌱", title: "Self-Regulation & Emotional Availability",
    fw: "LSP Emotional Regulation • FEDC Cap 1 • BESSI Emotional Resilience • R&W co-regulation • CPS/ASUP Regulate emotional response · Interoception · Tolerate sensory environment",
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
      "My child shows recognizable signs when they are becoming overwhelmed or upset",
    ],
  },
  {
    id: "orient", n: 2, icon: "👥", title: "Social Orientation & Engagement",
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
      "My child looks back and forth between a person and what they are doing together",
      "My child enjoys interacting with familiar people",
    ],
  },
  {
    id: "ja", n: 3, icon: "🔗", title: "Joint Attention & Shared Focus",
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
      "When I point at something, my child looks where I'm pointing",
      "My child points or shows me things they find interesting",
      "My child can stay focused during a shared activity for an extended time",
      "My child can pay attention to me from across the room",
      "My child can stay focused during an activity even with distractions",
    ],
  },
  {
    id: "learn", n: 4, icon: "🪞", title: "Social Learning & Imitation",
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
      "My child notices other people's facial expressions and body language",
      "My child copies other people's actions after watching them",
      "My child repeats or tries out words and phrases they hear others use",
      "My child follows along with routines that someone else demonstrates",
      "My child uses skills learned in one situation in new, similar situations",
    ],
  },
  {
    id: "multi", n: 5, icon: "👂", title: "Multi-Partner Social Awareness",
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
      "My child anticipates what different people will do next in a group activity",
      "My child copies or joins in with what multiple people are doing",
      "My child responds to and interacts with multiple people during the same activity",
    ],
  },
  {
    id: "flex", n: 6, icon: "🔄", title: "Flexibility & Adaptation",
    fw: "LSP #4 Flexibility • FEDC Cap 6 • DSM-5 ASD severity mapping • BESSI Adaptability • CPS/ASUP Shift from original idea · Flexibly handle ambiguity",
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
      "My child stays calm when small changes happen to familiar routines",
      "My child goes along with modified routines introduced by others",
      "My child handles expected changes without becoming upset",
      "My child handles unexpected changes without becoming upset",
      "My child uses objects and materials in creative or varied ways",
      "My child can work or interact with a range of people — not only preferred individuals",
    ],
  },
  {
    id: "shared", n: 7, icon: "🤝", title: "Shared Control & Problem-Solving",
    fw: "LSP #5 Shared Control • FEDC Cap 4 • SSF Negotiation Skill • CPS/ASUP Appreciate actions affect others · Empathize/perspective-take",
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
      "My child allows others to take the lead during shared activities",
      "My child will join in when someone else introduces an activity",
      "My child takes turns being the leader during activities with others",
      "My child waits for appropriate moments to take the lead",
      "My child works together with others to solve problems during activities",
    ],
  },
  {
    id: "interact", n: 8, icon: "💬", title: "Interaction Style: Init / Maint / Respond",
    fw: "LSP #6 A/B/C • FEDC Cap 3–4 • BESSI Conversational & Expressive Skill • CPS/ASUP Appreciate actions affect others · Empathize/perspective-take",
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
      "My child starts interactions with people using words, gestures, or actions",
      "My child initiates interactions for a variety of reasons — not only to get things they need",
      "My child uses words, gestures, or actions to keep interactions going",
      "My child keeps a back-and-forth interaction going for extended exchanges",
      "My child responds when someone communicates with them",
      "My child responds to others across different settings and situations",
    ],
  },
  {
    id: "comm", n: 9, icon: "🗣️", title: "Communication: Symbolic, Generative, Intentional",
    fw: "LSP #7 Verbal/Symbolic • FEDC Cap 5 • BESSI Expressive Skill • Prizant & Rydell echolalia • CPS/ASUP Express concerns/needs/thoughts · Understand others' communication",
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
      "My child uses words, gestures, signs, or a device to communicate wants and needs",
      "My child uses single words or familiar phrases with clear meaning",
      "My child combines words or modifies familiar phrases to express new meanings",
      "My child puts words together in flexible, original ways across different situations",
      "My child engages in pretend play, storytelling, or other creative expression",
      "My child communicates about feelings and abstract ideas — not only concrete requests",
    ],
  },
  {
    id: "ef", n: 10, icon: "🧩", title: "Executive Function & Planning",
    fw: "LSP #8 Executive Function • FEDC Cap 6 • BESSI Self-Management • R&W 5-question framework • CPS/ASUP Maintain focus · Persist on tasks · Sense of time · Consider solutions · Impulse control",
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
      "My child pays attention when I set up visual supports like checklists or schedules",
      "My child participates in practicing or rehearsing before an upcoming event",
      "My child follows a plan or checklist when working through steps together",
      "My child can complete a familiar routine on their own after being shown how",
      "My child picks up on situational cues to figure out what to do in new settings",
    ],
  },
  {
    id: "dist", n: 11, icon: "📡", title: "Contextual Awareness & Distance Learning",
    fw: "LSP #9 Distance Learning • R&W generalization across environments • BESSI Energy Regulation • CPS/ASUP Regulate activity level",
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
      "My child follows directions in larger spaces like gyms or outdoor areas",
      "My child can follow directions in noisy or busy places",
      "My child follows through on directions given from a distance",
    ],
  },
  {
    id: "trans", n: 12, icon: "➡️", title: "Transitions & Attentional Shifting",
    fw: "LSP #10 Transitions • DSM-5 difficulty switching • BESSI Adaptability • R&W visual schedules • CPS/ASUP Handle transitions · Shift mindset",
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
      "My child notices when someone signals that an activity is wrapping up",
      "My child picks up on environmental cues that a change is coming",
      "My child handles the end of an activity without becoming significantly upset",
      "My child helps wrap up one activity and shifts to the next one",
      "My child independently recognizes when it is time to stop and move on",
    ],
  },
];

const CLINICIAN_EXAMPLES = {
  reg: [
    "Remains seated and engaged during a structured tabletop activity for several minutes; participates in a conversation-based warm-up without signs of distress",
    "After becoming frustrated when a challenging task doesn't go as planned, calms within a few minutes when the clinician offers a break or co-regulation strategy",
    "After an unexpected interruption mid-session, independently takes a breath and re-engages with the activity without clinician prompting",
    "Looks toward the door when someone knocks; visually tracks new materials brought to the table; scans the room when session setup changes",
    "Continues working on a structured task while peers converse nearby; tolerates background sounds in a shared clinic space without shutting down",
    "Pushes materials aside when overwhelmed; verbalizes 'I need a break'; moves to a designated calm area; signals the clinician when distressed",
  ],
  orient: [
    "Makes eye contact with the clinician during conversation; shifts body orientation toward a peer who enters the session room",
    "Moves closer to observe a peer's project; leans in to see materials the clinician has prepared; watches with interest when a new group member joins",
    "Maintains focus on a partner's face and actions during a 5-minute collaborative task rather than disengaging or scanning the room",
    "Looks at a shared project the clinician is referencing, then at the clinician's face, then back at the project — coordinating attention between both",
    "Smiles when a preferred peer arrives for group; shows positive affect when the clinician proposes a favored activity; brightens during a humorous exchange",
  ],
  ja: [
    "Looks at a shared project, then up at the clinician, then back at the project — checking that the partner is attending to the same thing",
    "When the clinician points to a chart on the wall, shifts gaze from the clinician's gesture to the referenced material",
    "Holds up a completed worksheet for the clinician to review; points to something notable on a screen; taps a peer to direct their attention to shared materials",
    "Stays jointly focused with a partner on a collaborative task for 5+ minutes, following along and contributing comments as the activity progresses",
    "Responds to the clinician's bid from across the room; follows a gesture directing attention to materials on a far shelf",
    "Maintains shared attention on a partner's explanation while other group members have a side conversation nearby",
  ],
  learn: [
    "Watches the clinician demonstrate a multi-step task sequence; observes a peer's strategy for organizing materials during a group activity",
    "Notices the clinician's facial expression signaling encouragement; watches a peer's hand gesture indicating 'your turn'",
    "After watching the clinician model how to outline a project plan, picks up a marker and begins outlining their own plan without being directed",
    "After hearing the clinician use a specific phrase to request a turn, later uses a similar phrase during a group activity",
    "Clinician models a conversational repair strategy — the student mirrors the approach when a miscommunication occurs later in the session",
    "After practicing a self-advocacy phrase during a role-play, uses the same phrase in a later session with a different clinician",
  ],
  multi: [
    "During a group discussion, looks at each participant when they contribute — not just the preferred partner or the clinician",
    "In a three-person collaborative task, anticipates whose turn is next by tracking the group's pattern of contributions",
    "After observing both the clinician and a peer demonstrate different approaches, incorporates elements from both models",
    "In a group planning activity, responds to a question from one peer, then hands materials to another — engaging with multiple partners within the same task",
  ],
  flex: [
    "Pauses or looks up when the clinician rearranges session materials or changes the expected sequence of activities",
    "Accepts using a different workspace or alternate materials without protest; adjusts when the usual session room is unavailable",
    "When the clinician modifies the rules of a familiar activity mid-session, listens to the changes and continues participating",
    "After being told 'we'll work on the group project before the individual task today,' transitions without distress",
    "When an unexpected fire alarm interrupts the session, exits calmly and re-engages with the activity afterward within a reasonable timeframe",
    "Repurposes available materials creatively when expected supplies are unavailable; finds an alternative approach to complete a task",
    "Works productively with a substitute clinician or an unfamiliar peer; participates without refusal when the usual partner is absent",
  ],
  shared: [
    "Allows the clinician or a peer to take the lead during a collaborative task without grabbing materials or protesting",
    "Continues participating in an activity chosen by a peer, even though it was not their first preference",
    "During a co-construction task, naturally alternates between contributing ideas and deferring to a partner's direction",
    "Waits for an appropriate pause before adding to a group discussion; allows a peer to finish their thought before responding",
    "When a collaborative task hits a problem, turns to a partner and discusses what to try next; asks for input when stuck on a shared assignment",
  ],
  interact: [
    "Greets the clinician upon arrival; initiates a comment about something that happened at school; gestures toward preferred materials to start the session",
    "Initiates to comment ('guess what happened'), protest ('that's not fair'), greet ('hey'), and request ('can we do something different') — across multiple functions",
    "After a peer shares an idea during group, responds with a related thought — building on the conversational topic rather than changing it",
    "Engages in 4+ back-and-forth conversational turns about a shared topic without the clinician carrying the interaction",
    "When the clinician asks 'how did that go at school this week?', provides a relevant and elaborated answer; responds to a peer's comment during group discussion",
    "Responds appropriately to a peer's greeting in the waiting area, the clinician's question during a session activity, and a parent's comment at pickup",
  ],
  comm: [
    "Tells the clinician 'I need help with this part'; uses AAC to request a break; gestures toward preferred materials",
    "Uses key vocabulary to label concepts during a session task; uses a familiar phrase like 'can we move on' meaningfully to signal readiness for the next activity",
    "Says 'I want to try the harder version this time' combining words flexibly; modifies a scripted phrase to fit the current context",
    "Tells a peer 'I see what you mean, but I think we should try it this way' — adapting language to a collaborative situation",
    "Creates a narrative about a hypothetical scenario during a social thinking activity; role-plays a complex social situation with the clinician",
    "Says 'I'm getting anxious about the group part' before a challenging task; explains 'that felt unfair because everyone else got more time'",
  ],
  ef: [
    "Looks at a visual schedule or task checklist when the clinician references it; watches as the clinician sets up the session plan on a whiteboard",
    "Practices introducing themselves to a new group member using a rehearsal script; walks through the steps of an upcoming school presentation",
    "Follows a visual checklist to complete a multi-step project (brainstorm → organize → draft → review) with the clinician checking in at each stage",
    "Uses a previously rehearsed routine to independently gather session materials, set up the workspace, and begin the first task",
    "Enters an unfamiliar group setting, observes that peers are seated in a discussion circle, and joins without needing explicit direction",
  ],
  dist: [
    "Responds to the clinician calling their name from across the room, then from the hallway, then from an adjacent space",
    "Follows a direction given in a large open gym versus a small therapy room; responds to a partner in a busy common area versus a quiet office",
    "Responds to the clinician's instruction while peers are having a side conversation; follows a direction with background noise from an adjacent room",
    "When the clinician gives a direction from across a large space, looks up and follows through; responds to a gestural cue from a distance",
  ],
  trans: [
    "Looks up when the clinician says 'a few more minutes'; notices when a peer begins organizing their materials to leave",
    "Sees the clinician gesture toward the clock and begins wrapping up; notices peers shifting positions and prepares for the next activity",
    "When told 'time to switch activities,' stops the current task and begins transitioning without protest — even if the activity was preferred",
    "Helps organize session materials, moves to the next activity area, and begins engaging with only a brief verbal cue",
    "Notices the session timer, independently wraps up materials, organizes the workspace, and prepares to leave without clinician prompts",
  ],
};

const TEACHER_EXAMPLES = {
  reg: [
    "Remains seated and engaged during a class discussion or independent work period for several minutes without needing to leave the area",
    "After becoming upset about a conflict at recess or a low grade, calms within a few minutes when the teacher offers a break or a regulation strategy",
    "After a frustrating assignment or social misunderstanding, regroups independently and returns to the task without adult intervention",
    "Looks up when the classroom door opens; turns toward the morning announcements; scans the room when entering a new space like the cafeteria or auditorium",
    "Continues working on an essay while classmates have a side conversation; tolerates the noise level during group work without shutting down or acting out",
    "Puts head down on desk when overwhelmed; raises hand and says 'I need a break'; walks to the designated calm area; signals a teacher during a loud assembly",
  ],
  orient: [
    "Looks at the teacher during instruction; shifts body orientation toward a classmate who begins speaking during a group discussion",
    "Moves closer to observe a peer's science project; watches a classmate's presentation with interest; orients toward a group forming for a lab activity",
    "Stays focused on a peer's face during a partner discussion or collaborative task for several minutes rather than looking around the room",
    "During a teacher demonstration, looks at the materials being referenced, then at the teacher's face, then back at the materials — coordinating attention",
    "Smiles when a friend sits next to them at lunch; laughs when a peer shares a funny story; shows positive affect when a preferred classmate joins their group",
  ],
  ja: [
    "Looks at a classmate's project, then up at the classmate's face, then back at the project — sharing the moment of discovery",
    "When the teacher points to a diagram on the board, shifts gaze from the teacher's gesture to the referenced content",
    "Holds up a completed project for the teacher to see; points to something noteworthy on a shared screen; taps a peer to direct their attention to a passage in a textbook",
    "Stays jointly focused with a partner on a shared lab observation or reading passage for 5+ minutes, both attending to the same material and commenting",
    "Responds when the teacher addresses them from across the classroom; follows a point to the assignment board on the far wall",
    "Maintains shared attention with a partner during a group project while other groups are talking and working nearby",
  ],
  learn: [
    "Watches the teacher demonstrate a multi-step math procedure on the board; observes a peer's strategy for organizing a lab report",
    "Notices the teacher's thumbs-up signal for encouragement; watches a peer's hand-raise as a cue for how to get called on during discussion",
    "After watching the teacher model how to set up a graph, sets up their own graph the same way without being directed",
    "After hearing the teacher use a transition phrase like 'building on that idea,' later uses a similar phrase during a class discussion",
    "Teacher models the steps for a group discussion protocol — student follows the routine, taking their turn and passing the discussion to the next person",
    "After learning to use a graphic organizer during English class, also uses one during a social studies assignment without being retaught",
  ],
  multi: [
    "During a group project, looks at each group member when they share an idea — not just their one preferred friend or the teacher",
    "During a class discussion, anticipates who the teacher will call on next; looks toward the next presenter during a round of student share-outs",
    "Picks up a discussion strategy from the teacher and a collaborative approach from a peer — applies both appropriately with different partners",
    "In a cooperative learning group, answers a question from one classmate, then passes materials to another, engaging with multiple peers within the same task",
  ],
  flex: [
    "Notices when the teacher rearranges seating groups or changes the order of the daily schedule posted on the board",
    "Accepts sitting in a different seat for an assembly; uses alternate materials when their preferred supplies are unavailable without becoming upset",
    "When the teacher modifies the format of a familiar assignment or changes the rules of a review game, adjusts and continues participating",
    "After being told 'we will have indoor recess today because of weather,' accepts the change and chooses an indoor activity without distress",
    "When a fire drill or lockdown drill interrupts a preferred activity, follows procedures and returns to class without significant difficulty re-engaging",
    "Repurposes available materials creatively for a project; finds an alternative approach when expected supplies or technology are unavailable",
    "Works productively with a substitute teacher or an unfamiliar classmate during a group activity; participates without refusal when their usual partner is absent",
  ],
  shared: [
    "Allows a classmate to take the lead on a group decision without protesting; lets a peer choose the topic during partner work",
    "Continues participating in a group project direction chosen by another student, even though it was not their first choice",
    "During a collaborative project, naturally alternates between contributing ideas and supporting a partner's direction",
    "Waits to be called on during class discussion; lets a peer finish their point before responding; waits for an appropriate moment during a group activity",
    "When a group project hits a problem, discusses with partners what to try differently; asks a peer for input when stuck on a shared assignment",
  ],
  interact: [
    "Greets a classmate at arrival; raises hand to ask the teacher a question; approaches a peer at lunch to start a conversation",
    "Initiates to comment ('did you see that game last night?'), request help ('can you explain this part?'), greet ('hey, want to sit together?'), and protest ('I disagree') — across multiple functions",
    "After a classmate shares a weekend story, responds with a related experience — building on the conversational topic rather than changing it",
    "Maintains a back-and-forth conversation with a peer at lunch or during free time for several exchanges about a shared interest",
    "When the teacher asks 'how did you approach that problem?', explains their thinking; responds thoughtfully when a peer shares during a class discussion",
    "Responds appropriately when a peer greets them in the hallway, when the teacher asks a question during class, and when the cafeteria staff gives a direction",
  ],
  comm: [
    "Raises hand and says 'I need help with this'; asks for a hall pass; uses AAC to request a break or signal a need",
    "Uses key vocabulary to answer a question; uses a familiar phrase like 'can I have more time' meaningfully during a test; signs or gestures to communicate during a quiet activity",
    "Says 'I want to work on the second part first because it is easier' combining words flexibly; modifies a familiar script to fit the classroom context",
    "Tells the teacher 'I finished the first section but I do not understand the directions for the second part — can you explain it?' adapting language to the academic situation",
    "Creates an original narrative during a writing assignment; develops a character during a drama activity; builds an imaginative scenario with peers during a creative project",
    "Says 'I feel nervous about presenting' before a class presentation; explains 'I am upset because my group is not listening to my ideas' during a project conflict",
  ],
  ef: [
    "Looks at the class visual schedule or assignment checklist when the teacher references it; watches as the teacher outlines the day's plan on the board",
    "Practices the steps of an upcoming presentation with a peer; rehearses what to do during a standardized testing routine before the actual test day",
    "Follows a visual checklist to complete a multi-step writing process (brainstorm, draft, edit, publish) with the teacher checking in at each stage",
    "Uses a previously practiced routine checklist to independently complete arrival tasks (unpack, turn in homework, start bell work) or end-of-day procedures",
    "Enters the cafeteria, sees classmates getting trays and lining up, and joins the routine without needing verbal direction from an adult",
  ],
  dist: [
    "Responds when the teacher says their name from the front of the room, from across the classroom, or from the doorway",
    "Follows a direction given in the large gymnasium versus the small classroom; responds to a peer in the noisy cafeteria versus the quiet library",
    "Responds to the teacher's instruction while classmates are talking at their tables; follows a direction during a busy hands-on activity with background noise",
    "When the teacher calls a direction from across the playground or gym, looks up and follows through; responds to a gestural cue from across the classroom",
  ],
  trans: [
    "Looks up when the teacher says 'five more minutes'; notices when classmates start closing their notebooks and packing up materials",
    "Hears the class chime or transition signal and begins putting supplies away; sees peers pushing in chairs and does the same; notices environmental cues and stops the current task",
    "When told 'time to switch to the next subject,' closes the current materials and gets out the next set without protesting — even if the previous activity was preferred",
    "Helps clean up materials from the current activity, moves to the next area, and settles in ready for the next lesson with only a brief verbal cue",
    "Hears the school bell, independently packs up materials, pushes in chair, and transitions to the next class or location without adult prompts",
  ],
};

const PARENT_EXAMPLES = {
  reg: [
    "Stays calm during a family meal or while doing homework without becoming visibly upset or needing to leave",
    "After becoming upset about a disagreement with a sibling or a disappointing situation, calms down within a few minutes with your support or a familiar strategy",
    "After getting frustrated with homework or a chore, steps away briefly and then comes back to try again without needing your help to calm down",
    "Notices when someone comes home; looks up when a phone rings; shows interest when entering a new environment like a restaurant or a relative's house",
    "Handles a noisy family dinner or a crowded store without becoming overwhelmed or shutting down",
    "Shows clear signs when becoming stressed — like saying 'this is too much,' leaving the room, or seeking out a quiet space",
  ],
  orient: [
    "Looks at your face when you are talking to them; turns toward a family member who enters the room",
    "Shows curiosity about what others are doing — watches a sibling's homework, moves closer to see what a neighbor is working on, observes peers at a gathering",
    "Stays focused on you during a conversation or shared activity for several minutes rather than drifting off or looking at their phone",
    "Shifts attention between you and what you are both looking at — like glancing at the recipe and then at you while cooking together",
    "Shows positive reactions when interacting with familiar people — smiles when a friend calls, laughs during a family joke, looks happy when a favorite relative visits",
  ],
  ja: [
    "Looks at something interesting, then looks at you to see if you noticed it too — like a funny sign on a drive or something on TV",
    "When you point at something, your child looks where you are pointing — like following your gesture to a bird outside or an item on a shelf",
    "Points out things they find interesting or holds up something to show you — like a text from a friend, a drawing, or something they found outside",
    "Stays focused with you on a shared activity for an extended time — like cooking a recipe together, working on a project, or watching and discussing a show",
    "Responds when you call their name from another room or follows your gesture to something across a large space",
    "Stays focused on a shared conversation or activity even when the TV is on, siblings are talking, or other distractions are present",
  ],
  learn: [
    "Watches what you or others are doing during activities — like how you organize a task, how a sibling handles a social situation, or how a peer plays a game",
    "Picks up on facial expressions and body language — like noticing when you look frustrated or when a sibling is excited",
    "Copies actions after watching someone else — like organizing their desk the way you showed them or trying a new technique after watching a sibling",
    "Repeats or tries out words and phrases they have heard others use — like using a new expression picked up from a friend or a family member",
    "Follows along with routines that someone else walks them through — like the steps of a bedtime routine, a chore sequence, or getting ready for an outing",
    "Uses a skill learned in one situation in a new setting — like using a polite request phrase learned at home when ordering at a restaurant",
  ],
  multi: [
    "At a family gathering or group outing, pays attention to what several people are doing — not just one favorite person",
    "Anticipates what different people might do next during a group activity — like knowing whose turn is coming in a board game or who will speak next at dinner",
    "Picks up behaviors from multiple people — like learning a joke from a cousin and a greeting style from a grandparent and using both appropriately",
    "Responds to and interacts with multiple people during the same activity — like answering one person's question and then passing something to another during a family game",
  ],
  flex: [
    "Notices when something about a familiar routine has changed — like a different route to school, a schedule shift, or furniture rearranged at home",
    "Stays calm when small changes happen to familiar routines — like using a different cup or sitting in a different spot without becoming upset",
    "Goes along with modified plans introduced by others — like accepting a different restaurant choice or a changed activity order",
    "Handles expected changes without becoming upset — like a planned schedule change that was discussed ahead of time",
    "Handles unexpected changes without becoming upset — like a canceled outing, a surprise visitor, or a last-minute plan change",
    "Uses objects and materials in creative or varied ways — like repurposing household items for a project or finding a workaround when something is unavailable",
    "Can work or interact with a range of people — not only their closest friends or preferred family members",
  ],
  shared: [
    "Allows others to take the lead during shared activities — like letting a sibling pick the game or a friend choose the movie",
    "Joins in when someone else introduces an activity, even if it was not their first choice",
    "Takes turns being the leader during activities with others — sometimes directing and sometimes going along with someone else's plan",
    "Waits for an appropriate moment to take the lead — like waiting for a pause in conversation before sharing their idea or waiting their turn during a family game",
    "Works together with others to solve problems during activities — like figuring out a board game strategy with a sibling or deciding what to do when plans fall through",
  ],
  interact: [
    "Starts interactions with people using words, gestures, or actions — like greeting a neighbor, texting a friend to make plans, or asking a family member about their day",
    "Initiates interactions for a variety of reasons — not only to ask for things, but also to share news, say hello, tell a story, or make a comment",
    "Uses words, gestures, or actions to keep interactions going — like adding to a conversation, commenting on what someone said, or asking follow-up questions",
    "Keeps a back-and-forth interaction going for several exchanges — like a sustained conversation at dinner or an extended text exchange with a friend",
    "Responds when someone communicates with them — answers questions, acknowledges comments, or reacts to what someone says",
    "Responds to others across different settings — like answering a relative at a family gathering, replying to a coach at practice, or responding to a store clerk",
  ],
  comm: [
    "Uses words, gestures, signs, or a device to communicate wants and needs — like asking for help with homework, requesting a ride, or telling you they are hungry",
    "Uses single words or familiar phrases with clear meaning — like key vocabulary to label things or a familiar expression used at the right time",
    "Combines words or modifies familiar phrases to express new meanings — like adjusting a common expression to fit a new situation instead of repeating it exactly",
    "Puts words together in flexible, original ways across different situations — like explaining a problem at school, describing something that happened with friends, or making a new request",
    "Engages in creative expression — like making up stories, developing characters during imaginative play, or writing original content",
    "Communicates about feelings and abstract ideas — like saying 'I am stressed about the test' or explaining why something felt unfair",
  ],
  ef: [
    "Pays attention when you set up visual supports — like looking at a checklist for chores, a calendar for the week, or a posted schedule for after-school activities",
    "Participates in practicing or rehearsing before an event — like walking through what to expect at a doctor's appointment or rehearsing a school presentation at home",
    "Follows a plan or checklist when working through steps together — like using a homework planner or following a recipe with you step by step",
    "Can complete a familiar routine on their own after being shown how — like getting ready for school, packing their bag, or following a bedtime sequence without reminders",
    "Picks up on situational cues to figure out what to do in new settings — like noticing that everyone is taking off their shoes at a friend's house and doing the same",
  ],
  dist: [
    "Responds when you call their name or give a direction from across the room or from another floor of the house",
    "Follows directions in larger spaces — like hearing you at a park, a sporting event, or across a parking lot",
    "Can follow directions in noisy or busy places — like a grocery store, a family party, a restaurant, or a sports game",
    "Follows through on directions given from a distance — like coming inside when called from the yard or following a gesture from across a crowded room",
  ],
  trans: [
    "Notices when someone signals that an activity is ending — like when you say 'five more minutes' or a coach blows the whistle at practice",
    "Picks up on environmental cues that a change is coming — like noticing that other people are packing up, that the lights are being turned off, or that the car is pulling into the driveway",
    "Handles the end of an activity without becoming significantly upset — even when it is something they were enjoying, like a video game, time with friends, or a favorite show",
    "Helps wrap up one activity and shifts to the next — like putting away dishes after dinner and then starting homework, or cleaning up after a project and getting ready to leave",
    "Independently recognizes when it is time to stop and move on — like ending screen time when the agreed-upon time is up or getting ready for bed without being told multiple times",
  ],
};

const VERSION_META = {
  clinician: {
    label: "Clinician Protocol",
    badge: "#1b3a4b",
    instructions: "Rate current functioning based on direct clinical observation. Consider Social Awareness (SA) — noticing cues without instruction — and Independent Use (IU) — acting on cues without prompts. Specify observation context (structured vs. naturalistic, session type, materials) in the notes field per domain.",
  },
  teacher: {
    label: "Teacher Protocol",
    badge: "#1a7a7a",
    instructions: "Rate current functioning based on classroom and school observations. Consider how the student performs across school contexts — structured instruction, independent work, group activities, unstructured time (recess, hallways, lunch), and transitions between settings. Use notes to describe context per domain.",
  },
  parent: {
    label: "Parent / Caregiver Protocol",
    badge: "#2a7a5a",
    instructions: "Rate your child's current functioning based on what you typically observe at home and in the community. Use the stress modifier if your child can do this but not when stressed, tired, hungry, or in unfamiliar settings. There are no right or wrong answers.",
  },
};

function generateHTML(version) {
  const vm = VERSION_META[version];
  const isObs = version === "clinician" || version === "teacher";
  const isParent = version === "parent";

  const ratingKeyHTML = () => {
    let html = `<div class="rating-key"><span class="rk-label">Rating Key</span>`;
    for (const s of SCALE) {
      html += `<span class="rk-item" style="background:${s.bg};color:${s.color};border-color:${s.color}"><span class="rk-circle" style="border-color:${s.color}"></span>${s.abbrev} — ${s.label}</span>`;
    }
    if (isParent) {
      html += `<span class="rk-item" style="background:#f3edf9;color:#7a5aaa;border-color:#7a5aaa">⚡ Stress Modifier</span>`;
    }
    html += `</div>`;
    return html;
  };

  const examplesMap = version === "clinician" ? CLINICIAN_EXAMPLES
    : version === "teacher" ? TEACHER_EXAMPLES
    : PARENT_EXAMPLES;

  const domainSections = DOMAINS.map((d) => {
    const items = isParent ? d.parent : d.items;
    const examples = examplesMap[d.id] || [];
    const ctx = isObs ? (version === "clinician" ? d.clinicianContext : d.teacherContext) : null;
    const sc = SECTION_COLORS_LIGHT[d.id];
    const maxPts = items.length * 3;

    let tableRows = "";
    for (let i = 0; i < items.length; i++) {
      const zebra = i % 2 === 1 ? ' class="zebra"' : "";
      const exampleHTML = i < examples.length ? `<span class="item-example">${examples[i]}</span>` : "";
      let cells = `<td class="item-cell"><span class="item-num">${i + 1}.</span>${items[i]}${exampleHTML}</td>`;
      for (const s of SCALE) {
        cells += `<td class="circle-cell"><span class="circle"></span></td>`;
      }
      if (isParent) cells += `<td class="circle-cell"><span class="checkbox"></span></td>`;
      if (isObs) cells += `<td class="notes-cell"><div class="notes-line"></div></td>`;
      tableRows += `<tr${zebra}>${cells}</tr>\n`;
    }

    let colHeaders = `<th class="th-item">Item</th>`;
    for (const s of SCALE) {
      colHeaders += `<th class="th-scale" style="color:${s.color}">${s.abbrev}</th>`;
    }
    if (isParent) colHeaders += `<th class="th-scale" style="color:#7a5aaa">⚡</th>`;
    if (isObs) colHeaders += `<th class="th-notes">Notes / SA · IU</th>`;

    const contextHTML = ctx ? `<div class="domain-context"><strong>Observation context:</strong> ${ctx}</div>` : "";

    return `
<div class="domain-section">
${ratingKeyHTML()}
<div class="domain-block">
  <div class="domain-header" style="background:${sc}">
    <span class="dh-icon">${d.icon}</span>
    <span class="dh-num">D${d.n}</span>
    <span class="dh-title">${d.title}</span>
  </div>
  <div class="domain-fw">${d.fw}</div>
  ${contextHTML}
  <table class="domain-table">
    <thead><tr>${colHeaders}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  <div class="domain-totals">
    <span class="total-item">Raw Total: <span class="blank-line"></span> <span class="total-max">/ ${maxPts}</span></span>
    ${isParent
      ? `<span class="total-item">Stress Items: <span class="blank-line short"></span> <span class="total-max">/ ${items.length}</span></span>`
      : `<span class="total-item">% Score: <span class="blank-line"></span></span>`}
  </div>
  ${isObs ? `<div class="obs-box"><div class="obs-label">Observations / Contextual Notes</div><div class="lined-area"></div></div>` : ""}
</div>
</div>`;
  }).join("\n");

  const clientFields = isParent
    ? `<div class="info-field"><div class="field-label">Child's Name</div><div class="field-blank"></div></div>
       <div class="info-field"><div class="field-label">Your Name (Respondent)</div><div class="field-blank"></div></div>
       <div class="info-field"><div class="field-label">Date</div><div class="field-blank"></div></div>`
    : `<div class="info-field"><div class="field-label">Client / Student Name</div><div class="field-blank"></div></div>
       <div class="info-field"><div class="field-label">Respondent (Name, Role)</div><div class="field-blank"></div></div>
       <div class="info-field"><div class="field-label">Date</div><div class="field-blank"></div></div>
       <div class="info-field full-width"><div class="field-label">Setting / Context</div><div class="field-blank"></div></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SCDFI v0.4 — ${vm.label}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
body {
  font-family: 'DM Sans', -apple-system, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
  line-height: 1.5;
  color: #1a1a1a;
  padding: 32px 40px;
  max-width: 880px;
  margin: 0 auto;
}

@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { padding: 0; }
  @page { margin: 0.4in; }
  .no-print { display: none !important; }
}

.no-print {
  text-align: center;
  margin-bottom: 20px;
  padding: 12px;
  background: #f0f4f4;
  border-radius: 8px;
}
.no-print button {
  font-family: 'DM Sans', sans-serif;
  padding: 10px 24px;
  border-radius: 999px;
  border: none;
  background: #1a7a7a;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

/* Header */
.form-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 3px solid #1a1a1a;
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.form-title { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
.form-subtitle { font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #666; margin-top: 4px; }
.form-badge {
  font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 4px;
  color: #fff; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; margin-top: 4px;
}

/* Client info grid */
.info-grid {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  border: 1.5px solid #1a1a1a;
  margin-bottom: 10px;
}
.info-field { padding: 5px 10px; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd; }
.info-field:last-child { border-right: none; }
.info-field.full-width { grid-column: 1 / -1; border-bottom: none; border-right: none; }
.field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 2px; }
.field-blank { min-height: 20px; }

/* Instructions */
.instructions {
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 7px 10px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 10px;
}

/* Rating key */
.rating-key {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  padding: 5px 8px;
  border: 1.5px solid #1a1a1a;
  background: #fafafa;
  margin-bottom: 8px;
}
.rk-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-right: 6px; }
.rk-item {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 700;
  border: 1px solid;
}
.rk-circle { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid; display: inline-block; }

/* Domain sections — keep rating key + block together */
.domain-section { break-inside: avoid; page-break-inside: avoid; margin-bottom: 14px; }

/* Domain blocks */
.domain-block { page-break-inside: avoid; }
.domain-header {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; color: #fff; border-radius: 3px 3px 0 0;
}
.dh-icon { font-size: 18px; line-height: 1; }
.dh-num { font-size: 12px; font-weight: 600; opacity: 0.7; }
.dh-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.domain-fw {
  font-size: 11px; color: #888; font-style: italic;
  padding: 3px 10px;
  border-left: 1.5px solid #1a1a1a; border-right: 1.5px solid #1a1a1a;
  background: #fafafa;
}
.domain-context {
  font-size: 12px; padding: 4px 10px;
  border-left: 1.5px solid #1a1a1a; border-right: 1.5px solid #1a1a1a;
  border-bottom: 1px solid #ddd; background: #fcfcfc; font-style: italic;
}
.domain-context strong { font-style: normal; }

/* Domain table */
.domain-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
  border: 1.5px solid #1a1a1a; border-top: none;
}
.domain-table thead { display: table-header-group; }
.th-item {
  text-align: left; padding: 5px 8px; font-size: 11px;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  border-bottom: 2px solid #1a1a1a; background: #f0f0f0; width: 52%;
}
.th-scale {
  text-align: center; padding: 5px 3px; font-size: 11px;
  font-weight: 700; border-bottom: 2px solid #1a1a1a; background: #f0f0f0; min-width: 34px;
}
.th-notes {
  text-align: left; padding: 5px 6px; font-size: 11px;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  border-bottom: 2px solid #1a1a1a; background: #f0f0f0; min-width: 90px;
}
.domain-table tbody tr { background: transparent; }
.domain-table tbody tr.zebra { background: #f9f9f9; }
.item-cell { padding: 6px 8px; font-size: 13px; border-bottom: 1px solid #ddd; line-height: 1.4; vertical-align: top; }
.item-num { font-weight: 600; color: #666; margin-right: 4px; }
.item-example { display: block; font-size: 10.5px; color: #777; font-style: italic; margin-top: 2px; line-height: 1.35; }
.circle-cell { padding: 5px 3px; text-align: center; border-bottom: 1px solid #ddd; vertical-align: middle; }
.circle { display: inline-block; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid #aaa; }
.checkbox { display: inline-block; width: 14px; height: 14px; border-radius: 2px; border: 1.5px solid #aaa; }
.notes-cell { padding: 5px 6px; border-bottom: 1px solid #ddd; vertical-align: middle; }
.notes-line { border-bottom: 1px solid #bbb; min-height: 14px; }

/* Domain totals */
.domain-totals {
  display: flex; justify-content: flex-end; gap: 14px;
  padding: 5px 10px; font-size: 12px; font-weight: 700;
  color: #666; background: #f5f5f5;
  border: 1.5px solid #1a1a1a; border-top: none;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.total-item { display: inline-flex; align-items: center; gap: 6px; }
.blank-line { display: inline-block; width: 36px; border-bottom: 1.5px solid #1a1a1a; min-height: 12px; }
.blank-line.short { width: 30px; }
.total-max { color: #888; font-weight: 500; }

/* Observation box */
.obs-box {
  border: 1.5px solid #1a1a1a; border-top: none;
  border-radius: 0 0 3px 3px; padding: 5px 8px;
}
.obs-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 3px; }
.lined-area {
  min-height: 60px; border-top: 1px solid #ddd;
  background: repeating-linear-gradient(to bottom, transparent 0, transparent 19px, #e8e8e8 19px, #e8e8e8 20px);
}

/* Summary & signature */
.summary-section { margin-top: 24px; page-break-inside: avoid; }
.summary-header {
  background: #1a1a1a; color: #fff;
  padding: 7px 12px; font-size: 13px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em; border-radius: 3px 3px 0 0;
}
.summary-body { border: 1.5px solid #1a1a1a; border-top: none; border-radius: 0 0 3px 3px; padding: 14px; }
.summary-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 4px; }
.summary-lined { min-height: 90px; background: repeating-linear-gradient(to bottom, transparent 0, transparent 19px, #e8e8e8 19px, #e8e8e8 20px); margin-bottom: 14px; }
.sig-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
.sig-field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 2px; }
.sig-line { border-bottom: 1.5px solid #1a1a1a; min-height: 22px; }

/* Footer */
.form-footer {
  margin-top: 16px; padding-top: 8px; border-top: 1px solid #ddd;
  font-size: 10px; color: #888; text-align: center; line-height: 1.7; letter-spacing: 0.05em;
}
</style>
</head>
<body>

<div class="no-print">
  <button onclick="window.print()">🖨 Print / Save as PDF</button>
</div>

<div class="form-header">
  <div>
    <div class="form-title">SCDFI</div>
    <div class="form-subtitle">Social-Communication &amp; Developmental Functioning Inventory</div>
  </div>
  <div class="form-badge" style="background:${vm.badge}">${vm.label}</div>
</div>

<div class="info-grid">
  ${clientFields}
</div>

<div class="instructions"><strong>Instructions:</strong> ${vm.instructions}</div>

${domainSections}

<div class="summary-section">
  <div class="summary-header">📝 Summary &amp; Signature</div>
  <div class="summary-body">
    <div class="summary-label">Overall Clinical Impressions / Notes</div>
    <div class="summary-lined"></div>
    <div class="sig-grid">
      <div><div class="sig-field-label">Signature</div><div class="sig-line"></div></div>
      <div><div class="sig-field-label">Date</div><div class="sig-line"></div></div>
    </div>
    <div class="sig-grid" style="margin-top:10px">
      <div><div class="sig-field-label">Printed Name</div><div class="sig-line"></div></div>
      <div><div class="sig-field-label">${isParent ? "Relationship to Child" : "Role / Title"}</div><div class="sig-line"></div></div>
    </div>
  </div>
</div>

<div class="form-footer">
  SCDFI v0.4 · Social-Communication &amp; Developmental Functioning Inventory · Confidential<br>
  Rachel Terra Norton, MS, CCC-SLP<br>
  Inspired by ASHA Social Communication Benchmarks, LSP, FEDC/DIR, BESSI, SSF, Roth &amp; Worthington, Greene/CPS (ASUP)
</div>

</body>
</html>`;
}

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "printable-pdfs");

for (const v of ["clinician", "teacher", "parent"]) {
  const html = generateHTML(v);
  const filename = `SCDFI-v04-${VERSION_META[v].label.replace(/ \/ /g, "-").replace(/ /g, "-")}.html`;
  writeFileSync(join(dir, filename), html, "utf-8");
  console.log(`✓ ${filename}`);
}
