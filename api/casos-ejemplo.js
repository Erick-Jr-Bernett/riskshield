// Casos de ejemplo para la demo académica del "Verificador de Empresas".
// IMPORTANTE: esto NO es una base de datos oficial ni se actualiza en vivo.
// Son casos públicamente conocidos (noticias, alertas históricas de la
// Superfinanciera) incluidos solo para que la demo tenga ejemplos realistas
// que mostrar en la sustentación. Para una verificación real, siempre se debe
// consultar directamente https://www.superfinanciera.gov.co

const CASOS_EJEMPLO = `
CASOS DE EJEMPLO CONOCIDOS (uso exclusivamente educativo/demostrativo):

- "OmegaPro": Plataforma de inversión que operó en Colombia y varios países de Latinoamérica ofreciendo rendimientos fijos muy altos por reclutamiento de nuevos inversionistas. Fue objeto de alertas públicas de reguladores financieros en la región por presentar características de esquema Ponzi/pirámide. No estaba autorizada como entidad vigilada por la Superintendencia Financiera de Colombia para captar inversión pública.

- "Daily Cop" / plataformas similares de "gane dinero viendo anuncios" o "invierta y retire diario": Suelen presentar el patrón clásico de pirámide: pagan a los primeros inversionistas con el dinero de los nuevos, prometen rentabilidad diaria fija imposible de sostener con un negocio real, y no están vigiladas por la Superfinanciera.

- Patrón general de alerta: cualquier plataforma que (1) prometa rentabilidad fija muy alta y garantizada, (2) pague por invitar nuevos usuarios en vez de por una actividad productiva real, y (3) no aparezca en el listado de entidades vigiladas de la Superfinanciera (consultable en superfinanciera.gov.co), debe tratarse con máxima sospecha de ser una pirámide o esquema Ponzi.
`;

module.exports = { CASOS_EJEMPLO };