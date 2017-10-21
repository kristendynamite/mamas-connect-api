function sendWrappedResponse(Model, res, params = {}) {
  let response = {};
  const defaultPageSize = require('../config/main').pageSize;
  const currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize) : defaultPageSize;

  if (params.pageSize) delete params.pageSize;
  if (params.currentPage) delete params.currentPage;

  Model.find(params)
    .skip((pageSize * currentPage) - pageSize)
    .limit(pageSize)
    .exec((err, result) => {
      Model.count().exec((err, count) => {
        if (err) {
          res.send(err);
        } else {
          response.items = result;
          response.currentPage = currentPage;
          response.pageSize = pageSize
          response.totalCount = count;
          response.totalPages = Math.ceil(count / pageSize);

          if (currentPage > response.totalPages) {
            res.json({message: 'Page requested exceeds the total pages in the database.'});
          } else if (response.items.length === 0) {
            res.json({message: 'No results found.'})
          } else {
            res.json(response);
          }
        }
      });
    });
}

module.exports = sendWrappedResponse;
