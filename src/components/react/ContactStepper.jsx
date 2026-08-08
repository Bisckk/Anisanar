import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Scissors, Activity, Bed, Apple, Syringe, Zap, HelpCircle,
  Dog, Cat, Rabbit, User, PawPrint, ClipboardCheck,
  CheckCircle, ArrowLeft, ArrowRight, RefreshCw, Check, AlertCircle,
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

// ── Validación ───────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return EMAIL_RE.test(value.trim());
}

function isValidPhone(value) {
  const trimmed = value.trim();
  if (!trimmed) return true; // el teléfono es opcional
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[+]?[\d\s()-]+$/.test(trimmed);
}

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ?  32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -32 :  32, opacity: 0 }),
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
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState(null);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const next   = () => { setDir(1);  setStep(s => Math.min(s + 1, 4)); };
  const back   = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };
  const reset  = () => { setForm(EMPTY_FORM); setStep(1); setDir(1); setSubmitted(false); setError(null); };

  const canNext = () => {
    if (step === 1) return form.name.trim() && isValidEmail(form.email) && isValidPhone(form.phone);
    if (step === 2) return !!form.petType;
    if (step === 3) return !!form.service;
    return true;
  };

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar la solicitud');
      setSubmitted(true);
    } catch {
      setError('No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directo por WhatsApp.');
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
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
            <div className="stepper__nav-right">
              {error && (
                <p className="submit-error">
                  <AlertCircle size={13} strokeWidth={2} />
                  {error}
                </p>
              )}
              {step < 4 ? (
                <button className="stepper__next" onClick={next} disabled={!canNext()} type="button">
                  Siguiente
                  <ArrowRight size={15} strokeWidth={2} />
                </button>
              ) : (
                <button
                  className="stepper__submit"
                  onClick={submit}
                  disabled={sending}
                  type="button"
                >
                  <WhatsAppIcon size={16} />
                  {sending ? 'Enviando…' : 'Confirmar cita'}
                </button>
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

// ── Step header — ícono + título, consistente con el resto del sitio ──────

function StepHeader({ Icon, title, sub }) {
  return (
    <div className="step-header">
      <span className="step-header__icon" aria-hidden="true">
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="step-title">{title}</h3>
        {sub && <p className="step-sub">{sub}</p>}
      </div>
    </div>
  );
}

// ── Step 1 ─────────────────────────────────────────────────────────────────

function Step1({ form, update }) {
  const [touched, setTouched] = useState({ email: false, phone: false });
  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const emailError = touched.email && form.email.trim() && !isValidEmail(form.email)
    ? 'Ingresa un correo electrónico válido (ej. tu@email.com)'
    : null;
  const phoneError = touched.phone && form.phone.trim() && !isValidPhone(form.phone)
    ? 'Ingresa un número de teléfono válido'
    : null;

  return (
    <div className="step-layout">
      <StepHeader Icon={User} title="Cuéntanos quién eres" sub="Te contactaremos para confirmar tu cita." />
      <div className="step-fields">
        <Field label="Nombre completo *" htmlFor="s-name">
          <input id="s-name" type="text" className="s-input" placeholder="Tu nombre completo"
            value={form.name} onChange={e => update('name', e.target.value)} />
        </Field>
        <Field label="Email *" htmlFor="s-email" error={emailError}>
          <input id="s-email" type="email" inputMode="email" autoComplete="email"
            className={`s-input ${emailError ? 's-input--error' : ''}`} placeholder="tu@email.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            onBlur={() => touch('email')} />
        </Field>
        <Field label="Teléfono" htmlFor="s-phone" error={phoneError}>
          <input id="s-phone" type="tel" inputMode="tel" autoComplete="tel"
            className={`s-input ${phoneError ? 's-input--error' : ''}`} placeholder="+57 310 000 0000"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            onBlur={() => touch('phone')} />
        </Field>
      </div>
    </div>
  );
}

// ── Step 2 ─────────────────────────────────────────────────────────────────

function Step2({ form, update }) {
  return (
    <div className="step-layout">
      <StepHeader Icon={PawPrint} title="¿Cuál es tu mascota?" sub="Así nos preparamos mejor para su visita." />
      <div className="step-fields">
        <div className="pet-cards">
          {PET_OPTIONS.map(({ value, label, Icon }) => (
            <button key={value} type="button"
              className={`pet-card ${form.petType === value ? 'pet-card--active' : ''}`}
              onClick={() => update('petType', value)}
            >
              <Icon size={24} strokeWidth={1.5} />
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
      <StepHeader Icon={Stethoscope} title="¿Qué necesitas?" sub="Selecciona el servicio que buscas." />
      <div className="step-fields">
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
      {SERVICES.map(({ value, Icon }) => {
        const isActive = selected === value;
        return (
          <button key={value} type="button"
            className={`service-chip ${isActive ? 'service-chip--active' : ''}`}
            onClick={() => onSelect(value)}
            aria-pressed={isActive}
          >
            {isActive ? <Check size={20} strokeWidth={2.5} /> : <Icon size={20} strokeWidth={1.5} />}
            <span className="service-chip__label">{value}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Step 4 ─────────────────────────────────────────────────────────────────

function Step4({ form }) {
  const petOpt = PET_OPTIONS.find(p => p.value === form.petType);
  return (
    <div className="step-layout">
      <StepHeader Icon={ClipboardCheck} title="Confirma tu solicitud" sub="Revisa que todo esté correcto antes de enviar." />
      <div className="step-fields">
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="success-icon" aria-hidden="true">
        <CheckCircle size={30} strokeWidth={1.5} />
      </span>

      <h3 className="success-title">Todo listo, {firstName}</h3>
      <p className="success-body">
        Tu solicitud fue enviada correctamente.<br />
        Te responderemos en menos de 24 horas para confirmar tu cita.
      </p>

      <button className="success-reset" onClick={onReset} type="button">
        <RefreshCw size={14} strokeWidth={2} />
        Agendar otra cita
      </button>
    </motion.div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="s-field">
      <label className="s-label" htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="s-field__error">{error}</p>}
    </div>
  );
}
