// Função para animar a rolagem suave
function scrollSmoothTo(elementId) {
    var element = document.getElementById(elementId);
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop
    });
}

// Adiciona um listener de evento de clique para cada link do menu
var links = document.querySelectorAll('.container_navegacao_botao a');
links.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Evita o comportamento padrão do link
        var targetId = this.getAttribute('href').substring(1); // Pega o id do alvo sem #
        scrollSmoothTo(targetId); // Chama a função de rolagem suave
    });
});

function updateInformation() {
    var informacoesDiv = document.getElementById('informacoes');
    var date = new Date();
    var options = { hour: 'numeric', minute: 'numeric', hour12: false };
    var formattedDate = date.toLocaleDateString('pt-BR', options);

    // Obter a cidade usando a função obterCidade
    obterCidade().then(city => {
        var html = `<p> ${city}</p><p>${formattedDate}</p>`;
        informacoesDiv.innerHTML = html;
    }).catch(error => {
        console.error('Erro ao obter a cidade:', error);
    });
}

// Atualizar as informações inicialmente e configurar o intervalo de atualização
updateInformation();
setInterval(updateInformation, 1000);

function obterCidade() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`)
                    .then(response => response.json())
                    .then(data => {
                        resolve(data.city); // Resolver a promessa com o nome da cidade
                    })
                    .catch(error => {
                        reject(error); // Rejeitar a promessa em caso de erro
                    });
            });
        } else {
            reject('Geolocalização não suportada pelo navegador.'); // Rejeitar a promessa se a geolocalização não for suportada
        }
    });
}