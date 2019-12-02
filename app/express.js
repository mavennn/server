import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors'
import helmet from 'helmet';

require("dotenv").config();

module.exports = function (app) {
  app.use(helmet());
  // Compression middleware (should be placed before express.static)
  app.use(
    compression({
      threshold: 512,
    }),
  );

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true,
    }),
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static("../public"));

  app.use(cookieParser());
};
