

export interface Option {
  value: string;
  label: string;
}

export type SectionType = 'radio' | 'checkbox';

export interface LayoutSettings {
  // Mise en page
  positionY: number; // Position Verticale (cm)
  positionX: number; // Position Horizontale (cm)
  textBlockWidth: number; // Largeur du bloc de texte (cm)
  // Texte
  fontFamily: 'Helvetica' | 'Times' | 'Courier'; // Police
  fontSize: number; // Taille (pt)
  fontWeight: number; // Épaisseur
  lineHeight: number; // Hauteur de ligne
  entrySpacing: number; // Espacement (pt)
  opacity: number; // Densité (0-100)
  // Impression étiquette
  labelWidth: number; // Largeur (cm)
  labelHeight: number; // Hauteur (cm)
}


export interface PainState {
  p: string[];
  q: string[];
  r: string[];
  site: string;
  s: string;
  t: string[];
  u: string[];
  medicament: string;
  interventionsNonPharma: string[];
}

export interface PainField {
  id: keyof Omit<PainState, 'medicament' | 'interventionsNonPharma' | 'site'>;
  label: string;
  type: 'radio' | 'checkbox';
  options: Option[];
}

export interface MorseScaleState {
    history: number;
    secondaryDiagnosis: number;
    ambulatoryAid: number;
    ivTherapy: number;
    gait: number;
    mentalStatus: number;
}

export interface BradenScaleState {
    sensoryPerception: number;
    moisture: number;
    activity: number;
    mobility: number;
    nutrition: number;
    frictionAndShear: number;
}

export interface CIWAScaleState {
    nauseaVomiting: number;
    tremor: number;
    sweats: number;
    anxiety: number;
    agitation: number;
    tactile: number;
    auditory: number;
    visual: number;
    headache: number;
    orientation: number;
}

export interface FormState {
  quart: string;
  gender: string;
  // Admission fields
  admissionCheckboxes: string[];
  orientation: string[];
  autonomie: string;
  effetsPersonnels: string;
  accesVeineux: boolean;
  accesVeineux_gauge: string;
  accesVeineux_site: string;
  piccLine: boolean;
  piccLine_site: string;
  drains: string[];
  sondes: string[];
  // Other sections
  position: string[];
  etatEveil: string;
  signesVitaux: string;
  signesNeuro: string;
  respiratoire: string[];
  respiratoire_medicament: string;
  respiratoire_interventions: string[];
  respiratoire_o2_litres: string;
  digestif: string[];
  digestif_medicament: string;
  digestif_interventions: string[];
  urinaire: string[];
  urinaire_medicament: string;
  urinaire_interventions: string[];
  tegumentaire: string[];
  tegumentaire_medicament: string;
  tegumentaire_interventions: string[];
  geriatrie: string[];
  soinsPalliatifs: string[];
  soinsPalliatifs_autres: string;
  observations: string[];
  visites: string;
  particularites: string;
  douleur: PainState;
  morse: MorseScaleState;
  braden: BradenScaleState;
  ciwa: CIWAScaleState;
}

export interface SectionData {
  id: keyof Omit<FormState, 'douleur' | 'particularites' | `${string}_medicament` | `${string}_interventions'` | 'respiratoire_o2_litres' | 'quart' | 'gender' | 'admissionCheckboxes' | 'orientation' | 'autonomie' | 'effetsPersonnels' | 'accesVeineux' | 'accesVeineux_gauge' | 'accesVeineux_site' | 'piccLine' | 'piccLine_site' | 'drains' | 'sondes' | 'morse' | 'braden' | 'ciwa' | 'soinsPalliatifs_autres'>;
  title: string;
  type: SectionType;
  options: Option[];
  hasIntervention?: boolean;
  interventions?: Option[];
}

export interface NoteEntry {
  id: string;
  timestamp: string;
  content: string;
}

export interface PatientState {
  formState: FormState;
  noteEntries: NoteEntry[];
}

// Represents a saved template for a single patient state
export type SavedState = PatientState;