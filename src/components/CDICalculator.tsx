"use client"

import { calcularCDI, buscarCDIAtual } from "@/lib/finance";
import { useState, useEffect } from "react";
import { BotaoTema } from "./BotaoTema";

export default function CalculadoraCDI() {

  const [valorInicial, setValorInicial] = useState('');
  const [meses, setMeses] = useState('12');
  const [porcentagemCDI, setPorcentagemCDI] = useState('110');

  const [taxaCDI, setTaxaCDI] = useState<number>(0);
  const [carregando, setCarregando] = useState(true);

  const [resultado, setResultado] = useState<{
    montanteFinal: number;
    rendimento: number;
  }>({ montanteFinal: 0, rendimento: 0 });

  useEffect(() => {
    async function carregarTaxa() {
      try {
        setCarregando(true);
        const taxa = await buscarCDIAtual();
        console.log("Taxa recebida da API:", taxa);
        setTaxaCDI(taxa);
      } catch (error) {
        console.error("Erro detalhado:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarTaxa();
  }, []);

  // Calcula sempre que os inputs mudam
  useEffect(() => {
    if (taxaCDI <= 0) return;

    const resultado = calcularCDI({
      valorInicial: parseFloat(valorInicial) || 0,
      meses: parseInt(meses) || 0,
      taxaCDIAnual: taxaCDI,
      porcentagemCDI: parseFloat(porcentagemCDI) || 100,
    });

    setResultado(resultado);
  }, [valorInicial, meses, taxaCDI, porcentagemCDI]);

  function formatoBrasileiro(valor: number) {
    return valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

  return (
    <div className="max-w-4xl p-6 mx-auto bg-card rounded-lg border border-border shadow-md">
      <div className="flex justify-end items-center mb-4">
        <BotaoTema />
      </div>
      <h1 className="text-4xl font-bold mb-1 text-foreground tracking-tight">
        Calculadora <span className="text-primary">CDI</span>
      </h1>
      <p className="mb-6 text-muted-foreground">Simule seus rendimentos com precisão usando esta ferramenta de cálculo de CDI</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">

          <div>
            <label className="block text-foreground mb-2">
              Valor Investido (R$)
            </label>
            <input
              type="number"
              value={valorInicial}
              onChange={(e) => setValorInicial(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-transparent dark:bg-input/30"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              Período (meses)
            </label>
            <input
              type="number"
              value={meses}
              onChange={(e) => setMeses(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-transparent dark:bg-input/30"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              Rendimento do CDI (%)
            </label>
            <input
              type="number"
              value={porcentagemCDI}
              onChange={(e) => setPorcentagemCDI(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-transparent dark:bg-input/30"
            />
          </div>

        </div>

        <div className="space-y-4">
          <div className="h-full flex flex-col justify-between gap-4">

            <div className="p-3 bg-muted/40 rounded-md shadow-sm h-full">
              <p className="text-sm text-muted-foreground">
                Taxa CDI Atual (anual)
              </p>
              <p className="text-lg font-semibold text-foreground">
                {taxaCDI.toFixed(2)} %
              </p>
              <p className="text-xs text-muted-foreground mt-1">* Atualizado do Banco Central do Brasil</p>
            </div>

            <div className="p-3 bg-primary/10 rounded-md shadow-sm h-full">
              <h2 className="font-semibold text-foreground">
                Valor Bruto Final
              </h2>
              <p className="text-2xl font-bold text-primary">
                R$ {formatoBrasileiro(resultado.montanteFinal)}
              </p>
            </div>

            <div className="p-3 bg-green-500/10 rounded-md shadow-sm h-full">
              <h2 className="font-semibold text-foreground">
                Rendimento
              </h2>
              <p className="text-2xl font-bold text-green-500">
                + R$ {formatoBrasileiro(resultado.rendimento)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {((resultado.rendimento / parseFloat(valorInicial || "1")) * 100).toFixed(2)}% no período
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  )

}