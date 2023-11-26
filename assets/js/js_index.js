
async function f_cargarMonedas(){

    const response = await fetch("https://mindicador.cl/api");
    let data = await response.json();

    return data;
}

let id_button = document.getElementById('id_button');
id_button.addEventListener('click',async function(){

    try{
        let id_moneda = document.getElementById('id_moneda');
        let tipoMoneda = id_moneda.value;
        
        let monedas = await f_cargarMonedas();
        let valorMoneda = monedas[tipoMoneda].valor;

        let valorPeso = document.getElementById('id_pesos').value;
        let valorConversion = parseFloat(valorPeso / valorMoneda).toFixed(2);
        
        let id_resultado = document.getElementById('id_resultado');
        id_resultado.innerHTML = 'Resultado: '+valorConversion;    

        f_crearGrafico(tipoMoneda);
    } catch(e){
        let id_errores = document.getElementById('id_errores');
        id_errores.innerHTML = '<div class="alert alert-danger" role="alert">Error al cargar monedas</div>';        
    }

});

async function f_graficar(tipo){

      const response = await fetch("https://mindicador.cl/api/"+tipo);
      const listaPrecios = await response.json();
      
      
      let KeysValores = Object.keys(listaPrecios['serie']);
      let countKeys = KeysValores.length;
      
      let data = [];
      let labels = [];

      for (let x=0; x<=countKeys; x++){
        
          let fechaMoenda = listaPrecios['serie'][x].fecha;
          let fechaArray = fechaMoenda.split('T');
          data.push(listaPrecios['serie'][x].valor);
          labels.push(fechaArray[0]);
          
          if (x>=9)
            break;
      }
      

      const datasets = [
        {
            label: "historial últimos 10 días - "+tipo,
            borderColor: "rgb(255, 99, 132)",
            data
        }
        ];

         return {labels, datasets};

}

let grafico;

async function f_crearGrafico(tipo) {

    try{
            const data = await f_graficar(tipo);
            const config = {
                    type: "line",
                    data: {
                    labels: data.labels,
                    datasets: data.datasets
                    }
            };

            let myChart = document.getElementById("myChart");
            
            if (grafico)
                grafico.destroy();

            myChart.style.backgroundColor = "white";
            grafico = new Chart(myChart, config);
        } catch(e){
            let id_errores = document.getElementById('id_errores');
            id_errores.innerHTML = '<div class="alert alert-danger" role="alert">Error al graficar</div>';
        }
}

