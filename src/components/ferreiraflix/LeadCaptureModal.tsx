import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { submitLead } from '../../lib/leadSubmit';
import { generateTransactionId } from '../../lib/transactionId';
import { buildHotmartCheckoutUrl } from '../../lib/hotmartCheckout';
import { getCapturedUTMs } from '../../hooks/useUTMTracking';
import {
  trackFormStart,
  trackFormSuccess,
  trackFormError,
  setupFormAbandonmentTracking,
} from '../../lib/analytics';

const FORM_NAME = 'ferreiraflix-v2';

interface Props {
  onClose: () => void;
}

export function LeadCaptureModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const isSubmittingRef = useRef(false);

  const getFilledFields = useCallback(() => {
    const fields: string[] = [];
    if (name) fields.push('nome');
    if (email) fields.push('email');
    if (phone) fields.push('telefone');
    return fields;
  }, [name, email, phone]);

  useEffect(() => {
    const cleanup = setupFormAbandonmentTracking(FORM_NAME, getFilledFields);
    return cleanup;
  }, [getFilledFields]);

  const markFormStarted = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackFormStart(FORM_NAME);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError('Número de telefone inválido');
      return;
    }

    isSubmittingRef.current = true;
    setError('');
    setPhoneError('');
    setLoading(true);

    const transactionId = generateTransactionId();
    const utms = getCapturedUTMs();
    const phoneDigits = phone.replace(/\D/g, '');

    try {
      await submitLead(
        {
          name: name.trim(),
          email: email.trim(),
          phone: phoneDigits,
        },
        transactionId,
      );

      trackFormSuccess(FORM_NAME, transactionId, utms, {
        name: name.trim(),
        email: email.trim(),
        phone: phoneDigits,
      });

      setSubmitted(true);

      setTimeout(() => {
        window.location.href = buildHotmartCheckoutUrl({
          name: name.trim(),
          email: email.trim(),
          phone: phoneDigits,
        });
      }, 1200);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      trackFormError(FORM_NAME, errorMsg);
      setError('Ocorreu um erro. Tente novamente.');
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => !loading && !submitted && onClose()}
      />
      <div className="relative w-full max-w-md bg-[#0c0a0a] border border-[#fc0820]/30 rounded-3xl p-7 sm:p-9 shadow-[0_0_60px_-10px_rgba(252,8,32,0.45)] animate-modal">
        {!submitted && (
          <button
            onClick={() => !loading && onClose()}
            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-500/15 ring-1 ring-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2 text-white font-['MADE_Outer_Sans',sans-serif]">
              Tudo certo!
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-['MADE_Outer_Sans',sans-serif]">
              Estamos te redirecionando para o checkout...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-2 tracking-tight text-white font-['MADE_Outer_Sans',sans-serif]">
                Garanta seu acesso ao{' '}
                <span className="text-[#fc0820]">FerreiraFlix</span>
              </h2>
              <p className="text-gray-400 text-sm font-['MADE_Outer_Sans',sans-serif]">
                Preencha abaixo para finalizar sua compra.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="ff-name"
                  className="block text-sm font-medium text-gray-300 mb-1.5 font-['MADE_Outer_Sans',sans-serif]"
                >
                  Nome
                </label>
                <input
                  id="ff-name"
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={markFormStarted}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#fc0820]/60 transition-colors font-['MADE_Outer_Sans',sans-serif]"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label
                  htmlFor="ff-email"
                  className="block text-sm font-medium text-gray-300 mb-1.5 font-['MADE_Outer_Sans',sans-serif]"
                >
                  Email
                </label>
                <input
                  id="ff-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={markFormStarted}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#fc0820]/60 transition-colors font-['MADE_Outer_Sans',sans-serif]"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="ff-phone"
                  className="block text-sm font-medium text-gray-300 mb-1.5 font-['MADE_Outer_Sans',sans-serif]"
                >
                  Telefone (com DDI)
                </label>
                <PhoneInput
                  id="ff-phone"
                  international
                  defaultCountry="BR"
                  value={phone}
                  onChange={(value) => {
                    setPhone(value || '');
                    setPhoneError('');
                  }}
                  onFocus={markFormStarted}
                  disabled={loading}
                  className="ff-phone-input w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus-within:border-[#fc0820]/60 transition-colors font-['MADE_Outer_Sans',sans-serif]"
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-[#fc0820] font-['MADE_Outer_Sans',sans-serif]">
                    {phoneError}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-[#fc0820] text-center font-['MADE_Outer_Sans',sans-serif]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 md:h-16 rounded-full bg-[#fc0820] hover:bg-[#fc0820]/90 disabled:opacity-60 disabled:cursor-not-allowed text-base md:text-lg relative overflow-hidden cursor-pointer transition-colors"
              >
                <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
                <span className="font-['MADE_Outer_Sans',sans-serif] font-bold text-white relative z-10 pointer-events-none">
                  {loading ? 'Enviando...' : 'Continuar para o checkout'}
                </span>
              </button>

              <p className="text-center text-gray-500 text-xs mt-2 font-['MADE_Outer_Sans',sans-serif]">
                Seus dados são usados apenas para concluir a compra.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
