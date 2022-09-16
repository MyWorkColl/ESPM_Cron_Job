const router = require("express").Router();

/* router for property api */
router.use('/property', require("./property"));

/* router for meter api */
router.use('/meter', require("./meter"));

/* router for usage api */
router.use('/usage', require("./usage"));

/* router for score api */
router.use('/score', require("./score"));

module.exports = router;