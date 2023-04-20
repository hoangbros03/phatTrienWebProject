import { createServer, Model } from 'miragejs';

export const setupServer = () => {
  createServer({
    models: {
      infor: Model
    },
    routes() {
      this.get('/api/login', (schema) => {
        return schema.infor.all();
      });

      this.post('/api/login', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const user=  {user:payload.login.user,accesstoken:"1234AA",role:"cucdangkiem"};
        return user;
      });

    //   this.post('/api/updateTodo', (schema, request) => {
    //     const id = JSON.parse(request.requestBody);

    //     const currentTodo = schema.infor.find(id);

    //     currentTodo.update({ completed: !currentTodo.completed});

    //     return currentTodo;
    //   })
    }
  });
};