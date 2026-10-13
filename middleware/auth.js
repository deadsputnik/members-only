const requireAuth = (req, res, next) =>
  req.user ? next() : res.redirect("/sign-in");

const requireAdmin = (req, res, next) =>
  req.user?.admin
    ? next()
    : next(Object.assign(new Error("Forbidden"), { status: 403 }));

module.exports = { requireAuth, requireAdmin };
