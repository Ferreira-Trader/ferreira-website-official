// Política de privacidade dos sites da Ferreira Trader.
//
// Escrita em 14/10/2026 a partir do que os sites fazem de fato (container GTM-PJGMM2NV e o
// server-side GTM-5JKL99NJ, formulários, checkout e o kbtec-collect). Base: a política de
// 03/03/2025 do aplicativo de atendimento no Instagram, que vivia no WordPress antigo.
// Ao mudar o tracking (tag nova, plataforma nova, cookie novo), atualize a seção correspondente
// e a data de "Última atualização".

const UPDATED_AT = "14 de outubro de 2026";

type Block = { title: string; paragraphs?: string[]; items?: string[] };

const COOKIES: { name: string; what: string; duration: string }[] = [
  { name: "fn, ln, em, ph", what: "nome, sobrenome, e-mail e WhatsApp informados em um formulário, para reconhecer você nas próximas visitas e nas conversões", duration: "até 400 dias" },
  { name: "ct, st, country, client_ip_address", what: "cidade, estado, país e endereço IP aproximados da sua conexão", duration: "até 400 dias" },
  { name: "dmg_currency, dmg_total_value", what: "moeda e valor do pedido iniciado no checkout", duration: "até 400 dias" },
  { name: "_ga, _ga_*", what: "Google Analytics: medir visitas e uso das páginas", duration: "até 2 anos" },
  { name: "_fbp, _fbc", what: "Meta (Facebook e Instagram): medir resultado de anúncios", duration: "até 90 dias" },
  { name: "_gcl_*", what: "Google Ads: medir resultado de anúncios", duration: "até 90 dias" },
  { name: "_clck, _clsk", what: "Microsoft Clarity: entender como as páginas são usadas", duration: "até 1 ano" },
];

const BLOCKS: Block[] = [
  {
    title: "1. Quem somos",
    paragraphs: [
      "Esta política vale para os sites e páginas da Ferreira Trader (ferreiratrader.com.br e seus subdomínios, e as páginas da Alfa Class em alfaclass.com.br) e para o nosso atendimento por mensagem no Instagram e no WhatsApp.",
      "O responsável pelos seus dados pessoais (controlador, na Lei Geral de Proteção de Dados, Lei nº 13.709/2018) é a FERREIRA TRADER CONSULTORIA LTDA, CNPJ 38.158.936/0001-18, com sede no Rio de Janeiro/RJ.",
    ],
  },
  {
    title: "2. Encarregado de proteção de dados",
    paragraphs: [
      "O encarregado pelo tratamento de dados pessoais é Kelvin de Jesus Brito, pelo e-mail falecom@kelvinbrito.com. É com ele que você exerce os seus direitos (seção 8) e esclarece dúvidas sobre esta política.",
    ],
  },
  {
    title: "3. Quais dados coletamos",
    paragraphs: ["Dados que você nos informa:"],
    items: [
      "nome, e-mail e número de WhatsApp, quando você preenche um formulário (lista de espera, inscrição em aula, material gratuito);",
      "dados de compra (nome, e-mail, telefone, CPF e forma de pagamento), quando você compra pelo checkout. O pagamento é processado pela plataforma de checkout; não recebemos o número do seu cartão;",
      "o conteúdo das mensagens que você nos envia pelo WhatsApp, pelo Instagram (mensagem direta e comentários) ou por e-mail.",
    ],
  },
  {
    title: "",
    paragraphs: ["Dados coletados automaticamente quando você visita as páginas:"],
    items: [
      "endereço IP e a localização aproximada que se deduz dele (país, estado e cidade). Não usamos o GPS do seu aparelho;",
      "navegador, sistema operacional, idioma e tipo de aparelho;",
      "páginas visitadas, de onde você veio (por exemplo, de qual anúncio) e as ações nas páginas, como cliques e formulários enviados;",
      "identificadores guardados em cookies (seção 6).",
    ],
  },
  {
    title: "4. Para que usamos",
    items: [
      "entrar em contato sobre o que você pediu: aulas, materiais, lista de espera, atendimento comercial e suporte, inclusive pelo WhatsApp;",
      "processar compras, liberar o acesso aos produtos e cuidar da renovação e do pós-venda;",
      "medir quantas pessoas visitam as páginas e quais anúncios trazem resultado, e mostrar anúncios a quem já demonstrou interesse;",
      "melhorar as páginas e os produtos;",
      "prevenir fraude e cumprir obrigações legais e fiscais.",
    ],
  },
  {
    title: "5. Bases legais",
    items: [
      "execução de contrato (art. 7º, V): para entregar o que você comprou ou pediu;",
      "consentimento (art. 7º, I): quando você envia um formulário pedindo contato ou material;",
      "legítimo interesse (art. 7º, IX): para medir visitas e resultado de anúncios, melhorar as páginas e prevenir fraude, sempre respeitando os seus direitos. Você pode se opor a qualquer momento (seção 8);",
      "cumprimento de obrigação legal (art. 7º, II): para guardar registros fiscais e de acesso exigidos por lei.",
    ],
  },
  {
    title: "6. Cookies",
    paragraphs: [
      "Cookies são pequenos arquivos que o site guarda no seu navegador. Usamos os da tabela abaixo. Você pode apagá-los ou bloqueá-los nas configurações do navegador; as páginas continuam funcionando, mas deixamos de reconhecer a sua visita anterior.",
    ],
  },
  {
    title: "7. Com quem compartilhamos",
    paragraphs: ["Compartilhamos dados apenas com quem nos ajuda a operar, e só o necessário para cada função:"],
    items: [
      "Meta (Facebook e Instagram), Google (Analytics, Tag Manager e Ads) e Microsoft (Clarity): para medir visitas e resultado de anúncios. Para que a Meta e o Google atribuam corretamente um cadastro ou uma compra a um anúncio, enviamos a eles dados como e-mail, telefone, nome, cidade, estado e IP, em parte de forma criptografada (hash);",
      "plataformas de checkout e pagamento (como Cakto, Hotmart e Digital Manager Guru): para processar compras e assinaturas;",
      "ferramentas de atendimento e relacionamento (CRM e WhatsApp): para falar com você;",
      "KB Tecnologia, que opera parte da nossa infraestrutura de dados e de tecnologia em nosso nome;",
      "autoridades públicas, quando houver obrigação legal ou ordem judicial.",
    ],
  },
  {
    title: "",
    paragraphs: [
      "A localização aproximada a partir do IP usa a base IP Geolocation by DB-IP (https://db-ip.com), licenciada sob Creative Commons Attribution 4.0. A consulta acontece nos nossos servidores, sem enviar o seu IP à DB-IP.",
    ],
  },
  {
    title: "8. Seus direitos",
    paragraphs: [
      "Pela LGPD, você pode a qualquer momento: confirmar se tratamos dados seus e acessá-los; corrigir dados incompletos ou desatualizados; pedir anonimização, bloqueio ou eliminação de dados desnecessários; pedir a portabilidade; saber com quem compartilhamos; revogar o consentimento; e se opor a um tratamento feito por legítimo interesse.",
      "Para isso, escreva para falecom@kelvinbrito.com. Respondemos em até 15 dias. Se não ficar satisfeito, você pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD) ou aos órgãos de defesa do consumidor.",
    ],
  },
  {
    title: "9. Por quanto tempo guardamos",
    paragraphs: [
      "Guardamos os dados enquanto forem necessários para a finalidade de cada um: enquanto você for aluno ou cliente, enquanto houver interesse em contato (até você pedir para sair) e pelos prazos exigidos por lei, como os registros fiscais e os registros de acesso a aplicações (6 meses, Marco Civil da Internet). Depois, eliminamos ou anonimizamos.",
    ],
  },
  {
    title: "10. Transferência internacional",
    paragraphs: [
      "Alguns dos serviços que usamos (Meta, Google, Microsoft e provedores de servidor) guardam ou processam dados fora do Brasil, principalmente nos Estados Unidos. Nesses casos, a transferência segue o que a LGPD permite, com as garantias contratuais desses fornecedores.",
    ],
  },
  {
    title: "11. Segurança",
    paragraphs: [
      "Protegemos os dados com acesso restrito a quem precisa, conexões criptografadas (HTTPS), senhas e chaves guardadas fora do código e cópias de segurança. Nenhum sistema é completamente seguro. Se suspeitar de algum problema, escreva para falecom@kelvinbrito.com.",
    ],
  },
  {
    title: "12. Crianças e adolescentes",
    paragraphs: [
      "Nossos produtos e páginas são destinados a maiores de 18 anos. Se soubermos que coletamos dados de menor de idade, nós os eliminaremos.",
    ],
  },
  {
    title: "13. Mudanças nesta política",
    paragraphs: [
      "Podemos atualizar esta política quando mudarmos a forma de tratar dados. A data da versão em vigor fica no topo da página.",
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen w-full bg-white text-[#1a1a1a] [font-family:'Inter',Helvetica] px-4 py-12 md:py-16">
      <article className="max-w-[720px] mx-auto flex flex-col gap-6 text-[15px] md:text-[16px] leading-[1.7]">
        <header className="flex flex-col gap-2">
          <h1 className="text-[28px] md:text-[34px] font-bold leading-tight">Política de Privacidade</h1>
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
            {block.title.startsWith("6.") && (
              <div className="overflow-x-auto">
                <table className="w-full text-[14px] border-collapse">
                  <thead>
                    <tr className="text-left border-b border-[#ddd]">
                      <th className="py-2 pr-4 font-semibold">Cookie</th>
                      <th className="py-2 pr-4 font-semibold">Para quê</th>
                      <th className="py-2 font-semibold whitespace-nowrap">Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIES.map((c) => (
                      <tr key={c.name} className="border-b border-[#eee] align-top">
                        <td className="py-2 pr-4 font-mono text-[13px] whitespace-nowrap">{c.name}</td>
                        <td className="py-2 pr-4">{c.what}</td>
                        <td className="py-2 whitespace-nowrap">{c.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        <footer className="border-t border-[#eee] pt-6 text-[14px] text-[#5a5a5a]">
          FERREIRA TRADER CONSULTORIA LTDA · CNPJ 38.158.936/0001-18 · Rio de Janeiro/RJ ·
          Encarregado: Kelvin de Jesus Brito · falecom@kelvinbrito.com
        </footer>
      </article>
    </main>
  );
}
