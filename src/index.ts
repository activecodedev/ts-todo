import { TodoCollection } from "./todoCollection";
import { TodoItem } from "./todoItem";
import { createPromptModule } from "inquirer";

let todos: TodoItem[] = [
   new TodoItem(1, "Kupić kwiaty"),
   new TodoItem(2, "Odebrać buty"),
   new TodoItem(3, "Zamówić bilety"),
   new TodoItem(4, "Zadzwonić do Janka", true)
];

let collection: TodoCollection = new TodoCollection("Adam", todos);
let showCompleted = true;

function displayTodoList(): void {
   console.log(`Lista ${collection.userName}a ` + `(liczba zadań pozostałych do zrobienia: ${collection.getItemCounts().incomplete})`);
   collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

enum Commands {
   Toggle = "Pokaż lub ukryj wykonane",
   Quit = "Koniec"
}

function promptUser(): void {
   console.clear();
   displayTodoList();
   let prompt = createPromptModule();
   prompt({
      type: "list",
      name: "command",
      message: "Wybierz opcję",
      choices: Object.values(Commands),
   }).then(answers => {
      switch (answers["command"]) {
         case Commands.Toggle:
            showCompleted = !showCompleted;
            promptUser();
            break;
      
         default:
            break;
      }
   })
}

promptUser();