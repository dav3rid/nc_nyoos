exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status && msg) {
    res.status(status).send({ msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const { code } = err;
  const badRequestCodes = ['22P02', '23502'];
  if (badRequestCodes.includes(code)) {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, '<<< err');
  res.status(500).send({ msg: 'server error' });
};
