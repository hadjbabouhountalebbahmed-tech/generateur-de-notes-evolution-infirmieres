

import type { SectionData, PainField, Option, PainState, FormState, MorseScaleState, BradenScaleState, CIWAScaleState, LayoutSettings } from './types';

export const initialPainState: PainState = {
  p: [], q: [], r: [], site: '', s: '', t: [], u: [], medicament: '', interventionsNonPharma: []
};

export const initialMorseState: MorseScaleState = {
    history: 0,
    secondaryDiagnosis: 0,
    ambulatoryAid: 0,
    ivTherapy: 0,
    gait: 0,
    mentalStatus: 0,
};

export const initialBradenState: BradenScaleState = {
    sensoryPerception: 1,
    moisture: 1,
    activity: 1,
    mobility: 1,
    nutrition: 1,
    frictionAndShear: 1,
};

export const initialCIWAState: CIWAScaleState = {
    nauseaVomiting: 0,
    tremor: 0,
    sweats: 0,
    anxiety: 0,
    agitation: 0,
    tactile: 0,
    auditory: 0,
    visual: 0,
    headache: 0,
    orientation: 0,
};

export const defaultLayoutSettings: LayoutSettings = {
    positionY: 4.7,
    positionX: 2.2,
    textBlockWidth: 15.7,
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    fontWeight: 400,
    lineHeight: 1.5,
    entrySpacing: 4,
    opacity: 100,
    labelWidth: 8.9,
    labelHeight: 6.2,
};


export const fontOptions: Option[] = [
    { value: 'Helvetica', label: 'Helvetica (Sans-Serif)' },
    { value: 'Times', label: 'Times New Roman (Serif)' },
    { value: 'Courier', label: 'Courier (Monospace)' },
];

export const fontWeightOptions: Option[] = [
    { value: '300', label: 'Léger' },
    { value: '400', label: 'Normal' },
    { value: '500', label: 'Moyen' },
    { value: '600', label: 'Semi-gras' },
    { value: '700', label: 'Gras' },
];


// Nouvelles constantes pour la section Admission détaillée
export const admissionBaseOptions: Option[] = [
    { value: 'Bracelet d\'identification vérifié et conforme', label: 'Bracelet d\'identification vérifié' },
    { value: 'Allergies vérifiées et signalées au dossier', label: 'Allergies vérifiées' },
    { value: 'Enseignement sur le fonctionnement de l\'unité et l\'appel infirmier effectué', label: 'Enseignement patient effectué' },
    { value: 'Évaluation initiale de la douleur effectuée', label: 'Évaluation douleur initiale' },
];
export const orientationOptions: Option[] = [
    { value: 'Temps', label: 'Temps' },
    { value: 'Lieu', label: 'Lieu' },
    { value: 'Personne', label: 'Personne' },
];
export const autonomieOptions: Option[] = [
    { value: 'Autonome', label: 'Autonome' },
    { value: 'Aide x 1', label: 'Aide x 1' },
    { value: 'Aide x 2', label: 'Aide x 2' },
    { value: 'Aide totale', label: 'Aide totale' },
];
export const accesVeineuxGaugeOptions: Option[] = [
    { value: '#18', label: '#18' },
    { value: '#20', label: '#20' },
    { value: '#22', label: '#22' },
    { value: '#24', label: '#24' },
];
export const drainsOptions: Option[] = [
    { value: 'Jackson-Pratt (JP)', label: 'Jackson-Pratt (JP)' },
    { value: 'Hemovac', label: 'Hemovac' },
    { value: 'Penrose', label: 'Penrose' },
    { value: 'Drain thoracique', label: 'Drain thoracique' },
    { value: 'Pigtail', label: 'Pigtail' },
];
export const sondesOptions: Option[] = [
    { value: 'Sonde urinaire (Foley)', label: 'Sonde urinaire (Foley)' },
    { value: 'Sonde naso-gastrique (SNG)', label: 'Sonde naso-gastrique (SNG)' },
    { value: 'Sonde de gastrostomie (PEG)', label: 'Sonde de gastrostomie (PEG)' },
    { value: 'Étui pénien', label: 'Étui pénien' },
];
export const siteMembreOptions: Option[] = [
    { value: 'bras droit (BD)', label: 'Bras droit (BD)' },
    { value: 'bras gauche (BG)', label: 'Bras gauche (BG)' },
    { value: 'avant-bras droit (ABD)', label: 'Avant-bras droit (ABD)' },
    { value: 'avant-bras gauche (ABG)', label: 'Avant-bras gauche (ABG)' },
];


export const sectionsData: SectionData[] = [
  {
    id: 'position',
    title: 'Position du patient',
    type: 'checkbox',
    options: [
        { value: 'Décubitus dorsal', label: 'Décubitus dorsal' },
        { value: 'Décubitus latéral', label: 'Décubitus latéral' },
        { value: 'Décubitus ventral', label: 'Décubitus ventral' },
        { value: 'Position semi-assise', label: 'Position semi-assise' },
        { value: 'Assis(e) au fauteuil', label: 'Assis(e) au fauteuil' },
        { value: 'Debout', label: 'Debout' },
    ],
  },
  {
    id: 'etatEveil',
    title: 'État d’éveil',
    type: 'radio',
    options: [
      { value: 'Alerte', label: 'Alerte' },
      { value: 'Somnolent', label: 'Somnolent' },
      { value: 'Léthargique', label: 'Léthargique' },
      { value: 'Stuporeux', label: 'Stuporeux' },
      { value: 'Comateux', label: 'Comateux' },
      { value: 'Non évaluable', label: 'Non évaluable' },
    ],
  },
  {
    id: 'signesNeuro',
    title: 'Signes neurologiques (SN)',
    type: 'radio',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'Anormal', label: 'Anormal' },
    ],
  },
  {
    id: 'respiratoire',
    title: 'Système respiratoire',
    type: 'checkbox',
    options: [
      { value: 'Respiration régulière', label: 'Respiration régulière' },
      { value: 'Aucun signe de détresse', label: 'Aucun signe de détresse' },
      { value: 'Dyspnée au repos', label: 'Dyspnée au repos' },
      { value: 'Dyspnée à l’effort', label: 'Dyspnée à l’effort' },
      { value: 'Toux sèche', label: 'Toux sèche' },
      { value: 'Toux productive', label: 'Toux productive' },
      { value: 'Sécrétions abondantes', label: 'Sécrétions abondantes' },
      { value: 'Utilisation d’O₂', label: 'Utilisation d’O₂' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Surveillance de la saturation en O₂', label: 'Surveillance de la saturation en O₂' },
        { value: 'Auscultation pulmonaire', label: 'Auscultation pulmonaire' },
        { value: 'Aspiration des sécrétions si besoin', label: 'Aspiration des sécrétions' },
        { value: 'Position semi-assise', label: 'Position semi-assise' },
        { value: 'Administration d\'O₂ selon prescription', label: 'Administration d\'O₂' },
    ]
  },
  {
    id: 'signesVitaux',
    title: 'Signes vitaux (SV)',
    type: 'radio',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'Anormal', label: 'Anormal' },
    ],
  },
  {
    id: 'digestif',
    title: 'Système digestif',
    type: 'checkbox',
    options: [
      { value: 'Appétit conservé', label: 'Appétit conservé' },
      { value: 'Appétit diminué', label: 'Appétit diminué' },
      { value: 'Alimentation bien tolérée', label: 'Alimentation bien tolérée' },
      { value: 'Nausées', label: 'Nausées' },
      { value: 'Vomissements', label: 'Vomissements' },
      { value: 'Selles normales', label: 'Selles normales' },
      { value: 'Constipation', label: 'Constipation' },
      { value: 'Diarrhée', label: 'Diarrhée' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Surveillance des nausées/vomissements', label: 'Surveillance N/V' },
        { value: 'Administration d\'antiémétiques si prescrits', label: 'Admin. antiémétiques' },
        { value: 'Surveillance du transit intestinal', label: 'Surveillance du transit' },
        { value: 'Encourager l\'hydratation', label: 'Encourager l\'hydratation' },
        { value: 'Conseils diététiques', label: 'Conseils diététiques' },
    ]
  },
  {
    id: 'urinaire',
    title: 'Système urinaire',
    type: 'checkbox',
    options: [
      { value: 'Diurèse normale', label: 'Diurèse normale' },
      { value: 'Diurèse diminuée', label: 'Diurèse diminuée' },
      { value: 'Anurie', label: 'Anurie' },
      { value: 'Urine claire', label: 'Urine claire' },
      { value: 'Urine foncée', label: 'Urine foncée' },
      { value: 'Sonde urinaire', label: 'Sonde urinaire' },
      { value: 'Absence de signe d’infection', label: 'Absence de signe d’infection' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Surveillance de la diurèse', label: 'Surveillance de la diurèse' },
        { value: 'Soins de sonde urinaire', label: 'Soins de sonde urinaire' },
        { value: 'Encourager les apports hydriques', label: 'Encourager les apports hydriques' },
        { value: 'Surveillance des signes d\'infection', label: 'Surveillance signes d\'infection' },
        { value: 'Aide à la mobilisation pour la miction', label: 'Aide à la miction' },
    ]
  },
  {
    id: 'tegumentaire',
    title: 'Tégumentaire (peau)',
    type: 'checkbox',
    options: [
      { value: 'Peau intacte', label: 'Peau intacte' },
      { value: 'Rougeur', label: 'Rougeur' },
      { value: 'Lésion/plaie', label: 'Lésion/plaie' },
      { value: 'Escarre', label: 'Escarre' },
      { value: 'Pansement propre', label: 'Pansement propre' },
      { value: 'Pansement souillé', label: 'Pansement souillé' },
      { value: 'Changement de pansement effectué', label: 'Changement de pansement effectué' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Réfection du pansement selon protocole', label: 'Réfection du pansement' },
        { value: 'Surveillance de l\'état de la plaie', label: 'Surveillance de la plaie' },
        { value: 'Prévention d\'escarres', label: 'Prévention d\'escarres' },
        { value: 'Application de crème protectrice', label: 'Application de crème' },
        { value: 'Évaluation de la douleur de la plaie', label: 'Évaluation douleur plaie' },
    ]
  },
  {
    id: 'geriatrie',
    title: 'Évaluation gériatrique',
    type: 'checkbox',
    options: [
      { value: 'Confus(e) / désorienté(e)', label: 'Confus(e) / désorienté(e)' },
      { value: 'Agitation', label: 'Agitation' },
      { value: 'Apathie / Lenteur', label: 'Apathie / Lenteur' },
      { value: 'Marche avec aide technique', label: 'Marche avec aide technique' },
      { value: 'Risque de chute élevé', label: 'Risque de chute élevé' },
      { value: 'Alité(e)', label: 'Alité(e)' },
      { value: 'Aide nécessaire pour les transferts', label: 'Aide nécessaire pour les transferts' },
      { value: 'Risque de dénutrition', label: 'Risque de dénutrition' },
      { value: 'Risque de déshydratation', label: 'Risque de déshydratation' },
      { value: 'Aide au repas nécessaire', label: 'Aide au repas nécessaire' },
      { value: 'Troubles de déglutition / Fausses routes', label: 'Troubles de déglutition / Fausses routes' },
    ],
  },
  {
    id: 'soinsPalliatifs',
    title: 'Soins Palliatifs & Fin de Vie',
    type: 'checkbox',
    options: [
      { value: 'Douleur', label: 'Douleur' },
      { value: 'Fatigue / Asthénie', label: 'Fatigue' },
      { value: 'Nausées / Vomissements', label: 'Nausées / Vomissements' },
      { value: 'Anxiété / Agitation', label: 'Anxiété / Agitation' },
      { value: 'Dépression / Tristesse', label: 'Dépression / Tristesse' },
      { value: 'Somnolence', label: 'Somnolence' },
      { value: 'Perte d\'appétit / Anorexie', label: 'Perte d\'appétit' },
      { value: 'Dyspnée / Essoufflement', label: 'Dyspnée / Essoufflement' },
      { value: 'Respiration irrégulière / Apnée', label: 'Respiration irrégulière / Apnée' },
      { value: 'Encombrement bronchique / Râles terminaux', label: 'Encombrement / Râles' },
      { value: 'Tirage / Utilisation muscles accessoires', label: 'Tirage / Muscles accessoires' },
      { value: 'Constipation', label: 'Constipation' },
      { value: 'Confusion / Délirium', label: 'Confusion / Délirium' },
      { value: 'Bouche sèche / Soins de bouche effectués', label: 'Bouche sèche / Soins de bouche' },
      { value: 'Altération du bien-être général', label: 'Altération du bien-être' },
      { value: 'Soutien psychologique / spirituel', label: 'Soutien psychologique / spirituel' },
      { value: 'Présence de la famille / proches', label: 'Présence de la famille' },
    ],
  },
  {
    id: 'observations',
    title: 'Observations générales',
    type: 'checkbox',
    options: [
        { value: 'Calme et coopérant(e)', label: 'Calme et coopérant(e)' },
        { value: 'Anxieux/Anxieuse', label: 'Anxieux/Anxieuse' },
        { value: 'Agité(e)', label: 'Agité(e)' },
        { value: 'Sueurs / Diaphorèse', label: 'Sueurs / Diaphorèse' },
        { value: 'Sommeil réparateur', label: 'Sommeil réparateur' },
        { value: 'Sommeil perturbé', label: 'Sommeil perturbé' },
        { value: 'Mobilisation bien tolérée', label: 'Mobilisation bien tolérée' },
        { value: 'Bonne compréhension des soins', label: 'Bonne compréhension des soins' },
        { value: 'Suivi médical en cours', label: 'Suivi médical en cours' },
    ]
  },
  {
    id: 'visites',
    title: 'Visites de la famille / proches',
    type: 'radio',
    options: [
        { value: 'Oui', label: 'Oui' },
        { value: 'Non', label: 'Non' },
        { value: 'Non applicable', label: 'Non applicable' },
    ]
  }
];

export const painFieldsData: PainField[] = [
    { 
      id: 'p', 
      label: 'P - Provocation / Palliation', 
      type: 'checkbox',
      options: [
        { value: 'Mouvement', label: 'Mouvement' },
        { value: 'Repos', label: 'Repos' },
        { value: 'Pression', label: 'Pression' },
        { value: 'Changement de position', label: 'Changement de position' },
        { value: 'Médication', label: 'Médication' },
      ]
    },
    { 
      id: 'q', 
      label: 'Q - Qualité', 
      type: 'checkbox',
      options: [
        { value: 'Brûlure', label: 'Brûlure' },
        { value: 'Lancinante', label: 'Lancinante' },
        { value: 'Sourde', label: 'Sourde' },
        { value: 'Écrasement', label: 'Écrasement' },
        { value: 'Coup de poignard', label: 'Coup de poignard' },
        { value: 'Picotement', label: 'Picotement' },
      ] 
    },
    { 
      id: 'r', 
      label: 'R - Région / Rayonnement', 
      type: 'checkbox',
      options: [
        { value: 'Localisée', label: 'Localisée' },
        { value: 'Irradiation', label: 'Irradiation' },
        { value: 'Diffuse', label: 'Diffuse' },
      ]
    },
    { 
      id: 's', 
      label: 'S - Sévérité / Intensité', 
      type: 'radio',
      options: [
        { value: 'Légère (1-3/10)', label: 'Légère (1-3/10)' },
        { value: 'Modérée (4-6/10)', label: 'Modérée (4-6/10)' },
        { value: 'Sévère (7-10/10)', label: 'Sévère (7-10/10)' },
        { value: 'Non évaluable', label: 'Non évaluable' },
      ]
    },
    { 
      id: 't', 
      label: 'T - Temps', 
      type: 'checkbox',
      options: [
        { value: 'Continue', label: 'Continue' },
        { value: 'Intermittente', label: 'Intermittente' },
        { value: 'Apparition brutale', label: 'Apparition brutale' },
        { value: 'Apparition progressive', label: 'Apparition progressive' },
      ]
    },
    { 
      id: 'u', 
      label: 'U - Symptômes associés', 
      type: 'checkbox',
      options: [
        { value: 'Nausées', label: 'Nausées' },
        { value: 'Vertiges', label: 'Vertiges' },
        { value: 'Sueurs', label: 'Sueurs' },
        { value: 'Anxiété', label: 'Anxiété' },
        { value: 'Fatigue', label: 'Fatigue' },
        { value: 'Aucun', label: 'Aucun' },
      ]
    },
];

export const painNonPharmaInterventions: Option[] = [
    { value: 'Installation dans une position de confort', label: 'Installation en position de confort' },
    { value: 'Application de chaleur/froid', label: 'Application de chaleur/froid' },
    { value: 'Techniques de relaxation/distraction', label: 'Techniques de relaxation/distraction' },
    { value: 'Soutien psychologique/écoute active', label: 'Soutien psychologique/écoute active' },
    { value: 'Mobilisation douce', label: 'Mobilisation douce' },
    { value: 'Massage/friction', label: 'Massage/friction' },
];

export const scenariosByCategory: { category: string; scenarios: { label: string; description: string; state: Partial<FormState> }[] }[] = [
    {
        category: "Général & Admission",
        scenarios: [
            {
                label: 'Patient Stable',
                description: "Rapport standard pour un patient alerte, calme, avec des signes vitaux normaux et une douleur légère.",
                state: {
                    etatEveil: 'Alerte',
                    signesVitaux: 'Normal',
                    signesNeuro: 'Normal',
                    respiratoire: ['Respiration régulière', 'Aucun signe de détresse'],
                    digestif: ['Appétit conservé', 'Selles normales'],
                    urinaire: ['Diurèse normale', 'Urine claire'],
                    tegumentaire: ['Peau intacte'],
                    observations: ['Calme et coopérant(e)'],
                    douleur: { ...initialPainState, s: 'Légère (1-3/10)' }
                }
            },
            {
                label: 'Admission Patient',
                description: "Complète les informations d'admission de base, orientation et installation du patient.",
                state: {
                    admissionCheckboxes: ['Bracelet d\'identification vérifié et conforme', 'Allergies vérifiées et signalées au dossier', 'Enseignement sur le fonctionnement de l\'unité et l\'appel infirmier effectué'],
                    orientation: ['Temps', 'Lieu', 'Personne'],
                    autonomie: 'Autonome',
                    etatEveil: 'Alerte',
                    observations: ['Calme et coopérant(e)'],
                    particularites: 'Admission pour [MOTIF]. Installation dans la chambre effectuée. Constantes de base prises et dossier complété. Le/la patient(e) semble bien s\'adapter à l\'environnement.'
                }
            },
            {
                label: 'Fin de Quart',
                description: "Note de fin de quart pour un patient stable, incluant la transmission des informations.",
                state: {
                    observations: ['Calme et coopérant(e)', 'Sommeil réparateur'],
                    particularites: 'Transmission effectuée à l\'équipe suivante. État stable, aucun événement notable durant le quart.'
                }
            },
        ]
    },
    {
        category: 'Urgences & Événements Aigus',
        scenarios: [
            {
                label: 'Chute du Patient',
                description: "Rédige une note pour une chute, incluant l'évaluation, la douleur, et l'avis au médecin.",
                state: {
                    etatEveil: 'Alerte',
                    signesNeuro: 'Anormal',
                    geriatrie: ['Risque de chute élevé'],
                    tegumentaire: ['Rougeur'],
                    observations: ['Agité(e)'],
                    particularites: 'Patient(e) retrouvé(e) au sol près de son lit. Mécanisme de chute non-observé. Se plaint de douleur à la hanche droite. Pas de trauma crânien visible. Examen neurologique complet et surveillance initiés. Médecin avisé. Levée assistée.',
                    douleur: { ...initialPainState, s: 'Sévère (7-10/10)', site: 'Hanche droite', p: ['Mouvement'], q: ['Sourde'] },
                    morse: { history: 25, secondaryDiagnosis: 15, ambulatoryAid: 15, ivTherapy: 0, gait: 10, mentalStatus: 0 } // Score: 65
                }
            },
            {
                label: 'Détresse Respiratoire',
                description: "Scénario pour une dyspnée soudaine, incluant l'administration d'O2 et la surveillance.",
                state: {
                    position: ['Position semi-assise'],
                    etatEveil: 'Alerte',
                    respiratoire: ['Dyspnée au repos', 'Utilisation d’O₂'],
                    respiratoire_o2_litres: '3',
                    respiratoire_interventions: ['Surveillance de la saturation en O₂', 'Auscultation pulmonaire', 'Position semi-assise', 'Administration d\'O₂ selon prescription'],
                    observations: ['Anxieux/Anxieuse'],
                    particularites: 'Présente une augmentation soudaine de sa dyspnée. Saturation à 88% à l\'air ambiant, remonte à 94% avec O2 à 3L/min via lunette nasale. Toux productive avec sécrétions blanchâtres. Médecin avisé des changements.'
                }
            },
            {
                label: 'Douleur Thoracique',
                description: "Note pour une douleur thoracique, incluant ECG, PQRSTU et interventions.",
                state: {
                    position: ['Position semi-assise'],
                    etatEveil: 'Alerte',
                    signesVitaux: 'Anormal',
                    respiratoire: ['Aucun signe de détresse'],
                    observations: ['Anxieux/Anxieuse'],
                    particularites: 'Se plaint d\'une douleur thoracique rétrosternale survenue il y a 20 minutes. ECG effectué, en attente d\'interprétation par le médecin. Prélèvements sanguins (troponines) envoyés. Surveillances rapprochées.',
                    douleur: { ...initialPainState, s: 'Sévère (7-10/10)', q: ['Écrasement'], r: ['Irradiation'], site: 'Rétrosternale avec irradiation bras gauche', t: ['Continue'], u: ['Sueurs', 'Anxiété'], medicament: 'Nitroglycérine SL administrée avec soulagement partiel.' }
                }
            },
            {
                label: 'Patient Agité',
                description: "Pour un patient confus et agité, axé sur la sécurité et les mesures non-pharmacologiques.",
                state: {
                    etatEveil: 'Alerte',
                    geriatrie: ['Confus(e) / désorienté(e)', 'Agitation', 'Risque de chute élevé'],
                    observations: ['Agité(e)'],
                    particularites: 'Présente une agitation psychomotrice importante, tente de se lever du lit malgré les consignes. Propos incohérents. Surveillance accrue pour assurer sa sécurité. Mesures de contention non-pharmacologiques mises en place (ex: présence rassurante). Médecin avisé pour réévaluation.',
                }
            },
            {
                label: 'Hypoglycémie',
                description: "Note pour un événement hypoglycémique, incluant la glycémie, le resucrage et l'avis médical.",
                state: {
                    etatEveil: 'Somnolent',
                    signesNeuro: 'Anormal',
                    observations: ['Sueurs / Diaphorèse'],
                    particularites: 'Patient(e) retrouvé(e) somnolent(e). Glycémie capillaire à [VALEUR] mmol/L. Resucrage effectué avec [PRODUIT] per os. Contrôle glycémique à faire dans 15 minutes. Médecin avisé.',
                }
            },
            {
                label: 'Crise Hypertensive',
                description: "Scénario pour une poussée hypertensive avec céphalées, incluant la surveillance et le traitement.",
                state: {
                    signesVitaux: 'Anormal',
                    observations: ['Anxieux/Anxieuse'],
                    particularites: 'Se plaint de céphalées. Tension artérielle mesurée à [VALEUR] mmHg. Patient(e) mis(e) au repos au lit. Médecin avisé. Administration de [MÉDICAMENT] selon prescription. Surveillance tensionnelle horaire initiée.',
                    douleur: { ...initialPainState, s: 'Modérée (4-6/10)', site: 'Céphalées', q: ['Sourde'] }
                }
            },
        ]
    },
    {
        category: 'Post-Opératoire & Soins de Plaie',
        scenarios: [
            {
                label: 'Post-Op J+1',
                description: "Suivi standard au premier jour post-opératoire, incluant la plaie, la douleur et la mobilisation.",
                state: {
                    position: ['Position semi-assise'],
                    etatEveil: 'Alerte',
                    signesVitaux: 'Normal',
                    respiratoire: ['Respiration régulière'],
                    tegumentaire: ['Pansement propre', 'Changement de pansement effectué'],
                    observations: ['Mobilisation bien tolérée'],
                    particularites: 'Réfection du pansement au site opératoire [préciser site]. La plaie est belle, sans signe d\'infection. Drains en place, productifs. Mobilisation au fauteuil effectuée.',
                    douleur: { ...initialPainState, s: 'Modérée (4-6/10)', p: ['Mouvement'], q: ['Lancinante'], site: 'Site opératoire', medicament: 'Analgésie administrée avec bon soulagement.' }
                }
            },
            {
                label: 'Post-Fracture Hanche',
                description: "Suivi post-opératoire pour une fracture de hanche, axé sur la confusion et la mobilisation.",
                state: {
                    position: ['Décubitus dorsal'],
                    etatEveil: 'Somnolent',
                    signesNeuro: 'Anormal',
                    geriatrie: ['Confus(e) / désorienté(e)', 'Risque de chute élevé', 'Aide nécessaire pour les transferts'],
                    tegumentaire: ['Pansement propre'],
                    douleur: { ...initialPainState, s: 'Modérée (4-6/10)', p: ['Mouvement'], site: 'Hanche opérée', medicament: 'Analgésie IV administrée avec bon soulagement.' },
                    particularites: "Post-op J1 fracture de hanche. Pansement propre et sec. Mobilisation au lit permise. Neuro-signes stables mais patient(e) confus(e) par moments. Protocole de prévention du délirium en place. Surveillance circulation membre opéré.",
                    morse: { history: 25, secondaryDiagnosis: 15, ambulatoryAid: 30, ivTherapy: 20, gait: 20, mentalStatus: 15 }
                }
            },
            {
                label: 'Soins de Plaie',
                description: "Note pour la réfection d'un pansement, décrivant l'aspect de la plaie et la tolérance du patient.",
                state: {
                    tegumentaire: ['Lésion/plaie', 'Changement de pansement effectué'],
                    tegumentaire_interventions: ['Réfection du pansement selon protocole', 'Surveillance de l\'état de la plaie'],
                    particularites: 'Réfection du pansement de la plaie au [SITE]. Aspect de la plaie : propre, sans signe d\'infection, en bonne voie de cicatrisation. Patient(e) a bien toléré le soin.',
                    douleur: { ...initialPainState, s: 'Légère (1-3/10)', p: ['Pression'], site: 'Site de la plaie' }
                }
            },
        ]
    },
    {
        category: 'Pathologies & Suivis',
        scenarios: [
             {
                label: 'Insuffisance Cardiaque',
                description: "Pour un patient en décompensation cardiaque, incluant OAP, poids et diurétiques.",
                state: {
                    position: ['Position semi-assise'],
                    etatEveil: 'Alerte',
                    signesVitaux: 'Anormal',
                    respiratoire: ['Dyspnée à l’effort', 'Utilisation d’O₂'],
                    respiratoire_o2_litres: '2',
                    observations: ['Anxieux/Anxieuse'],
                    particularites: "Patient(e) admis(e) pour décompensation d'insuffisance cardiaque. Présente des œdèmes aux membres inférieurs +++. Poids ce matin : [X] kg. Diurétiques IV administrés selon prescription. Surveillance stricte des ingesta/excreta. Restriction hydrique en place.",
                }
            },
            {
                label: 'Post-AVC',
                description: "Suivi pour un patient post-AVC, incluant les déficits neurologiques et le plan de soins.",
                state: {
                    etatEveil: 'Somnolent',
                    signesNeuro: 'Anormal',
                    geriatrie: ['Aide nécessaire pour les transferts', 'Troubles de déglutition / Fausses routes', 'Apathie / Lenteur'],
                    particularites: 'Patient(e) au J2 de son AVC ischémique. Hémiparésie droite. Difficulté d\'élocution (aphasie). Alimentation en texture adaptée bien tolérée. Mobilisation au fauteuil avec aide x2. Plan de soins suivi.',
                    douleur: { ...initialPainState, s: 'Non évaluable' }
                }
            },
            {
                label: 'Infection / Fièvre',
                description: "Note pour un pic fébrile, incluant prélèvements, antibiothérapie et surveillance.",
                state: {
                    etatEveil: 'Somnolent',
                    signesVitaux: 'Anormal',
                    tegumentaire: ['Rougeur'],
                    urinaire: ['Urine foncée'],
                    observations: ['Sommeil perturbé', 'Sueurs / Diaphorèse'],
                    particularites: 'Pic fébrile à 38.9°C. Hémocultures et ECBU prélevés. Initiation de l\'antibiothérapie IV selon la prescription. Bien hydraté(e). Frissons rapportés.',
                    douleur: { ...initialPainState, s: 'Modérée (4-6/10)', p: ['Repos'], q: ['Sourde'], site: 'Diffuse (courbatures)' }
                }
            },
            {
                label: 'Sevrage Alcool (ROH)',
                description: "Pour un patient en sevrage, incluant le protocole CIWA et la surveillance des symptômes.",
                state: {
                    etatEveil: 'Alerte',
                    signesNeuro: 'Anormal',
                    observations: ['Agité(e)', 'Sueurs / Diaphorèse', 'Anxieux/Anxieuse'],
                    particularites: "Patient(e) admis(e) pour sevrage d'alcool. Protocole CIWA débuté. Surveillance des signes vitaux et neurologiques rapprochée. Hydratation IV en cours. Benzodiazépines administrées au besoin selon le score CIWA.",
                    ciwa: { nauseaVomiting: 2, tremor: 3, sweats: 4, anxiety: 4, agitation: 2, tactile: 0, auditory: 0, visual: 0, headache: 3, orientation: 0 }
                }
            },
            {
                label: 'Suivi Diabète',
                description: "Note standard pour le contrôle glycémique et l'administration d'insuline.",
                state: {
                    digestif: ['Alimentation bien tolérée'],
                    particularites: 'Glycémie capillaire effectuée : [VALEUR] mmol/L. Administration de [X] unités d\'insuline [TYPE] selon l\'échelle mobile. Repas bien toléré. Aucun signe d\'hypo/hyperglycémie noté.'
                }
            },
            {
                label: 'Anticoagulothérapie',
                description: "Suivi d'un patient sous anticoagulants, incluant l'INR et l'ajustement de la dose.",
                state: {
                    signesVitaux: 'Normal',
                    observations: ['Bonne compréhension des soins'],
                    particularites: "Suivi pour anticoagulothérapie sous [MÉDICAMENT]. INR de ce jour à [VALEUR]. Médecin avisé, ajustement de la dose selon protocole. Enseignement fait sur les signes de saignement. Prochain contrôle prévu."
                }
            },
            {
                label: 'Transfusion Sanguine',
                description: "Note pour le suivi d'une transfusion de culot globulaire, incluant la surveillance des réactions.",
                state: {
                    observations: ['Suivi médical en cours'],
                    particularites: 'Début de la transfusion du 1er culot globulaire (CG) à [HEURE]. Patient(e) apyrétique, signes vitaux stables avant, pendant et après la transfusion. Aucune réaction transfusionnelle observée. Surveillance maintenue selon protocole.'
                }
            },
        ]
    },
    {
        category: "Soins Palliatifs / Confort",
        scenarios: [
            {
                label: 'Soins Palliatifs',
                description: "Note axée sur le confort, la gestion de la douleur et des symptômes en soins de fin de vie.",
                state: {
                    position: ['Position semi-assise'],
                    etatEveil: 'Somnolent',
                    soinsPalliatifs: ['Douleur', 'Nausées / Vomissements', 'Fatigue / Asthénie', 'Encombrement bronchique / Râles terminaux', 'Bouche sèche / Soins de bouche effectués', 'Soutien psychologique / spirituel', 'Présence de la famille / proches'],
                    observations: ['Calme'],
                    particularites: 'Patient(e) en soins de confort. Famille présente au chevet. Administration des antalgiques et antiémétiques selon le protocole avec bon soulagement des symptômes. Soins de bouche effectués régulièrement.',
                    douleur: { ...initialPainState, s: 'Modérée (4-6/10)', t: ['Continue'], medicament: 'Hydromorphone SC au besoin, efficace.', interventionsNonPharma: ['Installation dans une position de confort', 'Soutien psychologique/écoute active'] }
                }
            },
        ]
    }
];


export const morseScaleData: { id: keyof MorseScaleState; label: string; options: { label: string; value: number }[] }[] = [
    { id: 'history', label: 'Antécédents de chute (dans les 3 derniers mois)', options: [{ label: 'Non', value: 0 }, { label: 'Oui', value: 25 }] },
    { id: 'secondaryDiagnosis', label: 'Diagnostic secondaire', options: [{ label: 'Non', value: 0 }, { label: 'Oui', value: 15 }] },
    { id: 'ambulatoryAid', label: 'Aide à la marche', options: [{ label: 'Aucune / Alité / Aide de l\'infirmière', value: 0 }, { label: 'Béquilles / Canne / Déambulateur', value: 15 }, { label: 'S\'appuie sur les meubles', value: 30 }] },
    { id: 'ivTherapy', label: 'Thérapie intraveineuse / Cathéter veineux', options: [{ label: 'Non', value: 0 }, { label: 'Oui', value: 20 }] },
    { id: 'gait', label: 'Démarche / Transfert', options: [{ label: 'Normale / Alité / Immobilité', value: 0 }, { label: 'Faible', value: 10 }, { label: 'Anormale / Perturbée', value: 20 }] },
    { id: 'mentalStatus', label: 'État mental (conscience de ses propres limites)', options: [{ label: 'Conscient de ses limites', value: 0 }, { label: 'Sur-estime ou oublie ses limites', value: 15 }] },
];

export const bradenScaleData: { id: keyof BradenScaleState; label: string; options: { label: string; value: number }[] }[] = [
    { id: 'sensoryPerception', label: 'Perception sensorielle', options: [{ label: '1. Totalement limitée', value: 1 }, { label: '2. Très limitée', value: 2 }, { label: '3. Légèrement limitée', value: 3 }, { label: '4. Aucune altération', value: 4 }] },
    { id: 'moisture', label: 'Humidité', options: [{ label: '1. Constamment humide', value: 1 }, { label: '2. Souvent humide', value: 2 }, { label: '3. Occasionnellement humide', value: 3 }, { label: '4. Rarement humide', value: 4 }] },
    { id: 'activity', label: 'Activité', options: [{ label: '1. Alité', value: 1 }, { label: '2. Au fauteuil', value: 2 }, { label: '3. Marche occasionnellement', value: 3 }, { label: '4. Marche fréquemment', value: 4 }] },
    { id: 'mobility', label: 'Mobilité', options: [{ label: '1. Totalement immobile', value: 1 }, { label: '2. Très limitée', value: 2 }, { label: '3. Légèrement limitée', value: 3 }, { label: '4. Aucune limitation', value: 4 }] },
    { id: 'nutrition', label: 'Nutrition', options: [{ label: '1. Très pauvre', value: 1 }, { label: '2. Probablement inadéquate', value: 2 }, { label: '3. Adéquate', value: 3 }, { label: '4. Excellente', value: 4 }] },
    { id: 'frictionAndShear', label: 'Friction et cisaillement', options: [{ label: '1. Problème', value: 1 }, { label: '2. Problème potentiel', value: 2 }, { label: '3. Pas de problème apparent', value: 3 }] },
];

export const ciwaScaleData: { id: keyof CIWAScaleState; label: string; options: { label: string; value: number }[] }[] = [
    { id: 'nauseaVomiting', label: 'Nausées et vomissements', options: [
        { label: '0 - Aucune nausée ni vomissement', value: 0 },
        { label: '1 - Nausées légères sans vomissement', value: 1 },
        { label: '4 - Nausées intermittentes avec haut-le-cœur', value: 4 },
        { label: '7 - Nausées et vomissements constants', value: 7 },
    ]},
    { id: 'tremor', label: 'Tremblements', options: [
        { label: '0 - Aucun tremblement', value: 0 },
        { label: '1 - Non visible, mais peut être senti au bout des doigts', value: 1 },
        { label: '4 - Modéré, avec les bras étendus', value: 4 },
        { label: '7 - Sévère, même sans extension des bras', value: 7 },
    ]},
    { id: 'sweats', label: 'Sueurs paroxystiques', options: [
        { label: '0 - Pas de sueur', value: 0 },
        { label: '1 - Sueur à peine perceptible, paumes moites', value: 1 },
        { label: '4 - Gouttelettes de sueur évidentes sur le front', value: 4 },
        { label: '7 - Sueurs profuses', value: 7 },
    ]},
    { id: 'anxiety', label: 'Anxiété', options: [
        { label: '0 - Aucune anxiété, calme', value: 0 },
        { label: '1 - Légèrement anxieux', value: 1 },
        { label: '4 - Modérément anxieux, ou gardé avec prudence', value: 4 },
        { label: '7 - Équivalent à un état de panique aiguë', value: 7 },
    ]},
    { id: 'agitation', label: 'Agitation', options: [
        { label: '0 - Normal, calme', value: 0 },
        { label: '1 - Un peu agité', value: 1 },
        { label: '2 - Modérément agité et irritable', value: 2 },
        { label: '4 - Assez agité, remue beaucoup', value: 4 },
        { label: '7 - Va et vient, se débat constamment', value: 7 },
    ]},
    { id: 'tactile', label: 'Perturbations tactiles', options: [
        { label: '0 - Aucune', value: 0 },
        { label: '1 - Démangeaisons, picotements, brûlures, engourdissements très légers', value: 1 },
        { label: '2 - Démangeaisons, picotements, brûlures, engourdissements légers', value: 2 },
        { label: '3 - Hallucinations tactiles modérées', value: 3 },
        { label: '5 - Hallucinations tactiles sévères', value: 5 },
        { label: '7 - Hallucinations tactiles continues', value: 7 },
    ]},
    { id: 'auditory', label: 'Perturbations auditives', options: [
        { label: '0 - Aucune', value: 0 },
        { label: '1 - Sensibilité accrue aux sons', value: 1 },
        { label: '2 - Hallucinations auditives légères', value: 2 },
        { label: '3 - Hallucinations auditives modérées', value: 3 },
        { label: '5 - Hallucinations auditives sévères', value: 5 },
        { label: '7 - Hallucinations auditives continues', value: 7 },
    ]},
    { id: 'visual', label: 'Perturbations visuelles', options: [
        { label: '0 - Aucune', value: 0 },
        { label: '1 - Sensibilité accrue à la lumière', value: 1 },
        { label: '2 - Hallucinations visuelles légères', value: 2 },
        { label: '3 - Hallucinations visuelles modérées', value: 3 },
        { label: '5 - Hallucinations visuelles sévères', value: 5 },
        { label: '7 - Hallucinations visuelles continues', value: 7 },
    ]},
    { id: 'headache', label: 'Céphalées, sensation de tête pleine', options: [
        { label: '0 - Aucune', value: 0 },
        { label: '1 - Très légère', value: 1 },
        { label: '2 - Légère', value: 2 },
        { label: '3 - Modérée', value: 3 },
        { label: '5 - Sévère', value: 5 },
        { label: '7 - Très sévère, insupportable', value: 7 },
    ]},
    { id: 'orientation', label: 'Orientation et état de conscience', options: [
        { label: '0 - Orienté et peut faire des additions en série', value: 0 },
        { label: '1 - Incapable de faire des additions en série', value: 1 },
        { label: '2 - Désorienté dans la date', value: 2 },
        { label: '3 - Désorienté dans le lieu', value: 3 },
        { label: '4 - Désorienté dans la personne', value: 4 },
    ]},
];