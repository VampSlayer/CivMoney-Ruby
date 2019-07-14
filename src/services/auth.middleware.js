import user from "./auth";

export default {
  guest(to, from, next) {
    if (!user.check()) {
      next();
    } else {
      next("/");
    }
  },
  async auth(to, from, next) {
    if (user.check()) {
      next();
    } else {
      try {
        var response = await user.get();
        user.store(response.data);
        next();
      } catch (e) {
        next({
          path: "/login"
        });
      }
    }
  }
};
