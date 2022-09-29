(function(){
  let DB 
  const formulario = document.querySelector('#formulario')

  document.addEventListener('DOMContentLoaded', () =>{
    formulario.addEventListener('submit', validarCliente)
    conectarDB()

    
  })

  function conectarDB(){
    let abrirConexion = window.indexedDB.open('crm', 1)

    abrirConexion.onerror = function(){
      console.log('aconteceu um erro na abertura de conexao');
    }

    abrirConexion.onsuccess = function(){
      DB = abrirConexion.result
    }
  }

  function validarCliente(e){
    e.preventDefault()

    console.log('validando os dados do formulario...');

    // buscar os inputs
    const nombre = document.querySelector('#nombre').value
    const email = document.querySelector('#email').value
    const telefono = document.querySelector('#telefono').value
    const empresa = document.querySelector('#empresa').value


    //validar se os forms são validos
    if( nombre === '' || email === '' || telefono === '' || empresa === '') {
      imprimirAlerta('Todos os campos são obrigatórios' , 'error')
      return
    }

    // criar um obj literal para trabalhar com os dados
    const cliente = {
      nombre, 
      email,
      telefono,
      empresa
  }

    // Generar un ID único
    cliente.id =  Date.now()
    // Criando novo cliente
    crearNuevoCliente(cliente)
  }

  function crearNuevoCliente(cliente){
    // utilizando transaction 
    const transaction = DB.transaction(['crm'], 'readwrite')
    const objectStore = transaction.objectStore('crm')
    console.log(objectStore, 'clg no obj store')
    objectStore.add(cliente)

    transaction.onerror = function (){
      console.log('houve um erro ao criar o dado no banco')
      imprimirAlerta('houve um erro', 'error')
    }

    transaction.oncomplete = function (){
      console.log('cliente criado com sucesso' ,cliente )

      // Mostrar mensaje de que todo esta bien...
      imprimirAlerta('Criado corretamente')

      // me leva pra home
      setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
    }
  }

  function imprimirAlerta(msg, tipo){
    const alerta = document.querySelector('.alerta')

    if(!alerta){
      //criar alerta
      const divMensagem = document.createElement('div')
      divMensagem.classList.add('px-4', 'py-3' , 'rounded' , 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta')

      if(tipo === 'error'){
        divMensagem.classList.add('bg-red-100', 'border-red-400', 'text-red-700')
      }else {
        divMensagem.classList.add('bg-green-100', 'border-green-400', 'text-green-700')
      }

      divMensagem.textContent = msg

      formulario.appendChild(divMensagem)
      setTimeout( () => {
        divMensagem.remove()
      }, 3000)
    }
    
  }

})()