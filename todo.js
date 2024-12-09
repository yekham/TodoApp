//Form tag'ini kullandigimiz icin submit'e erismek icin
// form tag'ini yakalamamiz gerekiyor.
const form = document.getElementById("todo-form");

//todoList eklenen todo'larimizin goruntulendigi kisim
//bu yuzden input'dan gelen todo'lari ul'ye eklemek icin
// bu ogeyi yakalamamiz gerekiyor.
const todoList = document.getElementById("todo-list");

const todoInput = document.getElementById("todo-input");
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search");
const clearButton = document.getElementById("clear");

eventListenersLoad();
function eventListenersLoad(){
    //sayfa yuklendigi zaman olusan olaydir.
    document.addEventListener("DOMContentLoaded",loadLocalStoragePage);
    form.addEventListener("submit",addTodo);
    clearButton.addEventListener("click",clearTodos);
    todoList.addEventListener("click",processTodo);
    searchInput.addEventListener("keyup",searchTodo);    
}



//TODO EKLEME
// e parametresi event'i temsil eder.
function addTodo(e){
    const newTodo = todoInput.value.trim();
    if(newTodo != ""){
        addTodoPage(newTodo);
        addTodoToLocalStorage(newTodo);
    }
    todoInput.value = "";
    todoInput.focus();
    //form'da submit tusuna bastiktan sonra sayfa kendisini yeniler
    //Burada sayfa yenilenmesini engelleriz.
    e.preventDefault();
}

//TODO ları ARAYÜZ ÜZERİNDE GÖSTERME
function addTodoPage(newTodo){
    const liElement = document.createElement("li");
    const span = document.createElement("span");
    const divElement = document.createElement("div");
    const updateElement = document.createElement("a");
    const deleteElement = document.createElement("a");
    const iElementDelete = document.createElement("i");
    const iElementUpdate = document.createElement("i");

    liElement.className = "list-group-item d-flex justify-content-between mb-2";
    span.textContent = newTodo;
    span.className = "todo-text";
    liElement.appendChild(span);
    divElement.className = "d-flex";
    updateElement.className = "nav-link update-todo mx-x p-2";
    iElementUpdate.className = "fa-solid fa-pen";
    updateElement.appendChild(iElementUpdate);
    divElement.appendChild(updateElement);
    deleteElement.className = "nav-link delete-todo mx-x p-2";
    iElementDelete.className = "fa-solid fa-xmark";
    deleteElement.appendChild(iElementDelete);
    divElement.appendChild(deleteElement);
    liElement.appendChild(divElement);

    todoList.appendChild(liElement);


    // const todoElement =`<li class="list-group-item d-flex justify-content-between mb-2">
    //                         <span>${newTodo} Template Literal</span>
    //                         <div class="d-flex">
    //                             <a href="#" class="nav-link update-todo mx-x p-2">
    //                                 <i class="fa-solid fa-pen"></i>
    //                             </a>
    //                             <a href="#" class="nav-link delete-todo mx-x p-2">
    //                                 <i class="fa-solid fa-xmark"></i>
    //                             </a>
    //                         </div>
    //                     </li>`;
    // todoList.innerHTML += todoElement;
}

//TODO ları LOCAL STORAGE ÜZERİNE EKLEME
function addTodoToLocalStorage(newTodo){
    let todos = getTodoFromLocalStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}

//Local Storage Üzerinden veri getirmek
function getTodoFromLocalStorage(){
    let todos;
    if(localStorage.getItem("todos") === null){
        todos = [];
    }else{
        //local strorage'dan veri string gelir biz dizi olarak saklamasi icin
        //parse islemi yaptik.
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

//Ekrana verileri local storage içerisinden getirme
function loadLocalStoragePage(){
    let todos = getTodoFromLocalStorage();
    //her todo dolasilarak ekrana basilir.
    todos.forEach(function(todo){
        addTodoPage(todo);
    })
}

//Tüm TODO ları Silme
function clearTodos(){
    if(confirm("Tüm görevleri silmek istediğinize emin misiniz?"))
    {
        localStorage.clear();
        todoList.innerHTML = "";
    }
    
}

//ToDO silme 
function processTodo(e){
    if(e.target.className === "fa-solid fa-xmark")
    {
        e.target.parentElement.parentElement.parentElement.remove();
        //console.log(e.target.parentElement.parentElement.parentElement.firstChild.textContent);
        deleteTodoFromLocalStorage(e.target.parentElement.parentElement.parentElement.firstChild.textContent);
    }
    if(e.target.className === "fa-solid fa-pen")
    {
        let todo = e.target.parentElement.parentElement.parentElement.firstChild.textContent;

        updateTodoFromLocalStorage(e.target.parentElement.parentElement.parentElement.firstChild.textContent)

    }

}
//Local Storage üzerinden todo silme
function deleteTodoFromLocalStorage(deleteTodo){
    let todos = getTodoFromLocalStorage();
    todos.forEach((todo,index) => {
        if(todo === deleteTodo){
            todos.splice(index,1);
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}

//
function updateTodoFromLocalStorage(updateTodo){
    let todos = getTodoFromLocalStorage();
    todos.forEach((todo,index)=>{
        if(todo === updateTodo){
            todos[index] = prompt("Yeni değeri giriniz : ",todo);
        }
    })
    localStorage.setItem("todos",JSON.stringify(todos));
    todoList.innerHTML = "";
    loadLocalStoragePage();
    
}







//SEARCH - FİLTRELEME
function searchTodo(e){
    const searchText = e.target.value.toLowerCase();
    const listTodos = document.querySelectorAll(".list-group-item")
    listTodos.forEach(function(todo,index){
        const text = document.getElementsByClassName("todo-text")[index].textContent.toLowerCase();
        if(text.indexOf(searchText) === -1){
            todo.setAttribute("style","display:none !important")
        }else{
            todo.setAttribute("style","display:block");
        }
    })
}