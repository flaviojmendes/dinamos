interface AlgorithmCategory {
  name: string;
  algorithms: {
    name: string;
    complexity: string;
    function: (n: number) => number;
    color: string;
    description: string;
  }[];
}

export const categories: AlgorithmCategory[] = [
  {
    name: "Complexidades Padrão",
    algorithms: [
      {
        name: "O(1) - Constante",
        complexity: "O(1)",
        function: (n: number) => 1,
        color: "#008FF6",
        description: "Tempo constante, independente do tamanho da entrada. Ex: acesso a array por índice, operações aritméticas simples."
      },
      {
        name: "O(log n) - Logarítmica",
        complexity: "O(log n)",
        function: (n: number) => Math.log2(n),
        color: "#FC52AE",
        description: "Cresce logaritmicamente, muito eficiente. Ex: busca binária, algumas operações em árvores balanceadas."
      },
      {
        name: "O(n) - Linear",
        complexity: "O(n)",
        function: (n: number) => n,
        color: "#D7BECB",
        description: "Cresce linearmente com o tamanho da entrada. Ex: busca linear, percorrer um array."
      },
      {
        name: "O(n log n) - Linear-logarítmica",
        complexity: "O(n log n)",
        function: (n: number) => n * Math.log2(n),
        color: "#FDFDFD",
        description: "Comum em algoritmos eficientes de ordenação. Ex: Merge Sort, Quick Sort (caso médio)."
      },
      {
        name: "O(n²) - Quadrática",
        complexity: "O(n²)",
        function: (n: number) => n * n,
        color: "#FC52AE",
        description: "Cresce quadraticamente, problemático para entradas grandes. Ex: Bubble Sort, comparações par a par."
      },
      {
        name: "O(n³) - Cúbica",
        complexity: "O(n³)",
        function: (n: number) => n * n * n,
        color: "#008FF6",
        description: "Cresce cubicamente, geralmente impraticável para entradas grandes. Ex: multiplicação de matrizes ingênua."
      },
      {
        name: "O(2ⁿ) - Exponencial",
        complexity: "O(2ⁿ)",
        function: (n: number) => Math.pow(2, n),
        color: "#D7BECB",
        description: "Cresce exponencialmente, geralmente impraticável. Ex: fibonacci recursivo, subconjuntos."
      },
      {
        name: "O(n!) - Fatorial",
        complexity: "O(n!)",
        function: (n: number) => {
          let result = 1;
          for(let i = 2; i <= n; i++) result *= i;
          return result;
        },
        color: "#FDFDFD",
        description: "Crescimento fatorial, extremamente ineficiente. Ex: permutações, caixeiro viajante força bruta."
      }
    ]
  }
]; 