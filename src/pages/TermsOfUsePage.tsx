// RASCUNHO de 30/10/2026: Termos de Uso dos sites e páginas da Ferreira Trader.
// A REVISAR PELO JURÍDICO DO FERREIRA antes de ser tratado como definitivo (foro, cláusulas de produto/reembolso,
// endereço completo e limites de responsabilidade são suposições comuns de mercado, não confirmadas).
// Mesmo visual da PrivacyPolicyPage. Ao mudar o texto, atualize a data de "Última atualização".

const UPDATED_AT = "30 de outubro de 2026";

type Block = { title: string; paragraphs?: string[]; items?: string[] };

const BLOCKS: Block[] = [
  {
    title: "1. Quem somos",
    paragraphs: [
      "Estes Termos de Uso valem para os sites e páginas da Ferreira Trader (ferreiratrader.com.br e seus subdomínios, e as páginas da Alfa Class em alfaclass.com.br), incluindo as páginas de inscrição em aulas, listas de espera e materiais gratuitos.",
      "Eles são oferecidos pela FERREIRA TRADER CONSULTORIA LTDA, CNPJ 38.158.936/0001-18, com sede no Rio de Janeiro/RJ (a \"Ferreira Trader\", \"nós\").",
    ],
  },
  {
    title: "2. Aceitação",
    paragraphs: [
      "Ao acessar as páginas ou se inscrever em qualquer aula, lista ou material, você declara que leu e concorda com estes Termos e com a nossa Política de Privacidade. Se não concordar, não utilize as páginas nem faça a inscrição.",
      "Nossos produtos e páginas são destinados a maiores de 18 anos.",
    ],
  },
  {
    title: "3. Uso das páginas e das inscrições",
    items: [
      "informe dados verdadeiros, completos e atuais (nome, e-mail e WhatsApp);",
      "cada inscrição é pessoal: use o seu próprio e-mail e o seu próprio número, e faça uma inscrição por pessoa;",
      "o acesso às aulas e aos materiais é pessoal e intransferível; não compartilhe links de acesso de forma a burlar a inscrição de terceiros;",
      "não use as páginas para fraude, para enviar dados de outra pessoa sem autorização, nem com robôs, scripts ou meios automatizados para fazer inscrições;",
      "não tente derrubar, invadir, copiar em massa ou prejudicar o funcionamento das páginas e dos sistemas;",
      "podemos recusar, cancelar ou bloquear inscrições que indiquem fraude, duplicidade ou uso indevido.",
    ],
  },
  {
    title: "4. Conteúdo educacional e aviso de risco",
    paragraphs: [
      "Tudo o que oferecemos (aulas, materiais, vídeos, mensagens e conversas) tem caráter exclusivamente educacional. Não é recomendação, consultoria ou promessa de investimento, e não leva em conta a sua situação financeira, os seus objetivos ou o seu perfil.",
      "Operar no mercado financeiro envolve risco de perda, inclusive de todo o capital investido. Resultados passados, exemplos e depoimentos não garantem resultados futuros. Não há garantia de ganho, de lucro ou de resultado de qualquer tipo. A decisão de operar e o resultado dela são sempre de sua inteira responsabilidade.",
    ],
  },
  {
    title: "5. Propriedade intelectual",
    paragraphs: [
      "Os textos, vídeos, aulas, imagens, marcas, logotipos e demais conteúdos das páginas e dos materiais pertencem à Ferreira Trader ou são usados com autorização. A inscrição dá a você o direito pessoal de assistir e consultar o conteúdo, para uso próprio.",
      "Sem autorização por escrito, você não pode copiar, gravar, reproduzir, distribuir, revender ou publicar o conteúdo, nem usar as nossas marcas.",
    ],
  },
  {
    title: "6. Comunicação por WhatsApp e e-mail",
    paragraphs: [
      "Ao se inscrever, você nos autoriza a entrar em contato pelo e-mail e pelo WhatsApp informados, para enviar os avisos da aula, o material pedido e, também, ofertas e conteúdos relacionados aos nossos produtos.",
      "Você pode deixar de receber as mensagens quando quiser: responda pedindo para sair, use o link de descadastro dos e-mails ou escreva para falecom@kelvinbrito.com. Se você entrar em um grupo de WhatsApp, pode sair dele a qualquer momento.",
    ],
  },
  {
    title: "7. Links e serviços de terceiros",
    paragraphs: [
      "As páginas podem ter links e usar serviços de terceiros (por exemplo, plataformas de vídeo, de pagamento, grupos de WhatsApp e ferramentas de medição). Esses serviços têm termos e políticas próprios, que não controlamos e pelos quais não respondemos.",
    ],
  },
  {
    title: "8. Limitação de responsabilidade",
    paragraphs: [
      "Fazemos o possível para manter as páginas no ar e as informações corretas, mas não garantimos funcionamento ininterrupto nem ausência de erros. Podemos alterar ou retirar páginas, aulas e datas, avisando pelos canais de contato quando houver mudança relevante.",
      "Na medida permitida pela lei, a Ferreira Trader não responde por perdas financeiras decorrentes de decisões de investimento que você tomar, nem por danos causados por falhas de internet, de dispositivos ou de serviços de terceiros. Isto não afasta direitos que a lei garante a você como consumidor.",
    ],
  },
  {
    title: "9. Privacidade",
    paragraphs: [
      "O tratamento dos seus dados pessoais está descrito na Política de Privacidade, que faz parte destes Termos.",
    ],
  },
  {
    title: "10. Alterações destes Termos",
    paragraphs: [
      "Podemos atualizar estes Termos. A versão em vigor é a publicada nesta página, com a data de atualização no topo. Continuar usando as páginas depois da mudança significa que você concorda com a nova versão.",
    ],
  },
  {
    title: "11. Lei aplicável e foro",
    paragraphs: [
      "Estes Termos são regidos pelas leis do Brasil. Fica eleito o foro da Comarca do Rio de Janeiro/RJ para resolver dúvidas e conflitos, ressalvado o direito do consumidor de propor ação no foro do seu domicílio, quando a lei assim garantir.",
      "Dúvidas sobre estes Termos: falecom@kelvinbrito.com.",
    ],
  },
];

export function TermsOfUsePage() {
  return (
    <main className="min-h-screen w-full bg-white text-[#1a1a1a] [font-family:'Inter',Helvetica] px-4 py-12 md:py-16">
      <article className="max-w-[720px] mx-auto flex flex-col gap-6 text-[15px] md:text-[16px] leading-[1.7]">
        <header className="flex flex-col gap-2">
          <h1 className="text-[28px] md:text-[34px] font-bold leading-tight">Termos de Uso</h1>
          <p className="text-[#5a5a5a] text-[14px]">Última atualização: {UPDATED_AT}</p>
        </header>

        {BLOCKS.map((block, i) => (
          <section key={i} className="flex flex-col gap-3">
            {block.title && <h2 className="text-[19px] md:text-[21px] font-semibold mt-2">{block.title}</h2>}
            {block.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
            {block.items && (
              <ul className="list-disc pl-6 flex flex-col gap-2">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
            {block.title.startsWith("9.") && (
              <p>
                <a href="/politica-privacidade" className="underline">Ler a Política de Privacidade</a>
              </p>
            )}
          </section>
        ))}

        <footer className="border-t border-[#eee] pt-6 text-[14px] text-[#5a5a5a]">
          FERREIRA TRADER CONSULTORIA LTDA · CNPJ 38.158.936/0001-18 · Rio de Janeiro/RJ · falecom@kelvinbrito.com
        </footer>
      </article>
    </main>
  );
}
