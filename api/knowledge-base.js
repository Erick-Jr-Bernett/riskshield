// Base de conocimiento del proyecto RiskShield.
// Contiene el contenido normativo (basado en el documento "Preguntas para bot")
// que se inyecta como contexto al modelo de IA para que responda con fundamento.

const KNOWLEDGE_BASE = `
MÓDULO 1: MARCO LEGAL Y SANCIONES PENALES
Pregunta: ¿Cuál es la pena de cárcel por lavado de activos en Colombia y qué ley lo regula?
Respuesta: El delito de Lavado de Activos está tipificado en el Artículo 323 del Código Penal Colombiano (Ley 599 de 2000, modificado por la Ley 1762 de 2015).
- Pena de Prisión: De 10 a 30 años de cárcel.
- Multa Económica Penal: De 650 a 50.000 SMMLV (Salarios Mínimos Mensuales Legales Vigentes).
- Agravantes (Art. 324 del Código Penal): La pena se aumentará de una tercera parte a la mitad cuando para la realización de las conductas se utilizaren operaciones de comercio exterior o de cambio.
- Pena Accesoria: Inhabilitación para el ejercicio de derechos y funciones públicas por el mismo tiempo que dure la pena privativa de la libertad.

MÓDULO 2: SANCIONES ADMINISTRATIVAS Y MULTAS POR INCUMPLIMIENTO
Pregunta: ¿Cuáles son las multas exactas para una empresa o directivo por no implementar SARLAFT o SAGRILAFT?
Respuesta: Las sanciones dependen de la entidad de supervisión asignada:
- Superintendencia Financiera de Colombia (SuperFinanciera): Conforme al Artículo 208 del Estatuto Orgánico del Sistema Financiero (EOSF), se pueden imponer multas institucionales y personales a administradores y oficiales de cumplimiento de hasta $1.000 millones de pesos (reajustables anualmente).
- Superintendencia de Sociedades (SuperSociedades - SAGRILAFT): De acuerdo con el Numeral 3 del Artículo 86 de la Ley 222 de 1995, la entidad puede imponer multas de hasta 200 SMMLV a la sociedad, al Oficial de Cumplimiento, al Revisor Fiscal o a los Administradores.
- Medidas Administrativas Adicionales: Remoción inmediata del cargo del Oficial de Cumplimiento o Administradores y la suspensión o revocatoria de la autorización de funcionamiento.

MÓDULO 3: REPORTE DE OPERACIONES SOSPECHOSAS (UIAF)
Pregunta: ¿Qué norma regula el envío del ROS a la UIAF y cuál es la consecuencia de romper la reserva legal?
Respuesta: El Reporte de Operación Sospechosa (ROS) se rige por las siguientes disposiciones legales:
- Obligación de Reporte: Regulado por el Artículo 102 del Estatuto Orgánico del Sistema Financiero y la Ley 526 de 1999 (creación de la UIAF).
- Reserva Legal: El Artículo 42 de la Ley 190 de 1995 prohíbe dar a conocer al cliente o a terceros que se ha remitido información a la UIAF.
- Sanción por Violación de Reserva: Revelar información reservada constituye delito de Avisar o Alertar ("Tipping-off"), el cual genera responsabilidad penal y disciplinaria según el Código Penal Colombiano.

MÓDULO 4: FINANCIACIÓN DEL TERRORISMO Y PROLIFERACIÓN
Pregunta: ¿Qué artículo sanciona la Financiación del Terrorismo en Colombia?
Respuesta: La Financiación del Terrorismo y de la Proliferación de Armas de Destrucción Masiva está sancionada en el Artículo 345 del Código Penal Colombiano (Ley 599 de 2000, modificado por la Ley 1453 de 2011):
- Pena de Prisión: De 13 a 22 años de cárcel.
- Multa Económica Penal: De 1.300 a 15.000 SMMLV.
- Congelamiento de Activos: Conforme a la Ley 1577 de 2012, las entidades sujetas deben aplicar de forma inmediata el congelamiento preventivo de activos de personas o entidades incluidas en las listas del Consejo de Seguridad de las Naciones Unidas (ONU).

MÓDULO 5: LISTAS RESTRICTIVAS Y DEBIDA DILIGENCIA
Pregunta: ¿Qué es la Lista Clinton y qué debe hacer una empresa si un cliente aparece en ella?
Respuesta: La Lista OFAC (Lista Clinton) es un mecanismo de control emitido por la Oficina de Control de Activos Extranjeros del Departamento del Tesoro de EE. UU.
Acción Inmediata: Si un cliente o proveedor aparece coincidente en esta u otras listas internacionales (ONU, Interpol, PEPs):
- Se bloquea inmediatamente la vinculación o la transacción.
- Se procede con el congelamiento preventivo de activos si aplica la norma.
- Se genera de forma prioritaria un ROS a la UIAF.
Consecuencia del Incumplimiento: Mantener relaciones comerciales con personas en la Lista Clinton genera el aislamiento del sistema financiero internacional y la terminación de contratos con corresponsales bancarios.

MÓDULO 6: GOBIERNO CORPORATIVO Y ROLES DE CONTROL
Pregunta: ¿Cuáles son las funciones y la responsabilidad legal del Oficial de Cumplimiento?
Respuesta: El Oficial de Cumplimiento es la persona designada por la Junta Directiva para liderar la gestión del riesgo SARLAFT/SAGRILAFT:
- Funciones Principales: Diseñar el manual de procedimientos, monitorear transacciones, capacitar al personal y presentar informes trimestrales/semestrales a la Junta Directiva.
- Responsabilidad Penal y Administrativa: Si omite deliberadamente sus funciones o encubre actividades ilícitas, puede responder penalmente como autor o cómplice y asumir multas personales de hasta 2.000 SMMLV impuestas por los entes de control.

MÓDULO 7: MODUS OPERANDI Y TIPOLOGÍAS DE RIESGO
Pregunta: ¿Cuáles son las modalidades o modus operandi más comunes para lavar dinero?
Respuesta: Los métodos delictivos más comunes identificados por la UIAF son:
- Smurfing o Pitufeo: Fraccionar grandes sumas de dinero en múltiples transacciones pequeñas (en Colombia, menores al umbral de reporte de $10.000.000 COP en efectivo) para no levantar alertas.
- Empresas Fachada / Papel: Sociedades creadas legalmente que simulan actividades comerciales inexistentes para emitir facturación falsa y justificar dinero ilícito.
- Sobrefacturación o Subfacturación en Comercio Exterior: Alterar los precios reales de importación/exportación de mercancías para transferir fondos ilícitos entre fronteras.
- Testaferrato: Usar la identidad de terceros para registrar la titularidad de inmuebles o vehículos comprados con capital ilegal.

MÓDULO 8: SISTEMAS DE ADMINISTRACIÓN DE RIESGO (VISIÓN GENERAL)

SARLAFT - Sistema de Administración del Riesgo de Lavado de Activos y Financiación del Terrorismo (SARLAFT/PADM)
- Descripción: Previene la introducción de capitales ilícitos en el sistema financiero o la canalización de recursos para actividades terroristas.
- Normativa: Circular Externa 027 y 055 de la Superintendencia Financiera / UIAF.
- Etapas: 1. Identificación del Riesgo, 2. Medición o Evaluación, 3. Control del Riesgo, 4. Monitoreo Continuo.
- Componentes de estructura: Políticas y Procedimientos, Estructura Organizacional (Oficial de Cumplimiento), Órganos de Control, Infraestructura Tecnológica.

SARO - Sistema de Administración del Riesgo Operativo
- Descripción: Gestiona pérdidas potenciales derivadas de fallas humanas, deficiencias en procesos internos, tecnología o eventos externos.
- Normativa: Circular Externa 041 de la Superintendencia Financiera.
- Etapas: 1. Identificación de Fallas, 2. Medición (Frecuencia e Impacto), 3. Control / Mitigación, 4. Monitoreo y Reporte.
- Componentes: Manual de Riesgo Operativo, Registro de Eventos de Pérdida, Planes de Continuidad del Negocio (BCP), Capacitación.

SARC - Sistema de Administración del Riesgo de Crédito
- Descripción: Evalúa la probabilidad de incumplimiento de deudores y calcula las pérdidas esperadas sobre las carteras de crédito.
- Normativa: Capítulo II de la Circular Básica Contable y Financiera.
- Etapas: 1. Evaluación del Otorgamiento, 2. Calificación de Cartera, 3. Constitución de Provisiones, 4. Recuperación de Cartera.
- Componentes: Políticas de Crédito y Scoring, Modelos de Pérdida Esperada, Garantías y Colaterales, Monitoreo Contable.

SARI / SARM - Riesgo de Mercado e Inversiones
- Descripción: Mide y controla las pérdidas económicas derivadas de fluctuaciones en variables de mercado (tasas de interés, divisas, acciones).
- Normativa: Capítulo XXI de la Circular Básica Contable y Financiera.
- Etapas: 1. Identificación de Factores de Mercado, 2. Medición VaR (Valor en Riesgo), 3. Establecimiento de Límites, 4. Monitoreo y Stress Testing.
- Componentes: Límites de Inversión, Pruebas de Tensión (Stress Tests), Comité de Riesgos, Sistemas de Información Front/Back Office.

TIPOS DE RIESGO ASOCIADOS
- Riesgo Reputacional: Posibilidad de pérdida de confianza del público o clientes debido al desprestigio de la entidad.
- Riesgo Legal: Pérdida o sanción económica por fallos judiciales, demandas o multas por incumplimiento normativo.
- Riesgo Operativo: Pérdidas por deficiencias en procesos internos, personal o sistemas de monitoreo de alertas.
- Riesgo de Contagio: Pérdida indirecta sufrida al relacionarse con un cliente, proveedor o aliado involucrado en actividades ilícitas.

MARCO NORMATIVO ADICIONAL
- Ley 526 de 1999: Crea la UIAF (Unidad de Información y Análisis Financiero) en Colombia.
- Ley 1474 de 2011 (Estatuto Anticorrupción): Sanciona delitos contra la administración pública.
- Circular Externa 027 / 055: Expedida por la Superintendencia Financiera imponiendo las reglas del SARLAFT.
- Código Penal (Art. 323): Tipifica el Lavado de Activos como delito autónomo.
`;

module.exports = { KNOWLEDGE_BASE };
