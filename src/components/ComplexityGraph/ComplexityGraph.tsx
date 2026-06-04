import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Panel, TacticalButton } from '../tactical';


interface Algorithm {
  name: string;
  color: string;
  function: (n: number) => number;
  description: string;
}

interface Category {
  name: string;
  algorithms: Algorithm[];
}

const categories: Category[] = [
  {
    name: "Notações Big-O",
    algorithms: [
      {
        name: "O(1) Constante",
        color: "#008FF6",
        function: (n: number) => 1,
        description: "Tempo constante, independente do tamanho da entrada"
      },
      {
        name: "O(log n) Logarítmica",
        color: "#FC52AE",
        function: (n: number) => Math.log2(Math.max(1, n)),
        description: "Cresce logaritmicamente, muito eficiente"
      },
      {
        name: "O(n) Linear",
        color: "#D7BECB",
        function: (n: number) => n,
        description: "Cresce linearmente com o tamanho da entrada"
      },
      {
        name: "O(n log n)",
        color: "#FDFDFD",
        function: (n: number) => n * Math.log2(Math.max(1, n)),
        description: "Comum em algoritmos eficientes de ordenação"
      },
      {
        name: "O(n²) Quadrática",
        color: "#FC52AE",
        function: (n: number) => n * n,
        description: "Cresce quadraticamente, problemático para entradas grandes"
      }
    ]
  },
  {
    name: "Algoritmos de Ordenação",
    algorithms: [
      {
        name: "Merge Sort",
        color: "#008FF6",
        function: (n: number) => n * Math.log2(Math.max(1, n)),
        description: "Melhor: O(n log n) | Médio: O(n log n) | Pior: O(n log n)"
      },
      {
        name: "Quick Sort (Médio)",
        color: "#FC52AE",
        function: (n: number) => n * Math.log2(Math.max(1, n)),
        description: "Melhor: O(n log n) | Médio: O(n log n) | Pior: O(n²)"
      },
      {
        name: "Quick Sort (Pior)",
        color: "#D7BECB",
        function: (n: number) => n * n,
        description: "Caso especial do Quick Sort quando o pivô é sempre o menor/maior"
      },
      {
        name: "Bubble Sort",
        color: "#FDFDFD",
        function: (n: number) => n * n,
        description: "Melhor: O(n) | Médio: O(n²) | Pior: O(n²)"
      },
      {
        name: "Selection Sort",
        color: "#FC52AE",
        function: (n: number) => n * n,
        description: "Melhor: O(n²) | Médio: O(n²) | Pior: O(n²)"
      },
      {
        name: "Insertion Sort",
        color: "#008FF6",
        function: (n: number) => n * n,
        description: "Melhor: O(n) | Médio: O(n²) | Pior: O(n²)"
      }
    ]
  },
  {
    name: "Algoritmos de Busca",
    algorithms: [
      {
        name: "Busca Linear",
        color: "#008FF6",
        function: (n: number) => n,
        description: "Melhor: O(1) | Médio: O(n) | Pior: O(n)"
      },
      {
        name: "Busca Binária",
        color: "#FC52AE",
        function: (n: number) => Math.log2(Math.max(1, n)),
        description: "Melhor: O(1) | Médio: O(log n) | Pior: O(log n)"
      },
      {
        name: "Busca por Interpolação",
        color: "#D7BECB",
        function: (n: number) => {
          const loglog = Math.log2(Math.log2(Math.max(2, n)));
          const linear = n;
          return (0.7 * loglog) + (0.3 * linear);
        },
        description: "Melhor: O(1) | Médio: O(log log n) | Pior: O(n)"
      }
    ]
  },
  {
    name: "Algoritmos de Grafos",
    algorithms: [
      {
        name: "BFS/DFS",
        color: "#008FF6",
        function: (n: number) => n + (n - 1),
        description: "O(V + E) - V vértices, E arestas"
      },
      {
        name: "Dijkstra",
        color: "#FC52AE",
        function: (n: number) => n * Math.log2(n),
        description: "O(V log V + E) com heap"
      },
      {
        name: "Floyd-Warshall",
        color: "#D7BECB",
        function: (n: number) => n * n * n,
        description: "O(V³) - Todos os caminhos mais curtos"
      },
      {
        name: "Kruskal",
        color: "#FDFDFD",
        function: (n: number) => n * Math.log2(n),
        description: "O(E log V) - Árvore geradora mínima"
      }
    ]
  },
  {
    name: "Pattern Matching",
    algorithms: [
      {
        name: "Força Bruta",
        color: "#008FF6",
        function: (n: number) => n * n,
        description: "O(n*m) - n texto, m padrão"
      },
      {
        name: "KMP",
        color: "#FC52AE",
        function: (n: number) => n,
        description: "O(n + m) - Knuth-Morris-Pratt"
      },
      {
        name: "Rabin-Karp",
        color: "#D7BECB",
        function: (n: number) => n,
        description: "O(n + m) médio, O(nm) pior caso"
      }
    ]
  }
];

type ExplanationsType = {
  [K in typeof categories[number]['name']]: {
    name: string;
    explanation: string;
    example: string;
  }[];
};

const explanations = {
  "Notações Big-O": [
    {
      name: "O(1) Constante",
      explanation: "Executa o mesmo número de operações independente do tamanho da entrada.",
      example: `const first = array[0]; // O(1)`
    },
    {
      name: "O(log n) Logarítmica",
      explanation: "O número de operações aumenta logaritmicamente com o tamanho da entrada.",
      example: `// Busca binária\nwhile (left <= right) {\n  mid = (left + right) / 2;\n}`
    },
    {
      name: "O(n) Linear",
      explanation: "O número de operações cresce linearmente com o tamanho da entrada.",
      example: `for (let i = 0; i < n; i++) { // O(n)`
    },
    {
      name: "O(n log n)",
      explanation: "Combina complexidade linear com logarítmica.",
      example: `mergeSort(array); // O(n log n)`
    },
    {
      name: "O(n²) Quadrática",
      explanation: "O número de operações cresce com o quadrado do tamanho da entrada.",
      example: `for (i = 0; i < n; i++)\n  for (j = 0; j < n; j++) // O(n²)`
    }
  ],
  "Algoritmos de Ordenação": [
    {
      name: "Merge Sort",
      explanation: "Divide o array ao meio recursivamente, depois combina ordenando.",
      example: `// Tempo: O(n log n) em todos os casos
mergeSort(array) {
  if (len <= 1) return array;
  mid = len/2;
  return merge(mergeSort(left), mergeSort(right));
}`
    },
    {
      name: "Quick Sort (Médio)",
      explanation: "Escolhe pivô, particiona array, ordena recursivamente.",
      example: `// Tempo: O(n log n) caso médio
quickSort(array) {
  pivot = choosePivot();
  partition(array, pivot);
  quickSort(left); quickSort(right);
}`
    },
    {
      name: "Quick Sort (Pior)",
      explanation: "Caso onde o pivô escolhido é sempre o menor/maior elemento.",
      example: `// Tempo: O(n²) no pior caso
// Array já ordenado com pivô sempre no fim
quickSort([1,2,3,4,5]);`
    },
    {
      name: "Bubble Sort",
      explanation: "Compara e troca elementos adjacentes até ordenar.",
      example: `// Tempo: O(n²), O(n) melhor caso
for (i = 0; i < n; i++)
  for (j = 0; j < n-i-1; j++)
    if (arr[j] > arr[j+1])
      swap(j, j+1);`
    },
    {
      name: "Selection Sort",
      explanation: "Encontra o menor elemento e coloca na posição correta.",
      example: `// Tempo: O(n²) em todos os casos
for (i = 0; i < n; i++) {
  min = findMin(i);
  swap(i, min);
}`
    },
    {
      name: "Insertion Sort",
      explanation: "Insere cada elemento na posição correta no subarray ordenado.",
      example: `// Tempo: O(n²), O(n) melhor caso
for (i = 1; i < n; i++)
  for (j = i; j > 0 && arr[j] < arr[j-1]; j--)
    swap(j, j-1);`
    }
  ],
  "Algoritmos de Busca": [
    {
      name: "Busca Linear",
      explanation: "Percorre sequencialmente todos os elementos até encontrar o alvo.",
      example: `// Tempo: O(n)
for (let i = 0; i < array.length; i++) {
  if (array[i] === target) return i;
}`
    },
    {
      name: "Busca Binária",
      explanation: "Divide o espaço de busca pela metade a cada iteração.",
      example: `// Tempo: O(log n)
while (left <= right) {
  mid = (left + right) / 2;
  if (array[mid] === target) return mid;
  if (array[mid] < target) left = mid + 1;
  else right = mid - 1;
}`
    },
    {
      name: "Busca por Interpolação",
      explanation: "Similar à busca binária, mas estima a posição baseado no valor.",
      example: `// Tempo: O(log log n) médio
pos = left + ((target - arr[left]) * (right - left)) 
    / (arr[right] - arr[left]);`
    }
  ],
  "Algoritmos de Grafos": [
    {
      name: "BFS/DFS",
      explanation: "Percorre o grafo em largura (BFS) ou profundidade (DFS).",
      example: `// Tempo: O(V + E)
function bfs(graph, start) {
  const queue = [start];
  while (queue.length > 0) {
    const vertex = queue.shift();
    for (let neighbor of graph[vertex]) {
      queue.push(neighbor);
    }
  }`
    },
    {
      name: "Dijkstra",
      explanation: "Encontra o caminho mais curto em grafos ponderados.",
      example: `// Tempo: O(V log V + E)
while (heap.length > 0) {
  const u = heap.extractMin();
  for (let v of graph[u]) {
    dist[v] = Math.min(dist[v], dist[u] + weight(u,v));
  }
}`
    },
    {
      name: "Floyd-Warshall",
      explanation: "Encontra todos os caminhos mais curtos entre todos os pares.",
      example: `// Tempo: O(V³)
for (let k = 0; k < V; k++)
  for (let i = 0; i < V; i++)
    for (let j = 0; j < V; j++)
      dist[i][j] = min(dist[i][j], 
                       dist[i][k] + dist[k][j]);`
    },
    {
      name: "Kruskal",
      explanation: "Encontra a árvore geradora mínima do grafo.",
      example: `// Tempo: O(E log V)
edges.sort((a, b) => a.weight - b.weight);
for (let edge of edges) {
  if (!createsCycle(edge))
    mst.add(edge);
}`
    }
  ],
  "Pattern Matching": [
    {
      name: "Força Bruta",
      explanation: "Compara o padrão com todas as possíveis posições do texto.",
      example: `// Tempo: O(n*m)
for (let i = 0; i <= n - m; i++) {
  for (let j = 0; j < m; j++) {
    if (text[i + j] !== pattern[j]) break;
  }
}`
    },
    {
      name: "KMP",
      explanation: "Usa um array auxiliar para evitar comparações redundantes.",
      example: `// Tempo: O(n + m)
computeLPS(); // Pré-processamento
while (i < n) {
  if (pattern[j] === text[i]) { i++; j++; }
  else if (j > 0) j = lps[j - 1];
  else i++;
}`
    },
    {
      name: "Rabin-Karp",
      explanation: "Usa hashing para comparar substrings eficientemente.",
      example: `// Tempo: O(n + m) médio
hash = computeHash(pattern);
for (let i = 0; i <= n - m; i++) {
  if (hash === textHash[i] && check(i))
    return i;
}`
    }
  ]
} as ExplanationsType;

export default function ComplexityGraph() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [maxN, setMaxN] = useState(20);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<Set<number>>(
    new Set(categories[selectedCategory].algorithms.map((_, i) => i))
  );

  const algorithms = categories[selectedCategory].algorithms;

  // Generate all data points up to maxN
  const data = useMemo(() => {
    const points = [];
    for (let n = 1; n <= maxN; n++) {
      const point: any = { n };
      algorithms.forEach((algorithm, index) => {
        if (selectedAlgorithms.has(index)) {
          point[`value${index}`] = algorithm.function(n);
        }
      });
      points.push(point);
    }
    return points;
  }, [maxN, selectedAlgorithms, algorithms]);

  // Calculate Y axis max value
  const yMax = useMemo(() => {
    let max = 0;
    algorithms.forEach((algorithm, index) => {
      if (selectedAlgorithms.has(index)) {
        const value = algorithm.function(maxN);
        if (value > max) max = value;
      }
    });
    return Math.ceil(max * 1.1);
  }, [maxN, selectedAlgorithms, algorithms]);

  const toggleAlgorithm = (index: number) => {
    setSelectedAlgorithms(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const changeCategory = (index: number) => {
    setSelectedCategory(index);
    setSelectedAlgorithms(new Set(categories[index].algorithms.map((_, i) => i)));
  };

  const rangeClass = 'w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ VISUALIZAÇÃO DE COMPLEXIDADES ALGORÍTMICAS ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          Compare curvas de complexidade temporal entre categorias de algoritmos.
        </p>
      </div>

      <Panel title="Categorias" accent="cyan">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <TacticalButton
              key={index}
              size="sm"
              variant={selectedCategory === index ? 'primary' : 'secondary'}
              onClick={() => changeCategory(index)}
            >
              {category.name}
            </TacticalButton>
          ))}
        </div>
      </Panel>

      <Panel title="Algoritmos" accent="amber">
        <div className="flex flex-wrap gap-2">
          {algorithms.map((algorithm, index) => (
            <TacticalButton
              key={index}
              size="sm"
              variant={selectedAlgorithms.has(index) ? 'primary' : 'ghost'}
              onClick={() => toggleAlgorithm(index)}
              className={selectedAlgorithms.has(index) ? '' : 'border-slate-300 dark:border-tactical-line'}
              style={selectedAlgorithms.has(index) ? undefined : { borderColor: algorithm.color }}
            >
              {algorithm.name}
            </TacticalButton>
          ))}
        </div>
      </Panel>

      <Panel title="Tamanho da entrada (n)" accent="green">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">n =</span>
          <span className="font-mono text-sm font-bold text-signal-cyan tabular-nums">{maxN}</span>
        </div>
        <input type="range" min="1" max="100" value={maxN} onChange={(e) => setMaxN(Number(e.target.value))} className={rangeClass} />
      </Panel>

      <Panel title="Gráfico" accent="cyan" padded={false} bodyClassName="p-4">
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FDFDFD30" />
              <XAxis
                dataKey="n"
                domain={[0, maxN]}
                type="number"
                stroke="#FDFDFD"
                label={{
                  value: 'Tamanho da Entrada (n)',
                  position: 'bottom',
                  offset: 0,
                  fill: '#FDFDFD',
                  fontFamily: 'Hanken Grotesk',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              />
              <YAxis
                domain={[0, yMax]}
                stroke="#FDFDFD"
                label={{
                  value: 'Número de Operações',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#FDFDFD',
                  fontFamily: 'Hanken Grotesk',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(56, 1, 31, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FDFDFD',
                  fontFamily: 'Hanken Grotesk',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
                formatter={(value: number) => [`${value.toFixed(2)} operações`]}
              />
              <Legend wrapperStyle={{ color: '#FDFDFD', fontFamily: 'Hanken Grotesk', fontSize: '14px', fontWeight: 'bold', paddingTop: '16px' }} />

              {algorithms.map((algorithm, index) => (
                selectedAlgorithms.has(index) && (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={`value${index}`}
                    name={algorithm.name}
                    stroke={algorithm.color}
                    strokeWidth={2}
                    dot={false}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Explicação das Complexidades" accent="red">
        <div className="space-y-4">
          {algorithms.map((algorithm, index) => (
            selectedAlgorithms.has(index) && (
              <div key={index} className="tactical-panel border-l-2 border-l-signal-cyan p-5">
                <h3 className="label-mono mb-2" style={{ color: algorithm.color }}>
                  {algorithm.name}
                </h3>
                <div className="space-y-4 font-mono text-sm text-slate-600 dark:text-tactical-dim">
                  <p>{explanations[categories[selectedCategory].name][index].explanation}</p>
                  <div>
                    <p className="label-mono text-signal-cyan mb-2">Exemplo:</p>
                    <pre className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4 overflow-x-auto">
                      <code className="text-sm whitespace-pre text-slate-900 dark:text-tactical-text">
                        {explanations[categories[selectedCategory].name][index].example}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </Panel>
    </div>
  );
} 