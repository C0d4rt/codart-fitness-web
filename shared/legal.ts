import type { Locale } from './locale'

export type LegalSection = { title: string; paragraphs?: string[]; items?: string[] }

export type LegalDoc = { intro: string; sections: LegalSection[] }

/** Matches FITNESS_TERMS_VERSION in codart-messaging: a new version asks everyone to accept again. */
export const LEGAL_VERSION = '1'
export const LEGAL_EFFECTIVE = '2026-10-29'

const pt: { terms: LegalDoc; privacy: LegalDoc } = {
  terms: {
    intro:
      'Estes termos valem para o Fitness, o diário de alimentação e treino no WhatsApp da Codart Tecnologia LTDA (CNPJ 65.840.318/0001-26, São Paulo, SP). Ao tocar em "Aceito" na conversa, você concorda com eles e com a Política de Privacidade.',
    sections: [
      {
        title: 'O que o serviço faz',
        paragraphs: [
          'Você conta o que comeu, bebeu ou treinou, por texto, áudio ou foto, e o diário registra, soma e responde com os números do seu dia, da sua semana e do seu peso. Também sugere refeições, lê rótulos e compara produtos, conforme o plano.',
          'O diário informa: não prescreve dieta, treino, suplemento nem remédio, e não substitui nutricionista, médico ou educador físico. Metas, calorias gastas e sugestões são estimativas gerais a partir do que você informa. Perguntas de saúde são encaminhadas a um profissional.',
          'Os valores dos alimentos vêm da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp), do Open Food Facts (licença ODbL), dos rótulos que você envia e de estimativas. Podem ter diferenças em relação ao alimento que você comeu.',
          'Parte das respostas é feita por inteligência artificial, que pode entender algo errado. Confira o que foi registrado; você pode corrigir ou apagar qualquer registro na conversa.',
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
        title: 'Teste grátis e planos',
        items: [
          'Todo número novo tem um período de teste gratuito, uma vez só, sem cartão. A duração, os planos, o que cada um inclui, os limites de uso diário e os preços estão na página Planos e são os mesmos mostrados na conversa.',
          'Quando o teste acaba, o diário para de registrar até você assinar. Nada do que você registrou é apagado por isso.',
          'O pagamento é feito na página da Pagar.me (Stone). Os dados do cartão são digitados lá e não chegam até nós.',
          'Mensal no cartão: renova sozinho todo mês, pelo mesmo preço contratado, até você cancelar. Se uma cobrança for recusada, o acesso continua por 7 dias para você acertar o pagamento; depois disso, a assinatura é cancelada.',
          'Mensal no Pix e anual: são pagos de uma vez por período, sem renovação automática. Pagamentos antecipados somam períodos.',
          'Mudança de preço não vale para o período já pago. Avisamos na conversa antes que um preço novo valha para você.',
          'Passar do Básico para o Premium vale na hora, pagando a diferença proporcional. Voltar para o Básico ou trocar de mensal para anual vale no fim do período pago.',
        ],
      },
      {
        title: 'Cancelamento e reembolso',
        items: [
          'Você cancela a qualquer momento dizendo "cancelar" na conversa. A renovação para e o acesso continua até o fim do período pago.',
          'Direito de arrependimento: em até 7 dias da primeira contratação, você pode desistir e receber o valor integral de volta, como prevê o Código de Defesa do Consumidor (art. 49). Peça na conversa; o acesso pago termina com o reembolso.',
          'Fora desse prazo, o período já pago não é reembolsado, salvo nos casos previstos em lei. Pedidos especiais são analisados pela equipe.',
          'Contestar uma cobrança com o banco ou o cartão (chargeback) suspende o acesso pago enquanto a contestação estiver aberta.',
          'Apagar a conta cancela a assinatura, sem reembolso automático do período em curso.',
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
          'Quando estes termos mudarem, publicamos a nova versão aqui e pedimos o seu aceite de novo na conversa antes de registrar qualquer coisa. Se não aceitar, você pode cancelar e apagar a conta.',
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
          'Da conta: o seu número de WhatsApp, o nome do seu perfil quando o WhatsApp o envia, o idioma e o fuso horário.',
          'Das conversas: as mensagens que você envia e as respostas, e os áudios e fotos que você manda (pratos, rótulos, códigos de barras).',
          'Do diário: refeições, alimentos, receitas, despensa, treinos e jejum.',
          'Dados de saúde: peso, altura, idade, sexo, nível de atividade, metas e pesagens. A LGPD trata esses dados como sensíveis.',
          'Do aceite: a versão dos termos aceita e quando.',
          'De pagamento: o plano, as cobranças e a situação da assinatura. Nome, documento e cartão de quem paga ficam com a Pagar.me, não conosco.',
          'De origem: quando você chega por um anúncio da Meta, o identificador do anúncio.',
        ],
      },
      {
        title: 'Para que usamos e com que base legal',
        items: [
          'Prestar o serviço que você contratou: registrar, somar, responder, lembrar e cobrar (execução de contrato, LGPD art. 7º, V).',
          'Guardar e usar os dados de saúde para montar o seu diário, com o seu consentimento específico e destacado, dado ao tocar em "Aceito" (art. 11, I). Você pode revogá-lo apagando a conta.',
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
          'OpenAI, pela Portkey: lê as mensagens, transcreve os áudios e interpreta as fotos para registrar o que você contou. Pela política da OpenAI para a sua API, o que enviamos não é usado para treinar modelos.',
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
          'Registros técnicos ficam 30 dias. Cópias de segurança ficam até 7 dias.',
          'Os registros fiscais dos pagamentos ficam com a Pagar.me pelo prazo que a lei exige.',
        ],
      },
      {
        title: 'Como apagar tudo',
        paragraphs: [
          'Diga "quero apagar minha conta" na conversa e confirme. Você tem 7 dias para desistir; nesse tempo, nada novo é registrado. Depois disso, apagamos a conta, o diário, as mensagens, os áudios, as fotos e os registros de pagamento. As cópias de segurança somem em até 7 dias. No total, em até 15 dias não sobra dado seu conosco.',
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
          'Quando esta política mudar, publicamos a nova versão aqui e pedimos o seu aceite de novo na conversa.',
        ],
      },
    ],
  },
}

const en: { terms: LegalDoc; privacy: LegalDoc } = {
  terms: {
    intro:
      'These terms apply to Fitness, the food and workout diary on WhatsApp by Codart Tecnologia LTDA (Brazilian company number CNPJ 65.840.318/0001-26, São Paulo, Brazil). By tapping "I accept" in the chat, you agree to them and to the Privacy Policy.',
    sections: [
      {
        title: 'What the service does',
        paragraphs: [
          'You tell it what you ate, drank or trained, by text, voice note or photo, and the diary logs it, adds it up and replies with the numbers for your day, your week and your weight. Depending on your plan, it also suggests meals, reads labels and compares products.',
          'The diary informs: it does not prescribe diets, workouts, supplements or medicine, and it does not replace a dietitian, doctor or fitness professional. Goals, calories burned and suggestions are general estimates based on what you tell it. Health questions are referred to a professional.',
          'Food values come from the Brazilian Food Composition Table (TACO, NEPA/Unicamp), from Open Food Facts (ODbL license), from the labels you send and from estimates. They may differ from the food you actually ate.',
          'Some replies are made by artificial intelligence, which can misunderstand. Check what was logged; you can fix or delete any entry in the chat.',
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
        title: 'Free trial and plans',
        items: [
          'Every new number gets one free trial, with no card. The trial length, the plans, what each one includes, the daily usage limits and the prices are on the Plans page and are the same ones shown in the chat.',
          'When the trial ends, the diary stops logging until you subscribe. Nothing you logged is deleted because of that.',
          'Payment is made on the Pagar.me (Stone) page. Card details are entered there and never reach us.',
          'Monthly by card: renews automatically every month, at the price you subscribed to, until you cancel. If a charge is declined, access continues for 7 days so you can sort out the payment; after that, the subscription is cancelled.',
          'Monthly by Pix and yearly: paid once per period, with no automatic renewal. Paying ahead adds up periods.',
          'A price change does not apply to a period already paid. We tell you in the chat before a new price applies to you.',
          'Moving from Basic to Premium takes effect right away, paying the prorated difference. Moving back to Basic or from monthly to yearly takes effect at the end of the paid period.',
        ],
      },
      {
        title: 'Cancellation and refunds',
        items: [
          'You can cancel at any time by saying "cancel" in the chat. Renewal stops and access continues until the end of the paid period.',
          'Right of withdrawal: within 7 days of your first purchase, you can withdraw and get the full amount back, as the Brazilian Consumer Protection Code provides (art. 49). Ask in the chat; paid access ends with the refund.',
          'After that period, the time already paid is not refunded, except where the law requires. Special requests are reviewed by the team.',
          'Disputing a charge with your bank or card issuer (chargeback) suspends paid access while the dispute is open.',
          'Deleting your account cancels the subscription, with no automatic refund of the current period.',
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
          'When these terms change, we publish the new version here and ask for your acceptance again in the chat before logging anything. If you do not accept, you can cancel and delete your account.',
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
          'Account: your WhatsApp number, your profile name when WhatsApp sends it, your language and time zone.',
          'Conversations: the messages you send and the replies, and the voice notes and photos you send (plates, labels, barcodes).',
          'Diary: meals, foods, recipes, pantry, workouts and fasting.',
          'Health data: weight, height, age, sex, activity level, goals and weigh-ins. Brazil’s data protection law (LGPD) treats this data as sensitive.',
          'Acceptance: which version of the terms you accepted and when.',
          'Payment: the plan, the charges and the subscription status. The payer’s name, ID document and card stay with Pagar.me, not with us.',
          'Origin: when you arrive from a Meta ad, the ad identifier.',
        ],
      },
      {
        title: 'What we use it for, and on what legal basis',
        items: [
          'To provide the service you signed up for: logging, adding up, replying, reminding and billing (performance of a contract, LGPD art. 7, V).',
          'To keep and use your health data to build your diary, with your specific and highlighted consent, given when you tap "I accept" (art. 11, I). You can withdraw it by deleting your account.',
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
          'OpenAI, through Portkey: reads the messages, transcribes voice notes and interprets photos to log what you said. Under OpenAI’s policy for its API, what we send is not used to train models.',
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
          'Technical logs are kept for 30 days. Backups are kept for up to 7 days.',
          'Payment tax records stay with Pagar.me for as long as the law requires.',
        ],
      },
      {
        title: 'How to delete everything',
        paragraphs: [
          'Say "delete my data" in the chat and confirm. You have 7 days to change your mind; during that time, nothing new is logged. After that, we delete the account, the diary, the messages, voice notes, photos and payment records. Backups are gone within 7 days. In total, within 15 days no data of yours remains with us.',
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
          'When this policy changes, we publish the new version here and ask for your acceptance again in the chat.',
        ],
      },
    ],
  },
}

export const LEGAL: Record<Locale, { terms: LegalDoc; privacy: LegalDoc }> = { pt, en }
