'use strict';

exports.getThing = function (req, res, next) {
  const ware = req.params.ware;
  res.status(200).json("OK");
};
