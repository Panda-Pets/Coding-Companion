const leetcodeController = {};


// this middleware reaches out to leetcode's graphql database to populate userinfo
leetcodeController.getUpdatedStats = async (req, res, next) => {  
  const leetcodeUsername = res.locals.currentUser.leetcodeusername;
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Cookie', process.env.LeetcodeAPICookie);

  //query to fetch the stats from the leetcode graphql api
  //TODO: remove input leetcode username from query and place into variables
  const graphql = JSON.stringify({
    query: `{ \n    matchedUser(username: "${leetcodeUsername}") \n    {\n        username\n        profile {\n           ranking \n        }\n        submitStats: submitStatsGlobal \n        {\n            acSubmissionNum \n            {\n                difficulty\n                count\n                submissions\n            }\n        }\n    }\n}`,
    variables: {}
  });
  // const graphql2= JSON.stringify({
  //   query: `{
  //     matchedUser(username: "${leetcodeUsername}")
  //       {
  //         username
  //         profile {
  //           ranking
  //         }
  //         submitStats: submitStatsGlobal
  //         {
  //           acSubmissionNum
  //           {
  //             difficulty
  //             count
  //             submissions
  //           }
  //         }
  //         }
  //       }
  //   }`,
  //   variables: {}
  // });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow'
  };
  try {
    const response = await fetch('https://leetcode.com/graphql\n\n', requestOptions);
    const data = await response.json();
    res.locals.currentStats = data.data.matchedUser.submitStats.acSubmissionNum;
    return next();
  } catch (err) {
    return next({
      log: 'leetcodeController.getUpdatedStats',
      message: err
    });
  }
};

module.exports = leetcodeController;