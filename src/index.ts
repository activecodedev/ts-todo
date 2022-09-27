import { TodoCollection } from "./todoCollection";
import { TodoItem } from "./todoItem";
import { createPromptModule } from "inquirer";

let prompt = createPromptModule();

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
   Add = "Dodaj nowe zadanie",
   Complete = "Wykonanie zadania",
   Toggle = "Pokaż lub ukryj wykonane",
   Purge = "Usuń wykonane zadania",
   Quit = "Koniec"
}

function promptAdd(): void {
   console.clear();
   prompt({
      type: "input",
      name: "add",
      message: "Podaj zadanie:"
   }).then(answers => {
      if (answers["add"] !== "")
         collection.addTodo(answers["add"]);

      promptUser();
   });
}

function promptComplete(): void {
   console.clear();
   prompt({
      type: "checkbox",
      name: "complete",
      message: "Oznaczenie zadań jako wykonanych",
      choices: collection.getTodoItems(showCompleted).map(item => ({ name: item.task, value: item.id, checked: item.complete }))
   }).then(answers => {
      let completedTasks = answers["complete"] as number[];
      collection.getTodoItems(true).forEach(item => collection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));
      promptUser();
   })
}

function promptUser(): void {
   console.clear();
   displayTodoList();
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
         case Commands.Add:
            promptAdd();
            break;
         case Commands.Complete:
            if (collection.getItemCounts().incomplete > 0) {
               promptComplete();
            } else {
               promptUser();
            }
            break;
         case Commands.Purge:
            collection.removeComplete();
            promptUser();
            break;

         default:
            break;
      }
   })
}

promptUser();