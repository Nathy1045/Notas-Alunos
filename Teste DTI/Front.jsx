// FRONT-END (React)
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [notas, setNotas] = useState(["", "", "", "", ""]);
  const [frequencia, setFrequencia] = useState("");

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/alunos");
      setAlunos(res.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  const handleAddAluno = async () => {
    const notasNumericas = notas.map(n => parseFloat(n));
    const frequenciaNum = parseFloat(frequencia);

    if (
      nome.trim() === "" ||
      notasNumericas.some(n => isNaN(n)) ||
      isNaN(frequenciaNum)
    ) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/alunos", {
        nome,
        notas: notasNumericas,
        frequencia: frequenciaNum,
      });
      fetchAlunos();
      setNome("");
      setNotas(["", "", "", "", ""]);
      setFrequencia("");
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error);
    }
  };

  const mediaTurmaDisciplinas = () => {
    if (alunos.length === 0) return [0, 0, 0, 0, 0];
    const soma = [0, 0, 0, 0, 0];
    alunos.forEach(aluno => {
      aluno.notas.forEach((nota, i) => {
        soma[i] += nota;
      });
    });
    return soma.map(s => (s / alunos.length).toFixed(2));
  };

  const mediaGeralTurma = () => {
    if (alunos.length === 0) return 0;
    return (
      alunos.reduce((acc, aluno) => acc + aluno.media, 0) / alunos.length
    ).toFixed(2);
  };

  const alunosAcimaDaMedia = () => {
    const mediaGeral = mediaGeralTurma();
    return alunos.filter(aluno => aluno.media > mediaGeral);
  };

  const alunosComFrequenciaBaixa = () => {
    return alunos.filter(aluno => aluno.frequencia < 75);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sistema de Notas e Frequência</h1>

      <div className="grid grid-cols-6 gap-2 mb-4">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="col-span-2 p-2 border rounded" />
        {notas.map((nota, i) => (
          <input
            key={i}
            type="number"
            value={nota}
            onChange={e => {
              const novasNotas = [...notas];
              novasNotas[i] = e.target.value;
              setNotas(novasNotas);
            }}
            placeholder={`Nota ${i + 1}`}
            className="p-2 border rounded"
          />
        ))}
        <input type="number" value={frequencia} onChange={e => setFrequencia(e.target.value)} placeholder="Frequência (%)" className="col-span-2 p-2 border rounded" />
        <button onClick={handleAddAluno} className="col-span-1 bg-blue-500 text-white p-2 rounded">Adicionar</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Alunos</h2>
        {alunos.map((aluno, index) => (
          <p key={index} className="mb-1">
            {aluno.nome}: Média = {aluno.media.toFixed(2)}, Frequência = {aluno.frequencia}%
          </p>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Média por disciplina</h2>
        <p>{mediaTurmaDisciplinas().join(" | ")}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Alunos acima da média</h2>
        {alunosAcimaDaMedia().length === 0 ? <p>(nenhum)</p> : alunosAcimaDaMedia().map((a, i) => <p key={i}>{a.nome}</p>)}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Alunos com frequência abaixo de 75%</h2>
        {alunosComFrequenciaBaixa().length === 0 ? <p>(nenhum)</p> : alunosComFrequenciaBaixa().map((a, i) => <p key={i}>{a.nome}</p>)}
      </div>
    </div>
  );
}
