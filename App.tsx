
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import jsPDF from 'jspdf';
import { sectionsData, painFieldsData, initialPainState, initialMorseState, initialBradenState, initialCIWAState, defaultLayoutSettings } from './constants';
// FIX: Import the 'Option' type to resolve type errors for 'quartOptions' and 'genderOptions'.
import type { FormState, PainState, SavedState, PatientState, MorseScaleState, BradenScaleState, CIWAScaleState, Option, LayoutSettings, NoteEntry } from './types';
import CollapsibleSection from './components/CollapsibleSection';
import RadioGroup from './components/RadioGroup';
import CheckboxGroup from './components/CheckboxGroup';
import PainSection from './components/PainSection';
import GeneratedNote from './components/GeneratedNote';
import Header from './components/Header';
import Footer from './components/Footer';
import ParticularitesSection from './components/ParticularitesSection';
import AccessCodeScreen from './components/AccessCodeScreen';
import ChangePasswordModal from './components/ChangePasswordModal';
import QuickScenarios from './components/QuickScenarios';
import AdmissionSection from './components/AdmissionSection';
import SaveLoad from './components/SaveLoad';
import PatientTabs from './components/PatientTabs';
import MorseScaleSection from './components/MorseScaleSection';
import BradenScaleSection from './components/BradenScaleSection';
import CIWAScaleSection from './components/CIWAScaleSection';
import ShiftReportModal from './components/ShiftReportModal';
import ZplLabelModal from './components/ZplLabelModal';
import PdfLayoutSettings from './components/PdfLayoutSettings';
import AiAssistantModal from './components/AiAssistantModal';

// Helper function to build the admission details string
const buildAdmissionDetails = (state: FormState): string => {
    const admissionDetails = [];
    if (state.admissionCheckboxes.length > 0) admissionDetails.push(...state.admissionCheckboxes);
    if (state.orientation.length > 0) admissionDetails.push(`Orientation: ${state.orientation.join(', ')}.`); else admissionDetails.push("Orientation: Non évaluée ou non orienté(e).");
    if (state.autonomie) admissionDetails.push(`Autonomie fonctionnelle: ${state.autonomie}.`);
    if (state.effetsPersonnels.trim()) admissionDetails.push(`Effets personnels: ${state.effetsPersonnels.trim()}.`);
    if (state.accesVeineux) { let accesVeineuxText = `Accès veineux (CVP) fonctionnel`; if (state.accesVeineux_gauge) accesVeineuxText += `, calibre ${state.accesVeineux_gauge}`; if (state.accesVeineux_site) accesVeineuxText += ` au ${state.accesVeineux_site}`; admissionDetails.push(accesVeineuxText + '.'); }
    if (state.piccLine) { let piccLineText = 'PICC Line en place et fonctionnel'; if (state.piccLine_site) piccLineText += ` au ${state.piccLine_site}`; admissionDetails.push(piccLineText + '.'); }
    if (state.drains.length > 0) admissionDetails.push(`Drains en place: ${state.drains.join(', ')}.`);
    if (state.sondes.length > 0) admissionDetails.push(`Sondes en place: ${state.sondes.join(', ')}.`);
    return admissionDetails.length > 0 ? `- Admission : ${admissionDetails.join(' ')}` : '';
};

// Helper function to build the clinical systems details string
const buildSystemsDetails = (state: FormState): string[] => {
    const parts: string[] = [];
    sectionsData.forEach(section => {
        const content = [];
        const selection = state[section.id as keyof FormState];
        if (Array.isArray(selection) && selection.length > 0) {
            let processedSelection = selection;
            if (section.id === 'respiratoire' && selection.includes('Utilisation d’O₂') && state.respiratoire_o2_litres) { processedSelection = selection.map(item => item === 'Utilisation d’O₂' ? `Utilisation d’O₂ (${state.respiratoire_o2_litres} L/min)` : item); }
            content.push(processedSelection.join(', '));
        } else if (typeof selection === 'string' && selection) {
            content.push(section.title.startsWith('Signes vitaux') || section.title.startsWith('Signes neurologiques') ? `${selection}, voir feuille spéciale` : selection);
        }
        if (section.id === 'soinsPalliatifs' && state.soinsPalliatifs_autres && state.soinsPalliatifs_autres.trim()) {
            content.push(`Autres: ${state.soinsPalliatifs_autres.trim()}`);
        }
        if (section.hasIntervention) {
            const medicament = state[`${section.id}_medicament` as keyof FormState] as string; if (medicament) content.push(`médicament administré: ${medicament}`);
            const interventions = state[`${section.id}_interventions` as keyof FormState] as string[]; if (interventions?.length > 0) content.push(`interventions: ${interventions.join(', ')}`);
        }
        if (content.length > 0) parts.push(`- ${section.title} : ${content.join('; ')}.`);
    });
    return parts;
};

// Helper function to build the scales (Morse, Braden, CIWA) details string
const buildScalesDetails = (state: FormState): string[] => {
    const parts: string[] = [];
    
    // FIX: In strict mode, Object.values() returns unknown[], which causes errors with `reduce`. Cast to number[] to ensure type safety.
    const morseTotal = (Object.values(state.morse) as number[]).reduce((sum, val) => sum + val, 0);
    if (Object.values(state.morse).some(v => v !== 0)) {
        let risk = 'Aucun risque identifié (0-24)';
        if (morseTotal >= 51) risk = 'Risque élevé (>=51)';
        else if (morseTotal >= 25) risk = 'Risque faible à modéré (25-50)';
        parts.push(`- Risque de Chute (Morse): Score ${morseTotal}. ${risk}.`);
    }

    // FIX: In strict mode, Object.values() returns unknown[], which causes errors with `reduce`. Cast to number[] to ensure type safety.
    const bradenTotal = (Object.values(state.braden) as number[]).reduce((sum, val) => sum + val, 0);
    if (Object.values(state.braden).some(v => v !== 1)) {
        let risk = 'Risque très élevé (<=9)';
        if (bradenTotal >= 19) risk = 'Pas de risque (19-23)';
        else if (bradenTotal >= 15) risk = 'Risque léger (15-18)';
        else if (bradenTotal >= 13) risk = 'Risque modéré (13-14)';
        else if (bradenTotal >= 10) risk = 'Risque élevé (10-12)';
        parts.push(`- Risque de Plaie de Pression (Braden): Score ${bradenTotal}/23. ${risk}.`);
    }

    // FIX: In strict mode, Object.values() returns unknown[], which causes errors with `reduce`. Cast to number[] to ensure type safety.
    const ciwaTotal = (Object.values(state.ciwa) as number[]).reduce((sum, val) => sum + val, 0);
    if (Object.values(state.ciwa).some(v => v !== 0)) {
        let risk = 'Sevrage léger (<10)';
        if (ciwaTotal > 18) risk = 'Sevrage sévère (>18)';
        else if (ciwaTotal >= 10) risk = 'Sevrage modéré (10-18)';
        parts.push(`- Sevrage d'Alcool (CIWA-Ar): Score ${ciwaTotal}. ${risk}.`);
    }

    return parts;
};

// Helper function to build the pain (PQRSTU) details string
const buildPainDetails = (douleur: PainState): string => {
    const { p, q, r, s, t, u, site: painSite, medicament: painMedicament, interventionsNonPharma } = douleur;
    const painDetails = Object.entries({p, q, r, s, t, u}).map(([key, value]) => {
        const fieldLabel = painFieldsData.find(f => f.id === key)?.label || key.toUpperCase();
        if (key === 'r') { const rValues = Array.isArray(value) ? value : []; if (rValues.length === 0 && !painSite) return null; let rText = rValues.join(', '); if (painSite) rText += `${rText ? '; ' : ''}Site: ${painSite}`; return `  - ${fieldLabel} : ${rText}`; }
        if ((Array.isArray(value) && value.length > 0) || (typeof value === 'string' && value)) { return `  - ${fieldLabel} : ${Array.isArray(value) ? value.join(', ') : value}`; }
        return null;
    }).filter(Boolean);

    if (painDetails.length > 0 || painMedicament || (interventionsNonPharma?.length > 0)) {
        let painString = "- Douleur (PQRSTU) :";
        if (painDetails.length > 0) painString += `\n${painDetails.join('\n')}`;
        if (painMedicament) painString += `\n  - Intervention pharmacologique (Médicament) : ${painMedicament}`;
        if (interventionsNonPharma?.length > 0) painString += `\n  - Interventions non pharmacologiques : ${interventionsNonPharma.join(', ')}`;
        return painString;
    }
    return '';
};


const App: React.FC = () => {
  const [accessCode, setAccessCode] = useState<string>(() => localStorage.getItem('APP_ACCESS_CODE') || '19960213');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const [eventTime, setEventTime] = useState<string>('');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme') as 'light' | 'dark';
    }
    return 'light'; // Default theme
  });

  const initialFormState: FormState = useMemo(() => ({
    quart: '',
    gender: '',
    admissionCheckboxes: [],
    orientation: [],
    autonomie: '',
    effetsPersonnels: '',
    accesVeineux: false,
    accesVeineux_gauge: '',
    accesVeineux_site: '',
    piccLine: false,
    piccLine_site: '',
    drains: [],
    sondes: [],
    position: [],
    etatEveil: '',
    signesVitaux: '',
    signesNeuro: '',
    respiratoire: [],
    respiratoire_medicament: '',
    respiratoire_interventions: [],
    respiratoire_o2_litres: '',
    digestif: [],
    digestif_medicament: '',
    digestif_interventions: [],
    urinaire: [],
    urinaire_medicament: '',
    urinaire_interventions: [],
    tegumentaire: [],
    tegumentaire_medicament: '',
    tegumentaire_interventions: [],
    geriatrie: [],
    soinsPalliatifs: [],
    soinsPalliatifs_autres: '',
    douleur: initialPainState,
    morse: initialMorseState,
    braden: initialBradenState,
    ciwa: initialCIWAState,
    observations: [],
    visites: '',
    particularites: '',
  }), []);

  const createNewPatient = useCallback((): PatientState => ({
    formState: JSON.parse(JSON.stringify(initialFormState)),
    noteEntries: [],
  }), [initialFormState]);

  const [patients, setPatients] = useState<Record<string, PatientState>>({});
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [savedStates, setSavedStates] = useState<Record<string, SavedState>>({});
  const [nextRoomNumber, setNextRoomNumber] = useState<number>(101);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [shiftReportContent, setShiftReportContent] = useState('');
  const [reportError, setReportError] = useState<string | null>(null);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(defaultLayoutSettings);
  const [isZplModalOpen, setIsZplModalOpen] = useState(false);
  const [zplCode, setZplCode] = useState('');
  
  // State for AI Assistant
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // State lifted from GeneratedNote
  const [isCopied, setIsCopied] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageFileName, setBackgroundImageFileName] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    let initialPatients: Record<string, PatientState> = {};
    let initialActiveId: string | null = null;

    try {
        const savedPatientsData = localStorage.getItem('nurse-shift-patients');
        if (savedPatientsData) {
            const parsedData = JSON.parse(savedPatientsData);
            
            // Data migration for old structure (aiNote: string) to new (noteEntries: NoteEntry[])
            Object.keys(parsedData).forEach(patientId => {
                const patient = parsedData[patientId] as any;
                if (patient.aiNote && !patient.noteEntries) {
                    const entries: NoteEntry[] = [];
                    const noteString = patient.aiNote;
                    const regex = /(\d{2}:\d{2})\s*-\s*/g;
                    const matches = [...noteString.matchAll(regex)];

                    if (matches.length > 0) {
                        for (let i = 0; i < matches.length; i++) {
                            const currentMatch = matches[i];
                            const nextMatch = matches[i + 1];
                            const content = noteString.substring(
                                currentMatch.index! + currentMatch[0].length,
                                nextMatch ? nextMatch.index : undefined
                            ).trim();
                            if (content) entries.push({ id: `${Date.now()}-${i}`, timestamp: currentMatch[1], content: content });
                        }
                    } else if (noteString) {
                        entries.push({ id: Date.now().toString(), timestamp: '??:??', content: noteString });
                    }
                    patient.noteEntries = entries;
                    delete patient.aiNote;
                } else if (!patient.noteEntries) {
                    patient.noteEntries = [];
                }
            });

            const typedPatients = parsedData as Record<string, PatientState>;
            if (Object.keys(typedPatients).length > 0) {
                initialPatients = typedPatients;
                const savedActiveId = localStorage.getItem('nurse-shift-active-id');
                initialActiveId = (savedActiveId && typedPatients[savedActiveId]) ? savedActiveId : Object.keys(typedPatients)[0];
            }
        }
    } catch (e) {
        console.error("Failed to parse patients from localStorage", e);
    }

    if (Object.keys(initialPatients).length === 0) {
        const initialId = 'Ch. 101';
        initialPatients[initialId] = createNewPatient();
        initialActiveId = initialId;
    }
    
    setPatients(initialPatients);
    setActivePatientId(initialActiveId);
    
    const existingNumbers = Object.keys(initialPatients)
        .map(id => parseInt(id.replace(/[^0-9]/g, ''), 10))
        .filter(n => !isNaN(n));
    const calculatedNextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 101;

    const savedNextRoomNumber = localStorage.getItem('nurse-next-room-number');
    const initialNextNumber = savedNextRoomNumber ? parseInt(savedNextRoomNumber, 10) : calculatedNextNumber;

    setNextRoomNumber(Math.max(calculatedNextNumber, initialNextNumber));
  }, [createNewPatient]);


  // Save state to localStorage on change
  useEffect(() => {
    if (Object.keys(patients).length > 0 && activePatientId) {
        localStorage.setItem('nurse-shift-patients', JSON.stringify(patients));
        localStorage.setItem('nurse-shift-active-id', activePatientId);
    } else if (Object.keys(patients).length === 0) {
        localStorage.removeItem('nurse-shift-patients');
        localStorage.removeItem('nurse-shift-active-id');
    }
  }, [patients, activePatientId]);

  useEffect(() => {
      localStorage.setItem('nurse-next-room-number', String(nextRoomNumber));
  }, [nextRoomNumber]);
  
  const currentPatient = useMemo(() => activePatientId ? patients[activePatientId] : null, [patients, activePatientId]);
  const formState = useMemo(() => currentPatient?.formState || initialFormState, [currentPatient, initialFormState]);
  const noteEntries = useMemo(() => currentPatient?.noteEntries || [], [currentPatient]);

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setEventTime(`${hours}:${minutes}`);
  }, [activePatientId]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    useEffect(() => {
        const loadedSaves: Record<string, SavedState> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('nurse-note-template-')) {
                try {
                    // FIX: Add type assertion to ensure parsed saved state data matches the expected type.
                    const savedData = JSON.parse(localStorage.getItem(key)!) as SavedState;
                    const name = key.replace('nurse-note-template-', '');
                    loadedSaves[name] = savedData;
                } catch (e) {
                    console.error(`Failed to parse saved state for key: ${key}`, e);
                }
            }
        }
        setSavedStates(loadedSaves);
    }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleSectionToggle = useCallback((sectionId: string) => {
    setOpenSectionId(prevId => (prevId === sectionId ? null : sectionId));
  }, []);

  const updateActivePatientState = useCallback((updater: (prevState: PatientState) => PatientState) => {
    if (!activePatientId) return;
    setPatients(prevPatients => ({
        ...prevPatients,
        [activePatientId]: updater(prevPatients[activePatientId])
    }));
  }, [activePatientId]);

  const updateActivePatientFormState = useCallback((updater: (prevFormState: FormState) => Partial<FormState>) => {
      updateActivePatientState(prevPatientState => ({
          ...prevPatientState,
          formState: {
              ...prevPatientState.formState,
              ...updater(prevPatientState.formState)
          }
      }));
  }, [updateActivePatientState]);
  
  const handleUpdateNoteEntry = useCallback((id: string, newContent: string) => {
    updateActivePatientState(prev => ({
        ...prev,
        noteEntries: prev.noteEntries.map(entry =>
            entry.id === id ? { ...entry, content: newContent } : entry
        )
    }));
  }, [updateActivePatientState]);

  const handleDeleteNoteEntry = useCallback((id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
        updateActivePatientState(prev => ({
            ...prev,
            noteEntries: prev.noteEntries.filter(entry => entry.id !== id)
        }));
    }
  }, [updateActivePatientState]);

  const isAdmissionSectionFilled = useMemo((): boolean => {
    if (!formState) return false;
    const { admissionCheckboxes, orientation, autonomie, effetsPersonnels, accesVeineux, piccLine, drains, sondes, accesVeineux_site, piccLine_site } = formState;
    return admissionCheckboxes.length > 0 || orientation.length > 0 || autonomie !== '' || effetsPersonnels.trim() !== '' || accesVeineux || piccLine || drains.length > 0 || sondes.length > 0 || accesVeineux_site.trim() !== '' || piccLine_site.trim() !== '';
  }, [formState]);


  const isSectionFilled = useCallback((sectionId: keyof FormState | 'douleur' | 'particularites' | 'morse' | 'braden' | 'ciwa', state: FormState): boolean => {
    if (!state) return false;
    if (sectionId === 'douleur') {
      const { p, q, r, s, t, u, site, medicament, interventionsNonPharma } = state.douleur;
      return p.length > 0 || q.length > 0 || r.length > 0 || s !== '' || t.length > 0 || u.length > 0 || site.trim() !== '' || medicament.trim() !== '' || interventionsNonPharma.length > 0;
    }
    if (sectionId === 'particularites') return state.particularites.trim() !== '';
    if (sectionId === 'morse') return Object.values(state.morse).some(v => v !== 0);
    if (sectionId === 'braden') return Object.values(state.braden).some(v => v !== 1);
    if (sectionId === 'ciwa') return Object.values(state.ciwa).some(v => v !== 0);
    if (sectionId === 'soinsPalliatifs') {
        return state.soinsPalliatifs.length > 0 || (state.soinsPalliatifs_autres && state.soinsPalliatifs_autres.trim() !== '');
    }
    
    const value = state[sectionId as keyof FormState];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return false;
  }, []);

  const handleRadioChange = useCallback((sectionId: keyof FormState, value: string) => updateActivePatientFormState(() => ({ [sectionId]: value })), [updateActivePatientFormState]);
  const handleCheckboxChange = useCallback((sectionId: keyof FormState, value: string) => {
    updateActivePatientFormState(prevFormState => {
        const currentValues = prevFormState[sectionId] as string[];
        const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
        return { [sectionId]: newValues };
    });
  }, [updateActivePatientFormState]);

  const handlePainCheckboxChange = useCallback((field: keyof PainState, value: string) => {
    updateActivePatientFormState(prevFormState => {
        const currentValues = prevFormState.douleur[field] as string[];
        const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
        return { douleur: { ...prevFormState.douleur, [field]: newValues } };
    });
  }, [updateActivePatientFormState]);
  const handlePainRadioChange = useCallback((field: keyof PainState, value: string) => updateActivePatientFormState(prev => ({ douleur: { ...prev.douleur, [field]: value } })), [updateActivePatientFormState]);
  const handlePainSiteChange = useCallback((value: string) => updateActivePatientFormState(prev => ({ douleur: { ...prev.douleur, site: value } })), [updateActivePatientFormState]);
  const handleParticularitesChange = useCallback((value: string) => updateActivePatientFormState(() => ({ particularites: value })), [updateActivePatientFormState]);
  
  const handleMedicamentChange = useCallback((sectionId: string, value: string) => {
    const key = `${sectionId}_medicament` as keyof FormState;
    updateActivePatientFormState(() => ({ [key]: value }));
  }, [updateActivePatientFormState]);
  
  const handleInterventionChange = useCallback((sectionId: string, value: string) => {
    const key = `${sectionId}_interventions` as keyof FormState;
    updateActivePatientFormState(prev => {
        const currentValues = prev[key] as string[];
        const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
        return { [key]: newValues };
    });
  }, [updateActivePatientFormState]);

  const handlePainMedicamentChange = useCallback((value: string) => updateActivePatientFormState(prev => ({ douleur: { ...prev.douleur, medicament: value } })), [updateActivePatientFormState]);
  const handlePainNonPharmaChange = useCallback((value: string) => {
      updateActivePatientFormState(prev => {
          const currentValues = prev.douleur.interventionsNonPharma;
          const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
          return { douleur: { ...prev.douleur, interventionsNonPharma: newValues } };
      });
  }, [updateActivePatientFormState]);
  const handleRespiratoireO2LitresChange = useCallback((value: string) => updateActivePatientFormState(() => ({ respiratoire_o2_litres: value })), [updateActivePatientFormState]);
  const handleAdmissionChange = useCallback((field: keyof FormState, value: string | boolean | string[]) => updateActivePatientFormState(() => ({ [field]: value })), [updateActivePatientFormState]);
  const handleMorseChange = useCallback((field: keyof MorseScaleState, value: number) => updateActivePatientFormState(prev => ({ morse: { ...prev.morse, [field]: value }})), [updateActivePatientFormState]);
  const handleBradenChange = useCallback((field: keyof BradenScaleState, value: number) => updateActivePatientFormState(prev => ({ braden: { ...prev.braden, [field]: value }})), [updateActivePatientFormState]);
  const handleCIWAChange = useCallback((field: keyof CIWAScaleState, value: number) => updateActivePatientFormState(prev => ({ ciwa: { ...prev.ciwa, [field]: value }})), [updateActivePatientFormState]);

  const resetCurrentPatientData = useCallback(() => {
    if (!activePatientId) return;
    if (window.confirm(`Êtes-vous sûr de vouloir réinitialiser entièrement la note et le formulaire pour le patient ${activePatientId} ?`)) {
        setPatients(prev => ({...prev, [activePatientId]: createNewPatient()}));
        setGenerationError(null);
        setIsGenerating(false);
    }
  }, [activePatientId, createNewPatient]);

  const handleScenarioSelect = useCallback((scenarioState: Partial<FormState>) => {
    updateActivePatientFormState(prev => ({ ...initialFormState, quart: prev.quart, gender: prev.gender, ...scenarioState }));
    setOpenSectionId(null);
  }, [updateActivePatientFormState, initialFormState]);

  const isFormEmpty = useMemo(() => {
    if (!formState) return true;
    const { quart, gender, ...restOfForm } = formState;
    const { quart: initialQuart, gender: initialGender, ...restOfInitialForm } = initialFormState;
    return JSON.stringify(restOfForm) === JSON.stringify(restOfInitialForm);
  }, [formState, initialFormState]);
  
  const buildClinicalData = useCallback((state: FormState): string => {
    const parts: string[] = [];
    const { douleur, particularites, quart, gender } = state;
    
    if (quart) parts.push(`Contexte: note rédigée durant le quart de ${quart}.`);
    if (gender) parts.push(`Genre du patient: ${gender}.`);
    
    parts.push(buildAdmissionDetails(state));
    parts.push(...buildSystemsDetails(state));
    parts.push(...buildScalesDetails(state));
    parts.push(buildPainDetails(douleur));

    if (particularites.trim()) parts.push(`- Particularités / Événements notables : ${particularites.trim()}`);
    return parts.filter(Boolean).join('\n');
  }, []);

  const handleGenerateNote = useCallback(async () => {
    if (isFormEmpty || !activePatientId || !currentPatient) return;

    setIsGenerating(true);
    setGenerationError(null);

    const clinicalData = buildClinicalData(formState);
    if (!clinicalData.trim()) { setGenerationError("Le formulaire est vide."); setIsGenerating(false); return; }
    
    const currentEntries = currentPatient.noteEntries;
    
    let prompt: string;
    const baseInstructions = `
RÔLE : Tu es un infirmier ou une infirmière rédigeant une note d'évolution pour le dossier d'un patient, conformément aux standards du système de santé québécois.
INSTRUCTIONS GÉNÉRALES :
- Accorde IMPÉRATIVEMENT le genre du texte (pronoms, adjectifs) en fonction du "Genre du patient" spécifié dans les données.
- Rédige dans un style professionnel, clair et concis. Utilise des abréviations médicales courantes si pertinent.
- Réponds IMPÉRATIVEMENT au format JSON en respectant le schéma fourni.
- N'inclus JAMAIS l'heure ou la date. Retourne UNIQUEMENT le contenu narratif.
`;

    if (currentEntries.length > 0) {
      const previousEntriesText = currentEntries.map(e => `${e.timestamp} - ${e.content}`).join('\n');
        prompt = `${baseInstructions}
TÂCHE : Ajouter une nouvelle entrée à une note d'évolution existante.

INSTRUCTIONS SPÉCIFIQUES À L'AJOUT :
1.  **APPRENTISSAGE DE STYLE** : Analyse attentivement les "ENTRÉES PRÉCÉDENTES". Ton objectif est d'imiter ce style (ton, structure, abréviations, niveau de détail) dans la nouvelle entrée. La cohérence est primordiale.
2.  **RÉDACTION** : Rédige un nouveau paragraphe narratif à partir des "NOUVELLES DONNÉES CLINIQUES", en appliquant le style que tu as appris.
3.  **RETOUR** : Retourne UNIQUEMENT le contenu narratif de la nouvelle entrée dans le champ JSON "content".

---
ENTRÉES PRÉCÉDENTES (modèle de style à suivre) :
"${previousEntriesText}"

NOUVELLES DONNÉES CLINIQUES :
${clinicalData}
---`;
    } else {
        prompt = `${baseInstructions}
TÂCHE : Rédiger la première entrée d'une note d'évolution.

INSTRUCTIONS SPÉCIFIQUES À LA CRÉATION :
1.  Rédige la note narrative à partir des "DONNÉES CLINIQUES".
2.  Retourne UNIQUEMENT le contenu narratif de la note dans le champ JSON "content".

---
DONNÉES CLINIQUES :
${clinicalData}
---`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: { content: { type: Type.STRING, description: "Le contenu narratif de la note d'évolution, sans l'heure." } },
                required: ['content']
            }
        }
      });
      
      const jsonString = response.text.trim();
      const parsedResponse = JSON.parse(jsonString) as { content: string };
      const newContent = parsedResponse.content || "Le contenu n'a pas pu être généré.";

      const newEntry: NoteEntry = {
        id: Date.now().toString(),
        timestamp: eventTime,
        content: newContent
      };

      setPatients(prev => ({
          ...prev,
          [activePatientId]: {
              ...prev[activePatientId],
              noteEntries: [...prev[activePatientId].noteEntries, newEntry],
              formState: {
                  ...initialFormState,
                  quart: prev[activePatientId].formState.quart,
                  gender: prev[activePatientId].formState.gender,
              }
          }
      }));
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setEventTime(`${hours}:${minutes}`);

    } catch (error) {
      console.error("Erreur lors de la génération de la note :", error);
      setGenerationError("Une erreur est survenue. L'IA a peut-être renvoyé une réponse inattendue. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  }, [formState, isFormEmpty, activePatientId, currentPatient, initialFormState, buildClinicalData, eventTime]);
  
  const handleAccessSubmit = (code: string) => {
    if (code === accessCode) { setIsAuthenticated(true); setAccessError(null); } 
    else { setAccessError("Code d'accès incorrect. Veuillez réessayer."); }
  };

  const handleChangePassword = ({ currentCode, newCode }: { currentCode: string, newCode: string }): { success: boolean, message: string } => {
    if (currentCode !== accessCode) return { success: false, message: "Le code d'accès actuel est incorrect." };
    if (!newCode || newCode.length < 4) return { success: false, message: "Le nouveau code doit contenir au moins 4 caractères." };
    setAccessCode(newCode);
    localStorage.setItem('APP_ACCESS_CODE', newCode);
    return { success: true, message: "Code d'accès mis à jour avec succès !" };
  };

    const handleSaveState = useCallback((name: string) => {
        if (!name.trim() || !currentPatient) return;
        const key = `nurse-note-template-${name.trim()}`;
        const stateToSave: SavedState = { formState: currentPatient.formState, noteEntries: currentPatient.noteEntries };
        localStorage.setItem(key, JSON.stringify(stateToSave));
        setSavedStates(prev => ({ ...prev, [name.trim()]: stateToSave }));
        alert(`Modèle enregistré sous le nom : "${name.trim()}"`);
    }, [currentPatient]);

    const handleLoadState = useCallback((name: string) => {
        if (!activePatientId) return;
        const stateToLoad = savedStates[name];
        if (stateToLoad) {
            setPatients(prevPatients => ({
                ...prevPatients,
                [activePatientId]: {
                    ...prevPatients[activePatientId],
                    formState: stateToLoad.formState,
                    noteEntries: stateToLoad.noteEntries || []
                }
            }));
            alert(`Modèle "${name}" chargé pour le patient actuel.`);
        }
    }, [savedStates, activePatientId]);

    const handleDeleteState = useCallback((name: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${name}" ?`)) {
            const key = `nurse-note-template-${name}`;
            localStorage.removeItem(key);
            setSavedStates(prev => {
                const newStates = { ...prev };
                delete newStates[name];
                return newStates;
            });
        }
    }, []);
    
    const handleAddPatient = () => {
        let currentNumber = nextRoomNumber;
        let id = `Ch. ${currentNumber}`;

        while (patients[id]) {
            currentNumber++;
            id = `Ch. ${currentNumber}`;
        }

        setPatients(prev => ({ ...prev, [id]: createNewPatient() }));
        setActivePatientId(id);
        setNextRoomNumber(currentNumber + 1);
    };

    const handleDeletePatient = (id: string) => {
        if (Object.keys(patients).length <= 1) {
            if (window.confirm("Ceci est le dernier patient. Au lieu de le supprimer, voulez-vous effacer toutes ses données ?")) {
                if (activePatientId) {
                    setPatients(prev => ({...prev, [activePatientId]: createNewPatient()}));
                    setGenerationError(null);
                    setIsGenerating(false);
                }
            }
            return;
        }
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le patient ${id} ? Cette action est irréversible.`)) {
            // If the patient to be deleted is the active one, find the next one to activate.
            if (activePatientId === id) {
                const remainingIds = Object.keys(patients).filter(pId => pId !== id);
                const nextActiveId = remainingIds.length > 0 ? remainingIds[0] : null;
                setActivePatientId(nextActiveId);
            }
            
            // Use a functional update to ensure we're modifying the latest state,
            // which is safer and prevents stale state issues.
            setPatients(prevPatients => {
                const newPatients = { ...prevPatients };
                delete newPatients[id];
                return newPatients;
            });
        }
    };
    
    const handleRenamePatient = (oldId: string, newId: string) => {
        const trimmedNewId = newId.trim();
        if (!trimmedNewId || trimmedNewId === oldId) {
            return;
        }
        if (patients[trimmedNewId]) {
            alert(`Un patient avec l'ID "${trimmedNewId}" existe déjà.`);
            return;
        }

        setPatients(prevPatients => {
            const newPatients = { ...prevPatients };
            const patientData = newPatients[oldId];
            delete newPatients[oldId];
            newPatients[trimmedNewId] = patientData;
            return newPatients;
        });

        if (activePatientId === oldId) {
            setActivePatientId(trimmedNewId);
        }
    };
    
    const handleSelectPatient = (id: string) => { setActivePatientId(id); setOpenSectionId(null); };

    const handleGenerateShiftReport = useCallback(async (shift: string) => {
        setIsGeneratingReport(true);
        setReportError(null);
        setShiftReportContent('');

        const allPatientNotes = Object.entries(patients)
            // FIX: Explicitly type `patient` to avoid it being inferred as `unknown` in strict mode.
            .map(([id, patient]: [string, PatientState]) => {
              const notes = patient.noteEntries.map(e => `${e.timestamp} - ${e.content}`).join('\n');
              return `Patient ${id}:\n${notes || 'Aucune note pour ce patient.'}`;
            })
            .join('\n\n---\n\n');
        
        const prompt = `
RÔLE : Tu es un(e) infirmier(ère) expérimenté(e) qui prépare un rapport de relève concis et professionnel pour le prochain quart de travail.
TÂCHE : Rédige un rapport de synthèse pour le quart de "${shift}", basé sur les notes d'évolution de plusieurs patients fournies ci-dessous.

INSTRUCTIONS :
1. Structure le rapport par patient (ex: "Ch. 101", "Ch. 102", etc.).
2. Pour chaque patient, extrais et résume les événements, changements d'état, interventions clés et suivis importants qui se sont produits.
3. Focalise-toi sur les informations pertinentes pour la continuité des soins. Ignore les détails routiniers si l'état est stable.
4. Sois clair, concis et utilise un langage infirmier professionnel.
5. Si les notes d'un patient sont vides ou ne contiennent pas d'informations pertinentes, mentionne simplement que l'état est stable ou qu'il n'y a rien de particulier à signaler.
6. Le rapport doit être une synthèse globale, pas une simple copie des notes. Il doit donner une vue d'ensemble rapide de l'état de l'unité.

---
NOTES DES PATIENTS :
${allPatientNotes}
---
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });
            setShiftReportContent(response.text);
        } catch (e) {
            console.error("Erreur lors de la génération du rapport de quart:", e);
            setReportError("Une erreur est survenue lors de la génération du rapport. Veuillez réessayer.");
        } finally {
            setIsGeneratingReport(false);
        }
    }, [patients]);

    const handleGenerateZpl = useCallback(() => {
        if (!activePatientId || !formState) return;
        const patientId = activePatientId;
        const gender = formState.gender || 'N/A';
        const allergies = formState.admissionCheckboxes.includes('Allergies vérifiées et signalées au dossier') ? 'Oui' : 'Non';
        // FIX: In strict mode, Object.values() returns unknown[], which causes errors with `reduce`. Cast to number[] to ensure type safety and fix subsequent comparison errors.
        const morseTotal = (Object.values(formState.morse) as number[]).reduce((sum, val) => sum + val, 0);
        
        let fallRisk = 'Faible';
        if (morseTotal >= 51) fallRisk = 'Eleve';
        else if (morseTotal >= 25) fallRisk = 'Modere';

        const generatedZpl = `
^XA
^PW406
^LL203
^CI28

^FO20,20^A0N,40,40^FD${patientId}^FS
^FO20,70^A0N,25,25^FDGenre: ${gender}^FS
^FO220,70^A0N,25,25^FDRisque Chute: ${fallRisk}^FS
^FO20,105^A0N,25,25^FDAllergies: ${allergies}^FS
^FO40,140^BY2,2,60^BCN,60,Y,N,N^FD${patientId}^FS

^XZ`.trim();

        setZplCode(generatedZpl);
        setIsZplModalOpen(true);
    }, [activePatientId, formState]);

    const handleCopy = useCallback(() => {
        if (noteEntries.length > 0) {
          const textToCopy = noteEntries.map(e => `${e.timestamp} - ${e.content}`).join('\n\n');
          navigator.clipboard.writeText(textToCopy);
          setIsCopied(true);
        }
    }, [noteEntries]);

    const handleSaveNote = useCallback(() => {
        const name = prompt("Entrez un nom pour sauvegarder la note et sa configuration comme modèle :");
        if (name && name.trim()) { handleSaveState(name.trim()); }
    }, [handleSaveState]);

    const generatePdf = useCallback((outputType: 'save' | 'print') => {
        if (noteEntries.length === 0 && !backgroundImage) return;

        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const pageDimensions = doc.internal.pageSize;
        const pageWidth = pageDimensions.getWidth();
        const pageHeight = pageDimensions.getHeight();
        
        const cmToMm = (cm: number) => cm * 10;
        const ptToMm = (pt: number) => pt * 0.352778;

        const addBackgroundImage = () => {
            if (backgroundImage) {
                try {
                    const imageType = backgroundImage.substring("data:image/".length, backgroundImage.indexOf(";base64"));
                    doc.addImage(backgroundImage, imageType.toUpperCase(), 0, 0, pageWidth, pageHeight, '', 'FAST');
                } catch (e) {
                    console.error("Error adding background image to PDF:", e);
                    if (noteEntries.length > 0) alert("L'image de fond n'a pas pu être ajoutée. Le PDF sera généré sans elle.");
                }
            }
        };
        
        addBackgroundImage();

        if (noteEntries.length > 0) {
            const fontFamily = layoutSettings.fontFamily.toLowerCase();
            const fontWeight = String(layoutSettings.fontWeight);
            doc.setFont(fontFamily, 'normal', fontWeight);
            doc.setFontSize(layoutSettings.fontSize);
            doc.setTextColor(0, 0, 0); // Opacity is handled via fillOpacity below, not setTextColor
            doc.setFillColor(0,0,0);
            doc.setCreationDate(new Date());

            const dateX = cmToMm(layoutSettings.positionX);
            const noteX = dateX + 31; // Based on form layout, 31mm width for date column
            const noteWidth = cmToMm(layoutSettings.textBlockWidth);
            let yPos = cmToMm(layoutSettings.positionY);

            noteEntries.forEach((entry) => {
                doc.setGState(new (doc.GState as any)({opacity: layoutSettings.opacity / 100}));
                
                const noteLines = doc.splitTextToSize(entry.content, noteWidth);
                const noteHeight = doc.getTextDimensions(noteLines).h;

                if (yPos + noteHeight > pageHeight - 20) { // 20mm bottom margin
                    doc.addPage();
                    addBackgroundImage();
                    yPos = cmToMm(layoutSettings.positionY); 
                }
                
                doc.text(entry.timestamp, dateX, yPos);
                doc.text(noteLines, noteX, yPos, { lineHeightFactor: layoutSettings.lineHeight });
                
                yPos += noteHeight + ptToMm(layoutSettings.entrySpacing);
            });
        }
        
        if (outputType === 'save') {
            doc.save('note_evolution.pdf');
        } else {
            doc.output('dataurlnewwindow');
        }
    }, [noteEntries, layoutSettings, backgroundImage]);

    const handleDownloadPdf = useCallback(() => generatePdf('save'), [generatePdf]);
    const handlePrintPdf = useCallback(() => generatePdf('print'), [generatePdf]);

    const handleGenerateLabelPdf = useCallback(() => {
        if (noteEntries.length === 0) return;
        
        const cmToMm = (cm: number) => cm * 10;
        const widthMm = cmToMm(layoutSettings.labelWidth);
        const heightMm = cmToMm(layoutSettings.labelHeight);

        const doc = new jsPDF({
            unit: 'mm',
            format: [widthMm, heightMm]
        });

        const textToPrint = noteEntries.map(e => `${e.timestamp} - ${e.content}`).join('\n');
        doc.setFontSize(8);
        const textLines = doc.splitTextToSize(textToPrint, widthMm - 10); // 5mm margin on each side
        doc.text(textLines, 5, 5);
        doc.output('dataurlnewwindow');

    }, [noteEntries, layoutSettings.labelWidth, layoutSettings.labelHeight]);


    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBackgroundImage(e.target?.result as string);
                setBackgroundImageFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    }, []);
    
    const handleRemoveImage = useCallback(() => {
        setBackgroundImage(null);
        setBackgroundImageFileName(null);
    }, []);


  if (!isAuthenticated) return <AccessCodeScreen onAccessGranted={handleAccessSubmit} error={accessError} />;

  const quartOptions: Option[] = [ { value: 'Jour', label: 'Jour' }, { value: 'Soir', label: 'Soir' }, { value: 'Nuit', label: 'Nuit' } ];
  const genderOptions: Option[] = [ { value: 'Masculin', label: 'Masculin' }, { value: 'Féminin', label: 'Féminin' } ];
  const painSectionIndex = sectionsData.findIndex(sec => sec.id === 'digestif');
  const geriatrieSectionIndex = sectionsData.findIndex(sec => sec.id === 'geriatrie');


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
      <Header 
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onGenerateReport={() => setIsReportModalOpen(true)}
      />
      <main className="flex-grow container mx-auto p-4 lg:p-8">
        <PatientTabs 
            patientIds={Object.keys(patients)}
            activePatientId={activePatientId}
            onSelect={handleSelectPatient}
            onAdd={handleAddPatient}
            onDelete={handleDeletePatient}
            onRename={handleRenamePatient}
            nextRoomNumber={nextRoomNumber}
            onNextRoomNumberChange={setNextRoomNumber}
        />
        {!currentPatient ? (
             <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">Aucun patient sélectionné.</h2>
                <p className="text-slate-500 mt-2">Veuillez ajouter un patient pour commencer.</p>
             </div>
        ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <QuickScenarios onScenarioSelect={handleScenarioSelect} />
              <SaveLoad savedStates={Object.keys(savedStates)} onSave={handleSaveState} onLoad={handleLoadState} onDelete={handleDeleteState}/>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-4">Contexte de la Note</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Genre du patient</label>
                          <RadioGroup name="gender" options={genderOptions} selectedValue={formState.gender} onChange={(value) => handleRadioChange('gender', value)} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Quart de travail</label>
                          <RadioGroup name="quart" options={quartOptions} selectedValue={formState.quart} onChange={(value) => handleRadioChange('quart', value)} />
                      </div>
                      <div>
                          <label htmlFor="event-time" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Heure de l'événement</label>
                          <input
                              type="time"
                              id="event-time"
                              value={eventTime}
                              onChange={(e) => setEventTime(e.target.value)}
                              className="p-2 w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                      </div>
                  </div>
              </div>

              <AdmissionSection isOpen={openSectionId === 'admission'} onToggle={() => handleSectionToggle('admission')} isFilled={isAdmissionSectionFilled} state={formState} onChange={handleAdmissionChange} />

              {sectionsData.slice(0, painSectionIndex + 1).map(section => (
                <CollapsibleSection key={section.id} title={section.title} isOpen={openSectionId === section.id} onToggle={() => handleSectionToggle(section.id)} isFilled={isSectionFilled(section.id, formState)}>
                  {section.type === 'radio' && <RadioGroup name={section.id} options={section.options} selectedValue={formState[section.id] as string} onChange={(value) => handleRadioChange(section.id, value)} />}
                  {section.type === 'checkbox' && <CheckboxGroup sectionId={section.id} options={section.options} selectedValues={formState[section.id] as string[]} onChange={(value) => handleCheckboxChange(section.id, value)} />}
                  {section.id === 'respiratoire' && formState.respiratoire.includes('Utilisation d’O₂') && (
                      <div className="mt-4">
                          <label htmlFor="respiratoire_o2_litres" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Débit d'oxygène (L/min)</label>
                          <input type="number" id="respiratoire_o2_litres" value={formState.respiratoire_o2_litres} onChange={(e) => handleRespiratoireO2LitresChange(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Ex: 2" min="0" step="0.5" />
                      </div>
                  )}
                  {section.hasIntervention && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                          <div>
                              <label htmlFor={`${section.id}-medicament`} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Médicament administré</label>
                              <input type="text" id={`${section.id}-medicament`} value={formState[`${section.id}_medicament` as keyof FormState] as string} onChange={(e) => handleMedicamentChange(section.id as string, e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Ex: Nom, dosage, voie..." />
                          </div>
                          {section.interventions && (
                            <div>
                                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Interventions Associées</h3>
                                  <CheckboxGroup sectionId={`${section.id}_interventions`} options={section.interventions} selectedValues={formState[`${section.id}_interventions` as keyof FormState] as string[]} onChange={(value) => handleInterventionChange(section.id, value)} />
                            </div>
                          )}
                      </div>
                  )}
                </CollapsibleSection>
              ))}

              <CollapsibleSection title="Douleur – Méthode PQRSTU" isOpen={openSectionId === 'douleur'} onToggle={() => handleSectionToggle('douleur')} isFilled={isSectionFilled('douleur', formState)}>
                <PainSection data={painFieldsData} painState={formState.douleur} onCheckboxChange={handlePainCheckboxChange} onRadioChange={handlePainRadioChange} onSiteChange={handlePainSiteChange} onMedicamentChange={handlePainMedicamentChange} onNonPharmaChange={handlePainNonPharmaChange}/>
              </CollapsibleSection>

              {sectionsData.slice(painSectionIndex + 1).map(section => (
                <CollapsibleSection key={section.id} title={section.title} isOpen={openSectionId === section.id} onToggle={() => handleSectionToggle(section.id)} isFilled={isSectionFilled(section.id, formState)}>
                  {section.type === 'radio' && <RadioGroup name={section.id} options={section.options} selectedValue={formState[section.id] as string} onChange={(value) => handleRadioChange(section.id, value)} />}
                  {section.type === 'checkbox' && <CheckboxGroup sectionId={section.id} options={section.options} selectedValues={formState[section.id] as string[]} onChange={(value) => handleCheckboxChange(section.id, value)} />}
                  {section.id === 'soinsPalliatifs' && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label htmlFor="soinsPalliatifs_autres" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Autres symptômes ou observations :</label>
                            <textarea
                                id="soinsPalliatifs_autres"
                                value={formState.soinsPalliatifs_autres}
                                onChange={(e) => updateActivePatientFormState(() => ({ soinsPalliatifs_autres: e.target.value }))}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                placeholder="Ex: Agitation terminale, hoquet, prurit..."
                                rows={2}
                            />
                        </div>
                  )}
                  {section.hasIntervention && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                          <div>
                              <label htmlFor={`${section.id}-medicament`} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Médicament administré</label>
                              <input type="text" id={`${section.id}-medicament`} value={formState[`${section.id}_medicament` as keyof FormState] as string} onChange={(e) => handleMedicamentChange(section.id as string, e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Ex: Nom, dosage, voie..." />
                          </div>
                          {section.interventions && (
                            <div>
                                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Interventions Associées</h3>
                                  <CheckboxGroup sectionId={`${section.id}_interventions`} options={section.interventions} selectedValues={formState[`${section.id}_interventions` as keyof FormState] as string[]} onChange={(value) => handleInterventionChange(section.id, value)} />
                            </div>
                          )}
                      </div>
                  )}
                </CollapsibleSection>
              ))}

              <MorseScaleSection isOpen={openSectionId === 'morse'} onToggle={() => handleSectionToggle('morse')} isFilled={isSectionFilled('morse', formState)} state={formState.morse} onChange={handleMorseChange} />
              <BradenScaleSection isOpen={openSectionId === 'braden'} onToggle={() => handleSectionToggle('braden')} isFilled={isSectionFilled('braden', formState)} state={formState.braden} onChange={handleBradenChange} />
              <CIWAScaleSection isOpen={openSectionId === 'ciwa'} onToggle={() => handleSectionToggle('ciwa')} isFilled={isSectionFilled('ciwa', formState)} state={formState.ciwa} onChange={handleCIWAChange} />

              <CollapsibleSection title="Particularités / Événements notables" isOpen={openSectionId === 'particularites'} onToggle={() => handleSectionToggle('particularites')} isFilled={isSectionFilled('particularites', formState)}>
                  <ParticularitesSection value={formState.particularites} onChange={handleParticularitesChange} />
              </CollapsibleSection>
            </div>

            <div className="lg:col-span-1">
              <GeneratedNote 
                  noteEntries={noteEntries}
                  onUpdateEntry={handleUpdateNoteEntry}
                  onDeleteEntry={handleDeleteNoteEntry}
                  isGenerating={isGenerating} 
                  error={generationError} 
                  isFormEmpty={isFormEmpty} 
                  onGenerate={handleGenerateNote} 
                  onReset={resetCurrentPatientData} 
                  backgroundImage={backgroundImage}
                  onCopy={handleCopy}
                  isCopied={isCopied}
                  layoutSettings={layoutSettings}
              />
            </div>
          </div>

          <div className="lg:w-80 shrink-0">
             <PdfLayoutSettings
                layoutSettings={layoutSettings}
                onLayoutChange={setLayoutSettings}
                onDownloadPdf={handleDownloadPdf}
                onPrintPdf={handlePrintPdf}
                onGenerateLabelPdf={handleGenerateLabelPdf}
                onGenerateZplLabel={handleGenerateZpl}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                backgroundImageFileName={backgroundImageFileName}
                noteIsEmpty={noteEntries.length === 0}
                backgroundImageIsEmpty={!backgroundImage}
             />
          </div>
        </div>
        )}
      </main>
      <Footer />
      {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setIsChangePasswordModalOpen(false)} onSubmit={handleChangePassword} />}
      <ShiftReportModal 
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onGenerate={handleGenerateShiftReport}
          isGenerating={isGeneratingReport}
          reportContent={shiftReportContent}
          error={reportError}
      />
      <ZplLabelModal
          isOpen={isZplModalOpen}
          onClose={() => setIsZplModalOpen(false)}
          zplCode={zplCode}
      />
      <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="fixed bottom-8 right-8 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 z-40"
          title="Ouvrir l'Assistant Clinique IA"
          aria-label="Ouvrir l'Assistant Clinique IA"
      >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
      </button>
      {isAiAssistantOpen && <AiAssistantModal onClose={() => setIsAiAssistantOpen(false)} />}
    </div>
  );
};

export default App;
