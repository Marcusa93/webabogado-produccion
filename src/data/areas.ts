// Sin imports: vite.config.ts lo lee en el build para pre-renderizar el <head> de cada página.

export interface AreaFaq {
  q: string;
  a: string;
}

export interface Area {
  slug: string;
  title: string;
  short: string;
  summary: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  cases: string[];
  faqs: AreaFaq[];
}

export const areas: Area[] = [
  {
    slug: 'laboral-y-art',
    title: 'Laboral y ART',
    short: 'Laboral y ART',
    summary:
      'Despidos, trabajo no registrado, acoso laboral y accidentes de trabajo. Representamos a trabajadores y defendemos empresas.',
    h1: 'Abogados laborales y de ART en Tucumán',
    metaTitle: 'Abogado laboral y ART en Tucumán | Estudio Marco Rossi',
    metaDescription:
      'Despidos, trabajo no registrado, acoso laboral y accidentes de trabajo. Reclamos contra ART y defensa de empresas en Tucumán. Primera consulta sin cargo.',
    intro: [
      'Asesoramos y litigamos conflictos laborales tanto del lado del trabajador como de la empresa. Analizamos tu situación para definir la mejor vía: negociación, reclamo administrativo o demanda judicial.',
      'En accidentes y enfermedades laborales te acompañamos en el trámite ante la ART y las comisiones médicas, y en el reclamo judicial cuando corresponde.',
    ],
    cases: [
      'Despidos con y sin causa',
      'Trabajo no registrado o mal registrado',
      'Accidentes de trabajo y enfermedades profesionales',
      'Reclamos contra ART y comisiones médicas',
      'Acoso laboral y discriminación',
      'Diferencias salariales y liquidaciones finales',
      'Defensa de empresas en reclamos laborales',
      'Prueba digital: chats, mails y redes sociales',
    ],
    faqs: [
      {
        q: '¿Cuánto tiempo tengo para hacer un reclamo laboral?',
        a: 'Como regla general, las acciones derivadas del contrato de trabajo prescriben a los dos años (art. 256 de la Ley de Contrato de Trabajo). Algunos plazos para intimar o impugnar son mucho más cortos, por eso conviene consultar apenas ocurre el problema.',
      },
      {
        q: '¿Qué hago si me despidieron?',
        a: 'Guardá el telegrama o la comunicación de despido, tus recibos de sueldo y los mensajes con tu empleador. No firmes nada sin asesorarte: con esa documentación evaluamos qué indemnización corresponde y cómo reclamarla.',
      },
      {
        q: '¿Qué pasa si la ART rechaza mi accidente o me reconoce una incapacidad baja?',
        a: 'El dictamen de la comisión médica puede revisarse. Analizamos el expediente y, si corresponde, lo impugnamos o iniciamos el reclamo judicial para que la incapacidad se valore correctamente.',
      },
      {
        q: '¿Atienden también a empresas?',
        a: 'Sí. Asesoramos a empleadores en desvinculaciones, sanciones y reclamos laborales, y los defendemos en juicio.',
      },
    ],
  },
  {
    slug: 'civil-y-danos',
    title: 'Civil y daños',
    short: 'Civil y daños',
    summary:
      'Accidentes de tránsito, daños y perjuicios, incumplimientos de contrato y defensa del consumidor frente a bancos y empresas.',
    h1: 'Abogados civiles y de daños en Tucumán',
    metaTitle: 'Abogado de daños y civil en Tucumán | Estudio Marco Rossi',
    metaDescription:
      'Accidentes de tránsito, daños y perjuicios, contratos y defensa del consumidor. Litigio civil y comercial en Tucumán. Primera consulta sin cargo.',
    intro: [
      'Llevamos reclamos por daños y conflictos civiles y comerciales, desde la negociación hasta el juicio. Trabajamos con prueba documental clásica y con evidencia digital cuando ayuda a acreditar los hechos.',
      'También defendemos a consumidores frente a bancos, empresas de servicios, aerolíneas y comercios electrónicos.',
    ],
    cases: [
      'Accidentes de tránsito',
      'Daños y perjuicios',
      'Incumplimientos contractuales y comerciales',
      'Defensa del consumidor',
      'Fraudes bancarios y débitos indebidos',
      'Vuelos cancelados o demorados',
      'Mediaciones',
    ],
    faqs: [
      {
        q: '¿Cuánto tiempo tengo para reclamar por un daño?',
        a: 'En general, el reclamo de la indemnización por daños derivados de la responsabilidad civil prescribe a los tres años (art. 2561 del Código Civil y Comercial), con excepciones. Conviene consultar cuanto antes para preservar la prueba.',
      },
      {
        q: 'Tuve un accidente de tránsito, ¿qué tengo que juntar?',
        a: 'Fotos del lugar y de los vehículos, datos del otro conductor y de su seguro, la denuncia policial o ante tu aseguradora, certificados médicos y comprobantes de gastos. Con eso evaluamos el reclamo contra el responsable y su compañía de seguros.',
      },
      {
        q: '¿Puedo reclamarle a un banco o a una empresa de servicios?',
        a: 'Sí. La Ley de Defensa del Consumidor (24.240) protege frente a cobros indebidos, incumplimientos y prácticas abusivas. Se puede reclamar la reparación del daño y, según el caso, una multa civil por daño punitivo.',
      },
      {
        q: '¿Hay que pasar por una mediación antes del juicio?',
        a: 'En muchos reclamos civiles la mediación previa es obligatoria. Te acompañamos en esa instancia, que muchas veces permite llegar a un acuerdo más rápido.',
      },
    ],
  },
  {
    slug: 'penal',
    title: 'Penal',
    short: 'Penal',
    summary: 'Defensa penal, denuncias y querellas, con foco en estafas, ciberdelitos y evidencia digital.',
    h1: 'Abogados penalistas en Tucumán',
    metaTitle: 'Abogado penalista en Tucumán | Estudio Marco Rossi',
    metaDescription:
      'Defensa penal, denuncias y querellas, estafas y ciberdelitos. Asistencia en todas las etapas del proceso en Tucumán. Primera consulta sin cargo.',
    intro: [
      'Asistimos tanto a personas imputadas como a víctimas que quieren intervenir como querellantes. Actuamos desde la denuncia o la primera citación hasta el juicio oral.',
      'Tenemos especial experiencia en delitos informáticos y en el manejo de evidencia digital: cómo obtenerla, preservarla y cuestionarla.',
    ],
    cases: [
      'Defensa de personas imputadas',
      'Denuncias penales',
      'Querellas en representación de víctimas',
      'Estafas y fraudes, también digitales',
      'Delitos informáticos',
      'Calumnias e injurias',
      'Juicios orales',
    ],
    faqs: [
      {
        q: 'Me citaron a declarar, ¿qué hago?',
        a: 'No te presentes sin asesoramiento. Tenés derecho a contar con un abogado defensor y nadie puede obligarte a declarar contra vos mismo. Antes de la audiencia revisamos la causa y definimos la estrategia.',
      },
      {
        q: 'Fui víctima de una estafa, ¿puedo hacer la denuncia?',
        a: 'Sí. Te ayudamos a presentar la denuncia con la prueba necesaria y, si querés, a intervenir como querellante para impulsar la investigación.',
      },
      {
        q: '¿Qué prueba sirve en un delito informático?',
        a: 'Capturas, chats, correos, comprobantes de transferencias y datos de las cuentas involucradas. Lo importante es preservarlos de forma que no puedan impugnarse, por eso conviene asesorarse antes de borrar o modificar nada.',
      },
    ],
  },
  {
    slug: 'previsional',
    title: 'Previsional',
    short: 'Previsional',
    summary: 'Jubilaciones, pensiones, retiro por invalidez, reajustes de haberes y reclamos ante ANSES.',
    h1: 'Abogados previsionales en Tucumán',
    metaTitle: 'Abogado previsional en Tucumán: jubilaciones y ANSES | Estudio Marco Rossi',
    metaDescription:
      'Jubilaciones, pensiones, retiro por invalidez y reajuste de haberes. Te acompañamos en el trámite ante ANSES y en el reclamo judicial. Tucumán.',
    intro: [
      'Te acompañamos para que accedas al beneficio que te corresponde y para que se te pague bien. Iniciamos y seguimos el trámite ante ANSES y, cuando hace falta, reclamamos en la justicia.',
    ],
    cases: [
      'Jubilaciones',
      'Pensiones por fallecimiento',
      'Retiro por invalidez',
      'Reajuste de haberes',
      'Reconocimiento de servicios y aportes',
      'Reclamos judiciales contra ANSES',
    ],
    faqs: [
      {
        q: '¿Cuándo me puedo jubilar?',
        a: 'En la jubilación ordinaria del régimen general, a los 65 años los varones y a los 60 las mujeres, con al menos 30 años de aportes. Existen regímenes especiales con otros requisitos: revisamos tu historia laboral para ver cuál te corresponde.',
      },
      {
        q: '¿Qué es el reajuste de haberes?',
        a: 'Es el reclamo para que se recalcule tu jubilación cuando el haber inicial o su actualización se calcularon mal. Antes de iniciarlo analizamos tu caso para evaluar si conviene.',
      },
      {
        q: '¿Qué hago si ANSES rechazó mi trámite?',
        a: 'La resolución puede cuestionarse. Revisamos el expediente, completamos lo que falte y, si corresponde, iniciamos la demanda judicial.',
      },
    ],
  },
  {
    slug: 'salud',
    title: 'Salud',
    short: 'Salud',
    summary: 'Amparos contra obras sociales y prepagas por medicamentos, tratamientos, cirugías y discapacidad.',
    h1: 'Abogados de derecho a la salud en Tucumán',
    metaTitle: 'Abogado de salud en Tucumán: amparos y coberturas | Estudio Marco Rossi',
    metaDescription:
      'Amparos contra obras sociales y prepagas por medicamentos, tratamientos, cirugías y discapacidad. Actuamos con urgencia cuando la salud no puede esperar.',
    intro: [
      'Cuando una obra social o una prepaga niega o demora una cobertura, la salud no puede esperar. Presentamos reclamos y acciones de amparo, con pedido de medida cautelar cuando la urgencia lo requiere.',
    ],
    cases: [
      'Negativa de cobertura de medicamentos',
      'Tratamientos y cirugías',
      'Prestaciones por discapacidad',
      'Cuotas y aumentos de prepagas',
      'Reintegros de gastos médicos',
      'Mala praxis médica',
    ],
    faqs: [
      {
        q: '¿Qué es un amparo de salud?',
        a: 'Es una acción judicial rápida para que la obra social o la prepaga cubra una prestación que niega o demora. Si hay urgencia, se pide además una medida cautelar para que la cobertura se otorgue mientras dura el juicio.',
      },
      {
        q: '¿Qué necesito para iniciar el reclamo?',
        a: 'La prescripción o el pedido médico, la constancia de la negativa o de la falta de respuesta, tu credencial y, si corresponde, el certificado de discapacidad. Con eso evaluamos el caso en la primera consulta.',
      },
      {
        q: '¿Qué cobertura tienen las personas con discapacidad?',
        a: 'La Ley 24.901 establece un sistema de prestaciones básicas de atención integral para las personas con discapacidad, a cargo de las obras sociales. Con el certificado único de discapacidad (CUD), esas prestaciones deben cubrirse en forma integral.',
      },
    ],
  },
  {
    slug: 'empresas-y-sociedades',
    title: 'Empresas y sociedades',
    short: 'Empresas',
    summary: 'Sociedades y fundaciones, conflictos societarios, contratos entre empresas y compliance digital.',
    h1: 'Abogados de empresas y sociedades en Tucumán',
    metaTitle: 'Abogado de empresas y sociedades en Tucumán | Estudio Marco Rossi',
    metaDescription:
      'Constitución de sociedades y fundaciones, contratos comerciales, conflictos societarios y asesoramiento continuo para empresas en Tucumán.',
    intro: [
      'Acompañamos a emprendedores, empresas y organizaciones sin fines de lucro desde su constitución hasta la resolución de conflictos. Preferimos prevenir: contratos claros y estructuras ordenadas evitan juicios.',
    ],
    cases: [
      'Constitución de sociedades (SA, SRL, SAS)',
      'Fundaciones y asociaciones civiles',
      'Contratos comerciales',
      'Conflictos entre socios',
      'Reclamos laborales y de consumidores contra la empresa',
      'Compliance digital y protección de datos',
      'Asesoramiento continuo',
    ],
    faqs: [
      {
        q: '¿Qué tipo de sociedad me conviene?',
        a: 'Depende de la cantidad de socios, el capital, la actividad y cómo quieran tomar decisiones. Comparamos SAS, SRL y SA según tu proyecto antes de constituirla.',
      },
      {
        q: '¿Cómo se constituye una fundación?',
        a: 'Se redacta el estatuto, se integra el patrimonio inicial y se solicita la autorización ante el organismo de control. Te acompañamos en todo el trámite.',
      },
      {
        q: '¿Ofrecen asesoramiento mensual?',
        a: 'Sí. Para empresas que necesitan consultas frecuentes ofrecemos un esquema de asesoramiento continuo con honorarios definidos de antemano.',
      },
    ],
  },
  {
    slug: 'derecho-digital',
    title: 'Derecho digital',
    short: 'Derecho digital',
    summary:
      'Influencers, recuperación de cuentas, fraudes online y prueba electrónica: preservación de evidencia y pericias.',
    h1: 'Abogados de derecho digital en Tucumán',
    metaTitle: 'Abogado de derecho digital e influencers en Tucumán | Estudio Marco Rossi',
    metaDescription:
      'Influencers y creadores, recuperación de cuentas, fraudes online, datos personales y prueba electrónica. Derecho y tecnología en Tucumán.',
    intro: [
      'Traducimos conflictos en redes y plataformas en planteos jurídicos concretos. Asesoramos a influencers, empresas y particulares, y litigamos casos donde la prueba es digital.',
      'Te guiamos en la identificación, preservación y presentación de evidencia digital para que tenga validez judicial.',
    ],
    cases: [
      'Contratos para influencers y creadores',
      'Uso no autorizado de imagen o contenido',
      'Recuperación de cuentas y desmonetizaciones',
      'Fraudes online y phishing',
      'Protección de datos personales',
      'Preservación de evidencia y pericias informáticas',
      'Inteligencia artificial en empresas',
    ],
    faqs: [
      {
        q: '¿Cómo preservo un chat o una publicación como prueba?',
        a: 'No borres nada y anotá fecha, hora y URL. Una captura sola puede impugnarse: para darle valor probatorio se puede certificar ante escribano o con una pericia informática. Te indicamos el camino según el caso.',
      },
      {
        q: 'Me hackearon la cuenta, ¿qué hago?',
        a: 'Intentá recuperarla por los canales oficiales y reuní toda la evidencia: mails de la plataforma, capturas y movimientos. Si hubo estafa o uso de tu identidad, podemos hacer la denuncia y los reclamos ante la plataforma.',
      },
      {
        q: '¿Una marca puede usar mi imagen o mi contenido sin permiso?',
        a: 'No. El uso de tu imagen requiere tu consentimiento (art. 53 del Código Civil y Comercial) y tus contenidos están protegidos por la Ley de Propiedad Intelectual. Podemos reclamar que se retiren y una indemnización.',
      },
    ],
  },
];

export const workSteps = [
  'Diagnóstico inicial sin cargo',
  'Costos claros desde el inicio',
  'Reportes de avance',
  'Cupo mensual pro bono',
];

export const areaPath = (slug: string) => `/areas/${slug}`;
