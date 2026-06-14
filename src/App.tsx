import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Activity, 
  Heart, 
  Brain, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  User, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Phone, 
  Clock, 
  Moon, 
  Footprints, 
  Zap, 
  HelpCircle, 
  RefreshCw, 
  BookOpen, 
  CheckCircle2, 
  Calendar,
  MessageSquare
} from "lucide-react";

// --- Types ---
interface Patient {
  name: string;
  age: number;
  conditions: string;
  notes: string;
}

interface SupportContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  schedule: string;
}

interface WristbandMetrics {
  sleepHours: number;
  physicalActivityMinutes: number;
  dailySteps: number;
  stressLevel: "Bajo" | "Medio" | "Alto";
  attentionPercent: number;
  memoryPercent: number;
  repetitiveQuestionsToday: number;
  cognitiveMinutes: number;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  parsed?: {
    mode: "Emergencia" | "Memoria" | "Cognitivo" | string;
    risk: "Bajo" | "Medio" | "Alto" | "Crítico" | string;
    analysis: string;
    recommendation: string;
    messageToFamily: string;
  };
}

interface EventLog {
  id: string;
  time: string;
  type: "INFO" | "FALL" | "CONFUSION" | "EMERGENCY" | "METRIC";
  message: string;
  risk: "Bajo" | "Medio" | "Alto" | "Crítico";
}

export default function App() {
  // --- State Configuration ---
  const [patient, setPatient] = useState<Patient>({
    name: "Don Roberto",
    age: 81,
    conditions: "Deterioro cognitivo leve inicial, hipertensión controlada",
    notes: "Suele experimentar desorientación por las tardes (síndrome del ocaso). Responde muy bien a la música clásica y la conversación tranquila de familiares."
  });

  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientForm, setPatientForm] = useState<Patient>({ ...patient });

  // Registered Support Network
  const [contacts, setContacts] = useState<SupportContact[]>([
    { 
      id: "1", 
      name: "María", 
      role: "Hija (Contacto de Emergencia Principal)", 
      phone: "+56 9 1234 5678", 
      schedule: "Disponible 24/7 (Vive a 5 minutos)" 
    },
    { 
      id: "2", 
      name: "Carlos", 
      role: "Cuidador de Turno Mañana", 
      phone: "+56 9 8765 4321", 
      schedule: "Lunes a Viernes de 08:00 a 14:00" 
    },
    { 
      id: "3", 
      name: "Ana", 
      role: "Doctora Terapeuta Ocupacional", 
      phone: "+56 9 5555 6666", 
      schedule: "Visitas de Estimulación: Martes y Jueves a las 16:00" 
    }
  ]);

  // Form for New Contact
  const [newContact, setNewContact] = useState({
    name: "",
    role: "",
    phone: "",
    schedule: ""
  });
  const [showAddContact, setShowAddContact] = useState(false);

  // Live Metric Settings
  const [metrics, setMetrics] = useState<WristbandMetrics>({
    sleepHours: 7.2,
    physicalActivityMinutes: 20,
    dailySteps: 3400,
    stressLevel: "Medio",
    attentionPercent: 78,
    memoryPercent: 65,
    repetitiveQuestionsToday: 1,
    cognitiveMinutes: 20
  });

  // Chat & History
  const [chatInput, setChatInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "MODO DETECTADO:\nCognitivo\n\nNIVEL DE RIESGO:\nBajo\n\nANÁLISIS:\nBienvenido al núcleo inteligente Guardian AI Core. Todos los sistemas del brazalete de Roberto están sincronizados. Los índices de ritmo cardíaco (72 lpm) y temperatura del sensor de muñeca están estables.\n\nRECOMENDACIÓN:\n- Mantener hidratación continua por la tarde.\n- Continuar con el paseo diario programado si no hay fatiga.\n- Revisar el diario de actividades si se presentan consultas repetitivas.",
      timestamp: "08:15 AM",
      parsed: {
        mode: "Cognitivo",
        risk: "Bajo",
        analysis: "Bienvenido al núcleo inteligente Guardian AI Core. Todos los sistemas del brazalete de Roberto están en línea y estables. Los índices vitales basales son óptimos.",
        recommendation: "- Mantener hidratación continua por la tarde para contrarrestar la fatiga cognitiva.\n- Continuar con el paseo diario programado si no hay fatiga física.",
        messageToFamily: "No aplica"
      }
    }
  ]);

  // Bracelet Alert & Logging History
  const [logs, setLogs] = useState<EventLog[]>([
    { id: "log-1", time: "08:00 AM", type: "INFO", message: "Pulsera de Roberto encendida. Batería al 94%.", risk: "Bajo" },
    { id: "log-2", time: "08:15 AM", type: "METRIC", message: "Sincronización de métricas completada. Sueño registrado: 7.2 hrs.", risk: "Bajo" }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isPending]);

  // --- Handlers ---
  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    setPatient(patientForm);
    setIsEditingPatient(false);
    addLog("INFO", `Ficha médica actualizada para ${patientForm.name}.`, "Bajo");
  };

  const addLog = (type: EventLog["type"], message: string, risk: EventLog["risk"]) => {
    const timeString = new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' });
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        time: timeString,
        type,
        message,
        risk
      },
      ...prev
    ]);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.role) return;
    const added: SupportContact = {
      id: Math.random().toString(),
      name: newContact.name,
      role: newContact.role,
      phone: newContact.phone || "No registrado",
      schedule: newContact.schedule || "No especificado"
    };
    setContacts(prev => [...prev, added]);
    setNewContact({ name: "", role: "", phone: "", schedule: "" });
    setShowAddContact(false);
    addLog("INFO", `Contacto '${added.name}' (${added.role}) añadido a la red de apoyo.`, "Bajo");
  };

  const handleDeleteContact = (id: string) => {
    const deleted = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    if (deleted) {
      addLog("INFO", `Contacto '${deleted.name}' eliminado de la red de apoyo.`, "Bajo");
    }
  };

  // Triggering calls to Server API
  const queryCore = async (userPrompt: string) => {
    setIsPending(true);
    
    // Add user message to history
    const userMsgId = Math.random().toString();
    const timeString = new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: userPrompt,
        timestamp: timeString
      }
    ]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          patientContext: patient,
          contactsContext: contacts,
          metricsContext: metrics
        })
      });

      if (!response.ok) {
        throw new Error("La API de Guardian AI Core respondió con error.");
      }

      const data = await response.json();
      const rawText = data.text || "";

      // Parse the response parts precisely
      const parsed = parseResponse(rawText);

      setChatHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: rawText,
          timestamp: new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
          parsed
        }
      ]);

      // Set logs and status depending on the parsed safety
      let logRisk: EventLog["risk"] = "Bajo";
      if (parsed.risk.includes("Crítico")) logRisk = "Crítico";
      else if (parsed.risk.includes("Alto")) logRisk = "Alto";
      else if (parsed.risk.includes("Medio")) logRisk = "Medio";

      let logType: EventLog["type"] = "INFO";
      if (parsed.mode.includes("Emergencia")) logType = "EMERGENCY";
      else if (parsed.mode.includes("Memoria")) logType = "CONFUSION";
      else logType = "METRIC";

      addLog(logType, `Guardian AI Core procesó evento. Modo: ${parsed.mode}. Riesgo: ${parsed.risk}.`, logRisk);

    } catch (error: any) {
      console.error(error);
      setChatHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "system",
          text: `Error de conexión con Guardian AI Core: ${error.message || "Por favor, verifica el estado del servidor."}`,
          timestamp: new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      addLog("INFO", "Fallo al comunicar con Guardian AI Core.", "Medio");
    } finally {
      setIsPending(false);
    }
  };

  // Helper parser for custom tags
  const parseResponse = (text: string) => {
    const parts = {
      mode: "Cognitivo",
      risk: "Bajo",
      analysis: "",
      recommendation: "",
      messageToFamily: ""
    };

    // Strict multi-line extraction matching our server prompts
    const modeMatch = text.match(/MODO DETECTADO:\s*([^\n]+)/i);
    const riskMatch = text.match(/NIVEL DE RIESGO:\s*([^\n]+)/i);
    const analysisMatch = text.match(/ANÁLISIS:\s*([\s\S]*?)(?=RECOMENDACIÓN:|MENSAJE PARA FAMILIAR:|$)/i);
    const recommendationMatch = text.match(/RECOMENDACIÓN:\s*([\s\S]*?)(?=MENSAJE PARA FAMILIAR:|$)/i);
    const messageToFamilyMatch = text.match(/MENSAJE PARA FAMILIAR:\s*([\s\S]*?)$/i);

    if (modeMatch) parts.mode = modeMatch[1].trim().replace(/[\[\]]/g, "");
    if (riskMatch) parts.risk = riskMatch[1].trim().replace(/[\[\]]/g, "");
    if (analysisMatch) parts.analysis = analysisMatch[1].trim();
    if (recommendationMatch) parts.recommendation = recommendationMatch[1].trim();
    if (messageToFamilyMatch) parts.messageToFamily = messageToFamilyMatch[1].trim();

    // Fallback if formatting was loose
    if (!parts.analysis) {
      parts.analysis = text;
    }

    return parts;
  };

  // Form submission in chat
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const textToSend = chatInput;
    setChatInput("");
    queryCore(textToSend);
  };

  // Instant simulator alerts
  const triggerWristbandAlert = (type: "FALL" | "CONFUSION" | "EMERGENCY") => {
    let alertMsg = "";
    let systemLogMsg = "";
    let risk: EventLog["risk"] = "Medio";

    if (type === "FALL") {
      alertMsg = `[ALERTA DE CAÍDA DIRECTA DE LA PULSERA] El acelerómetro de precisión ha reportado un impacto fuerte a nivel del suelo seguido de 15 segundos sin pasos de ${patient.name}.`;
      systemLogMsg = `Impacto detectado (Posible caída de ${patient.name}).`;
      risk = "Alto";
    } else if (type === "CONFUSION") {
      alertMsg = `[CONFUSIÓN / SOLICITUD DE AYUDA COGNITIVA] El usuario ${patient.name} ha tocado repetidamente el botón auxiliar o ha expresado desorientación de las personas a su alrededor. Preguntas repetitivas de hoy: ${metrics.repetitiveQuestionsToday}.`;
      systemLogMsg = `Botón de auxilio cognitivo pulsado.`;
      risk = "Medio";
    } else {
      alertMsg = `[BOTÓN DE S.O.S. EMERGENGIA PRESIONADO] Se pulsó físicamente el botón rojo lateral de emergencia prolongado en la pulsera de ${patient.name}.`;
      systemLogMsg = `BOTÓN S.O.S. FÍSICO ACTIVADO.`;
      risk = "Crítico";
    }

    addLog(type, systemLogMsg, risk);
    queryCore(alertMsg);
  };

  // Cognitive trends comprehensive analysis
  const handleRequestCognitiveReport = () => {
    const prompt = `Analiza las tendencias conductuales y métricas de ${patient.name} del día de hoy:
- Horas de sueño: ${metrics.sleepHours} hrs
- Actividad física: ${metrics.physicalActivityMinutes} min
- Pasos diarios registrados: ${metrics.dailySteps}
- Nivel de estrés: ${metrics.stressLevel}
- Rendimiento Cognitivo (Atención: ${metrics.attentionPercent}%, Memoria de trabajo: ${metrics.memoryPercent}%)
- Preguntas repetitivas hoy: ${metrics.repetitiveQuestionsToday}
- Estimulación cognitiva realizada hoy: ${metrics.cognitiveMinutes} minutos

¿Cómo se evalúa la conducta global y qué plan de acción preventivo se sugiere?`;
    
    addLog("METRIC", "Solicitado análisis preventivo cognitivo global.", "Bajo");
    queryCore(prompt);
  };

  // Copy support message helper
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col lg:flex-row" id="app-root-container">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto" id="sidebar-panel">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between" id="sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-650 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white" id="logo-icon">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight" id="sidebar-title">Guardian AI</h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest" id="sidebar-subtitle">Core Engine v4.2</p>
            </div>
          </div>
          
          <div className="lg:hidden flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px]" id="mobile-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Online</span>
          </div>
        </div>

        {/* Monitored User details */}
        <div className="p-6 space-y-5 flex-1" id="sidebar-body">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50" id="monitored-user-card">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2" id="monitored-user-label">USUARIO PROTEGIDO</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-505 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm" id="user-avatar-initials">
                {patient.name.split(" ").map(n => n[0]).join("") || "U"}
              </div>
              <div id="user-profile-summary">
                <p className="text-sm text-white font-semibold leading-tight">{patient.name}</p>
                <p className="text-[11px] text-indigo-400 font-mono mt-0.5">{patient.age} años • ID: 822-004</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1" id="sidebar-capabilities-nav">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 px-1">CAPACIDADES ACTIVADAS</p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="bg-indigo-600/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/15 flex items-center gap-2.5 font-medium" id="cap-item-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                Detección Temprana (Cap. 1)
              </li>
              <li className="p-2.5 hover:bg-slate-800/40 hover:text-slate-200 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer" id="cap-item-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                Memoria y Soporte (Cap. 2)
              </li>
              <li className="p-2.5 hover:bg-slate-800/40 hover:text-slate-200 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer" id="cap-item-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                Análisis Cognitivo (Cap. 3)
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar Bottom Sector: Interactive Direct Triggers */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40" id="sidebar-panic-panel">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-2.5">
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-0.5">Pánico de Brazalete</p>
              <p className="text-slate-400 text-[10px] leading-snug">Simula pulsaciones de gravedad transmitidas por la pulsera:</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => triggerWristbandAlert("FALL")}
                className="p-2 bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 rounded-xl text-center text-[10px] font-bold text-red-200 cursor-pointer transition-all active:scale-95"
                id="btn-fall"
                title="Caída fuerte detectada"
              >
                FALL
              </button>
              <button
                onClick={() => triggerWristbandAlert("CONFUSION")}
                className="p-2 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-800/40 rounded-xl text-center text-[10px] font-bold text-amber-205 cursor-pointer transition-all active:scale-95"
                id="btn-confusion"
                title="Desorientación detectada"
              >
                CONFUSIO
              </button>
              <button
                onClick={() => triggerWristbandAlert("EMERGENCY")}
                className="p-2 bg-red-600 hover:bg-red-500 px-1 border border-red-500 rounded-xl text-center text-[10px] font-bold text-white shadow-md shadow-red-900/30 cursor-pointer transition-all active:scale-95 animate-pulse"
                id="btn-emergency"
                title="Botón de S.O.S presionando"
              >
                S.O.S
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col p-4 lg:p-8 gap-6 w-full" id="main-content-layout">
        
        {/* Header / Top Status Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200" id="main-view-header">
          <div>
            <h2 className="text-2xl lg:text-3xl font-light text-slate-800" id="main-view-greeting">
              Buenos días, <span className="font-bold text-slate-900">Soporte Familiar & Cuidadores</span>
            </h2>
            <p className="text-xs lg:text-sm text-slate-500 mt-0.5" id="main-view-description">
              Panel integrado Guardian AI Core • Monitoreo preventivo complementario de <strong>{patient.name}</strong>
            </p>
          </div>

          {/* Quick Metrics Badge Widget */}
          <div className="flex gap-3 items-center flex-wrap" id="ribbon-metrics-container">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 text-xs font-medium" id="ribbon-card">
              <div className="border-r pr-4 border-slate-100 shrink-0" id="ribbon-metric-hr">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Ritmo Cardíaco</p>
                <div className="text-base lg:text-lg font-bold text-slate-850 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse inline" /> 72 <span className="text-[10px] font-normal text-slate-500">LPM</span>
                </div>
              </div>
              <div className="shrink-0" id="ribbon-metric-steps">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pasos Hoy</p>
                <div className="text-base lg:text-lg font-bold text-slate-850 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-emerald-500 inline" /> {metrics.dailySteps.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-semibold" id="ribbon-active-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Brazalete Activo</span>
            </div>
          </div>
        </header>

        {/* Dashboard grid columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="dashboard-grid">
          
          {/* LEFT COLUMN: Controls & Patient Profile */}
          <section className="lg:col-span-5 space-y-6" id="left-column-layout">
            
            {/* Card: Patient clinical profile info */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4" id="patient-info-widget-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-650" />
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">FICHA DEL ADULTO MAYOR</h3>
                </div>
                <button 
                  onClick={() => {
                    setPatientForm({ ...patient });
                    setIsEditingPatient(!isEditingPatient);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-500 underline font-semibold transition-colors cursor-pointer"
                  id="btn-edit-patient"
                >
                  {isEditingPatient ? "Ver Ficha" : "Editar"}
                </button>
              </div>

              {!isEditingPatient ? (
                <div className="space-y-4" id="patient-info-view-mode">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900">{patient.name}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{patient.age} años</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Condiciones Clínicas Registradas</span>
                    <p className="text-sm text-slate-700 font-medium mt-0.5" id="patient-conditions-text">{patient.conditions}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 relative">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Notas del Cuidado Diario:</span>
                    <p className="text-xs text-slate-600 leading-relaxed italic" id="patient-notes-text">
                      "{patient.notes}"
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSavePatient} className="space-y-3 pt-1" id="patient-info-edit-form">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={patientForm.name}
                      onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Edad (Años)</label>
                      <input
                        type="number"
                        value={patientForm.age}
                        onChange={(e) => setPatientForm({...patientForm, age: parseInt(e.target.value) || 0})}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Monitoreo Frecuencia</label>
                      <div className="text-xs font-bold p-2.5 bg-rose-50 border border-rose-150 rounded-xl text-rose-700">
                        72 LPM Activo
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Condiciones Médicas</label>
                    <input
                      type="text"
                      value={patientForm.conditions}
                      onChange={(e) => setPatientForm({...patientForm, conditions: e.target.value})}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Notas de Comportamiento / Rutina</label>
                    <textarea
                      rows={3}
                      value={patientForm.notes}
                      onChange={(e) => setPatientForm({...patientForm, notes: e.target.value})}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
                      placeholder="Agrega notas de soporte conductual, gustos, desorientación ocasional..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-600/10"
                    id="btn-submit-patient-edit"
                  >
                    Guardar Cambios Clínicos
                  </button>
                </form>
              )}
            </div>

            {/* Card: Wristband metrics configuration */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5" id="metrics-configurator-card">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">SENSORES DE TENDENCIA Y CONDUCTA</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Modifica los indicadores actuales transmitidos en vivo para probar cómo el motor de recomendación Guardian AI calcula el riesgo preventivo y emite sugerencias de cuidado cognitivo:
              </p>

              <div className="space-y-4 pt-1">
                {/* Hours Slept slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-500" /> Horas de Sueño Anoche
                    </span>
                    <span className="font-mono text-indigo-600" id="lbl-sleep-val">{metrics.sleepHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={metrics.sleepHours}
                    onChange={(e) => setMetrics({...metrics, sleepHours: parseFloat(e.target.value)})}
                    className="w-full accent-indigo-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
                    id="slider-sleep-hours"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                    <span>Malo (&lt;5h)</span>
                    <span>Óptimo (7h - 9h)</span>
                  </div>
                </div>

                {/* Steps slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Footprints className="w-4 h-4 text-emerald-500" /> Pasos Diarios Alcanzados
                    </span>
                    <span className="font-mono text-emerald-600" id="lbl-steps-val">{metrics.dailySteps.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={metrics.dailySteps}
                    onChange={(e) => setMetrics({...metrics, dailySteps: parseInt(e.target.value)})}
                    className="w-full accent-emerald-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
                    id="slider-daily-steps"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                    <span>Sedentario</span>
                    <span>Actividad Recomendada</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Estrés de Muñeca</label>
                    <select
                      value={metrics.stressLevel}
                      onChange={(e) => setMetrics({...metrics, stressLevel: e.target.value as any})}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                      id="select-stress-level"
                    >
                      <option value="Bajo">Bajo (Relajado)</option>
                      <option value="Medio">Medio (Normal)</option>
                      <option value="Alto">Alto (Agitado/Sundance)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Preguntas Repetitivas</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={metrics.repetitiveQuestionsToday}
                        onChange={(e) => setMetrics({...metrics, repetitiveQuestionsToday: parseInt(e.target.value) || 0})}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-mono text-center font-bold focus:outline-none focus:border-indigo-500"
                        id="input-rep-questions"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 text-center block mt-1">Registradas hoy</span>
                  </div>
                </div>

                {/* Cognitive details dropdown */}
                <details className="text-xs text-slate-650 space-y-3 cursor-pointer group pt-1" id="details-cognitive-extended">
                  <summary className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                    Ver Variables Cognitivas y de Memoria Adicionales
                  </summary>
                  <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-150 cursor-default" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] text-slate-500 font-bold block mb-1">Foco de Atención (%)</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={metrics.attentionPercent}
                        onChange={(e) => setMetrics({...metrics, attentionPercent: parseInt(e.target.value) || 0})}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 text-slate-850 font-mono text-center"
                        id="input-attention-pct"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 font-bold block mb-1">Memoria de Trabajo (%)</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={metrics.memoryPercent}
                        onChange={(e) => setMetrics({...metrics, memoryPercent: parseInt(e.target.value) || 0})}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 text-slate-850 font-mono text-center"
                        id="input-memory-pct"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-500 font-bold">Estimulación Mental Activa</span>
                        <span className="text-[10px] text-indigo-650 font-mono font-bold">{metrics.cognitiveMinutes} min</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        step="5"
                        value={metrics.cognitiveMinutes}
                        onChange={(e) => setMetrics({...metrics, cognitiveMinutes: parseInt(e.target.value)})}
                        className="w-full accent-indigo-600 bg-slate-200 h-1 rounded-sm"
                        id="slider-cognitive-mins"
                      />
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Card: Support contacts network list and insertion */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4" id="contacts-network-widget-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">RED DE APOYO REGISTRADA</h3>
                </div>
                <button
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="p-1 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  id="btn-add-contact-reveal"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>

              {showAddContact && (
                <form onSubmit={handleCreateContact} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs animate-fade-in" id="add-contact-form">
                  <span className="font-bold text-slate-850 block text-[11px] uppercase tracking-wider">Registrar Nuevo Auxiliar o Familiar</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nombre (ej: María)"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 text-xs"
                      required
                      id="input-contact-name"
                    />
                    <input
                      type="text"
                      placeholder="Parentesco / Rol (ej: Cuidadora Mañana)"
                      value={newContact.role}
                      onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 text-xs"
                      required
                      id="input-contact-role"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Teléfono"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 text-[11px]"
                        id="input-contact-phone"
                      />
                      <input
                        type="text"
                        placeholder="Horarios"
                        value={newContact.schedule}
                        onChange={(e) => setNewContact({...newContact, schedule: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 text-[11px]"
                        id="input-contact-schedule"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddContact(false)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-bold text-xs"
                      id="btn-cancel-contact"
                    >
                      Salir
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-550 rounded-lg text-white font-bold text-xs"
                      id="btn-submit-contact"
                    >
                      Registrar
                    </button>
                  </div>
                </form>
              )}

              {/* List Registered Support Network */}
              <div className="space-y-3" id="contacts-rendered-container">
                {contacts.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex justify-between items-start gap-2" id={`contact-row-${c.name}`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm leading-tight">{c.name}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-white text-slate-600 border border-slate-150 rounded-full">{c.role}</span>
                      </div>
                      
                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {c.schedule}
                        </div>
                      </div>

                      {/* Prompt integration trigger specifically query who is this person */}
                      <button
                        onClick={() => queryCore(`¿Quién es ${c.name}?`)}
                        className="mt-1.5 text-[10px] text-indigo-650 hover:text-indigo-505 font-bold flex items-center gap-1 hover:underline text-left cursor-pointer"
                        id={`btn-ask-whois-${c.name}`}
                      >
                        <HelpCircle className="w-3 h-3" /> Preguntar a Guardian AI por {c.name}
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                      title={`Eliminar contacto ${c.name}`}
                      id={`btn-delete-${c.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-[11px] text-indigo-800 leading-snug" id="strict-memory-callout">
                💡 <strong>Memoria Estricta:</strong> El núcleo tiene estrictamente prohibido responder de quiénes son personas externas. Para consultar de familiares o cuidadores por nombre, agrégalos arriba.
              </div>
            </div>

          </section>

          {/* MAIN INTELLIGENCE AND CHAT COLUMN (cols 6-12) */}
          <section className="lg:col-span-7 space-y-6" id="right-column-layout">
            
            {/* Card: Trend Analytics & Diagnostic Trigger (Capacidad 3) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5" id="trend-analytics-panel-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">ANÁLISIS COGNITIVO Y TENDENCIAS</h3>
                </div>
                
                <button
                  onClick={handleRequestCognitiveReport}
                  className="p-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/10 transition-all cursor-pointer active:scale-95"
                  id="btn-analyze-trends-trigger"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Analizar Conducta Actual
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                El motor analiza diariamente patrones de desorientación, nivel de estrés acumulado para predecir sobrecargas o deterioros basales del adulto mayor:
              </p>

              {/* Polished interactive grid of metrics derived from the simulated parameters */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4" id="visual-trend-grid">
                <div className="space-y-1" id="trend-stat-sleep">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Sueño Semanal</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-indigo-600">{metrics.sleepHours}h</span>
                    <span className="text-[9px] text-emerald-500 font-semibold">Anoche</span>
                  </div>
                  <div className="text-[10px] text-slate-505">Patrón regular</div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5 mt-1.5">
                    <div className="h-full bg-indigo-200" style={{ width: "20%" }}></div>
                    <div className="h-full bg-indigo-300" style={{ width: "20%" }}></div>
                    <div className="h-full bg-indigo-400" style={{ width: "20%" }}></div>
                    <div className="h-full bg-indigo-600" style={{ width: "40%" }}></div>
                  </div>
                </div>

                <div className="space-y-1" id="trend-stat-steps">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Paseos / Pasos</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-emerald-600">{(metrics.dailySteps/1000).toFixed(1)}k</span>
                    <span className="text-[9px] text-slate-400 font-mono">meta</span>
                  </div>
                  <div className="text-[10px] text-slate-505">Activo hoy</div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5 mt-1.5">
                    <div className="h-full bg-emerald-300" style={{ width: `${Math.min(100, (metrics.dailySteps/10000)*100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1" id="trend-stat-stress">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Nivel Estrés</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-amber-600">{metrics.stressLevel}</span>
                  </div>
                  <div className="text-[10px] text-slate-505">Frecuencia basal</div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5 mt-1.5">
                    <div className="h-full bg-amber-400" style={{ width: metrics.stressLevel === "Bajo" ? "25%" : metrics.stressLevel === "Medio" ? "60%" : "90%" }}></div>
                  </div>
                </div>

                <div className="space-y-1" id="trend-stat-confusion">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Preguntas Rep.</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-rose-600">{metrics.repetitiveQuestionsToday}</span>
                    <span className="text-[9px] text-slate-450">veces</span>
                  </div>
                  <div className="text-[10px] text-slate-505">Indicador confusión</div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5 mt-1.5">
                    <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, metrics.repetitiveQuestionsToday * 20)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-1 flex items-start gap-2.5" id="trend-prevention-alert-notice">
                <div className="p-1 px-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg mt-0.5 shrink-0 uppercase tracking-wide">
                  Prevención
                </div>
                <p className="text-xs text-slate-605 leading-snug">
                  La prevención oportuna permite planificar el relevo de cuidadores y evitar el estrés del adulto mayor. Recuerde mantener registros limpios de los síntomas diurnos.
                </p>
              </div>
            </div>

            {/* Card: Chat Assistant Console container */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px] relative" id="chat-assistant-console-card">
              
              {/* Box Header */}
              <div className="bg-slate-50 border-b border-slate-200/80 p-4 shrink-0 flex items-center justify-between" id="chat-console-card-header">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" id="console-live-ping"></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">Consola Operativa Guardian AI Core</h3>
                    <p className="text-[10px] text-slate-500" id="console-live-desc">Asistencia Preventiva en Tiempo Real</p>
                  </div>
                </div>
                
                <div className="text-xs text-rose-700 font-bold font-mono flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full" id="live-indicator-badge">
                  <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>NÚCLEO EN VIVO</span>
                </div>
              </div>

              {/* Chat Message Scroll Panel */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20" id="chat-messages-scroll-area">
                {chatHistory.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"} animate-fade-in`}
                    id={`chat-msg-${msg.id}`}
                  >
                    <span className="text-[9px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">
                      {msg.sender === "user" ? "Remitente o Sensor" : "Guardian AI Core"} • {msg.timestamp}
                    </span>

                    {msg.sender === "user" ? (
                      <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm font-medium shadow-sm">
                        {msg.text}
                      </div>
                    ) : msg.sender === "system" ? (
                      <div className="bg-red-50 border border-red-105 text-red-700 rounded-2xl px-4 py-3 text-xs flex gap-2 items-start font-mono leading-relaxed" id="system-error-render">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{msg.text}</span>
                      </div>
                    ) : (
                      // Parse response segments layout strictly styled light-sleek
                      <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-sm overflow-hidden text-slate-800 w-full animate-fade-in" id={`ai-response-block-${msg.id}`}>
                        
                        {msg.parsed ? (
                          <div className="divide-y divide-slate-100" id={`analyzed-container-${msg.id}`}>
                            
                            {/* Modal metadata line */}
                            <div className="p-3 bg-slate-50 flex flex-wrap gap-2 items-center justify-between text-xs border-b border-slate-100" id={`metas-row-${msg.id}`}>
                              <div className="flex items-center gap-1.5 font-bold">
                                <span className="text-slate-450 uppercase text-[9px] tracking-wider">Modo Pulsera:</span>
                                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] ${
                                  msg.parsed.mode.includes("Emergencia") ? "bg-red-50 text-red-700 border border-red-100" :
                                  msg.parsed.mode.includes("Memoria") ? "bg-amber-50 text-amber-800 border border-amber-100" :
                                  "bg-indigo-50 text-indigo-750 border border-indigo-100"
                                }`}>
                                  {msg.parsed.mode}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1.5 font-bold">
                                <span className="text-slate-450 uppercase text-[9px] tracking-wider">Riesgo:</span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                                  msg.parsed.risk.includes("Crítico") ? "bg-red-650 text-white font-black animate-pulse" :
                                  msg.parsed.risk.includes("Alto") ? "bg-orange-50 text-orange-700 border border-orange-100 font-bold" :
                                  msg.parsed.risk.includes("Medio") ? "bg-amber-50 text-amber-800 border border-amber-100 font-bold" :
                                  "bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold"
                                }`}>
                                  {msg.parsed.risk}
                                </span>
                              </div>
                            </div>

                            {/* Analysis segment */}
                            <div className="p-4 space-y-1" id={`analysis-seg-${msg.id}`}>
                              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-extrabold block">Análisis de Evento</span>
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                                {msg.parsed.analysis}
                              </p>
                            </div>

                            {/* Recommendation segment */}
                            {msg.parsed.recommendation && (
                              <div className="p-4 bg-slate-50/60 space-y-2 border-t border-slate-100" id={`recommendation-seg-${msg.id}`}>
                                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-extrabold block">Recomendación Práctica</span>
                                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                                  {msg.parsed.recommendation}
                                </div>
                              </div>
                            )}

                            {/* Custom Message to send to Family */}
                            {msg.parsed.messageToFamily && msg.parsed.messageToFamily.toLowerCase() !== "no aplica" && msg.parsed.messageToFamily.toLowerCase() !== "no aplica." && (
                              <div className="p-4 bg-emerald-50/40 border-l-4 border-emerald-500 space-y-2" id={`whatsapp-seg-${msg.id}`}>
                                <div className="flex items-center justify-between flex-wrap gap-1">
                                  <span className="text-[9px] text-emerald-700 font-extrabold tracking-wider uppercase">Mensaje listo para enviar a familiares (WhatsApp)</span>
                                  <button
                                    onClick={() => handleCopyToClipboard(msg.parsed!.messageToFamily, msg.id)}
                                    className="text-[10px] text-emerald-700 hover:text-emerald-850 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                    id={`btn-copy-${msg.id}`}
                                  >
                                    {copiedId === msg.id ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-650" /> ¡Copiado!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" /> Copiar Texto
                                      </>
                                    )}
                                  </button>
                                </div>
                                <p className="text-xs text-slate-605 italic bg-white p-3 rounded-xl border border-slate-200 shadow-2xs leading-relaxed font-semibold">
                                  "{msg.parsed.messageToFamily}"
                                </p>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="p-4 text-sm text-slate-705 whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                        )}

                      </div>
                    )}
                  </div>
                ))}

                {isPending && (
                  <div className="flex flex-col max-w-[85%] mr-auto items-start animate-pulse" id="processing-shimmer">
                    <span className="text-[10px] text-slate-400 mb-1">Guardian AI Core está calculando la respuesta...</span>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 w-64 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-indigo-650 font-bold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analizando red de cuidadores...</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Quick Shelf */}
              <div className="p-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto whitespace-nowrap shrink-0 scrollbar-none" id="quick-tests-shelf">
                <span className="text-[9px] text-slate-400 font-bold uppercase px-2 tracking-wider">Pruebas rápidas:</span>
                
                <button 
                  onClick={() => queryCore("¿Quién es María? ¿Qué parentesco tiene y cuál es su horario registrado?")}
                  className="text-[10px] bg-white border border-slate-200 hover:border-indigo-350 text-slate-700 px-3 py-1 font-semibold rounded-lg cursor-pointer transition-all"
                  id="btn-fast-maria"
                >
                  ¿Quién es María?
                </button>

                <button 
                  onClick={() => queryCore("¿Quién es Ana? ¿Cuándo viene?")}
                  className="text-[10px] bg-white border border-slate-200 hover:border-indigo-350 text-slate-700 px-3 py-1 font-semibold rounded-lg cursor-pointer transition-all"
                  id="btn-fast-ana"
                >
                  ¿Quién es Ana?
                </button>

                <button 
                  onClick={() => queryCore("¿Quién es Pedro?")}
                  className="text-[10px] bg-white border border-slate-200 hover:border-red-300 text-slate-700 px-3 py-1 font-semibold rounded-lg cursor-pointer transition-all"
                  id="btn-fast-pedro"
                >
                  Preguntar por Pedro (No Registrado)
                </button>

                <button 
                  onClick={() => queryCore(`Roberto está experimentando desorientación severa de tarde hoy. Repitió su pregunta de la comida 5 veces seguidas. ¿Sugerencias conductuales urgentes?`)}
                  className="text-[10px] bg-white border border-slate-200 hover:border-indigo-350 text-slate-700 px-3 py-1 font-semibold rounded-lg cursor-pointer transition-all"
                  id="btn-fast-ocaso"
                >
                  Síntomas de Ocaso
                </button>
              </div>

              {/* Chat Text area input form */}
              <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0" id="chat-input-form-control">
                <input
                  type="text"
                  placeholder="Consulte sobre eventos de la pulsera, familiares o tendencias conductuales..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isPending}
                  className="flex-1 text-sm bg-slate-55 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-50"
                  required
                  id="chat-input-field"
                />
                <button
                  type="submit"
                  disabled={isPending || !chatInput.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer text-sm font-bold flex items-center justify-center shrink-0"
                  id="btn-send-message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

            {/* Card: Live Event Logs history */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3.5" id="live-logs-feed-card">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" id="live-feed-ping"></span>
                Historial Técnico de Eventos (Live Sensor Feed)
              </h3>
              
              <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1" id="live-feed-scroll">
                {logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start text-xs border-b border-slate-100 pb-2 bg-white hover:bg-slate-50/40 p-1.5 rounded-lg transition-all" id={`log-item-${log.id}`}>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-slate-400 font-mono pt-0.5">{log.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        log.type === "FALL" ? "bg-red-50 text-red-700 border border-red-105" :
                        log.type === "EMERGENCY" ? "bg-rose-50 text-rose-700 border border-rose-105" :
                        log.type === "CONFUSION" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                        log.type === "METRIC" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-slate-700 font-medium">{log.message}</span>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-tight ${
                      log.risk === "Crítico" ? "text-red-655" :
                      log.risk === "Alto" ? "text-orange-500" :
                      log.risk === "Medio" ? "text-amber-600" :
                      "text-emerald-600"
                    }`}>
                      {log.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>

        {/* Primary Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-slate-500 text-xs w-full mt-12" id="app-footer">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© 2026 Guardian AI Core. Todos los derechos reservados. Diseñado bajo la directriz Sleek UI.</p>
            <p className="flex items-center gap-1.5 justify-center">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Asistente Inteligente de Soporte Oportuno y Prevención sin diagnósticos clínicos patológicos.</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
