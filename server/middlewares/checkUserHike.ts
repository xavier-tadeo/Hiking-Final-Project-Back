// import express, { NextFunction } from "express";

// import UserModel from "../../database/models/user";

// export interface RequestWithAuth extends express.Request {
//   email?: string;
//   userId?: string;
//   name?: string;
// }

// class ErrorCode extends Error {
//   code: number | undefined;
// }

// const checkUserHike = async (
//   req: RequestWithAuth,
//   res: express.Response,
//   next: NextFunction
// ) => {
//   const { hikeId } = req.params;
//   const user = await UserModel.findById(req.userId);
//   const findIdRoute = user.yourRoutes.find(
//     // eslint-disable-next-line no-underscore-dangle
//     (routeId) => routeId._id.toString() === hikeId
//   );

//   // if (findIdRoute) {
//   //   const hikes = user.yourRoutes.filter((hike) => hike !== findIdRoute);
//   //   user.yourRoutes = hikes;
//   //   user.save();
//   //   next();
//   // } else {
//   //   const error = new ErrorCode();
//   //   error.code = 401;
//   //   error.message = "You I can't";
//   //   next(error);
//   // }
// };

// export default checkUserHike;
