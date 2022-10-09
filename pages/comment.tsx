import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import CommentList from "../components/CommentList";

interface FormValue {
  todo: string;
}
interface IToDos {
  id: number;
  text: string;
}

const Comment: NextPage = () => {
  const [userName, setUserName] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["LoginToken"]);

  const [toDos, setToDos] = useState<IToDos[]>([]);
  const [toDo, setToDo] = useState("");
  const idNumber = useRef(1);

  const router = useRouter();

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
    reset,
    formState: { errors },
  } = useForm<FormValue>();

  /**
   * onSubmitHandler 설명
   * react-hook-form에서 input text를 받아옵니다.
   * if로 내용이 있는지 확인하고, 내용이 있다면 setToDo합니다.
   * 그리고 toDo를 id값과 함께 toDos 배열에 넣고 setToDos합니다.
   * 그리고 reset 메소드로 input값을 초기화 합니다.
   */
  const onSubmitHandler: SubmitHandler<FormValue> = (data) => {
    if (data.todo === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    setToDo(data.todo);
    const newToDos = [...toDos, { id: idNumber.current++, text: data.todo }];
    setToDos(newToDos);
    reset();
  };

  /**
   * 회사 로고 우측의 이름을 클릭하게 되면 실행되면 함수입니다.
   * confirm의 응답이 확인이라면, cookie를 제거하고 reload하여 login이 있는 index를 출력합니다.
   */
  function LogoutConfirm() {
    const con = confirm("로그아웃 하시겠습니까?");
    if (con === true) {
      removeCookie("LoginToken");
      router.reload();
    }
  }

  /**
   * useEffect을 사용하여 axios를 통해 GET 요청을 합니다.
   * 이 때 api에서 해석 된 Name을 받고 setUserName 합니다.
   * catch 예외 처리로 비정상적인 접근이 발생하면 페이지를 이동시킵니다.
   */
  useEffect(() => {
    axios
      .get("/api/user")
      .then((response) => {
        const { memberName } = response.data;
        setUserName(memberName);
      })
      .catch((err) => {
        alert("접근 권한이 없습니다.");
        router.push("/");
      });
  });

  return (
    <div className="wrap">
      <div className="comment-form">
        <div className="comment-logo">
          <Image src="/logo.png" alt="logo" width={150} height={17} />
          <div className="title-name" onClick={LogoutConfirm}>
            {userName}
          </div>
        </div>
        <div className="comment-body">
          {toDos.map((data) => (
            <CommentList key={data.id} name={userName} toDos={data.text} />
          ))}
        </div>
        <div className="comment-input-wrap">
          <form className="comment-input-body" onSubmit={handleSubmit(onSubmitHandler)}>
            <input {...register("todo")} type="text" placeholder="오늘은 어떤 일이 있었나요?" autoComplete="off" />
            <button>전송</button>
          </form>
        </div>
      </div>

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
        .comment-form {
          width: 350px;
          height: 500px;
          border-radius: 5px;
          overflow: hidden;
          text-align: center;
          box-shadow: 1px 1px 30px lightgrey;
          background-color: #fff;
        }
        .comment-logo {
          background-color: #464e5c;
          width: 350px;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 20px;
          color: #fff;
        }

        .title-name {
          cursor: pointer;
        }
        .title-name:hover {
          color: lightgrey;
        }
        .comment-body {
          width: 350px;
          height: 350px;
          padding-bottom: 20px;
          background-color: #fff;
          overflow: auto;
        }

        .comment-input-wrap {
          width: 350px;
          height: 50px;
        }
        .comment-input-body {
          width: 300px;
          height: 45px;
          border: 1px solid lightgrey;
          border-radius: 3px;
          overflow: hidden;
          box-shadow: 1px 1px 5px #e1dfdf;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
        }
        input {
          width: 250px;
          height: 45px;
          background-color: #fff;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #6a6a6a;
          padding: 10px;
        }

        button {
          width: 80px;
          height: 50px;
          padding: 10px;
          background-color: #fff;
          color: #6a6a6a;
          border: none;
          font-size: 16px;
          font-weight: 600;
        }
        button:hover {
          background-color: #e9e9e9;
          cursor: pointer;
        }
        button::before {
          opacity: 0.2;
          content: "|";
          font-weight: 400;
          color: #6a6a6a;
          display: inline-block;
          padding-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default Comment;
