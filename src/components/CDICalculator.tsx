"use client"

import { calcularCDI, buscarCDIAtual } from "@/lib/finance";
import { useState, useEffect } from "react";
import BotaoTema from "./BotaoTema";

export default function CalculadoraCDI() {

  const [valorInicial, setValorInicial] = useState('');
  const [meses, setMeses] = useState('12');
  const [porcentagemCDI, setPorcentagemCDI] = useState('110');
  
  const [taxaCDI, setTaxaCDI] = useState<number>(0);
  const [carregando, setCarregando] = useState(true);

  const [valorFinal, setValorFinal] = useState(0);

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

    setValorFinal(resultado);
  }, [valorInicial, meses, taxaCDI, porcentagemCDI]);

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex justify-end items-center mb-4">
        <BotaoTema />
      </div>
      <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
        Calculadora CDI
      </h1>
      <p className="mb-6">Simule seus rendimentos com precisão usando esta ferramenta de cálculo de CDI</p>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Valor Investido (R$)
        </label>
        <input
          type="number"
          value={valorInicial}
          onChange={(e) => setValorInicial(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Período (meses)
        </label>
        <input
          type="number"
          value={meses}
          onChange={(e) => setMeses(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Rendimento do CDI (%)
        </label>
        <input
          type="number"
          value={porcentagemCDI}
          onChange={(e) => setPorcentagemCDI(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Taxa CDI Atual (anual)
        </label>
        <input
          type="number"
          value={taxaCDI.toFixed(2)}
          readOnly
          className="w-full p-2 bg-gray-100 rounded-md dark:bg-gray-700"
        />
        <p className="text-xs mt-1">* Atualizado do Banco Central do Brasil</p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md dark:bg-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Valor Final Bruto
        </h2>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          R$ {valorFinal.toFixed(2)}
        </p>
        <p>
          CDI anual: {taxaCDI}% | {porcentagemCDI}% do CDI
        </p>
      </div>

    </div>
  )

}