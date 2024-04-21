

// Modal income
const incomeModal = document.getElementById("income-modal");
const openIncomeModalBtn = document.getElementById("show-income-modal");

openIncomeModalBtn.addEventListener("click", () => {
  incomeModal.showModal();
});

incomeModal.addEventListener("mousedown", (event) => {
  if (event.target === incomeModal) {
    incomeModal.close();
  }
});

// Modal outcome
const outcomeModal = document.getElementById("expense-modal");
const openBtn = document.getElementById("show-expense-modal");

openBtn.addEventListener("click", () => {
  outcomeModal.showModal();
});

outcomeModal.addEventListener("mousedown", (event) => {
  if (event.target === outcomeModal) {
    outcomeModal.close();
  }
});

// Modal Configurações

const setModal = document.getElementById("settings-modal");
const setBtn = document.getElementById("show-settings-modal");

// Adiciona um ouvinte de evento de clique ao botão de abrir modal
setBtn.addEventListener("click", () => {
  // Quando o botão é clicado, mostra o modal de configurações
  setModal.showModal();
});

// Adiciona um ouvinte de evento de clique ao modal de configurações
setModal.addEventListener("mousedown", (event) => {
   // Verifica se o clique ocorreu no próprio modal
  if (event.target === setModal){
     // Se o clique ocorreu no modal, fecha o modal
    setModal.close();
  }
});



function openChartModal() {
  // Obtém o contexto do canvas
  var ctx = document.getElementById('lineChart').getContext('2d');
  getUserData(function(data) {
    // Faça o que quiser com os dados aqui
    const lucros = data.incomes.map(transacao => transacao.value);
    const contas = data.expenses.map(transacao => transacao.value);
    const datas = data.expenses.map(transacao => transacao.createdAt)
    console.log(datas.map(item => item.split('T')[0]));
    labels = datas.map(item => item.split('T')[0].split('-')[2]);
   
    // Dados do gráfico de linhas
    var data = {
      labels: labels,
      datasets: [{
        label: 'Lucros',
        data: lucros,
        borderColor: 'green',
        borderWidth: 2
      },{
      label: 'Contas',
        data: contas,
        borderColor: 'red',
        borderWidth: 2
      }]
    };

  // Opções do gráfico de linhas
  var options = {
    scales: {
    
        y:{
          beginAtZero: true
        }
    }
  };

  // Cria o gráfico de linhas
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });

  // Abre o modal
  const chartModal = document.getElementById("chart-modal");
  chartModal.showModal();
  });
  myLineChart.destroy();
}

// Função para fechar o modal
function closeChartModal() {
  const chartModal = document.getElementById("chart-modal");
  chartModal.close();
}

// Evento de clique no botão para mostrar o modal e o gráfico
const chartBtn = document.getElementById("show-chart-modal");
chartBtn.addEventListener("click", openChartModal);

// Evento de clique fora do modal para fechar
const chartModal = document.getElementById("chart-modal");
chartModal.addEventListener("mousedown", (event) => {
  if (event.target === chartModal){
    closeChartModal();
  }
});




