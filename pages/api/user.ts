// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import userData from "./userData.json";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

/**
 * userArray 설명
 * import한 userData.json을 불러오고 users 내부의 객체만 가져옵니다.
 */
const userArray = userData.users;

/**
 * handler POST 설명
 * client의 Request를 받고 userArray에서 일치하는 id를 찾습니다.
 * 일치하는 id가 있을 경우에 password를 비교합니다.
 * 아이디와 비밀번호 모두 일치할 경우 user 정보를 담은 JWT를 생성합니다.
 * 하나라도 불일치 할 경우 FAIL을 응답합니다.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, password } = req.body;
    var userItem = userArray.find((object) => object.id == id);
    console.log(userItem);
    if (userItem != null) {
      if (userItem.password == password) {
        const secret = "35063ceca085c152603b5aa586811f9954e47715fe2a7aa81e43cb8d2cc83d40";
        try {
          const accessToken = await new Promise((resolve, reject) => {
            jwt.sign(
              {
                memberId: userItem?.id,
                memberName: userItem?.name,
              },
              secret,
              {
                expiresIn: "5m",
              },
              (err, token) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(token);
                }
              }
            );
          });

          res.json({ success: true, accessToken });
        } catch (err) {
          console.log(err);
          res.status(401).json({ success: false, errormessage: "토큰 서명에 실패했습니다." });
        }
      } else {
        res.status(401).json({ success: false, errormessage: "아이디와 비밀번호가 일치하지 않습니다." });
      }
    } else {
      res.status(401).json({ success: false, errormessage: "아이디와 비밀번호가 일치하지 않습니다." });
    }
  }
  /**
   * handler GET 설명
   * GET 요청이 들어오면 req에서 cookie를 받아옵니다.
   * cookie 안에 들어있는 JWT를 decoding 하여 reponse합니다.
   */
  if (req.method === "GET") {
    var token = req.cookies.LoginToken;
    var decoded = jwt_decode(token!);
    res.send(decoded);
    return;
  }
}
