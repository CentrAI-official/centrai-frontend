export type LeadStatus = "hot" | "warm" | "cold" | "new"
export type LeadSource = "facebook" | "messenger" | "email" | "sms"

export interface ConversationEntry {
  id: string
  date: string
  channel: LeadSource
  sender: "lead" | "agent" | "ia"
  message: string
}

export interface BuyerQualification {
  villeOuSecteurRecherche: string | null
  typeDePropriete: string | null
  delaiAchat: string | null
  proprieteAVendre: boolean | null
}

export interface SellerQualification {
  quandVendre: string | null
  typeDePropriete: string | null
  villeOuAdresse: string | null
  dejaUnCourtier: boolean | null
}

export interface LeadAppointment {
  id: string
  startTimeUtc: string
  endTimeUtc: string
  status: string
}

export interface Lead {
  id: string
  name: string
  status: LeadStatus
  source: LeadSource
  phone: string
  email: string
  budget: string
  interest: string
  lastContact: string
  createdAt: string
  conversations: ConversationEntry[]
  projectType?: "buyer" | "seller" | null
  buyerQualification?: BuyerQualification
  sellerQualification?: SellerQualification
  appointments?: LeadAppointment[]
}

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Jean-François Tremblay",
    status: "hot",
    source: "facebook",
    phone: "514-555-0142",
    email: "jf.tremblay@gmail.com",
    budget: "450 000 $ - 500 000 $",
    interest: "Condo 2 chambres, Plateau-Mont-Royal",
    lastContact: "2026-06-19T14:30:00",
    createdAt: "2026-06-10T09:00:00",
    conversations: [
      { id: "c1", date: "2026-06-10T09:00:00", channel: "facebook", sender: "lead", message: "Bonjour, je suis intéressé par le condo sur la rue Rachel." },
      { id: "c2", date: "2026-06-10T09:05:00", channel: "facebook", sender: "ia", message: "Bonjour Jean-François! Merci de votre intérêt. Êtes-vous disponible pour une visite cette semaine?" },
      { id: "c3", date: "2026-06-19T14:30:00", channel: "facebook", sender: "lead", message: "Oui, jeudi en après-midi me conviendrait." },
    ],
  },
  {
    id: "2",
    name: "Marie-Claude Gagnon",
    status: "hot",
    source: "messenger",
    phone: "438-555-0198",
    email: "mc.gagnon@hotmail.com",
    budget: "600 000 $ - 650 000 $",
    interest: "Maison unifamiliale, Longueuil",
    lastContact: "2026-06-19T11:00:00",
    createdAt: "2026-06-08T10:00:00",
    conversations: [
      { id: "c1", date: "2026-06-08T10:00:00", channel: "messenger", sender: "lead", message: "Avez-vous d'autres maisons similaires à celle sur Le Vieux-Longueuil?" },
      { id: "c2", date: "2026-06-19T11:00:00", channel: "messenger", sender: "agent", message: "Bonjour Marie-Claude, j'ai une nouvelle propriété qui pourrait vous intéresser, je vous envoie les détails." },
    ],
  },
  {
    id: "3",
    name: "Alexandre Bouchard",
    status: "hot",
    source: "sms",
    phone: "450-555-0123",
    email: "alex.bouchard@outlook.com",
    budget: "350 000 $ - 400 000 $",
    interest: "Condo 1 chambre, Québec",
    lastContact: "2026-06-18T16:45:00",
    createdAt: "2026-06-05T13:20:00",
    conversations: [
      { id: "c1", date: "2026-06-18T16:45:00", channel: "sms", sender: "lead", message: "Le condo sur René-Lévesque est-il encore disponible?" },
    ],
  },
  {
    id: "4",
    name: "Sophie Lavoie",
    status: "hot",
    source: "email",
    phone: "514-555-0176",
    email: "sophie.lavoie@gmail.com",
    budget: "500 000 $ - 550 000 $",
    interest: "Plex 4 logements, Rosemont",
    lastContact: "2026-06-19T08:15:00",
    createdAt: "2026-06-12T15:00:00",
    conversations: [
      { id: "c1", date: "2026-06-19T08:15:00", channel: "email", sender: "lead", message: "J'aimerais avoir le rapport d'inspection du plex sur la rue Masson." },
    ],
  },
  {
    id: "5",
    name: "Mathieu Roy",
    status: "hot",
    source: "facebook",
    phone: "581-555-0134",
    email: "mathieu.roy@gmail.com",
    budget: "300 000 $ - 350 000 $",
    interest: "Condo, Sainte-Foy",
    lastContact: "2026-06-19T17:20:00",
    createdAt: "2026-06-14T12:00:00",
    conversations: [
      { id: "c1", date: "2026-06-19T17:20:00", channel: "facebook", sender: "lead", message: "Bonjour, est-ce que je peux visiter en fin de semaine?" },
    ],
  },
  {
    id: "6",
    name: "Catherine Bélanger",
    status: "warm",
    source: "messenger",
    phone: "418-555-0156",
    email: "catherine.belanger@gmail.com",
    budget: "400 000 $ - 450 000 $",
    interest: "Maison de ville, Lévis",
    lastContact: "2026-06-17T10:00:00",
    createdAt: "2026-05-28T09:30:00",
    conversations: [
      { id: "c1", date: "2026-06-17T10:00:00", channel: "messenger", sender: "lead", message: "Je dois en discuter avec mon conjoint, je vous reviens bientôt." },
    ],
  },
  {
    id: "7",
    name: "Simon Côté",
    status: "warm",
    source: "email",
    phone: "514-555-0189",
    email: "simon.cote@yahoo.ca",
    budget: "550 000 $ - 600 000 $",
    interest: "Maison unifamiliale, Brossard",
    lastContact: "2026-06-16T14:00:00",
    createdAt: "2026-05-30T11:00:00",
    conversations: [
      { id: "c1", date: "2026-06-16T14:00:00", channel: "email", sender: "lead", message: "Merci pour la visite, je réfléchis encore à l'offre." },
    ],
  },
  {
    id: "8",
    name: "Isabelle Pelletier",
    status: "warm",
    source: "sms",
    phone: "450-555-0167",
    email: "isabelle.pelletier@gmail.com",
    budget: "250 000 $ - 300 000 $",
    interest: "Condo studio, Montréal",
    lastContact: "2026-06-15T09:45:00",
    createdAt: "2026-06-01T08:00:00",
    conversations: [
      { id: "c1", date: "2026-06-15T09:45:00", channel: "sms", sender: "lead", message: "Pouvez-vous m'envoyer plus de photos?" },
    ],
  },
  {
    id: "9",
    name: "Nicolas Gauthier",
    status: "cold",
    source: "facebook",
    phone: "819-555-0145",
    email: "nicolas.gauthier@gmail.com",
    budget: "320 000 $",
    interest: "Condo, Sherbrooke",
    lastContact: "2026-05-20T13:00:00",
    createdAt: "2026-05-01T10:00:00",
    conversations: [
      { id: "c1", date: "2026-05-20T13:00:00", channel: "facebook", sender: "lead", message: "Je ne suis plus certain de vouloir acheter cette année." },
    ],
  },
  {
    id: "10",
    name: "Émilie Morin",
    status: "cold",
    source: "email",
    phone: "514-555-0112",
    email: "emilie.morin@outlook.com",
    budget: "480 000 $",
    interest: "Maison, Laval",
    lastContact: "2026-05-15T11:30:00",
    createdAt: "2026-04-22T09:00:00",
    conversations: [
      { id: "c1", date: "2026-05-15T11:30:00", channel: "email", sender: "lead", message: "Je vous recontacterai si je change d'avis." },
    ],
  },
  {
    id: "11",
    name: "David Lefebvre",
    status: "new",
    source: "messenger",
    phone: "438-555-0177",
    email: "david.lefebvre@gmail.com",
    budget: "à déterminer",
    interest: "Premier achat, Montréal",
    lastContact: "2026-06-20T08:00:00",
    createdAt: "2026-06-20T08:00:00",
    conversations: [
      { id: "c1", date: "2026-06-20T08:00:00", channel: "messenger", sender: "lead", message: "Bonjour, je commence mes recherches pour un premier achat." },
    ],
  },
  {
    id: "12",
    name: "Audrey Caron",
    status: "new",
    source: "sms",
    phone: "450-555-0188",
    email: "audrey.caron@gmail.com",
    budget: "à déterminer",
    interest: "Condo, Terrebonne",
    lastContact: "2026-06-20T07:30:00",
    createdAt: "2026-06-20T07:30:00",
    conversations: [
      { id: "c1", date: "2026-06-20T07:30:00", channel: "sms", sender: "lead", message: "Salut, j'ai vu votre annonce sur Centris." },
    ],
  },
]

export interface Appointment {
  id: string
  date: string
  time: string
  title: string
  clientName: string
  address: string
  type: "visite" | "signature" | "evaluation" | "rencontre"
}

export const mockAppointments: Appointment[] = [
  { id: "a1", date: "2026-06-20", time: "10:00", title: "Visite condo", clientName: "Jean-François Tremblay", address: "4250 Rue Rachel, Montréal", type: "visite" },
  { id: "a2", date: "2026-06-20", time: "13:30", title: "Évaluation maison", clientName: "Marie-Claude Gagnon", address: "85 Rue Saint-Charles, Longueuil", type: "evaluation" },
  { id: "a3", date: "2026-06-20", time: "16:00", title: "Signature offre d'achat", clientName: "Simon Côté", address: "120 Rue de Brossard, Brossard", type: "signature" },
  { id: "a4", date: "2026-06-22", time: "09:30", title: "Visite plex", clientName: "Sophie Lavoie", address: "2310 Rue Masson, Montréal", type: "visite" },
  { id: "a5", date: "2026-06-23", time: "14:00", title: "Rencontre client", clientName: "Catherine Bélanger", address: "Bureau CentrAI, Lévis", type: "rencontre" },
  { id: "a6", date: "2026-06-25", time: "11:00", title: "Visite condo", clientName: "Mathieu Roy", address: "950 Boulevard René-Lévesque, Québec", type: "visite" },
]

export interface Commission {
  id: string
  property: string
  salePrice: number
  commissionPercent: number
  commissionAmount: number
  date: string
  status: "pending" | "paid"
}

export const mockCommissions: Commission[] = [
  { id: "co1", property: "4250 Rue Rachel, Montréal", salePrice: 485000, commissionPercent: 4, commissionAmount: 19400, date: "2026-06-12", status: "paid" },
  { id: "co2", property: "85 Rue Saint-Charles, Longueuil", salePrice: 620000, commissionPercent: 4, commissionAmount: 24800, date: "2026-05-28", status: "paid" },
  { id: "co3", property: "120 Rue de Brossard, Brossard", salePrice: 575000, commissionPercent: 4.5, commissionAmount: 25875, date: "2026-05-15", status: "pending" },
  { id: "co4", property: "2310 Rue Masson, Montréal", salePrice: 710000, commissionPercent: 4, commissionAmount: 28400, date: "2026-04-30", status: "paid" },
  { id: "co5", property: "950 Boulevard René-Lévesque, Québec", salePrice: 340000, commissionPercent: 5, commissionAmount: 17000, date: "2026-04-10", status: "paid" },
  { id: "co6", property: "780 Avenue du Mont-Royal, Montréal", salePrice: 395000, commissionPercent: 4.5, commissionAmount: 17775, date: "2026-03-22", status: "paid" },
  { id: "co7", property: "55 Rue Principale, Terrebonne", salePrice: 460000, commissionPercent: 4, commissionAmount: 18400, date: "2026-03-05", status: "paid" },
  { id: "co8", property: "1500 Chemin du Lac, Sherbrooke", salePrice: 525000, commissionPercent: 4, commissionAmount: 21000, date: "2026-02-18", status: "paid" },
]

export type EmailClassification = "hot" | "warm" | "cold" | "admin" | "spam"

export interface Email {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  body: string
  classification: EmailClassification
  date: string
  repliedByAI: boolean
  aiReply?: string
}

export const mockEmails: Email[] = [
  {
    id: "e1",
    from: "Jean-François Tremblay",
    fromEmail: "jf.tremblay@gmail.com",
    subject: "Visite du condo rue Rachel",
    preview: "Bonjour, serait-il possible de visiter jeudi...",
    body: "Bonjour, serait-il possible de visiter le condo de la rue Rachel jeudi en après-midi? Merci!",
    classification: "hot",
    date: "2026-06-19T14:30:00",
    repliedByAI: true,
    aiReply: "Bonjour Jean-François, jeudi 14h vous convient-il pour la visite? Je confirme dès votre réponse.",
  },
  {
    id: "e2",
    from: "Sophie Lavoie",
    fromEmail: "sophie.lavoie@gmail.com",
    subject: "Rapport d'inspection plex Masson",
    preview: "J'aimerais recevoir le rapport d'inspection complet...",
    body: "Bonjour, j'aimerais recevoir le rapport d'inspection complet du plex sur la rue Masson avant de faire une offre.",
    classification: "hot",
    date: "2026-06-19T08:15:00",
    repliedByAI: true,
    aiReply: "Bonjour Sophie, voici le rapport en pièce jointe. N'hésitez pas si vous avez des questions!",
  },
  {
    id: "e3",
    from: "Simon Côté",
    fromEmail: "simon.cote@yahoo.ca",
    subject: "Suivi offre Brossard",
    preview: "Je réfléchis encore à l'offre, je vous reviens...",
    body: "Bonjour, je réfléchis encore à l'offre sur la maison de Brossard. Je vous reviens d'ici vendredi.",
    classification: "warm",
    date: "2026-06-16T14:00:00",
    repliedByAI: false,
  },
  {
    id: "e4",
    from: "Isabelle Pelletier",
    fromEmail: "isabelle.pelletier@gmail.com",
    subject: "Photos supplémentaires",
    preview: "Pouvez-vous m'envoyer plus de photos du condo...",
    body: "Bonjour, pouvez-vous m'envoyer plus de photos du condo studio? Merci d'avance.",
    classification: "warm",
    date: "2026-06-15T09:45:00",
    repliedByAI: true,
    aiReply: "Bonjour Isabelle, voici 6 photos supplémentaires en pièce jointe!",
  },
  {
    id: "e5",
    from: "Nicolas Gauthier",
    fromEmail: "nicolas.gauthier@gmail.com",
    subject: "Pause dans mes recherches",
    preview: "Je ne suis plus certain de vouloir acheter...",
    body: "Bonjour, je mets mes recherches en pause pour le moment. Je vous recontacterai si la situation change.",
    classification: "cold",
    date: "2026-05-20T13:00:00",
    repliedByAI: false,
  },
  {
    id: "e6",
    from: "Émilie Morin",
    fromEmail: "emilie.morin@outlook.com",
    subject: "Re: Maison à Laval",
    preview: "Je vous recontacterai si je change d'avis...",
    body: "Merci pour votre patience, je vous recontacterai si je change d'avis dans les prochains mois.",
    classification: "cold",
    date: "2026-05-15T11:30:00",
    repliedByAI: false,
  },
  {
    id: "e7",
    from: "Centris Québec",
    fromEmail: "notifications@centris.ca",
    subject: "Rapport hebdomadaire de vos annonces",
    preview: "Voici le résumé de la performance de vos annonces...",
    body: "Voici le résumé hebdomadaire: 245 vues, 18 demandes d'information sur vos annonces actives.",
    classification: "admin",
    date: "2026-06-18T07:00:00",
    repliedByAI: false,
  },
  {
    id: "e8",
    from: "Chambre immobilière du Grand Montréal",
    fromEmail: "info@cigm.ca",
    subject: "Formation continue obligatoire 2026",
    preview: "Rappel: votre formation continue doit être complétée...",
    body: "Rappel: votre formation continue obligatoire doit être complétée avant le 31 décembre 2026.",
    classification: "admin",
    date: "2026-06-14T09:00:00",
    repliedByAI: false,
  },
  {
    id: "e9",
    from: "Offre Crypto Exclusive",
    fromEmail: "promo@crypto-invest-now.biz",
    subject: "Multipliez vos gains x10 maintenant!!!",
    preview: "Cliquez ici pour découvrir notre offre exclusive...",
    body: "Cliquez ici pour découvrir notre offre exclusive et multipliez vos gains rapidement!",
    classification: "spam",
    date: "2026-06-13T03:00:00",
    repliedByAI: false,
  },
  {
    id: "e10",
    from: "SEO Pro Services",
    fromEmail: "contact@seo-pro-services.net",
    subject: "Améliorez votre visibilité Google",
    preview: "Nous avons remarqué que votre site pourrait...",
    body: "Nous avons remarqué que votre site pourrait bénéficier de nos services de référencement.",
    classification: "spam",
    date: "2026-06-11T10:00:00",
    repliedByAI: false,
  },
]

export interface Property {
  id: string
  address: string
  type: string
  price: number
  listedDate: string
  status: "active" | "sold"
  soldPrice?: number
  commission?: number
  commissionPercent?: number
  bedrooms: number
  bathrooms: number
  url?: string
}

export const mockProperties: Property[] = [
  { id: "p1", address: "4521 Avenue du Parc, Montréal", type: "Condo", price: 459000, listedDate: "2026-05-10", status: "active", bedrooms: 2, bathrooms: 1 },
  { id: "p2", address: "12 Rue des Érables, Boucherville", type: "Maison unifamiliale", price: 689000, listedDate: "2026-05-22", status: "active", bedrooms: 4, bathrooms: 3 },
  { id: "p3", address: "300 Rue Saint-Jean, Trois-Rivières", type: "Condo", price: 285000, listedDate: "2026-06-01", status: "active", bedrooms: 1, bathrooms: 1 },
  { id: "p4", address: "78 Chemin Sainte-Foy, Québec", type: "Plex", price: 525000, listedDate: "2026-04-15", status: "active", bedrooms: 6, bathrooms: 3 },
  { id: "p5", address: "1900 Rue Notre-Dame, Gatineau", type: "Maison de ville", price: 410000, listedDate: "2026-06-10", status: "active", bedrooms: 3, bathrooms: 2 },
  { id: "p6", address: "4250 Rue Rachel, Montréal", type: "Condo", price: 469000, listedDate: "2026-04-02", status: "sold", soldPrice: 485000, commission: 19400, bedrooms: 2, bathrooms: 2 },
  { id: "p7", address: "85 Rue Saint-Charles, Longueuil", type: "Maison unifamiliale", price: 599000, listedDate: "2026-03-18", status: "sold", soldPrice: 620000, commission: 24800, bedrooms: 4, bathrooms: 2 },
  { id: "p8", address: "2310 Rue Masson, Montréal", type: "Plex", price: 695000, listedDate: "2026-02-25", status: "sold", soldPrice: 710000, commission: 28400, bedrooms: 8, bathrooms: 4 },
]

export interface DashboardSummary {
  commissionsThisMonth: number
  activeLeads: number
  hotLeadsCount: number
  appointmentsToday: number
  pendingFollowUps: number
  monthlyGoal: number
  monthlyProgress: number
  aiSummary: string
}

export const mockDashboardSummary: DashboardSummary = {
  commissionsThisMonth: 18500,
  activeLeads: 24,
  hotLeadsCount: 6,
  appointmentsToday: 3,
  pendingFollowUps: 5,
  monthlyGoal: 25000,
  monthlyProgress: 74,
  aiSummary:
    "Bonjour! Voici ton résumé: 3 rendez-vous aujourd'hui, dont une signature d'offre à 16h avec Simon Côté. 5 leads attendent une relance depuis plus de 24h, notamment Isabelle Pelletier qui a demandé des photos. Tes 6 leads chauds représentent un potentiel de plus de 90 000 $ en commissions ce trimestre. Continue comme ça, tu es à 74% de ton objectif mensuel!",
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  property: string
  status: "actif" | "ancien"
  notes: string
}

export const mockClients: Client[] = [
  { id: "cl1", name: "Jean-François Tremblay", email: "jf.tremblay@gmail.com", phone: "514-555-0142", property: "4250 Rue Rachel, Montréal", status: "actif", notes: "Premier acheteur, très réactif, préapprouvé pour 500 000 $." },
  { id: "cl2", name: "Marie-Claude Gagnon", email: "mc.gagnon@hotmail.com", phone: "438-555-0198", property: "85 Rue Saint-Charles, Longueuil", status: "actif", notes: "Recherche une maison avec grand terrain pour ses enfants." },
  { id: "cl3", name: "Simon Côté", email: "simon.cote@yahoo.ca", phone: "514-555-0189", property: "120 Rue de Brossard, Brossard", status: "actif", notes: "En attente de financement de la banque." },
  { id: "cl4", name: "Geneviève Beauchamp", email: "g.beauchamp@gmail.com", phone: "450-555-0211", property: "1200 Boulevard Taschereau, Longueuil", status: "ancien", notes: "Vente complétée en janvier 2026, très satisfaite du service." },
  { id: "cl5", name: "Patrick Dubé", email: "patrick.dube@gmail.com", phone: "514-555-0233", property: "78 Rue de la Gauchetière, Montréal", status: "ancien", notes: "Achat complété, intéressé à revendre dans 2-3 ans." },
  { id: "cl6", name: "Laurence Fortin", email: "laurence.fortin@outlook.com", phone: "581-555-0245", property: "950 Boulevard René-Lévesque, Québec", status: "ancien", notes: "Référé par Mathieu Roy, transaction rapide et sans accroc." },
]
