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
        authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
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
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Не удалось удалить статус',
        },
        edit: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Не удалось удалить задачу',
          accessError: 'Задачу может удалить только её автор',
        },
        edit: {
          success: 'Задача успешно изменёна',
          error: 'Не удалось изменить задачу',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: 'Не удалось удалить метку',
        },
        edit: {
          success: 'Метка успешно изменена',
          error: 'Не удалось изменить метку',
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
        labels: 'Метки',
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
          createButton: 'Создать статус',
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
        label: 'Метка',
        new: {
          create: 'Создание задачи',
          submit: 'Создать',
          createButton: 'Создать задачу',
        },
        edit: {
          editStatus: 'Изменение задачи',
          submit: 'Изменить',
        },
        delete: {
          submit: 'Удалить',
        },
        filterActions: {
          show: 'Показать',
          chooseMine: 'Только мои задачи',
        },
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          create: 'Создание метки',
          submit: 'Создать',
          createButton: 'Создать метку',
        },
        edit: {
          editStatus: 'Изменение метки',
          submit: 'Изменить',
        },
        delete: {
          submit: 'Удалить',
        },
      },
    },
  },
};
