import type { NextPage, NextPageContext } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Comment from "./comment";
import { Cookies } from "react-cookie";
import axios from "axios";

interface FormValue {
  splice(arg0: number, arg1: number, base64Pw: string): unknown;
  id: string;
  password: string;
}
/**
 * React-Cookie를 사용하기 위해서 선언합니다.
 */
const cookies = new Cookies();

const Home: NextPage = () => {
  const [login, setLogin] = useState(false);
  const router = useRouter();
  /**
   * LoginToken 쿠키가 undefined면 login state를 false, 아니라면 true를 세팅합니다.
   * 로그인과 comment 컴포넌트 중 어떤 컴포넌트를 렌더링할지 삼항 연산자에 넣어 사용할 용도입니다.
   */
  useEffect(() => {
    const cookieValue = cookies.get("LoginToken");
    if (cookieValue === undefined) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  }, []);
  /**
   * React-hook-form을 사용하기 위해 import 후 선언한 변수입니다.
   * register는 input이 받을 값을 정의합니다.
   * handleSubmit은 각 항목이 입력되었을 때 submit 이벤트를 처리합니다.
   * watch는 register 한 항목의 변경사항을 추적합니다.
   * errors는 유효성이 통과되지 않으면 에러 상태를 내보내줍니다.
   */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValue>();

  /**
   * onSubmitHandler 설명
   * Form에서 summit을 하게 되면 실행되는 함수입니다.
   * 이 때 form에서 받아온 data를 매개변수로 사용하여 값을 받아옵니다.
   * 비밀번호를 BASE64로 변환하기 위해 btoa메소드를 사용했고, 이후 객체를 새로 만들었습니다.
   */
  const onSubmitHandler: SubmitHandler<FormValue> = (data) => {
    const loginId = data.id;
    const base64Pw = btoa(data.password);
    const newLoginArray = {
      id: loginId,
      password: base64Pw,
    };

    /**
     * axios를 사용하여 로그인 정보를 담아 POST 합니다.
     * 이 후 응답 받은 accessToken을 cookie에 저장합니다.
     * 그리고 comment 컴포넌트를 출력할 수 있도록 reload 합니다.
     */
    axios
      .post("/api/user", newLoginArray)
      .then((response) => {
        const { accessToken } = response.data;
        cookies.set("LoginToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "none",
        });

        router.reload();
      })
      .catch((error) => {
        alert("아이디 또는 비밀번호를 확인해주세요.");
      });
  };

  return (
    <div className="wrap">
      {login === false ? (
        <div className="login-form">
          <div className="login-form-logo">
            <Image src="/logo.png" alt="logo" width={260} height={29} />
          </div>
          <h1>로그인 페이지</h1>
          <span>아래 양식을 채워주세요.</span>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div>ID</div>
            <input {...register("id")} placeholder="ID" autoComplete="off" />
            <div>PASSWORD</div>
            <input {...register("password")} type="password" placeholder="PASSWORD" />
            <button>로그인</button>
          </form>
        </div>
      ) : (
        <Comment />
      )}

      <style jsx>{`
        .wrap {
          width: 100vw;
          height: 100vh;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url("/bg_img.png");
          background-repeat: no-repeat;
        }
        .login-form {
          width: 350px;
          height: 500px;
          border-radius: 5px;
          overflow: hidden;
          text-align: center;
          box-shadow: 1px 1px 30px lightgrey;
          background-color: #fff;
        }
        .login-form > h1 {
          font-size: 20px;
          font-weight: 500;
        }
        .login-form > span {
          font-size: 15px;
          font-weight: 400;
        }
        .login-form-logo {
          background-color: #464e5c;
          width: 350px;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }

        form > div {
          text-align: left;
          margin-left: 37px;
          font-size: 16px;
          font-weight: 500;
          margin-top: 20px;
        }
        input {
          width: 280px;
          height: 40px;
          background-color: #fff;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #000;
          box-shadow: 1px 2px 5px lightgrey;
          border-radius: 2px;
          margin-top: 10px;
          padding: 10px;
        }
        button {
          display: block;
          width: 280px;
          height: 40px;
          margin: 0 auto;
          margin-top: 20px;
          background-color: #464e5c;
          border: none;
          border-radius: 2px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Home;
