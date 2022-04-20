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
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          success: 'Статус успешно удален',
          error: 'Не удалось удалить статус',
        },
        edit: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
      },
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        tasks: 'Задачи',
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
      statuses: {
        name: 'Наименование',
        id: 'ID',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          create: 'Создание статуса',
          submit: 'Создать',
        },
        edit: {
          editStatus: 'Изменение статуса',
          submit: 'Изменить',
        },
        delete: {
          submit: 'Удалить',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          create: 'Создание задачи',
          submit: 'Создать',
        },
        edit: {
          editStatus: 'Изменение задачи',
          submit: 'Изменить',
        },
        delete: {
          submit: 'Удалить',
        },
      },
    },
  },
};
