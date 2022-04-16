// @ts-check

export default {
  translation: {
    appName: 'Fastify Шаблон',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          anotherUserError: 'Вы не можете редактировать или удалять другого пользователя',
          success: 'Пользователь успешно удалён',
        },
        edit: {
          anotherUserError: 'Вы не можете редактировать или удалять другого пользователя',
          success: 'Пользователь успешно изменён',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        password: 'Пароль',
        createdAt: 'Дата создания',
        actions: 'Действия',
        name: 'Полное имя',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
          registerFields: {
            firstName: 'Имя',
            lastName: 'Фамилия',
            email: 'Email',
            password: 'Пароль',
          },
        },
        edit: {
          editUser: 'Изменение пользователя',
          submit: 'Изменить',
          cancel: 'Отмена',
        },
        delete: {
          submit: 'Удалить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
