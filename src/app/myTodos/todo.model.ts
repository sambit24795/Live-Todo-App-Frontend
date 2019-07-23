export class TodoModel {
    id: string
    title: string;
    description: string;
    date: any;
    subTodos: [{
        name: string,
        check: boolean
    }];
    status: string;
    creator: string;
}
