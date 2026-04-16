import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Scissors, Activity, Bed, Apple, Syringe, Zap, HelpCircle,
  Dog, Cat, Rabbit,
  CheckCircle, Send, ArrowLeft, ArrowRight, RefreshCw, Check, Clipboard,
} from 'lucide-react';
import './ContactStepper.css';

// ── WhatsApp icon (Lucide no lo trae, inline SVG) ─────────────────────────
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

// ── SVG Animals ────────────────────────────────────────────────────────────

function DogFace({ className = '', size = 140 }) {
  return (
    <svg viewBox="0 0 140 140" width={size} height={size} className={`animal-svg ${className}`} aria-hidden="true">
      <ellipse cx="38" cy="52" rx="18" ry="28" fill="#c9a870" transform="rotate(-15 38 52)" />
      <ellipse cx="102" cy="52" rx="18" ry="28" fill="#c9a870" transform="rotate(15 102 52)" />
      <ellipse cx="38" cy="55" rx="11" ry="19" fill="#e8c891" transform="rotate(-15 38 55)" />
      <ellipse cx="102" cy="55" rx="11" ry="19" fill="#e8c891" transform="rotate(15 102 55)" />
      <circle cx="70" cy="76" r="44" fill="#e8c891" />
      <ellipse cx="70" cy="94" rx="22" ry="15" fill="#d4aa70" />
      <circle cx="54" cy="68" r="8" fill="#2d2118" />
      <circle cx="86" cy="68" r="8" fill="#2d2118" />
      <circle cx="56.5" cy="65.5" r="2.5" fill="white" />
      <circle cx="88.5" cy="65.5" r="2.5" fill="white" />
      <ellipse cx="70" cy="88" rx="8" ry="6" fill="#2d2118" />
      <path d="M62 95 Q70 103 78 95" stroke="#2d2118" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="101" rx="6" ry="5" fill="#ff9999" />
      <path className="dog-tail" d="M108 112 Q128 90 120 68" stroke="#c9a870" strokeWidth="10" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CatFace({ className = '', size = 140 }) {
  return (
    <svg viewBox="0 0 140 140" width={size} height={size} className={`animal-svg ${className}`} aria-hidden="true">
      <polygon points="28,62 42,22 60,60" fill="#c0a0d8" />
      <polygon points="80,60 98,22 112,62" fill="#c0a0d8" />
      <polygon points="34,60 44,30 56,59" fill="#f2c4e0" />
      <polygon points="84,59 96,30 106,60" fill="#f2c4e0" />
      <circle cx="70" cy="80" r="43" fill="#d8bce8" />
      <ellipse cx="70" cy="94" rx="20" ry="13" fill="#c8a8d8" />
      <ellipse cx="54" cy="74" rx="9" ry="10" fill="#2d1a3a" />
      <ellipse cx="86" cy="74" rx="9" ry="10" fill="#2d1a3a" />
      <ellipse cx="54" cy="74" rx="4" ry="9" fill="#1a0828" />
      <ellipse cx="86" cy="74" rx="4" ry="9" fill="#1a0828" />
      <circle cx="57" cy="70" r="2.5" fill="white" />
      <circle cx="89" cy="70" r="2.5" fill="white" />
      <polygon points="70,88 65,93 75,93" fill="#ff9999" />
      <path d="M65 93 Q62 98 57 97" stroke="#2d1a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M75 93 Q78 98 83 97" stroke="#2d1a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="20" y1="90" x2="58" y2="91" stroke="#a080b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="95" x2="58" y2="94" stroke="#a080b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="82" y1="91" x2="120" y2="90" stroke="#a080b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="82" y1="94" x2="120" y2="95" stroke="#a080b8" strokeWidth="1.5" strokeLinecap="round" />
      <path className="cat-tail" d="M108 118 Q130 100 125 75" stroke="#c0a0d8" strokeWidth="9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function RabbitFace({ className = '', size = 130 }) {
  return (
    <svg viewBox="0 0 130 140" width={size} height={size} className={`animal-svg ${className}`} aria-hidden="true">
      {/* Ears */}
      <ellipse cx="42" cy="35" rx="12" ry="30" fill="#e8d0e8" />
      <ellipse cx="88" cy="35" rx="12" ry="30" fill="#e8d0e8" />
      <ellipse cx="42" cy="35" rx="6" ry="22" fill="#f4b8c8" />
      <ellipse cx="88" cy="35" rx="6" ry="22" fill="#f4b8c8" />
      {/* Head */}
      <circle cx="65" cy="90" r="42" fill="#f0e0f0" />
      {/* Cheeks */}
      <circle cx="46" cy="98" r="10" fill="rgba(255,160,180,0.3)" />
      <circle cx="84" cy="98" r="10" fill="rgba(255,160,180,0.3)" />
      {/* Eyes */}
      <circle cx="52" cy="82" r="7" fill="#2d1a3a" />
      <circle cx="78" cy="82" r="7" fill="#2d1a3a" />
      <circle cx="54" cy="80" r="2.5" fill="white" />
      <circle cx="80" cy="80" r="2.5" fill="white" />
      {/* Nose */}
      <ellipse cx="65" cy="96" rx="5" ry="4" fill="#ff9999" />
      {/* Mouth */}
      <path d="M60 99 Q65 104 70 99" stroke="#2d1a3a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="25" y1="94" x2="56" y2="95" stroke="#c8a8c8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="74" y1="95" x2="105" y2="94" stroke="#c8a8c8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function HappyDog({ className = '', size = 150 }) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} className={`animal-svg ${className}`} aria-hidden="true">
      <circle cx="18" cy="28" r="4" fill="#8CC63F" className="sparkle-1" />
      <circle cx="142" cy="22" r="3" fill="#a0d060" className="sparkle-2" />
      <circle cx="148" cy="55" r="5" fill="#8CC63F" className="sparkle-3" />
      <ellipse cx="44" cy="62" rx="20" ry="30" fill="#c9a870" transform="rotate(-15 44 62)" />
      <ellipse cx="116" cy="62" rx="20" ry="30" fill="#c9a870" transform="rotate(15 116 62)" />
      <ellipse cx="44" cy="66" rx="12" ry="21" fill="#e8c891" transform="rotate(-15 44 66)" />
      <ellipse cx="116" cy="66" rx="12" ry="21" fill="#e8c891" transform="rotate(15 116 66)" />
      <circle cx="80" cy="88" r="48" fill="#e8c891" />
      <ellipse cx="80" cy="107" rx="24" ry="16" fill="#d4aa70" />
      <path d="M56 80 Q64 73 72 80" stroke="#2d2118" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M88 80 Q96 73 104 80" stroke="#2d2118" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="52" cy="90" r="9" fill="rgba(255,160,160,0.35)" />
      <circle cx="108" cy="90" r="9" fill="rgba(255,160,160,0.35)" />
      <ellipse cx="80" cy="100" rx="9" ry="7" fill="#2d2118" />
      <path d="M66 112 Q80 124 94 112" stroke="#2d2118" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="119" rx="8" ry="7" fill="#ff8888" />
    </svg>
  );
}

// ── Config ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Tus datos' },
  { id: 2, label: 'Mascota'   },
  { id: 3, label: 'Servicio'  },
  { id: 4, label: 'Confirmar' },
];

const PET_OPTIONS = [
  { value: 'perro', label: 'Perro', Icon: Dog    },
  { value: 'gato',  label: 'Gato',  Icon: Cat    },
  { value: 'otro',  label: 'Otro',  Icon: Rabbit },
];

const SERVICES = [
  { value: 'Medicina general',       Icon: Stethoscope },
  { value: 'Cirugía',                Icon: Scissors    },
  { value: 'Diagnóstico por imagen', Icon: Activity    },
  { value: 'Hospitalización',        Icon: Bed         },
  { value: 'Nutrición',              Icon: Apple       },
  { value: 'Vacunación',             Icon: Syringe     },
  { value: 'Urgencia',               Icon: Zap         },
  { value: 'Otro',                   Icon: HelpCircle  },
];

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ?  50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -50 :  50, opacity: 0 }),
};

const EMPTY_FORM = {
  name: '', email: '', phone: '',
  petType: '', petName: '',
  service: '', message: '',
};

// ── Main ───────────────────────────────────────────────────────────────────

export default function ContactStepper() {
  const [step, setStep]           = useState(1);
  const [dir,  setDir]            = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const next   = () => { setDir(1);  setStep(s => Math.min(s + 1, 4)); };
  const back   = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };
  const reset  = () => { setForm(EMPTY_FORM); setStep(1); setDir(1); setSubmitted(false); };

  const canNext = () => {
    if (step === 1) return form.name.trim() && form.email.trim();
    if (step === 2) return !!form.petType;
    if (step === 3) return !!form.service;
    return true;
  };

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const submit = async () => {
    setSending(true);
    setSendError('');
    try {
      const petOpt = PET_OPTIONS.find(p => p.value === form.petType);
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          petType: petOpt?.label ?? form.petType,
        }),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setSubmitted(true);
    } catch {
      setSendError('No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stepper">
      {submitted ? (
        <SuccessScreen name={form.name} onReset={reset} />
      ) : (
        <>
          <StepProgress current={step} />

          <div className="stepper__body">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="stepper__step"
              >
                {step === 1 && <Step1 form={form} update={update} />}
                {step === 2 && <Step2 form={form} update={update} />}
                {step === 3 && <Step3 form={form} update={update} />}
                {step === 4 && <Step4 form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="stepper__nav">
            <div>
              {step > 1 && (
                <button className="stepper__back" onClick={back} type="button">
                  <ArrowLeft size={15} strokeWidth={2} />
                  Atrás
                </button>
              )}
            </div>
            <div>
              {step < 4 ? (
                <button className="stepper__next" onClick={next} disabled={!canNext()} type="button">
                  Siguiente
                  <ArrowRight size={15} strokeWidth={2} />
                </button>
              ) : (
                <div className="submit-wrap">
                  {sendError && <p className="submit-error">{sendError}</p>}
                  <button
                    className="stepper__submit"
                    onClick={submit}
                    disabled={sending}
                    type="button"
                  >
                    <WhatsAppIcon size={16} />
                    {sending ? 'Enviando…' : 'Confirmar cita'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Progress ───────────────────────────────────────────────────────────────

function StepProgress({ current }) {
  return (
    <div className="step-progress">
      <div className="step-progress__track">
        <motion.div
          className="step-progress__fill"
          animate={{ width: `${((current - 1) / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="step-progress__dots">
        {STEPS.map(({ id, label }) => (
          <div key={id} className={`step-dot ${id <= current ? 'step-dot--done' : ''} ${id === current ? 'step-dot--active' : ''}`}>
            <div className="step-dot__circle">
              {id < current
                ? <Check size={12} strokeWidth={2.5} color="#0a0a0a" />
                : <span>{id}</span>
              }
            </div>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 1 ─────────────────────────────────────────────────────────────────

function Step1({ form, update }) {
  return (
    <div className="step-layout">
      <div className="step-animal">
        <DogFace className="anim-bounce" />
        <p className="step-animal__caption">Hola, soy Rex<br />¿Cómo te llamas?</p>
      </div>
      <div className="step-fields">
        <h3 className="step-title">Cuéntanos quién eres</h3>
        <Field label="Nombre completo *" htmlFor="s-name">
          <input id="s-name" type="text" className="s-input" placeholder="Tu nombre completo"
            value={form.name} onChange={e => update('name', e.target.value)} />
        </Field>
        <Field label="Email *" htmlFor="s-email">
          <input id="s-email" type="email" className="s-input" placeholder="tu@email.com"
            value={form.email} onChange={e => update('email', e.target.value)} />
        </Field>
        <Field label="Teléfono" htmlFor="s-phone">
          <input id="s-phone" type="tel" className="s-input" placeholder="+34 600 000 000"
            value={form.phone} onChange={e => update('phone', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

// ── Step 2 ─────────────────────────────────────────────────────────────────

function Step2({ form, update }) {
  const selected = PET_OPTIONS.find(p => p.value === form.petType);
  return (
    <div className="step-layout">
      <div className="step-animal">
        <AnimatePresence mode="wait">
          <motion.div key={form.petType || 'none'}
            initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {form.petType === 'perro' && <DogFace className="anim-wiggle" />}
            {form.petType === 'gato'  && <CatFace className="anim-wiggle" />}
            {form.petType === 'otro'  && <RabbitFace className="anim-pulse" />}
            {!form.petType && (
              <div className="animal-placeholder">
                <Dog size={36} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                <p>Elige tu mascota</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {selected && (
          <p className="step-animal__caption">
            Un {selected.label.toLowerCase()},<br />encantados de conocerlo
          </p>
        )}
      </div>
      <div className="step-fields">
        <h3 className="step-title">¿Cuál es tu mascota?</h3>
        <div className="pet-cards">
          {PET_OPTIONS.map(({ value, label, Icon }) => (
            <button key={value} type="button"
              className={`pet-card ${form.petType === value ? 'pet-card--active' : ''}`}
              onClick={() => update('petType', value)}
            >
              <Icon size={28} strokeWidth={1.5} />
              <span className="pet-card__label">{label}</span>
            </button>
          ))}
        </div>
        <Field label="Nombre de tu mascota" htmlFor="s-petname">
          <input id="s-petname" type="text" className="s-input" placeholder="¿Cómo se llama?"
            value={form.petName} onChange={e => update('petName', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

// ── Step 3 ─────────────────────────────────────────────────────────────────

function Step3({ form, update }) {
  return (
    <div className="step-layout">
      <div className="step-animal">
        <div className="vet-scene">
          <div className="vet-badge">
            <Stethoscope size={28} color="#8CC63F" strokeWidth={1.5} />
          </div>
          <DogFace className="anim-nod" size={120} />
        </div>
        <p className="step-animal__caption">¿En qué podemos<br />ayudarte hoy?</p>
      </div>
      <div className="step-fields">
        <h3 className="step-title">¿Qué necesitas?</h3>
        <Field label="Servicio *" htmlFor="s-service">
          <ServiceGrid selected={form.service} onSelect={v => update('service', v)} />
        </Field>
        <Field label="Cuéntanos más (opcional)" htmlFor="s-message">
          <textarea id="s-message" className="s-input s-textarea" rows={3}
            placeholder="Cuéntanos sobre lo que necesita tu mascota…"
            value={form.message} onChange={e => update('message', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function ServiceGrid({ selected, onSelect }) {
  return (
    <div className="service-grid">
      {SERVICES.map(({ value, Icon }) => (
        <button key={value} type="button"
          className={`service-chip ${selected === value ? 'service-chip--active' : ''}`}
          onClick={() => onSelect(value)}
        >
          <Icon size={20} strokeWidth={1.5} />
          <span className="service-chip__label">{value}</span>
        </button>
      ))}
    </div>
  );
}

// ── Step 4 ─────────────────────────────────────────────────────────────────

function Step4({ form }) {
  const petOpt = PET_OPTIONS.find(p => p.value === form.petType);
  return (
    <div className="step-layout">
      <div className="step-animal">
        <HappyDog className="anim-celebrate" />
        <p className="step-animal__caption">Todo listo,<br />revisa tus datos</p>
      </div>
      <div className="step-fields">
        <h3 className="step-title">Confirma tu solicitud</h3>
        <div className="summary">
          <SummaryRow label="Nombre"   value={form.name} />
          <SummaryRow label="Email"    value={form.email} />
          {form.phone   && <SummaryRow label="Teléfono" value={form.phone} />}
          {form.petType && <SummaryRow label="Mascota"  value={`${petOpt?.label}${form.petName ? ` · ${form.petName}` : ''}`} />}
          <SummaryRow label="Servicio" value={form.service} />
          {form.message && <SummaryRow label="Notas"    value={form.message} />}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value}</span>
    </div>
  );
}

// ── Success ────────────────────────────────────────────────────────────────

function SuccessScreen({ name, onReset }) {
  const firstName = name.split(' ')[0];
  return (
    <motion.div className="success-screen"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <HappyDog className="anim-celebrate" size={150} />

      <div className="success-badge">
        <CheckCircle size={16} strokeWidth={2} />
        <span>Solicitud enviada correctamente</span>
      </div>

      <h3 className="success-title">Todo listo, {firstName}</h3>
      <p className="success-body">
        Tu solicitud ha sido enviada a través de WhatsApp.<br />
        Te responderemos en menos de 24 horas para confirmar tu cita.
      </p>

      <button className="success-reset" onClick={onReset} type="button">
        <RefreshCw size={14} strokeWidth={2} />
        ¿Quieres agendar otra cita?
      </button>
    </motion.div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────

function Field({ label, htmlFor, children }) {
  return (
    <div className="s-field">
      <label className="s-label" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
