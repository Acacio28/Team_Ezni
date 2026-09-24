/* ============================================================
   Enzi Dev — Posts data (edit content here only)
   Add/remove objects in POSTS to change the feed.
   ============================================================ */
var POSTS = [
  {
    id: 'p1',
    featured: true,
    title: 'Bitdefender GravityZone: securing 200+ endpoints across Timor-Leste',
    excerpt: 'How we rolled out centralized endpoint protection for a government ministry — from policy design to staged deployment and ongoing monitoring.',
    content: 'Enzi Dev recently completed a Bitdefender GravityZone deployment covering more than 200 endpoints for a government ministry in Dili.\n\nThe engagement started with a full inventory of workstations, laptops and servers, followed by risk-based policy design. We staged the rollout by department to minimize disruption, validated exclusions for line-of-business apps, and switched on anti-ransomware, web control and device control from day one.\n\nPost-deployment, the GravityZone console gives the ministry a single pane of glass for EDR alerts, weekly posture reports and patch visibility. False positives were tuned in the first two weeks; mean time to isolate a suspicious host dropped from hours to minutes.\n\nKey outcomes:\n• 100% agent coverage on managed Windows devices\n• Centralized attack surface dashboard for the IT team\n• Monthly executive security report automated from GravityZone\n\nIf your organization still manages antivirus per-machine, talk to us about a GravityZone pilot — we can scope it in one site visit.',
    category: 'Security',
    tags: ['Bitdefender', 'EDR', 'Government'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    author: 'Ezequel',
    authorRole: 'IT Manager',
    date: '2026-09-18',
    readTime: 6
  },
  {
    id: 'p2',
    featured: false,
    title: 'Cybersecurity Awareness Workshop — registration open',
    excerpt: 'Two-day hands-on training for local teams: threat landscape, password hygiene, phishing defence and incident response basics.',
    content: 'Enzi Dev is opening registration for our Cybersecurity Awareness Workshop in Dili.\n\nDay 1 covers the current threat landscape in Timor-Leste, real phishing samples, password managers and MFA setup. Day 2 walks through incident response: who to call, how to preserve evidence, and a tabletop exercise using a ransomware scenario.\n\nAudience: office staff, IT coordinators, NGO field teams. No prior security background required.\n\nDate: 15 October 2026\nVenue: Fatuhada, Dili\nSeats: limited to 30 participants\n\nUse the Register button on the Activities section, or WhatsApp us to reserve a seat for your team. Corporate on-site sessions are available on request.',
    category: 'Training',
    tags: ['Workshop', 'Awareness', 'Dili'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    author: 'Brigida',
    authorRole: 'IT Support',
    date: '2026-09-15',
    readTime: 3
  },
  {
    id: 'p3',
    featured: false,
    title: 'Cisco Meraki campus Wi-Fi: design notes from our last rollout',
    excerpt: 'RF survey, VLAN planning and dashboard hygiene — what we learned deploying Meraki across a multi-building campus.',
    content: 'Campus Wi-Fi projects fail for boring reasons: wrong AP density, co-channel interference, and flat networks. Here is how we approach Meraki deployments.\n\n1. RF survey first. We walk the site with a survey kit, mark dead zones and high-density areas (halls, labs), then place APs on a floor plan before ordering hardware.\n2. SSID and VLAN map. Guest, staff and IoT get separate SSIDs with different firewall rules. Captive portal for guest; 802.1X for staff where possible.\n3. Traffic shaping. Voice and video get priority; bulk backups are rate-limited so classrooms stay responsive.\n4. Dashboard runbook. We hand over a one-page runbook: who alerts whom, how to read the health tab, and a monthly configuration backup.\n\nResult on our last campus: 95%+ coverage at -67 dBm, guest isolation verified, and the client IT team can troubleshoot most issues from the Meraki dashboard without a site visit.',
    category: 'Projects',
    tags: ['Cisco', 'Meraki', 'Networking'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    author: 'Xisto',
    authorRole: 'Networking',
    date: '2026-09-10',
    readTime: 5
  },
  {
    id: 'p4',
    featured: false,
    title: 'HRMS & Inventory System: building for a government ministry',
    excerpt: 'Custom HR and inventory platform — tracking staff, assets and procurement in one place without spreadsheet chaos.',
    content: 'Enzi Dev is delivering an integrated HRMS and Inventory System for a government ministry.\n\nScope includes employee records, leave and attendance, asset registry with QR labels, purchase requests and stock movements. Role-based access keeps payroll data limited to HR while department heads see only their teams.\n\nWe chose a modular architecture so the ministry can switch on procurement modules later without a re-platform. Offline-tolerant forms help field offices with intermittent connectivity; data syncs when the link returns.\n\nCurrent phase: user acceptance testing with real HR scenarios. Go-live is planned for Q4 2026, with training for 40 staff and a super-user program so the ministry can administer accounts in-house.',
    category: 'Projects',
    tags: ['Software', 'HRMS', 'Government'],
    image: '',
    author: 'Joao',
    authorRole: 'System Analyst',
    date: '2026-09-05',
    readTime: 4
  },
  {
    id: 'p5',
    featured: false,
    title: 'Why offline-first forms matter for NGOs in Timor-Leste',
    excerpt: 'Connectivity drops should not drop data. Patterns we use for forms that keep working when the network does not.',
    content: 'NGO field teams often collect data where 4G is unreliable. If your form dies on submit, trust in the system dies with it.\n\nOur approach:\n• Local persistence — draft answers save to the device immediately\n• Queue and retry — submissions upload when connectivity returns, with idempotent IDs to avoid duplicates\n• Clear status UI — “saved on device” vs “synced” so staff know what happened\n• Conflict rules — last-write-wins for most fields, explicit merge for critical ones\n\nWe have used this pattern for survey tools and registration systems across Dili and the municipalities. The result is higher completion rates and fewer “we lost the data” calls.\n\nPlanning a field data project? Send us the workflow — we will sketch an offline-first design in one call.',
    category: 'Tutorial',
    tags: ['Offline', 'NGO', 'UX'],
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80',
    author: 'Acacio',
    authorRole: 'Director',
    date: '2026-08-28',
    readTime: 4
  },
  {
    id: 'p6',
    featured: false,
    title: 'JICA partnership meeting: ICT capacity building next steps',
    excerpt: 'Meeting with the JICA Timor-Leste team to explore training programs and technology transfer collaboration.',
    content: 'On 23 September, Enzi Dev met with Mr. Yamazaki Hiroto and the JICA Timor-Leste team to discuss ICT capacity-building collaboration.\n\nTopics included joint training curricula for public-sector IT staff, equipment donation logistics, and a possible internship pathway for UNTL engineering students. Both sides agreed to draft a memorandum of understanding outlining scope, timelines and success metrics.\n\nWe will share a follow-up note once the MoU draft is circulated. Organizations interested in co-sponsoring training sessions can contact us via the Contact form.',
    category: 'Company',
    tags: ['JICA', 'Partnership', 'Training'],
    image: '',
    author: 'Frenky',
    authorRole: 'Business Manager',
    date: '2026-09-23',
    readTime: 2
  },
  {
    id: 'p7',
    featured: false,
    title: 'CCTV supply & installation checklist for commercial sites',
    excerpt: 'Camera count, NVR sizing, cabling and commissioning — a practical checklist before anyone climbs a ladder.',
    content: 'Before a CCTV project starts, walk the site with this checklist:\n\n1. Assets and angles — list what must be covered (entrances, cash handling, perimeters) and note lighting/night conditions.\n2. Camera mix — bullet for outdoors, dome for interiors; match resolution to the required identification distance.\n3. NVR and storage — calculate retention (e.g. 30 days × bitrate × cameras) and leave 30% headroom.\n4. Cabling path — conduit, PoE budget, surge protection on outdoor runs.\n5. Network isolation — CCTV VLAN separate from office Wi-Fi; remote view only through VPN or vendor app with MFA.\n6. Commissioning sign-off — focus test each camera, verify retention, hand over as-built drawings and credentials in a password vault.\n\nEnzi Dev handles supply through installation and handover. Ask for a site survey if you are expanding an existing system.',
    category: 'Tutorial',
    tags: ['CCTV', 'Security', 'Checklist'],
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    author: 'Reinildo',
    authorRole: 'Networking',
    date: '2026-08-20',
    readTime: 5
  },
  {
    id: 'p8',
    featured: false,
    title: 'Cloud hosting migration for an NGO — zero long downtime',
    excerpt: 'Moving email and file services to a scalable environment with staged cutover and rollback plan.',
    content: 'We migrated an NGO from aging on-prem servers to a cloud hosting environment with a staged cutover.\n\nPhase 1 replicated mailboxes and validated round-trip delivery. Phase 2 moved file shares with delta sync. Cutover happened on a Saturday morning with a documented rollback path; the longest user-visible gap was 18 minutes.\n\nPost-migration: nightly backups to a separate tenancy, MFA on admin accounts, and a monthly cost report so finance sees spend next to the old hardware line item.\n\nIf you are planning a similar move, start with an inventory of systems and a dependency map — most surprises hide there.',
    category: 'Projects',
    tags: ['Cloud', 'Migration', 'NGO'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    author: 'Ezequel',
    authorRole: 'IT Manager',
    date: '2026-08-12',
    readTime: 4
  },
  {
    id: 'p9',
    featured: false,
    title: 'Password managers for teams: a 30-minute rollout guide',
    excerpt: 'Shared vaults, break-glass accounts and MFA — how to get a team off shared spreadsheets fast.',
    content: 'Shared password spreadsheets are a breach waiting to happen. Here is a 30-minute plan to move a small team to a password manager:\n\n1. Pick a business plan with admin recovery and audit log.\n2. Create vaults by function (Finance, IT, Social) — not by individual.\n3. Import existing secrets, rotate the critical ones (email admin, domain registrar, bank) the same week.\n4. Enforce MFA on the manager itself; store break-glass codes in a sealed envelope in the office safe.\n5. 15-minute training: save, share, generate, emergency access.\n\nWe run this as a facilitated session and leave a one-page policy. WhatsApp us if you want the template.',
    category: 'Tutorial',
    tags: ['Passwords', 'MFA', 'Training'],
    image: '',
    author: 'Brigida',
    authorRole: 'IT Support',
    date: '2026-08-05',
    readTime: 3
  },
  {
    id: 'p10',
    featured: false,
    title: 'Enzi Dev opens expanded support hours for public-sector clients',
    excerpt: 'Extended helpdesk coverage and a clearer escalation path for ministries and institutions we support.',
    content: 'Starting this quarter, Enzi Dev is extending helpdesk hours for public-sector support contracts.\n\nCoverage now runs 07:00–19:00 Monday to Friday, with on-call escalation for P1 incidents outside those hours. Tickets can be raised by WhatsApp, email or phone; every ticket gets an owner and an SLA clock.\n\nWe also publish a monthly service report: ticket volume, mean response time, and top recurring issues with recommended fixes.\n\nExisting clients will receive the updated support matrix by email. New inquiries can use the Contact section.',
    category: 'Company',
    tags: ['Support', 'SLA', 'Announcement'],
    image: '',
    author: 'Frenky',
    authorRole: 'Business Manager',
    date: '2026-07-28',
    readTime: 2
  }
];

var POST_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'Security', label: 'Security' },
  { key: 'Projects', label: 'Projects' },
  { key: 'Training', label: 'Training' },
  { key: 'Tutorial', label: 'Tutorial' },
  { key: 'Company', label: 'Company' }
];
