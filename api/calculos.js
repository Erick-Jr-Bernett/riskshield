// Detecta patrones de cálculo financiero en el mensaje y hace la cuenta exacta
// en JS — a la IA no se le confía la aritmética, solo explicar el resultado.

const TASA_USURA_ANUAL = 0.2924; // 29.24% E.A. vigente (Superfinanciera, ref. sep. 2026)

function parseMonto(str) {
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
}

function calcularUsura(monto, total, dias) {
  const interesCobrado = total - monto;
  const tasaPeriodo = interesCobrado / monto;
  const tasaDiaria = Math.pow(1 + tasaPeriodo, 1 / dias) - 1;
  const tasaMensual = Math.pow(1 + tasaDiaria, 30) - 1;
  const tasaAnual = Math.pow(1 + tasaDiaria, 365) - 1;
  const veces = tasaAnual / TASA_USURA_ANUAL;
  const esUsura = tasaAnual > TASA_USURA_ANUAL;

  return `DATOS CALCULADOS (usa exactamente estos números, no los recalcules):
- Monto prestado: $${monto.toLocaleString('es-CO')}
- Total a pagar: $${total.toLocaleString('es-CO')}
- Interés cobrado: $${interesCobrado.toLocaleString('es-CO')}
- Tasa mensual efectiva: ${(tasaMensual * 100).toFixed(2)}%
- Tasa anual efectiva equivalente: ${(tasaAnual * 100).toFixed(1)}%
- Tasa de usura legal vigente: ${(TASA_USURA_ANUAL * 100).toFixed(2)}% anual
- Veces por encima del límite legal: ${veces.toFixed(1)}
- ¿Es usura?: ${esUsura ? 'SÍ, delito de usura (Art. 305 Código Penal)' : 'No, está dentro del límite legal'}`;
}

function detectarCalculo(mensaje) {
  const texto = mensaje.toLowerCase();

  // Caso 1: pago DIARIO por N días — ej: "prestaron $500.000 y pago $20.000 diarios por 30 días"
  // Aquí el segundo número es una cuota diaria, NO el total, hay que multiplicarlo por los días.
  const prestamoDiario = texto.match(
    /(?:prest[eó]|presto|me prestaron)[^\d]*([\d.,]+)[\s\S]*?\$?\s*([\d.,]+)\s*(?:diarios?|al\s*d[ií]a|por\s*d[ií]a|c\/d[ií]a)[\s\S]*?(\d+)\s*d[ií]as?/
  );
  if (prestamoDiario) {
    const monto = parseMonto(prestamoDiario[1]);
    const cuotaDiaria = parseMonto(prestamoDiario[2]);
    const dias = parseInt(prestamoDiario[3], 10);
    if (monto > 0 && cuotaDiaria > 0 && dias > 0) {
      const total = cuotaDiaria * dias;
      return calcularUsura(monto, total, dias);
    }
  }

  // Caso 2: total explícito a pagar — ej: "me prestaron $500.000 y pago $600.000 en 30 días"
  const prestamoTotal = texto.match(
    /(?:prest[eó]|presto|me prestaron)[^\d]*([\d.,]+)[\s\S]*?(?:pag[oaué]+|total)[^\d]*([\d.,]+)[\s\S]*?(\d+)\s*d[ií]as?/
  );
  if (prestamoTotal) {
    const monto = parseMonto(prestamoTotal[1]);
    const total = parseMonto(prestamoTotal[2]);
    const dias = parseInt(prestamoTotal[3], 10);
    if (monto > 0 && total > 0 && dias > 0) return calcularUsura(monto, total, dias);
  }

  // Caso 3: promesa de inversión — ej: "invierto $1.000.000 y me prometen 20% mensual"
  const inversion = texto.match(/(?:invert[ií]|invierto|inversi[oó]n)[^\d]*([\d.,]+)[\s\S]*?(\d+(?:[.,]\d+)?)\s*%/);
  if (inversion) {
    const monto = parseMonto(inversion[1]);
    const porcentaje = parseFloat(inversion[2].replace(',', '.'));
    if (monto > 0 && porcentaje > 0) {
      const ganancia = monto * (porcentaje / 100);
      const total = monto + ganancia;
      return `DATOS CALCULADOS (usa exactamente estos números, no los recalcules):
- Monto de la inversión: $${monto.toLocaleString('es-CO')}
- Rentabilidad prometida: ${porcentaje}%
- Ganancia prometida: $${ganancia.toLocaleString('es-CO')}
- Total prometido después del periodo: $${total.toLocaleString('es-CO')}
- Nota obligatoria: esto es solo lo que PROMETEN, no una garantía de que se vaya a recibir.`;
    }
  }

  return null;
}

module.exports = { detectarCalculo };