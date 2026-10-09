const axios = require("axios");
let token;

axios
  .post("https://servidor-exercicios-js-eficaz.vercel.app/token", 
    {username: "gabrielknr"},
    {
      headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
    })
  .then((response) => {
    token = response.data.accessToken;

    return axios.get("https://servidor-exercicios-js-eficaz.vercel.app/exercicio", 
      {
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + token
      }
      });
  })
  .then(async (response) => {
    const exercicios = response.data;
    const respostas = {};

    for (const chave in exercicios) {
      const entrada = exercicios[chave].entrada;

      if (chave === 'soma') {
        respostas[chave] = entrada.a + entrada.b;
      }

      if (chave === 'tamanho-string') {
        respostas[chave] = entrada.string.length;
      }

      if (chave === 'nome-do-usuario') {
        respostas[chave] = entrada.email.split('@')[0]
      }

      if (chave === 'jaca-wars') {
        const g = 9.8;
        const r = (entrada.theta * Math.PI) / 180;
        const ans = (entrada.v ** 2 * Math.sin(2 * r)) / g;

        if (Math.abs(ans - 100) <= 2) respostas[chave] = 0;
        else if (ans < 100) respostas[chave] = -1;
        else respostas[chave] = 1;
      }

      if (chave === 'ano-bissexto') {
        const ano = entrada.ano;

        respostas[chave] = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
      }

      if (chave === 'volume-da-pizza') {
        respostas[chave] = Math.round(Math.PI * (entrada.z ** 2) * entrada.a);
      }

      if (chave === 'mru') {
        respostas[chave] = entrada.s0 + entrada.v * entrada.t
      }

      if (chave === 'inverte-string') {
        respostas[chave] = entrada.string.split('').reverse().join('');
      }

      if (chave === 'soma-valores') {
         respostas[chave] = Object.values(entrada.objeto).reduce((a, b) => a + b, 0);
      }

      if (chave === 'n-esimo-primo') {
        const isPrime = (num) => {
          if (num < 2) return false;
          for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
          }
          return true;
        };

        let count = 0;
        let num = 1;

        while (count < entrada.n) {
          num++;
          if (isPrime(num)) count++;
        }

        respostas[chave] = num;
      }

      if (chave === 'maior-prefixo-comum') {
        const arr = entrada.strings;
        let maior = '';

        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            let k = 0;
            while (
              k < arr[i].length &&
              k < arr[j].length &&
              arr[i][k] === arr[j][k]
            ) {
              k++;
            }

            const prefixo = arr[i].slice(0, k);
            if (prefixo.length > maior.length) {
              maior = prefixo;
            }
          }
        }

        respostas[chave] = maior;
      }

      if (chave === 'soma-segundo-maior-e-menor-numeros') {
        const nums = entrada.numeros.slice().sort((a, b) => a - b);
        respostas[chave] = nums[1] + nums[nums.length - 2];
      }
      
      if (chave === 'conta-palindromos') {
        const isPal = (s) => s === s.split('').reverse().join('');
        respostas[chave] = entrada.palavras.filter(isPal).length;
      }

      if (chave === 'soma-de-strings-de-ints') {
        respostas[chave] = entrada.strings
          .map(Number)
          .reduce((a, b) => a + b, 0);
      }

      if (chave === 'soma-com-requisicoes') {
        const reqs = await Promise.all(
          entrada.endpoints.map((url) => axios.get(url, {
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + token
          }
          }))
        );
        respostas[chave] = reqs.reduce((acc, r) => acc + r.data, 0);
      }

      if (chave === 'caca-ao-tesouro') {
        let url = entrada.inicio;

        while (true) {
          const res = await axios.get(url, {
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + token
          }
          });
          if (typeof res.data === 'number') {
            respostas[chave] = res.data;
            break;
          }
          url = res.data;
        }
      }
    }

    console.log("RESPOSTAS:", respostas);

    for (const slug in respostas) {
      try {
        const resultado = await axios.post(
          `https://servidor-exercicios-js-eficaz.vercel.app/exercicio/${slug}`,
          { resposta: respostas[slug] },
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": "Bearer " + token,
            },
          }
        );
        console.log(`${resultado.data.sucesso ? '✅' : '❌'} ${slug}:`, resultado.data);
      } catch (err) {
        console.error(`❌ ${slug}:`, err.response?.data || err.message);
      }
    }
  })
  .catch((err) => console.error("Erro:", err.response?.data || err.message));