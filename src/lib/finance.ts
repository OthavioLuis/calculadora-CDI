interface ParametrosCalculoCDI {
  valorInicial: number;
  meses: number;
  taxaCDIAnual: number;
  porcentagemCDI: number;
}

export interface ResultadoCalculado {
  montanteFinal: number;
  rendimento: number;
}

export function calcularCDI({
  valorInicial,
  meses,
  taxaCDIAnual,
  porcentagemCDI,
}: ParametrosCalculoCDI): ResultadoCalculado {
  const taxaEfetiva = (taxaCDIAnual * porcentagemCDI) / 10000;
  const taxaMensal = Math.pow(1 + taxaEfetiva, 1 / 12) -1;
  const montanteFinal = valorInicial * Math.pow(1 + taxaMensal, meses);
  return {
    montanteFinal,
    rendimento: montanteFinal - valorInicial
  }
}

export async function buscarCDIAtual(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json'
    );
    
    if (!response.ok) throw new Error("Erro na resposta da API");

    const data = await response.json();
    
    // Verificação adicional dos dados
    if (!Array.isArray(data) || data.length === 0 || !data[0].valor) {
      throw new Error("Formato de dados inválido");
    }

    return parseFloat(data[0].valor.replace(',', '.')); // Converte "14,90" para 14.90
  } catch (error) {
    console.error("Erro ao buscar CDI:", error);
    return 13.65; // Fallback
  }
}