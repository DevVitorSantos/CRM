(function (){

  // armazenar o resultado do db aqui
  let DB
  const listadoClientes = document.querySelector('#listado-clientes')

  // quando o conteudo estiver pronto
  document.addEventListener('DOMContentLoaded', () => {
    crearDB()

    if(window.indexedDB.open('crm', 1)){
      obtenerClientes()
    }
    // funcao para deletar algum registro será chamada 
    listadoClientes.addEventListener('click', eliminarRegistro)
  })


  // criar uma base de dados no indexDB
  function crearDB(){
    // abrindo conexão com o banco "crm"
    const crearDB = window.indexedDB.open('crm', 1)
    //caso aconteça algum erro
    crearDB.onerror = function() {
      console.log('houve um erro na criação');
    }
    // em sucesso cria e preenche a variavel DB com o resultado de criação do banco
    crearDB.onsuccess = function(){
      console.log('foi criado o db com sucesso')
      DB = crearDB.result
      console.log(DB, 'resultado apos criado o db, o result');
    }

    // essa funcão corre apenas uma vez, muito boa para criar as partes internas do db
    crearDB.onupgradeneeded = function(e){
      const db = e.target.result
      const objectStore = db.createObjectStore('crm', { keyPath: 'id',  autoIncrement: true } )

      objectStore.createIndex('nombre', 'nombre', { unique: false } )
      objectStore.createIndex('email', 'email', { unique: true } )
      objectStore.createIndex('telefono', 'telefono', { unique: false } )
      objectStore.createIndex('empresa', 'empresa', { unique: false } )
      objectStore.createIndex('id', 'id', { unique: true } )

      
      console.log('Database creada y lista')
    }
  }

  //buscar clientes no banco
  function obtenerClientes(){
    // abrir conexao
    const abrirConexion = window.indexedDB.open('crm', 1)

    abrirConexion.onerror = function(){
      console.log('houve um erro na hora de abrir a conexao')
    }

    abrirConexion.onsuccess = function(){
      console.log('abrirmos o db com sucesso e vmaos buscar os dados')

      DB = abrirConexion.result
      const objectStore = DB.transaction('crm').objectStore('crm')

      objectStore.openCursor().onsuccess = function(e){
        const cursor = e.target.result
        if(cursor){
          console.log(cursor.value)
          cursor.continue()
          // vamos extrair via destructuring os dados do objeto para adicionar no html
          const {nombre, empresa, email, telefono, id} = cursor.value
          // vamos pegar a tabela
          
          listadoClientes.innerHTML += `

                              <tr>
                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                      <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                      <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                                  </td>
                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                      <p class="text-gray-700">${telefono}</p>
                                  </td>
                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                      <p class="text-gray-600">${empresa}</p>
                                  </td>
                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                      <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                      <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                                  </td>
                              </tr>
                          `
        }else{
          console.log('não temos mais registros');
        }
      }
    }
  }

  // vamos desenvolver a funcao que irá identificar e removar um registro
  function eliminarRegistro(e){
    
    if(e.target.classList.contains('eliminar')){
      const idEliminar = Number(e.target.dataset.cliente) 
      const confirmar = confirm(' Você deseja mesmo deletar este registro?')
      
      if(confirmar){
        const transaction  = DB.transaction(['crm'] , 'readwrite')
        const objectStore = transaction.objectStore('crm')

        objectStore.delete(idEliminar)

        transaction.onerror = function(){
          console.log('ocorreu um erro no processo de deletar o registro');
        }
        transaction.oncomplete = function(){
          console.log('registro eliminado')
          e.target.parentElement.parentElement.remove()
        }
      }
    }
  }
})()

