import type { Locale } from './locale'

export type LegalSection = { title: string; paragraphs?: string[]; items?: string[] }

export type LegalDoc = { intro: string; sections: LegalSection[] }

/** Matches FITNESS_TERMS_VERSION in codart-messaging, recorded with the next health data each person sends. */
export const LEGAL_VERSION = '6'
export const LEGAL_EFFECTIVE = '2026-11-12'

const pt: { terms: LegalDoc; privacy: LegalDoc } = {
  terms: {
    intro:
      'Estes termos valem para o Fitness, o assistente de alimentação e treino no WhatsApp da Codart Tecnologia LTDA (CNPJ 65.840.318/0001-26, São Paulo, SP). A primeira mensagem da conversa traz o link destes termos, e ao usar o diário você concorda com eles e com a Política de Privacidade.',
    sections: [
      {
        title: 'O que o serviço faz',
        paragraphs: [
          'Você conta o que comeu, bebeu ou treinou, por texto, áudio ou foto, e o diário registra, soma e responde com os números do seu dia, da sua semana e do seu peso. Também sugere refeições, lê rótulos e compara produtos, conforme o plano.',
          'No teste e no Premium, o diário informa: não prescreve dieta, treino, suplemento nem remédio, e não substitui nutricionista, médico ou educador físico. Os treinos prontos são programas gerais, assinados por um educador físico (CREF), que você mesmo escolhe; não são montados para você. Metas, calorias gastas e sugestões são estimativas gerais a partir do que você informa.',
          'No Premium Pro, a dieta e o treino feitos para você são assinados por profissionais com registro no conselho, como explica a seção Premium Pro. Em nenhum plano o serviço receita, dosa ou orienta o uso de remédio ou hormônio, nem interpreta exames.',
          'O jejum intermitente não é indicado para todo mundo: com alguma condição de saúde, na gestação ou com histórico de transtorno alimentar, converse com um profissional antes de começar. O diário registra o protocolo que você escolhe, mas não avalia se ele é adequado para você.',
          'Os valores dos alimentos vêm da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp), do Open Food Facts (licença ODbL), dos rótulos que você envia e de estimativas. Podem ter diferenças em relação ao alimento que você comeu.',
          'O assistente da conversa é uma inteligência artificial, não um nutricionista nem um educador físico, e pode entender algo errado. Confira o que foi registrado; você pode corrigir ou apagar qualquer registro na conversa.',
        ],
      },
      {
        title: 'Quem pode usar',
        paragraphs: [
          'O serviço é para maiores de 18 anos. Quem informar idade menor não tem dados de saúde guardados e recebe a opção de apagar a conta.',
          'A conta é o seu número de WhatsApp. Você responde pelo uso feito a partir dele.',
        ],
      },
      {
        title: 'Teste grátis e Premium',
        items: [
          'São dois planos: o Premium, o assistente completo, por mês ou por ano, e o Premium Pro, o programa com profissionais da seção seguinte. O que cada um inclui, os limites de uso diário e os preços estão na página Planos e são os mesmos mostrados na conversa.',
          'Todo número novo tem um período de teste gratuito do Premium, uma vez só, sem cartão, com a duração mostrada na página Planos. Quando o teste acaba, o diário para de registrar até você assinar. Nada do que você registrou é apagado por isso.',
          'O pagamento é feito na página da Pagar.me (Stone). Os dados do cartão são digitados lá e não chegam até nós.',
          'Premium mensal no cartão: renova sozinho todo mês, pelo mesmo preço contratado, até você cancelar. Se uma cobrança for recusada, o acesso continua por 7 dias para você acertar o pagamento; depois disso, a assinatura é cancelada.',
          'Premium mensal no Pix e anual: são pagos de uma vez por período, sem renovação automática. Pagamentos antecipados somam períodos.',
          'Mudança de preço não vale para o período já pago. Avisamos na conversa antes que um preço novo valha para você.',
          'Trocar o Premium mensal pelo anual vale no fim do período pago.',
        ],
      },
      {
        title: 'Premium Pro',
        items: [
          'O Premium Pro é um programa de acompanhamento vendido por pacote de meses, com tudo do Premium. Você faz uma avaliação completa e recebe uma dieta e um treino montados para você, assinados por um nutricionista (CRN) e por um educador físico (CREF), com check-ins e uma reavaliação por mês. Os pacotes, os preços e a disponibilidade estão na página Planos.',
          'Os profissionais são contratados pela Codart. As dúvidas do seu caso vão para eles, e a resposta chega na própria conversa, com o nome de quem respondeu, em até 24 horas corridas, todos os dias da semana.',
          'A assinatura do plano e das mudanças nele pode ser automática: sai no nome do profissional, com a autorização dele, sem que ele revise cada versão antes de chegar a você. O plano de quem usa hormônio, e uma dieta que mantém um alimento que piora alguma condição sua, continuam esperando o profissional.',
          'O assistente aplica o que os profissionais assinaram, como a progressão de carga do treino e as trocas equivalentes de exercício ou de alimento, e eles veem o que foi feito. Mudanças na estrutura do plano, como frequência, divisão ou calorias, saem com a assinatura deles.',
          'O pacote é pago uma vez só, à vista no Pix ou parcelado no cartão sem juros. Não tem teste grátis nem renovação automática: o programa termina no fim do pacote.',
          'Durante o programa, uma assinatura do Premium mensal no cartão fica pausada, sem cobrança, e volta no fim. Um Premium já pago de uma vez (mensal no Pix ou anual) vira desconto no pacote, proporcional aos dias em que ele e o programa correm juntos, e continua valendo até a data em que já terminaria.',
          'No fim do programa, você volta ao plano que tinha, e o último plano fica na conversa para consulta, sem ajustes, check-ins nem chat com os profissionais. Sem um plano pago, o acesso volta a ser o de quem terminou o teste.',
          'O que você contar sobre remédios e hormônios que usa, e os exames que mandar, fica registrado só para os profissionais levarem em conta no treino e na dieta. Nem o assistente nem os profissionais do programa receitam, dosam ou orientam o uso de remédio ou hormônio.',
        ],
      },
      {
        title: 'Cancelamento e reembolso',
        items: [
          'Premium: você cancela a qualquer momento dizendo "cancelar" na conversa. A renovação para e o acesso continua até o fim do período pago.',
          'Direito de arrependimento: em até 7 dias da primeira contratação do Premium, ou da primeira do Premium Pro, você pode desistir e receber de volta o valor integral pago, como prevê o Código de Defesa do Consumidor (art. 49). Peça na conversa; o acesso pago daquele plano termina com o reembolso.',
          'O reembolso do Premium Pro devolve o que foi pago pelo pacote e retoma a assinatura do Premium que estava pausada. Um Premium já pago continua como estava.',
          'Fora desse prazo, o período já pago e o pacote do Premium Pro não são reembolsados, salvo nos casos previstos em lei. Pedidos especiais são analisados pela equipe.',
          'Contestar uma cobrança com o banco ou o cartão (chargeback) suspende o acesso pago enquanto a contestação estiver aberta.',
          'Apagar a conta cancela a assinatura e encerra o Premium Pro, sem reembolso automático do período em curso.',
        ],
      },
      {
        title: 'Uso permitido',
        paragraphs: [
          'Use o diário para o seu próprio acompanhamento. Não é permitido: enviar conteúdo ilegal ou de terceiros sem autorização, tentar fazer o diário agir fora da sua função, automatizar mensagens, revender o serviço ou tentar acessar dados de outras pessoas. Podemos suspender o acesso de quem fizer isso, avisando na conversa.',
        ],
      },
      {
        title: 'Disponibilidade',
        paragraphs: [
          'O serviço depende do WhatsApp, da Meta, e de outros fornecedores. Trabalhamos para que ele funcione sempre, mas pode haver interrupções, atrasos ou mudanças de funções. Uma mensagem que não for respondida pode ser enviada de novo.',
        ],
      },
      {
        title: 'Responsabilidade',
        paragraphs: [
          'Respondemos pelo serviço nos termos do Código de Defesa do Consumidor. Não respondemos por decisões de alimentação, treino ou saúde tomadas só com base nas estimativas do diário, nem por falhas do WhatsApp ou da sua conexão.',
        ],
      },
      {
        title: 'Propriedade',
        paragraphs: [
          'Os registros são seus. O software, a marca e os textos do serviço são da Codart. Os dados de alimentos de terceiros seguem as licenças das suas fontes.',
        ],
      },
      {
        title: 'Mudanças nestes termos',
        paragraphs: [
          'Quando estes termos mudarem, publicamos a nova versão aqui, e ela passa a valer para o que você mandar depois disso. Se não concordar, você pode cancelar e apagar a conta.',
        ],
      },
      {
        title: 'Lei e foro',
        paragraphs: [
          'Valem as leis do Brasil. Fica eleito o foro do seu domicílio para qualquer questão sobre estes termos.',
        ],
      },
    ],
  },
  privacy: {
    intro:
      'Esta política explica que dados o Fitness guarda, para quê, com quem são compartilhados e como você os controla. A controladora é a Codart Tecnologia LTDA (CNPJ 65.840.318/0001-26, São Paulo, SP). Encarregado pelos dados: Codart Tecnologia LTDA, pelo privacidade@codart.dev.',
    sections: [
      {
        title: 'Dados que guardamos',
        items: [
          'Da conta: o seu número de WhatsApp, o nome que você disser na conversa, o idioma e o fuso horário.',
          'Das conversas: as mensagens que você envia e as respostas, e os áudios e fotos que você manda (pratos, rótulos, códigos de barras).',
          'Do diário: refeições, alimentos, receitas, despensa, treinos e jejum.',
          'Dados de saúde: peso, altura, idade, sexo, nível de atividade, metas, pesagens, dores contadas nos treinos e os itens de saúde abaixo. A LGPD trata esses dados como sensíveis.',
          'Do que você conta ao assistente: notas e preferências (rotina, gostos, o que evita) e, só depois do seu "sim", as condições de saúde que mudam dieta ou treino e os suplementos que você usa. "O que você sabe sobre mim?" mostra tudo, e "esquece" apaga.',
          'Do Premium Pro: as respostas da avaliação e dos check-ins (medidas, histórico de saúde, rotina e alimentação), o registro de remédios e hormônios que você usa, as fotos do físico, os exames e as dietas e treinos anteriores que você mandar, e as mensagens com os profissionais.',
          'Do aceite: a versão dos termos aceita e quando.',
          'De pagamento: o plano, as cobranças e a situação da assinatura. Nome, documento e cartão de quem paga ficam com a Pagar.me, não conosco.',
          'De origem: quando você chega por um anúncio da Meta, o identificador do anúncio.',
        ],
      },
      {
        title: 'Para que usamos e com que base legal',
        items: [
          'Prestar o serviço que você contratou: registrar, somar, responder, lembrar e cobrar (execução de contrato, LGPD art. 7º, V).',
          'Guardar e usar os dados de saúde para montar o seu diário, com o seu consentimento (art. 11, I), dado ao mandar esses dados na conversa depois do aviso da primeira mensagem, que traz o link destes textos. Você pode revogá-lo apagando a conta.',
          'No Premium Pro, usar a avaliação, os check-ins, as fotos, os exames e o registro de remédios e hormônios para os profissionais montarem e ajustarem o seu plano, com o consentimento específico que você dá na avaliação (art. 11, I). As fotos do físico, os exames e os remédios e hormônios ficam só com os profissionais e nunca vão ao modelo de inteligência artificial.',
          'Manter o serviço seguro, evitar abuso e corrigir falhas, com registros técnicos que não trazem o texto das mensagens (legítimo interesse, art. 7º, IX).',
          'Medir visitas e anúncios no site, só com o seu consentimento no aviso de cookies (art. 7º, I).',
        ],
        paragraphs: [
          'Não vendemos os seus dados, não os usamos para publicidade de terceiros e não montamos perfil para outros fins.',
        ],
      },
      {
        title: 'Com quem compartilhamos',
        items: [
          'Meta (WhatsApp): leva as mensagens entre você e o diário.',
          'OpenAI, pela Portkey: lê as mensagens, transcreve os áudios e interpreta as fotos de refeições e rótulos para registrar o que você contou. Pela política da OpenAI para a sua API, o que enviamos não é usado para treinar modelos.',
          'Os profissionais do Premium Pro (nutricionista e educador físico contratados pela Codart): veem, num painel de acesso restrito, os dados de quem está no programa com eles. Cada abertura das fotos do físico fica registrada.',
          'Amazon Web Services (AWS): hospeda o servidor, os bancos de dados e os arquivos.',
          'Pagar.me (Stone): processa os pagamentos.',
          'Open Food Facts: recebe só o código de barras consultado, sem nenhum dado seu.',
          'Ferramenta de avisos internos da equipe: recebe os pedidos de suporte que você faz na conversa (o que você contou, o seu plano e o idioma), para a equipe ler e acompanhar.',
          'Autoridades, quando a lei ou uma ordem judicial exigir.',
        ],
      },
      {
        title: 'Transferência internacional',
        paragraphs: [
          'Os servidores ficam nos Estados Unidos (AWS, região us-east-1), e a OpenAI, a Portkey e a Meta também processam dados fora do Brasil. A transferência é feita para cumprir o contrato com você e com fornecedores que adotam garantias de proteção de dados (LGPD art. 33).',
        ],
      },
      {
        title: 'Por quanto tempo',
        items: [
          'Os dados do diário ficam enquanto a conta existir.',
          'Áudios e fotos são apagados automaticamente 90 dias depois de enviados; o que foi registrado a partir deles continua no diário.',
          'No Premium Pro, as fotos do físico, os exames e as dietas e treinos anteriores ficam enquanto durar o programa e são apagados 90 dias depois do fim, ou antes, se você apagar a conta. O que a avaliação registrou no seu perfil fica enquanto a conta existir, para um próximo programa não perguntar de novo.',
          'Registros técnicos ficam 30 dias. Cópias de segurança ficam até 7 dias.',
          'Os registros fiscais dos pagamentos ficam com a Pagar.me pelo prazo que a lei exige.',
        ],
      },
      {
        title: 'Como apagar tudo',
        paragraphs: [
          'Diga "quero apagar minha conta" na conversa e confirme. Você tem 7 dias para desistir; nesse tempo, nada novo é registrado. Depois disso, apagamos a conta, o diário, o que o assistente guardou, as mensagens, inclusive com os profissionais, os áudios, as fotos, os exames e os registros de pagamento. As cópias de segurança somem em até 7 dias. No total, em até 15 dias não sobra dado seu conosco.',
          'Guardamos só o registro de que houve um pedido de exclusão e quando foi cumprido, sem o seu número. A cópia das conversas no seu WhatsApp e nos servidores da Meta segue as regras da Meta.',
        ],
      },
      {
        title: 'Os seus direitos',
        paragraphs: [
          'Pela LGPD (art. 18), você pode pedir: confirmação de que tratamos os seus dados, acesso a eles, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre com quem compartilhamos, e revogar o consentimento. Peça na conversa ou pelo privacidade@codart.dev; respondemos em até 15 dias. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).',
        ],
      },
      {
        title: 'Segurança',
        paragraphs: [
          'Os dados trafegam com criptografia, ficam em servidores com acesso restrito, e os registros técnicos não guardam o texto das mensagens nem o seu número. Encontrou uma falha? Escreva para security@codart.dev.',
        ],
      },
      {
        title: 'Este site',
        paragraphs: [
          'O site não pede nem guarda dado pessoal. Com a sua permissão no aviso de cookies, o Google Analytics e o pixel da Meta contam visitas e medem anúncios; sem ela, nada deles é carregado. A sua escolha fica só no seu navegador e muda pelo link Cookies no rodapé.',
        ],
      },
      {
        title: 'Menores de idade',
        paragraphs: [
          'O serviço é para maiores de 18 anos. Quem informar idade menor não tem dados de saúde guardados e recebe a opção de apagar a conta.',
        ],
      },
      {
        title: 'Mudanças nesta política',
        paragraphs: [
          'Quando esta política mudar, publicamos a nova versão aqui, e ela passa a valer para os dados que você mandar depois disso.',
        ],
      },
    ],
  },
}

const en: { terms: LegalDoc; privacy: LegalDoc } = {
  terms: {
    intro:
      'These terms apply to Fitness, the food and workout assistant on WhatsApp by Codart Tecnologia LTDA (Brazilian company number CNPJ 65.840.318/0001-26, São Paulo, Brazil). The first message in the chat links these terms, and by using the diary you agree to them and to the Privacy Policy.',
    sections: [
      {
        title: 'What the service does',
        paragraphs: [
          'You tell it what you ate, drank or trained, by text, voice note or photo, and the diary logs it, adds it up and replies with the numbers for your day, your week and your weight. Depending on your plan, it also suggests meals, reads labels and compares products.',
          'On the trial and on Premium, the diary informs: it does not prescribe diets, workouts, supplements or medicine, and it does not replace a dietitian, doctor or fitness professional. The ready workout programs are general programs, signed by a certified trainer (CREF), that you pick yourself; they are not built for you. Goals, calories burned and suggestions are general estimates based on what you tell it.',
          'On Premium Pro, the diet and the training made for you are signed by licensed professionals, as the Premium Pro section explains. On no plan does the service prescribe, dose or advise on the use of medicine or hormones, nor does it interpret lab tests.',
          'Intermittent fasting is not for everyone: if you have a health condition, are pregnant or have a history of eating disorders, talk to a professional before you start. The diary records the protocol you choose, but does not assess whether it suits you.',
          'Food values come from the Brazilian Food Composition Table (TACO, NEPA/Unicamp), from Open Food Facts (ODbL license), from the labels you send and from estimates. They may differ from the food you actually ate.',
          'The chat assistant is artificial intelligence, not a dietitian or a fitness professional, and it can misunderstand. Check what was logged; you can fix or delete any entry in the chat.',
        ],
      },
      {
        title: 'Who can use it',
        paragraphs: [
          'The service is for people aged 18 or over. Anyone who gives an age under 18 has no health data stored and is offered to delete the account.',
          'Your account is your WhatsApp number. You are responsible for its use.',
        ],
      },
      {
        title: 'Free trial and Premium',
        items: [
          'There are two plans: Premium, the full assistant, monthly or yearly, and Premium Pro, the program with professionals described in the next section. What each one includes, the daily usage limits and the prices are on the Plans page and are the same ones shown in the chat.',
          'Every new number gets one free trial of Premium, with no card, for the length shown on the Plans page. When the trial ends, the diary stops logging until you subscribe. Nothing you logged is deleted because of that.',
          'Payment is made on the Pagar.me (Stone) page. Card details are entered there and never reach us.',
          'Premium monthly by card: renews automatically every month, at the price you subscribed to, until you cancel. If a charge is declined, access continues for 7 days so you can sort out the payment; after that, the subscription is cancelled.',
          'Premium monthly by Pix and yearly: paid once per period, with no automatic renewal. Paying ahead adds up periods.',
          'A price change does not apply to a period already paid. We tell you in the chat before a new price applies to you.',
          'Moving from Premium monthly to yearly takes effect at the end of the paid period.',
        ],
      },
      {
        title: 'Premium Pro',
        items: [
          'Premium Pro is a coaching program sold in packages of months, with everything in Premium. You fill in a full assessment and get a diet and a training plan made for you, signed by a registered dietitian (CRN) and a certified trainer (CREF), with check-ins and a reassessment every month. The packages, the prices and whether it is on sale are on the Plans page.',
          'The professionals are hired by Codart. Questions about your case go to them, and the answer arrives in the chat, with the name of who answered, within 24 hours, every day of the week.',
          'Signing the plan and its changes can be automatic: it goes out in the professional’s name, with their authorisation, without them reviewing each version before it reaches you. The plan of someone who uses hormones, and a diet that keeps a food that worsens one of your conditions, still wait for the professional.',
          'The assistant applies what the professionals signed, such as the load progression of your training and equivalent swaps of exercises or foods, and they see what was done. Changes to the structure of the plan, such as frequency, split or calories, go out with their signature.',
          'The package is paid once, upfront by Pix or in interest-free installments by card. There is no free trial and no automatic renewal: the program ends when the package ends.',
          'During the program, a Premium monthly card subscription is paused, with no charges, and resumes at the end. Premium already paid in one go (monthly by Pix or yearly) becomes a discount on the package, in proportion to the days it overlaps with the program, and stays valid until the date it would have ended anyway.',
          'When the program ends, you go back to the plan you had, and the last plan stays in the chat for reference, with no adjustments, check-ins or chat with the professionals. Without a paid plan, your access goes back to that of someone whose trial has ended.',
          'What you tell us about medicine and hormones you use, and the lab tests you send, is recorded only for the professionals to take into account in your training and diet. Neither the assistant nor the program’s professionals prescribe, dose or advise on the use of medicine or hormones.',
        ],
      },
      {
        title: 'Cancellation and refunds',
        items: [
          'Premium: you can cancel at any time by saying "cancel" in the chat. Renewal stops and access continues until the end of the paid period.',
          'Right of withdrawal: within 7 days of your first Premium purchase, or of your first Premium Pro purchase, you can withdraw and get the full amount paid back, as the Brazilian Consumer Protection Code provides (art. 49). Ask in the chat; paid access to that plan ends with the refund.',
          'A Premium Pro refund returns what was paid for the package and resumes the Premium subscription that was paused. Premium already paid stays as it was.',
          'After that period, the time already paid and the Premium Pro package are not refunded, except where the law requires. Special requests are reviewed by the team.',
          'Disputing a charge with your bank or card issuer (chargeback) suspends paid access while the dispute is open.',
          'Deleting your account cancels the subscription and ends Premium Pro, with no automatic refund of the current period.',
        ],
      },
      {
        title: 'Acceptable use',
        paragraphs: [
          'Use the diary for your own tracking. You may not: send illegal content or third parties’ content without permission, try to make the diary act outside its purpose, automate messages, resell the service or try to access other people’s data. We may suspend access for anyone who does, telling them in the chat.',
        ],
      },
      {
        title: 'Availability',
        paragraphs: [
          'The service relies on WhatsApp, by Meta, and other providers. We work to keep it running, but there may be interruptions, delays or changes to features. A message that goes unanswered can be sent again.',
        ],
      },
      {
        title: 'Liability',
        paragraphs: [
          'We are liable for the service under the Brazilian Consumer Protection Code. We are not liable for food, training or health decisions made only on the diary’s estimates, nor for failures of WhatsApp or of your connection.',
        ],
      },
      {
        title: 'Ownership',
        paragraphs: [
          'Your entries are yours. The software, the brand and the texts of the service belong to Codart. Third-party food data follows the licenses of its sources.',
        ],
      },
      {
        title: 'Changes to these terms',
        paragraphs: [
          'When these terms change, we publish the new version here, and it applies to what you send after that. If you do not agree, you can cancel and delete your account.',
        ],
      },
      {
        title: 'Governing law',
        paragraphs: [
          'These terms are governed by the laws of Brazil. Any dispute about them may be brought in the courts of your place of residence.',
        ],
      },
    ],
  },
  privacy: {
    intro:
      'This policy explains what data Fitness keeps, what for, who it is shared with and how you control it. The controller is Codart Tecnologia LTDA (CNPJ 65.840.318/0001-26, São Paulo, Brazil). Data protection contact: Codart Tecnologia LTDA, at privacy@codart.dev.',
    sections: [
      {
        title: 'Data we keep',
        items: [
          'Account: your WhatsApp number, the name you tell the chat, your language and time zone.',
          'Conversations: the messages you send and the replies, and the voice notes and photos you send (plates, labels, barcodes).',
          'Diary: meals, foods, recipes, pantry, workouts and fasting.',
          'Health data: weight, height, age, sex, activity level, goals, weigh-ins, pain you mention in workouts and the health items below. Brazil’s data protection law (LGPD) treats this data as sensitive.',
          'What you tell the assistant: notes and preferences (routine, tastes, what you avoid) and, only after your "yes", the health conditions that change diet or training and the supplements you take. "What do you know about me?" shows all of it, and "forget" deletes it.',
          'Premium Pro: the answers to the assessment and the check-ins (measurements, health history, routine and eating), the record of medicine and hormones you use, the physique photos, the lab tests and the previous diets and training plans you send, and the messages with the professionals.',
          'Acceptance: which version of the terms you accepted and when.',
          'Payment: the plan, the charges and the subscription status. The payer’s name, ID document and card stay with Pagar.me, not with us.',
          'Origin: when you arrive from a Meta ad, the ad identifier.',
        ],
      },
      {
        title: 'What we use it for, and on what legal basis',
        items: [
          'To provide the service you signed up for: logging, adding up, replying, reminding and billing (performance of a contract, LGPD art. 7, V).',
          'To keep and use your health data to build your diary, with your consent (art. 11, I), given when you send that data in the chat after the notice in the first message, which links these texts. You can withdraw it by deleting your account.',
          'On Premium Pro, to use the assessment, the check-ins, the photos, the lab tests and the record of medicine and hormones so the professionals can build and adjust your plan, with the specific consent you give in the assessment (art. 11, I). Physique photos, lab tests and medicine and hormones stay with the professionals only and are never sent to the artificial intelligence model.',
          'To keep the service secure, prevent abuse and fix faults, with technical logs that do not contain the text of messages (legitimate interest, art. 7, IX).',
          'To measure visits and ads on the website, only with your consent in the cookie notice (art. 7, I).',
        ],
        paragraphs: [
          'We do not sell your data, do not use it for third-party advertising and do not profile you for other purposes.',
        ],
      },
      {
        title: 'Who we share it with',
        items: [
          'Meta (WhatsApp): carries the messages between you and the diary.',
          'OpenAI, through Portkey: reads the messages, transcribes voice notes and interprets photos of meals and labels to log what you said. Under OpenAI’s policy for its API, what we send is not used to train models.',
          'The Premium Pro professionals (a dietitian and a trainer hired by Codart): see, in a restricted-access panel, the data of the people in the program with them. Every opening of the physique photos is logged.',
          'Amazon Web Services (AWS): hosts the server, the databases and the files.',
          'Pagar.me (Stone): processes payments.',
          'Open Food Facts: receives only the barcode looked up, with no data about you.',
          'The team’s internal notification tool: receives the support requests you make in the chat (what you told us, your plan and language), so the team can read and follow them up.',
          'Authorities, when the law or a court order requires it.',
        ],
      },
      {
        title: 'International transfers',
        paragraphs: [
          'Our servers are in the United States (AWS, us-east-1 region), and OpenAI, Portkey and Meta also process data outside Brazil. These transfers are made to perform the contract with you, with providers that adopt data protection safeguards (LGPD art. 33).',
        ],
      },
      {
        title: 'How long we keep it',
        items: [
          'Diary data is kept for as long as the account exists.',
          'Voice notes and photos are deleted automatically 90 days after they are sent; what was logged from them stays in the diary.',
          'On Premium Pro, physique photos, lab tests and previous diets and training plans are kept while the program lasts and deleted 90 days after it ends, or sooner if you delete your account. What the assessment recorded in your profile stays for as long as the account exists, so a later program does not ask again.',
          'Technical logs are kept for 30 days. Backups are kept for up to 7 days.',
          'Payment tax records stay with Pagar.me for as long as the law requires.',
        ],
      },
      {
        title: 'How to delete everything',
        paragraphs: [
          'Say "delete my data" in the chat and confirm. You have 7 days to change your mind; during that time, nothing new is logged. After that, we delete the account, the diary, what the assistant kept, the messages, including those with the professionals, voice notes, photos, lab tests and payment records. Backups are gone within 7 days. In total, within 15 days no data of yours remains with us.',
          'We only keep a record that a deletion was requested and when it was carried out, without your number. The copy of the conversation in your WhatsApp and on Meta’s servers follows Meta’s rules.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: [
          'Under the LGPD (art. 18), you can ask for: confirmation that we process your data, access to it, correction, anonymization, blocking or deletion, portability, information about who we share it with, and to withdraw your consent. Ask in the chat or at privacy@codart.dev; we reply within 15 days. You can also complain to Brazil’s National Data Protection Authority (ANPD).',
        ],
      },
      {
        title: 'Security',
        paragraphs: [
          'Data travels encrypted, is stored on servers with restricted access, and technical logs do not keep the text of messages or your number. Found a vulnerability? Write to security@codart.dev.',
        ],
      },
      {
        title: 'This website',
        paragraphs: [
          'The website does not ask for or keep personal data. With your permission in the cookie notice, Google Analytics and the Meta pixel count visits and measure ads; without it, nothing from them is loaded. Your choice stays only in your browser and can be changed from the Cookies link in the footer.',
        ],
      },
      {
        title: 'Minors',
        paragraphs: [
          'The service is for people aged 18 or over. Anyone who gives an age under 18 has no health data stored and is offered to delete the account.',
        ],
      },
      {
        title: 'Changes to this policy',
        paragraphs: [
          'When this policy changes, we publish the new version here, and it applies to the data you send after that.',
        ],
      },
    ],
  },
}

export const LEGAL: Record<Locale, { terms: LegalDoc; privacy: LegalDoc }> = { pt, en }
