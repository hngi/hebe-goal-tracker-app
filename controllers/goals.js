const Goal = require('../models/Goal');
const fs = require('fs');

exports.createGoal = (req, res, next) => {
  const goal = new Goal({
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId
  });
  goal.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};



exports.getGoal = (req, res, next) => {
  Goal.findOne({
    _id: req.params.id
  }).then(
    (goal) => {
      res.status(200).json(goal);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyGoal = (req, res, next) => {
  let goal = new Goal({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.goal = JSON.parse(req.body.goal);
    goal = {
      _id: req.params.id,
      title: req.body.goal.title,
      description: req.body.goal.description,
      userId: req.body.goal.userId
    };
  } else {
    goal = {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId
    };
  }
  
  Goal.updateOne({_id: req.params.id}, goal).then(
    () => {
      res.status(201).json({
        message: 'Goal updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteGoal = (req, res, next) => {
  Goal.findOne({_id: req.params.id}).then(
    (goal) => {
      const filename = goal.split('/items/')[1];
      fs.unlink('/items/' + filename, () => {
        Goal.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

exports.getAllGoal = (req, res, next) => {
  Goal.find().then(
    (goals) => {
      res.status(200).json(goals);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};