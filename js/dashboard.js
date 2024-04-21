function exibirHoras(){
  let hora_atual = new Date().getHours();
  if (hora_atual > 6 && hora_atual < 12) return 'Bom dia';
  if (hora_atual >= 12 && hora_atual < 18) return 'Boa tarde';
  if (hora_atual >= 18) return 'Boa noite';
  return 'Boa noite';
}




const url = "https://poupe-mais-api.vercel.app";
const token = sessionStorage.getItem("token");

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    logout();
});

const horas = document.getElementById("saudacao");

horas.innerHTML = exibirHoras();

// Obter os dados do usuário
async function getUserData(callback) {
    const usernameElement = document.getElementById("username");
    const incomeElement = document.getElementById("total-incomes");
    const expenseElement = document.getElementById("total-expense");
    const totalElement = document.getElementById("monthly-income");

    const username = sessionStorage.getItem("username");
    usernameElement.textContent = username; 
    
    await fetch(`${url}/transaction/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(function (response) {
        if (!response.ok) { throw new Error(response.statusText) }

        return response.json();
    })
    .then(function (data) {
        const transactions = data.body;

        const incomes = transactions.filter(({ type }) => type === "INCOME");
        const expenses = transactions.filter(({ type }) => type === "EXPENSE");
        
     

        const totalIncomes = incomes.reduce((accumulator, currentValue) => { return accumulator + currentValue.value }, 0);
        const totalExpenses = expenses.reduce((accumulator, currentValue) => { return accumulator + currentValue.value }, 0);
        const total = totalIncomes - totalExpenses;

        incomeElement.innerHTML = `<span>+ R$ ${totalIncomes}</span>`;
        expenseElement.innerHTML = `<span>- R$ ${totalExpenses}</span>`;

        
        totalElement.innerHTML = `<span>R$ ${total}</span>`;
    
        if (total < 0){
          totalElement.style.color = 'red';
        }
        else {
          totalElement.style.color = 'green';
        }
        callback({ incomes, expenses, total });
        
    })
    .catch(function (error) {
        console.error(error);
    })
   
}

getUserData();



// Obter categorias
async function getCategories() {
  const categories = document.querySelector(".categories");

  await fetch(`${url}/category/list`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      }
  })
  .then((response) => {
      if(!response.ok) {
          throw new Error(response.statusText);
      }

      return response.json();
  })
  .then((data) => {
      const categoriesData = data.body;

      const categoriesChildes = categoriesData.map((category) => {
          const li = document.createElement("li");
          li.setAttribute("class", "category");

          const img = document.createElement("img");
          img.setAttribute("src", "./assets/elipse-verde.svg");
          img.setAttribute("alt", "Elipse Verde");

          const span = document.createElement("span");
          span.textContent = category.categoryName;
        
          li.appendChild(img);
          li.appendChild(span);

          return li;
      });

      const liCadastrarCategoria = document.createElement("li");
      liCadastrarCategoria.setAttribute("class", "btn-new-categorie");

      const img = document.createElement("img");
      img.setAttribute("src", "./assets/elipse-azul-2.svg");
      img.setAttribute("alt", "Elipse Azul");

      const span = document.createElement("span");
      span.textContent = "Cadastrar nova categoria";
      
      liCadastrarCategoria.appendChild(img);
      liCadastrarCategoria.appendChild(span);

      categories.append(...categoriesChildes);
      categories.appendChild(liCadastrarCategoria);

      // Atribui a lógica de abrir o modal ao botão "Cadastrar nova categoria"
      const modal = document.getElementById("create-categoria-modal");
      liCadastrarCategoria.addEventListener("click", () => {
          modal.showModal();
      });

      const submitCategoryBtn = document.getElementById("submitCategoryBtn");
      submitCategoryBtn.addEventListener("click", () => {
          const categoryName = document.getElementById("categoryNameInput").value;
          if (categoryName) {
            try {
                  
               // Se a categoria foi cadastrada com sucesso, adicione-a na página
                const li = document.createElement("li");
                li.setAttribute("class", "category");
    
                const img = document.createElement("img");
                img.setAttribute("src", "./assets/elipse-verde.svg");
                img.setAttribute("alt", "Elipse Verde");
    
                const span = document.createElement("span");
                span.textContent = categoryName;
    
                li.appendChild(img);
                li.appendChild(span);
    
                categories.append(li);
    
                console.log("Nova categoria cadastrada:", categoryName);
                modal.close();
            } catch (error) {
                console.error("Erro ao cadastrar nova categoria:", error);
            }
        } else {
            console.log("Operação de cadastro de nova categoria cancelada.");
            modal.close();
        }
      });

  })
  .catch((error) => {
      console.error("this", error);
  });
}

getCategories();

  
// Obter opções
async function getOptions() {
    const categorySelect = document.getElementById("category-select");

    await fetch(`${url}/category/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return response.json();
    })
    .then((data) => {
        const categories = data.body;

        const options = categories.map((category) => {
            const novaOpcao = document.createElement("option");
            novaOpcao.value = category.id;
            novaOpcao.textContent = category.categoryName;
            return novaOpcao;
        });

        categorySelect.append(...options);
    })
    .catch((error) => {
        console.error("this", error);
    });
}

getOptions();

// Obter os maiores gastos do mês
async function getBiggestExpenseMonth() {
    await fetch(`${url}/transaction/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    })
      .then((response) => {
        if(!response.ok) {
          throw new Error(response.statusText);
        }
  
        return response.json();
      })
      .then((data) => {
        const transactions = data.body;
        const biggestExpenses = document.querySelector("#biggest-expenses");
        
        const expenses = transactions.filter(transaction => transaction.type === "EXPENSE");
        const expensesMonth = expenses.filter(expense => {
          const month = parseInt(expense.createdAt.split("T")[0].split("-")[1]);
          return month === (new Date().getMonth() + 1);
        });
  
        if(expensesMonth.length > 0) {
          // Ordenar as despesas em ordem decrescente com base no valor
          expensesMonth.sort((a, b) => b.value - a.value);
  
          let topExpensesMonth = [];
    
          if(expensesMonth.length > 7) {
            topExpensesMonth = expensesMonth.slice(0, 7);
          } else {
            topExpensesMonth = expensesMonth;
          }
  
          const biggestExpenseChildes = topExpensesMonth.map((topExpenseMonth) => {    
            const li = document.createElement("li");
  
            const span = document.createElement("span");
            const img = document.createElement("img");
            img.setAttribute("src", "./assets/elipse-azul.svg");
            span.appendChild(img);
            span.innerHTML += `${topExpenseMonth.description}`;    
    
            const span02 = document.createElement("span");
            span02.textContent = `R$ ${topExpenseMonth.value}`;
    
            li.appendChild(span);
            li.appendChild(span02);
  
            return li;
          });
  
          biggestExpenses.innerHTML = '';
  
          biggestExpenses.append(...biggestExpenseChildes);
        } else {
          const li = document.createElement("li");
  
          li.setAttribute("class", "no-content");
          li.textContent = "Nenhum gasto encontrado";
          
          biggestExpenses.innerHTML = '';
  
          biggestExpenses.appendChild(li);
        }
      })
      .catch((error) => {
        console.error("this", error);
      });
}

getBiggestExpenseMonth();


// Transação income
const formIncome = document.getElementById("add-income-form");

formIncome.addEventListener("submit", async (event) => {
  event.preventDefault();

  const value = document.getElementById("income-value").value;
  const description = document.getElementById("income-description").value;

  await fetch(`${url}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      value: Number(value),
      description,
      type: "INCOME",
      categoryId: null,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((data) => {
      formIncome.reset();
      getUserData();
    })
    .catch((error) => {
      console.error("this", error);
    });
});

// Transacao expense
const formExpense = document.getElementById("add-expense-form");

formExpense.addEventListener("submit", async (event) => {
  event.preventDefault();

  const value = document.getElementById("expense-value").value;
  const description = document.getElementById("expense-description").value;
  const categoryId = document.getElementById("category-select").value;

  await fetch(`${url}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      value: Number(value),
      description,
      type: "EXPENSE",
      categoryId: categoryId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((data) => {
      formExpense.reset();
      getUserData();
      getBiggestExpenseMonth();
    })
    .catch((error) => {
      console.error("this", error);
    });
});
