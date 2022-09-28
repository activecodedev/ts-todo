import { LowSync, JSONFileSync } from "lowdb";
import { TodoCollection } from "./todoCollection.js";
import { TodoItem } from "./todoItem.js";

type schemaType = {
   tasks: { id: number; task: string; complete: boolean }[]
};

export class JsonTodoCollection extends TodoCollection {
   adapter = new JSONFileSync<schemaType>('db.json');
   db = new LowSync<schemaType>(this.adapter);

   constructor(public userName: string, todoItems: TodoItem[] = []) {
      super(userName, []);
      this.db.read();

      if (this.db.data !== null && this.db.data.tasks.length > 0) {
         let dbItems = this.db.data.tasks;
         dbItems.forEach(item => this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete)));
      } else {
         this.db.data ||= { tasks: [] }
         this.db.data.tasks = todoItems;
         this.db.write();
         todoItems.forEach(item => this.itemMap.set(item.id, item));
      }
   }

   addTodo(task: string): number {
       let result = super.addTodo(task);
       this.storeTasks();

       return result;
   }

   markComplete(id: number, complete: boolean): void {
      super.markComplete(id, complete);
      this.storeTasks();
   }

   removeComplete(): void {
       super.removeComplete();
       this.storeTasks();
   }

   private storeTasks() {
      this.db.data ||= { tasks: [] }
      this.db.data.tasks = [...this.itemMap.values()];
      this.db.write();
   }
}