exports.error = function(res, err){
  console.log(err);
  res.status(400).send({error: err.message});
};

exports.success = function(res, data, status){
  res.status(status || 200).send(data || {success: true});
};

