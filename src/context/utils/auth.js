const REGISTERED_USERS_KEY = 'registeredUsers';
const CURRENT_USER_KEY = 'currentUser';

const getRegisteredUsers = () => {
  const users = localStorage.getItem(REGISTERED_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveRegisteredUsers = (users) => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export const auth = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getRegisteredUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },

  async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!userData.email || !userData.password) {
          reject(new Error('Email and password are required'));
          return;
        }
        const users = getRegisteredUsers();
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          reject(new Error('Email is already registered'));
          return;
        }
        const newUser = {
          id: Date.now(),
          ...userData
        };
        users.push(newUser);
        saveRegisteredUsers(users);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }
};