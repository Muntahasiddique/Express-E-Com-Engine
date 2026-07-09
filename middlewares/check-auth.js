function checkAuth(req, res, next) {
  // 1. ALWAYS set the default state to false for security
  res.locals.isAuth = false;
  res.locals.isAdmin = false;

  const uid = req.session.uid;
  
  // 2. If they are a guest, move on. The defaults are already false.
  if (!uid) {
    return next();
  }

  // 3. If they have a session, upgrade their variables
  res.locals.uid = uid;
  res.locals.isAuth = true;
  res.locals.isAdmin = req.session.isAdmin;
  
  next();
} 

module.exports = checkAuth;